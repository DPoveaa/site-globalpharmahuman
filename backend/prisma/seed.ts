import { PrismaClient, PromotionType, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@globalpharmahuman.com.br";
  const adminPassword = await hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Administrador GPH",
      email: adminEmail,
      passwordHash: adminPassword,
      role: Role.ADMIN
    }
  });

  const vitaminCategory = await prisma.category.upsert({
    where: { slug: "vitaminas" },
    update: {},
    create: {
      name: "Vitaminas e Suplementos",
      slug: "vitaminas",
      description: "Suplementos para energia, imunidade e performance."
    }
  });

  const manipulatedCategory = await prisma.category.upsert({
    where: { slug: "manipulados" },
    update: {},
    create: {
      name: "Manipulados",
      slug: "manipulados",
      description: "Fórmulas personalizadas com qualidade farmacêutica."
    }
  });

  const promo = await prisma.promotion.create({
    data: {
      title: "Promo de Boas-vindas",
      description: "Desconto para os principais produtos de entrada.",
      type: PromotionType.PERCENT,
      value: 10,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      active: true
    }
  });

  await prisma.product.upsert({
    where: { slug: "vitamina-c-1000mg" },
    update: {},
    create: {
      name: "Vitamina C 1000mg",
      slug: "vitamina-c-1000mg",
      description: "Reforço da imunidade e ação antioxidante.",
      details: "60 cápsulas",
      price: 79.9,
      sku: "VIT-C-1000",
      categoryId: vitaminCategory.id,
      promotionId: promo.id,
      imageUrl:
        "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=1200&q=80"
    }
  });

  await prisma.product.upsert({
    where: { slug: "formula-sono-mag" },
    update: {},
    create: {
      name: "Fórmula Sono + Magnésio",
      slug: "formula-sono-mag",
      description: "Composto manipulado para suporte ao descanso e relaxamento.",
      details: "30 doses",
      price: 119.9,
      sku: "MAN-SONO-MAG",
      categoryId: manipulatedCategory.id,
      imageUrl:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

