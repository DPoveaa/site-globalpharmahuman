import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router = Router();
const db = prisma as any;

const VALID_STAMP_ORDER_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
const STAMPS_PER_ELIGIBLE_ORDER = 1;
const STAMPS_TO_COUPON = 5;

type LoyaltyRuleMode = "INCLUSION" | "EXCLUSION";

function normalizeOrderIdentifier(value: string) {
  return value.trim().replace(/^#/, "");
}

function generateCouponCode() {
  return `SELO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function getLoyaltyRules(tx = db) {
  const [productsSetting, modeSetting] = await Promise.all([
    tx.setting.findUnique({ where: { key: "LOYALTY_QUALIFYING_PRODUCTS" } }),
    tx.setting.findUnique({ where: { key: "LOYALTY_RULE_MODE" } })
  ]);

  let qualifyingProductIds: string[] = [];
  if (productsSetting?.value) {
    try {
      const parsed = JSON.parse(productsSetting.value);
      if (Array.isArray(parsed)) qualifyingProductIds = parsed.filter((id) => typeof id === "string");
    } catch {
      qualifyingProductIds = [];
    }
  }

  const ruleMode: LoyaltyRuleMode = modeSetting?.value === "EXCLUSION" ? "EXCLUSION" : "INCLUSION";
  return { qualifyingProductIds, ruleMode };
}

function isOrderEligibleForStamp(
  order: any,
  qualifyingProductIds: string[],
  ruleMode: LoyaltyRuleMode
) {
  if (!VALID_STAMP_ORDER_STATUSES.includes(order.status)) return false;
  if (!Array.isArray(order.items) || order.items.length === 0) return false;
  if (qualifyingProductIds.length === 0) return true;

  const qualifyingSet = new Set(qualifyingProductIds);

  if (ruleMode === "INCLUSION") {
    return order.items.some((item: any) => qualifyingSet.has(item.productId));
  }

  return order.items.some((item: any) => !qualifyingSet.has(item.productId));
}

async function addStampForEligibleOrder(tx: any, userId: string, order: any) {
  const { qualifyingProductIds, ruleMode } = await getLoyaltyRules(tx);

  if (!isOrderEligibleForStamp(order, qualifyingProductIds, ruleMode)) {
    throw new Error("Pedido não possui produtos válidos para gerar selo.");
  }

  const existingTransaction = await tx.loyaltyTransaction.findFirst({
    where: {
      userId,
      type: "EARN",
      externalOrderNumber: order.id
    }
  });

  if (existingTransaction) {
    throw new Error("Este pedido já foi cadastrado no programa de fidelidade.");
  }

  await tx.loyaltyTransaction.create({
    data: {
      userId,
      type: "EARN",
      stamps: STAMPS_PER_ELIGIBLE_ORDER,
      externalOrderNumber: order.id,
      description: `Selo por pedido válido #${order.id.slice(-8).toUpperCase()}`
    }
  });

  const user = await tx.user.update({
    where: { id: userId },
    data: {
      stampsBalance: {
        increment: STAMPS_PER_ELIGIBLE_ORDER
      }
    },
    select: {
      id: true,
      stampsBalance: true
    }
  });

  if (user.stampsBalance < STAMPS_TO_COUPON) {
    return { couponGenerated: false, coupon: null };
  }

  const coupon = await tx.loyaltyCoupon.create({
    data: {
      userId,
      code: generateCouponCode()
    }
  });

  await tx.loyaltyTransaction.create({
    data: {
      userId,
      type: "REDEEM",
      stamps: -STAMPS_TO_COUPON,
      description: "Vale de 50% gerado automaticamente"
    }
  });

  await tx.user.update({
    where: { id: userId },
    data: {
      stampsBalance: {
        decrement: STAMPS_TO_COUPON
      }
    }
  });

  return { couponGenerated: true, coupon };
}

