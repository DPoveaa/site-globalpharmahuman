import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { calculatePriceWithPromotion } from "../lib/utils";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99)
});

router.get("/", requireAuth, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.auth!.userId },
    include: {
      product: {
        include: { promotion: true }
      }
    }
  });

  const normalizedItems = items.map((item) => {
    const productPrice = Number(item.product.price);
    const promotion = item.product.promotion
      ? {
          ...item.product.promotion,
          value: Number(item.product.promotion.value)
        }
      : null;
    const finalPrice = calculatePriceWithPromotion(productPrice, promotion);
    return {
      id: item.id,
      quantity: item.quantity,
      subtotal: finalPrice * item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: productPrice,
        finalPrice
      }
    };
  });

  const total = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
  return res.json({ items: normalizedItems, total });
});

router.post("/items", requireAuth, async (req, res) => {
  const parsed = cartItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || !product.active) return res.status(404).json({ message: "Produto indisponível." });

  const current = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: req.auth!.userId,
        productId: parsed.data.productId
      }
    }
  });

  const quantity = (current?.quantity ?? 0) + parsed.data.quantity;

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: req.auth!.userId,
        productId: parsed.data.productId
      }
    },
    create: {
      userId: req.auth!.userId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity
    },
    update: { quantity }
  });

  return res.json({ ok: true });
});

router.patch("/items", requireAuth, async (req, res) => {
  const parsed = cartItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || !product.active) {
    return res.status(400).json({ message: "Produto indisponível." });
  }

  await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId: req.auth!.userId,
        productId: parsed.data.productId
      }
    },
    data: { quantity: parsed.data.quantity }
  });

  return res.json({ ok: true });
});

router.delete("/items/:productId", requireAuth, async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: {
      userId: req.auth!.userId,
      productId: req.params.productId
    }
  });
  return res.json({ ok: true });
});

export default router;

