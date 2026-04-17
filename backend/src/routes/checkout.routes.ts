import { Router } from "express";
import { prisma } from "../lib/prisma";
import { calculatePriceWithPromotion } from "../lib/utils";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const notes = typeof req.body?.notes === "string" ? req.body.notes : undefined;
  const whatsappContact =
    typeof req.body?.whatsappContact === "string" ? req.body.whatsappContact : undefined;

  const items = await prisma.cartItem.findMany({
    where: { userId: req.auth!.userId },
    include: {
      product: {
        include: { promotion: true }
      }
    }
  });

  if (!items.length) return res.status(400).json({ message: "Carrinho vazio." });

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

  const total = prepared.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${item.product.name}`);
      }
    }

    const created = await tx.order.create({
      data: {
        userId: req.auth!.userId,
        total,
        notes,
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

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: req.auth!.userId } });
    return created;
  });

  return res.json({ ok: true, orderId: order.id });
});

export default router;

