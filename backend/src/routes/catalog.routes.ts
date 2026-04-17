import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return res.json(categories);
});

router.get("/products", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(category ? { category: { slug: category } } : {})
    },
    include: { promotion: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  return res.json(
    products.map((product) => ({
      ...product,
      price: Number(product.price),
      promotion: product.promotion
        ? {
            ...product.promotion,
            value: Number(product.promotion.value)
          }
        : null
    }))
  );
});

router.get("/products/featured", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { active: true },
    take: 6,
    orderBy: { createdAt: "desc" }
  });
  return res.json(products.map((p) => ({ ...p, price: Number(p.price) })));
});

router.get("/categories-with-products", async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { active: true },
        take: 4,
        include: { promotion: true }
      }
    }
  });
  return res.json(categories);
});

router.get("/products/latest", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { promotion: true }
  });
  return res.json(
    products.map((p) => ({
      ...p,
      price: Number(p.price),
      promotion: p.promotion ? { ...p.promotion, value: Number(p.promotion.value) } : null
    }))
  );
});

router.get("/settings/:key", async (req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
  return res.json(setting);
});

export default router;