router.get("/user/stamps", requireAuth, async (req, res) => {
  const [user, loyaltyTransactions, loyaltyCoupons] = await Promise.all([
    db.user.findUnique({
      where: { id: req.auth!.userId },
      select: { stampsBalance: true }
    }),
    db.loyaltyTransaction.findMany({
      where: { userId: req.auth!.userId },
      orderBy: { createdAt: "desc" }
    }),
    db.loyaltyCoupon.findMany({
      where: { userId: req.auth!.userId },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return res.json({
    stampsBalance: user?.stampsBalance ?? 0,
    loyaltyTransactions,
    loyaltyCoupons
  });
});

router.post("/user/register-order", requireAuth, async (req, res) => {
  const parsed = z.object({ orderNumber: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Número do pedido inválido." });

  const orderNumber = normalizeOrderIdentifier(parsed.data.orderNumber);

  try {
    const result = await db.$transaction(async (tx: any) => {
      const order = await tx.order.findFirst({
        where: {
          userId: req.auth!.userId,
          OR: [
            { id: orderNumber },
            { id: { endsWith: orderNumber, mode: "insensitive" } }
          ]
        },
        include: { items: true }
      });

      if (!order) throw new Error("Pedido não encontrado para este usuário.");
      return addStampForEligibleOrder(tx, req.auth!.userId, order);
    });

    return res.json({
      message: "Selo resgatado com sucesso!",
      ...result
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Erro ao cadastrar pedido." });
  }
});

router.post("/admin/give-stamp", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({ identifier: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Identificador inválido." });

  const identifier = parsed.data.identifier.trim();

  try {
    const result = await db.$transaction(async (tx: any) => {
      const user = await tx.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { cpf: identifier.replace(/\D/g, "") },
            { id: identifier }
          ]
        }
      });

      if (!user) throw new Error("Usuário não encontrado.");

      await tx.loyaltyTransaction.create({
        data: {
          userId: user.id,
          type: "EARN",
          stamps: STAMPS_PER_ELIGIBLE_ORDER,
          description: "Selo concedido manualmente"
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          stampsBalance: {
            increment: STAMPS_PER_ELIGIBLE_ORDER
          }
        },
        select: {
          id: true,
          stampsBalance: true
        }
      });

      if (updatedUser.stampsBalance < STAMPS_TO_COUPON) {
        return { couponGenerated: false, coupon: null };
      }

      const coupon = await tx.loyaltyCoupon.create({
        data: {
          userId: user.id,
          code: generateCouponCode()
        }
      });

      await tx.loyaltyTransaction.create({
        data: {
          userId: user.id,
          type: "REDEEM",
          stamps: -STAMPS_TO_COUPON,
          description: "Vale de 50% gerado automaticamente"
        }
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          stampsBalance: {
            decrement: STAMPS_TO_COUPON
          }
        }
      });

      return { couponGenerated: true, coupon };
    });

    return res.json({ message: "Selo adicionado com sucesso.", ...result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Erro ao dar selo." });
  }
});

router.get("/admin/coupons", requireAuth, requireAdmin, async (_req, res) => {
  const coupons = await db.loyaltyCoupon.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return res.json(coupons);
});

router.post("/admin/validate-coupon", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({ code: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Código inválido." });

  const coupon = await db.loyaltyCoupon.findUnique({
    where: { code: parsed.data.code.trim().toUpperCase() }
  });

  if (!coupon) return res.status(404).json({ message: "Cupom não encontrado." });
  if (coupon.isUsed) return res.status(400).json({ message: "Cupom já utilizado." });

  const updated = await db.loyaltyCoupon.update({
    where: { id: coupon.id },
    data: { isUsed: true, usedAt: new Date() }
  });

  return res.json(updated);
});

router.get("/public/coupon-details/:code", async (req, res) => {
  const coupon = await db.loyaltyCoupon.findUnique({
    where: { code: req.params.code.trim().toUpperCase() },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          cpf: true
        }
      }
    }
  });

  if (!coupon) return res.status(404).json({ message: "Cupom não encontrado." });

  const contributionHistory = await db.loyaltyTransaction.findMany({
    where: {
      userId: coupon.userId,
      type: "EARN"
    },
    take: STAMPS_TO_COUPON,
    orderBy: { createdAt: "desc" }
  });

  return res.json({ ...coupon, contributionHistory });
});

router.post("/public/consume-coupon", async (req, res) => {
  const parsed = z.object({ code: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Código inválido." });

  const coupon = await db.loyaltyCoupon.findUnique({
    where: { code: parsed.data.code.trim().toUpperCase() }
  });

  if (!coupon) return res.status(404).json({ message: "Cupom não encontrado." });
  if (coupon.isUsed) return res.status(400).json({ message: "Cupom já utilizado." });

  const updated = await db.loyaltyCoupon.update({
    where: { id: coupon.id },
    data: { isUsed: true, usedAt: new Date() }
  });

  return res.json(updated);
});

router.get("/admin/settings", requireAuth, requireAdmin, async (_req, res) => {
  const settings = await db.setting.findMany({
    where: {
      key: {
        in: ["LOYALTY_QUALIFYING_PRODUCTS", "LOYALTY_RULE_MODE"]
      }
    }
  });

  return res.json(settings);
});

router.post("/admin/settings", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({ key: z.string().min(1), value: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const setting = await db.setting.upsert({
    where: { key: parsed.data.key },
    create: parsed.data,
    update: { value: parsed.data.value }
  });

  return res.json(setting);
});

router.get("/admin/rewards", requireAuth, requireAdmin, async (_req, res) => {
  if (!db.loyaltyReward) return res.json([]);
  const rewards = await db.loyaltyReward.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(rewards);
});

router.post("/admin/rewards", requireAuth, requireAdmin, async (req, res) => {
  if (!db.loyaltyReward) return res.status(404).json({ message: "Recompensas não configuradas." });
  const reward = await db.loyaltyReward.create({ data: req.body });
  return res.json(reward);
});

router.put("/admin/rewards/:id", requireAuth, requireAdmin, async (req, res) => {
  if (!db.loyaltyReward) return res.status(404).json({ message: "Recompensas não configuradas." });
  const reward = await db.loyaltyReward.update({
    where: { id: req.params.id },
    data: req.body
  });
  return res.json(reward);
});

router.delete("/admin/rewards/:id", requireAuth, requireAdmin, async (req, res) => {
  if (!db.loyaltyReward) return res.status(404).json({ message: "Recompensas não configuradas." });
  await db.loyaltyReward.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

router.post("/user/redeem/:rewardId", requireAuth, async (_req, res) => {
  return res.status(400).json({ message: "Resgate por recompensa não está habilitado para este programa." });
});

export default router;
