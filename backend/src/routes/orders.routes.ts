import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/my-orders", requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.auth!.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return res.json(orders.map((o) => ({ ...o, total: Number(o.total) })));
});

export default router;

