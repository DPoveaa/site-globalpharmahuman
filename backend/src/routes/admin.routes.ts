import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  details: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  sku: z.string().min(3),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().cuid(),
  promotionId: z.string().cuid().optional().or(z.literal(""))
});

const promotionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  active: z.boolean().default(true)
});

router.get("/dashboard", async (_req, res) => {
  const [products, orders, users, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } })
  ]);

  return res.json({
    products,
    orders,
    users,
    revenue: Number(revenue._sum.total || 0)
  });
});

router.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(products.map((p) => ({ ...p, price: Number(p.price) })));
});

router.post("/products", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const data = parsed.data;
  const created = await prisma.product.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      details: data.details,
      price: data.price,
      stock: data.stock,
      sku: data.sku,
      imageUrl: data.imageUrl || null,
      categoryId: data.categoryId,
      promotionId: data.promotionId || null
    }
  });

  return res.json(created);
});

router.put("/products/:id", async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const current = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!current) return res.status(404).json({ message: "Produto não encontrado." });

  const data = parsed.data;
  const name = data.name ?? current.name;

  const updated = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name,
      slug: slugify(name),
      description: data.description ?? current.description,
      details: data.details ?? current.details,
      price: data.price ?? current.price,
      stock: data.stock ?? current.stock,
      sku: data.sku ?? current.sku,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl || null : current.imageUrl,
      categoryId: data.categoryId ?? current.categoryId,
      promotionId: data.promotionId !== undefined ? data.promotionId || null : current.promotionId
    }
  });

  return res.json(updated);
});

router.delete("/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

router.get("/promotions", async (_req, res) => {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(promotions.map((p) => ({ ...p, value: Number(p.value) })));
});

router.post("/promotions", async (req, res) => {
  const parsed = promotionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const created = await prisma.promotion.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt)
    }
  });

  return res.json(created);
});

router.put("/promotions/:id", async (req, res) => {
  const parsed = promotionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const current = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!current) return res.status(404).json({ message: "Promoção não encontrada." });

  const updated = await prisma.promotion.update({
    where: { id: req.params.id },
    data: {
      title: parsed.data.title ?? current.title,
      description: parsed.data.description ?? current.description,
      type: parsed.data.type ?? current.type,
      value: parsed.data.value ?? current.value,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : current.startsAt,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : current.endsAt,
      active: parsed.data.active ?? current.active
    }
  });

  return res.json(updated);
});

router.delete("/promotions/:id", async (req, res) => {
  await prisma.promotion.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

router.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(orders.map((o) => ({ ...o, total: Number(o.total) })));
});

router.get("/settings", async (_req, res) => {
  const settings = await prisma.setting.findMany();
  return res.json(settings);
});

router.post("/settings", async (req, res) => {
  const schema = z.object({ key: z.string().min(1), value: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const setting = await prisma.setting.upsert({
    where: { key: parsed.data.key },
    create: parsed.data,
    update: { value: parsed.data.value }
  });
  return res.json(setting);
});

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
  return res.json(users);
});

export default router;

