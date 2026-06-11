import { Router } from "express";
import { prisma } from "../lib/prisma";
import { calculatePriceWithPromotion } from "../lib/utils";
import { requireAuth } from "../middlewares/auth";
import { notifyAdminWhatsappNewOrder } from "../services/admin-whatsapp.service";

const router = Router();
const db = prisma as any;

type LoyaltyRuleMode = "INCLUSION" | "EXCLUSION";

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

function isLoyaltyEligibleProduct(
  productId: string,
  qualifyingProductIds: string[],
  ruleMode: LoyaltyRuleMode
) {
  if (qualifyingProductIds.length === 0) return true;
  if (ruleMode === "INCLUSION") return qualifyingProductIds.includes(productId);
  return !qualifyingProductIds.includes(productId);
}

router.post("/", requireAuth, async (req, res) => {
  const notes = typeof req.body?.notes === "string" ? req.body.notes : undefined;
  const whatsappContact =
    typeof req.body?.whatsappContact === "string" ? req.body.whatsappContact : undefined;
  const addressId = typeof req.body?.addressId === "string" ? req.body.addressId : "";
  const paymentMethod = typeof req.body?.paymentMethod === "string" ? req.body.paymentMethod : "Não informado";
  const loyaltyCouponCode =
    typeof req.body?.loyaltyCouponCode === "string" ? req.body.loyaltyCouponCode.trim().toUpperCase() : "";
  const loyaltyDiscountProductId =
    typeof req.body?.loyaltyDiscountProductId === "string" ? req.body.loyaltyDiscountProductId : "";

  const items = await prisma.cartItem.findMany({
    where: { userId: req.auth!.userId },
    include: {
      product: {
        include: { promotion: true }
      }
    }
  });

  if (!items.length) return res.status(400).json({ message: "Carrinho vazio." });

  const [user, address] = await Promise.all([
    db.user.findUnique({
      where: { id: req.auth!.userId },
      select: { id: true, name: true, email: true, phone: true }
    }),
    addressId
      ? db.address.findFirst({
          where: { id: addressId, userId: req.auth!.userId }
        })
      : null
  ]);

  const prepared = items.map((item) => {
    const basePrice = Number(item.product.price);
    const promotion = item.product.promotion
      ? {
          ...item.product.promotion,
          value: Number(item.product.promotion.value)
        }
      : null;
    const unitPrice = calculatePriceWithPromotion(basePrice, promotion);
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity
    };
  });

  let loyaltyDiscount = 0;
  let selectedLoyaltyProductId = "";

  if (loyaltyCouponCode) {
    const coupon = await db.loyaltyCoupon.findUnique({ where: { code: loyaltyCouponCode } });
    if (!coupon) return res.status(404).json({ message: "Cupom de fidelidade não encontrado." });
    if (coupon.isUsed) return res.status(400).json({ message: "Cupom de fidelidade já utilizado." });
    if (coupon.userId !== req.auth!.userId) {
      return res.status(403).json({ message: "Cupom de fidelidade não pertence a este usuário." });
    }

    const { qualifyingProductIds, ruleMode } = await getLoyaltyRules();
    const eligiblePreparedItems = prepared.filter((item) =>
      isLoyaltyEligibleProduct(item.productId, qualifyingProductIds, ruleMode)
    );

    if (eligiblePreparedItems.length === 0) {
      return res.status(400).json({ message: "O cupom só pode ser aplicado a produtos válidos no carrinho." });
    }

    if (eligiblePreparedItems.length === 1) {
      selectedLoyaltyProductId = eligiblePreparedItems[0].productId;
    } else {
      selectedLoyaltyProductId = loyaltyDiscountProductId;
      const isSelectedProductEligible = eligiblePreparedItems.some((item) => item.productId === selectedLoyaltyProductId);
      if (!isSelectedProductEligible) {
        return res.status(400).json({ message: "Escolha um produto válido para receber o desconto do cupom." });
      }
    }

    const selectedItem = eligiblePreparedItems.find((item) => item.productId === selectedLoyaltyProductId)!;
    loyaltyDiscount = Math.round(selectedItem.unitPrice * 0.5 * 100) / 100;
  }

  const total = Math.max(0, prepared.reduce((sum, item) => sum + item.subtotal, 0) - loyaltyDiscount);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.active) {
        throw new Error(`Produto indisponível: ${item.product.name}`);
      }
    }

    const created = await tx.order.create({
      data: {
        userId: req.auth!.userId,
        total,
        notes: loyaltyCouponCode
          ? [notes, `Cupom fidelidade ${loyaltyCouponCode} aplicado ao produto ${selectedLoyaltyProductId}.`].filter(Boolean).join("\n")
          : notes,
        whatsappContact,
        status: "PENDING",
        items: {
          create: prepared.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          }))
        }
      }
    });

    if (loyaltyCouponCode) {
      await (tx as any).loyaltyCoupon.update({
        where: { code: loyaltyCouponCode },
        data: { isUsed: true, usedAt: new Date() }
      });
    }



    await tx.cartItem.deleteMany({ where: { userId: req.auth!.userId } });
    const fullOrder = await tx.order.findUnique({
      where: { id: created.id },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    if (!fullOrder) throw new Error("Pedido não encontrado após criação.");
    return fullOrder;
  });

  notifyAdminWhatsappNewOrder({ ...order, user: order?.user || user }, address, paymentMethod)
    .catch((error) => console.error("[AdminWhatsApp] Erro ao notificar pedido:", error));

  return res.json({ ok: true, orderId: order.id });
});

export default router;
