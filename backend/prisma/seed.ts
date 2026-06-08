import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando semeadura do banco de dados...");

  // 1. Configurações (Settings)
  console.log("Semeando configurações...");
  await prisma.setting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "5511949209864" },
    create: { key: "whatsapp_number", value: "5511949209864" }
  });
  await prisma.setting.upsert({
    where: { key: "CEP_ORIGEM" },
    update: { value: "04048001" },
    create: { key: "CEP_ORIGEM", value: "04048001" }
  });
  await prisma.setting.upsert({
    where: { key: "HOME_FEATURED_CONFIG" },
    update: { value: "{\"showOnHome\":true,\"order\":-10,\"homeTitle\":\"Ofertas Imperdíveis\"}" },
    create: { key: "HOME_FEATURED_CONFIG", value: "{\"showOnHome\":true,\"order\":-10,\"homeTitle\":\"Ofertas Imperdíveis\"}" }
  });
  await prisma.setting.upsert({
    where: { key: "HOME_LATEST_CONFIG" },
    update: { value: "{\"showOnHome\":true,\"order\":1000,\"homeTitle\":\"Novidades Fresquinhas\"}" },
    create: { key: "HOME_LATEST_CONFIG", value: "{\"showOnHome\":true,\"order\":1000,\"homeTitle\":\"Novidades Fresquinhas\"}" }
  });
  await prisma.setting.upsert({
    where: { key: "HEADER_NAV_BAR_COLOR" },
    update: { value: "#0062ff" },
    create: { key: "HEADER_NAV_BAR_COLOR", value: "#0062ff" }
  });
  await prisma.setting.upsert({
    where: { key: "HEADER_NAV_TEXT_COLOR" },
    update: { value: "#ffffff" },
    create: { key: "HEADER_NAV_TEXT_COLOR", value: "#ffffff" }
  });
  await prisma.setting.upsert({
    where: { key: "HEADER_NAV_ICON_COLOR" },
    update: { value: "#d1d1d1" },
    create: { key: "HEADER_NAV_ICON_COLOR", value: "#d1d1d1" }
  });
  await prisma.setting.upsert({
    where: { key: "HOME_BANNERS" },
    update: { value: "[{\"id\":\"541f0554-12a8-498c-b62b-5b4b63da8df4\",\"image\":\"/uploads/prod-1780932258844.webp\",\"title\":\"\",\"subtitle\":\"\",\"link\":\"/catalogo?categoria=suplementos\"},{\"id\":\"7db19c72-f8dd-4f1f-8779-c97c9a008e92\",\"image\":\"/uploads/prod-1780932272032.webp\",\"title\":\"\",\"subtitle\":\"\",\"link\":\"/catalogo?categoria=energia\"}]" },
    create: { key: "HOME_BANNERS", value: "[{\"id\":\"541f0554-12a8-498c-b62b-5b4b63da8df4\",\"image\":\"/uploads/prod-1780932258844.webp\",\"title\":\"\",\"subtitle\":\"\",\"link\":\"/catalogo?categoria=suplementos\"},{\"id\":\"7db19c72-f8dd-4f1f-8779-c97c9a008e92\",\"image\":\"/uploads/prod-1780932272032.webp\",\"title\":\"\",\"subtitle\":\"\",\"link\":\"/catalogo?categoria=energia\"}]" }
  });

  // 2. Unidades de Farmácia (Pharmacy Units)
  console.log("Semeando unidades de farmácia...");
  await prisma.pharmacyUnit.upsert({
    where: { id: "cmp4ews4v0004u88ddd6h2s3d" },
    update: {
      name: "Campinas",
      address: "R. Sete de Setembro, 322 - Vila Industrial, Campinas - SP, 13035-350",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Sete+de+Setembro,+322+-+Vila+Industrial+(Campinas),+Campinas+-+SP,+13035-350/@-22.9139137,-47.0613607,19.5z/data=!4m6!3m5!1s0x94c8c8cb9d225d4f:0xdbde6a51a093d549!8m2!3d-22.913873!4d-47.0608607!16s%2Fg%2F11xs_rq04h?entry=ttu&g_ep=EgoyMDI2MDUxMS4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778698076575.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: false,
      order: 0
    },
    create: {
      id: "cmp4ews4v0004u88ddd6h2s3d",
      name: "Campinas",
      address: "R. Sete de Setembro, 322 - Vila Industrial, Campinas - SP, 13035-350",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Sete+de+Setembro,+322+-+Vila+Industrial+(Campinas),+Campinas+-+SP,+13035-350/@-22.9139137,-47.0613607,19.5z/data=!4m6!3m5!1s0x94c8c8cb9d225d4f:0xdbde6a51a093d549!8m2!3d-22.913873!4d-47.0608607!16s%2Fg%2F11xs_rq04h?entry=ttu&g_ep=EgoyMDI2MDUxMS4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778698076575.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: false,
      order: 0
    }
  });
  await prisma.pharmacyUnit.upsert({
    where: { id: "cmp4emwyh0000u88dn4i1sdxi" },
    update: {
      name: "Vila Mariana",
      address: "R. das Rosas, 665 - Vila Mariana, São Paulo - SP, 04048-001",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/Global+Pharma+Human/@-23.6051682,-46.6454017,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5b38192963a1:0x31c388837ac8da2f!8m2!3d-23.6051731!4d-46.6428268!16s%2Fg%2F1pty85lfr?hl=pt-BR&authuser=1&entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697610151.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    },
    create: {
      id: "cmp4emwyh0000u88dn4i1sdxi",
      name: "Vila Mariana",
      address: "R. das Rosas, 665 - Vila Mariana, São Paulo - SP, 04048-001",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/Global+Pharma+Human/@-23.6051682,-46.6454017,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5b38192963a1:0x31c388837ac8da2f!8m2!3d-23.6051731!4d-46.6428268!16s%2Fg%2F1pty85lfr?hl=pt-BR&authuser=1&entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697610151.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    }
  });
  await prisma.pharmacyUnit.upsert({
    where: { id: "cmp4eoek60001u88ducbmtrkw" },
    update: {
      name: "Mooca",
      address: "R. da Mooca, 3177 - Mooca, São Paulo - SP, 03165-001",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/Global+Pharma+Human/@-23.5565743,-46.5969544,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce592224c08d6b:0x7cb42a8ef18577f0!8m2!3d-23.5565792!4d-46.5943795!16s%2Fg%2F11ryzt_trq?hl=pt-BR&authuser=1&entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697737295.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    },
    create: {
      id: "cmp4eoek60001u88ducbmtrkw",
      name: "Mooca",
      address: "R. da Mooca, 3177 - Mooca, São Paulo - SP, 03165-001",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/Global+Pharma+Human/@-23.5565743,-46.5969544,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce592224c08d6b:0x7cb42a8ef18577f0!8m2!3d-23.5565792!4d-46.5943795!16s%2Fg%2F11ryzt_trq?hl=pt-BR&authuser=1&entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697737295.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    }
  });
  await prisma.pharmacyUnit.upsert({
    where: { id: "cmp4eqnxm0002u88d7z5a96qp" },
    update: {
      name: "Vila Mariana",
      address: "R. França Pinto, 424 - Vila Mariana, São Paulo - SP, 04016-002",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Fran%C3%A7a+Pinto,+424+-+Vila+Mariana,+S%C3%A3o+Paulo+-+SP,+04016-002/@-23.5869416,-46.6432185,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5987c6aeaaab:0x238dfd91d73b34b0!8m2!3d-23.5869465!4d-46.6406436!16s%2Fg%2F11t55r_qtj?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697749304.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    },
    create: {
      id: "cmp4eqnxm0002u88d7z5a96qp",
      name: "Vila Mariana",
      address: "R. França Pinto, 424 - Vila Mariana, São Paulo - SP, 04016-002",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Fran%C3%A7a+Pinto,+424+-+Vila+Mariana,+S%C3%A3o+Paulo+-+SP,+04016-002/@-23.5869416,-46.6432185,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5987c6aeaaab:0x238dfd91d73b34b0!8m2!3d-23.5869465!4d-46.6406436!16s%2Fg%2F11t55r_qtj?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697749304.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    }
  });
  await prisma.pharmacyUnit.upsert({
    where: { id: "cmp4esspa0003u88dr7x4r5wl" },
    update: {
      name: "Perdizes",
      address: "R. Monte Alegre, 251 - Perdizes, São Paulo - SP, 05014-000",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Monte+Alegre,+251+-+Perdizes,+S%C3%A3o+Paulo+-+SP,+05014-000/@-23.5019786,-46.6419712,15z/data=!4m6!3m5!1s0x94ce581c8a2f315f:0xf5e322e9c796e0d4!8m2!3d-23.5330257!4d-46.6665973!16s%2Fg%2F11snn_0t1b?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697855293.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    },
    create: {
      id: "cmp4esspa0003u88dr7x4r5wl",
      name: "Perdizes",
      address: "R. Monte Alegre, 251 - Perdizes, São Paulo - SP, 05014-000",
      phone: "(11) 94920-9864",
      mapsUrl: "https://www.google.com/maps/place/R.+Monte+Alegre,+251+-+Perdizes,+S%C3%A3o+Paulo+-+SP,+05014-000/@-23.5019786,-46.6419712,15z/data=!4m6!3m5!1s0x94ce581c8a2f315f:0xf5e322e9c796e0d4!8m2!3d-23.5330257!4d-46.6665973!16s%2Fg%2F11snn_0t1b?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
      imageUrl: "/uploads/prod-1778697855293.webp",
      openTime: "09:00",
      closeTime: "18:00",
      active: true,
      order: 0
    }
  });

  // 3. Usuários e Endereços
  console.log("Semeando usuários...");
  {
    const userRecord = await prisma.user.upsert({
      where: { email: "teste@globalpharmahuman.com.br" },
      update: {
        name: "Teste",
        passwordHash: "$2a$10$Xwa97IKVl/Ve66YY0913SONe3Z1Y1Vv5XVZeyHsjXFqKr4aFe/oEu",
        role: "CUSTOMER",
        permissions: [],
        mustChangePassword: false,
        phone: "(11) 99810-5896",
        cpf: "47933955894",
        stampsBalance: 0
      },
      create: {
        id: "cmq5d5o360007mvq5owguqadt",
        email: "teste@globalpharmahuman.com.br",
        name: "Teste",
        passwordHash: "$2a$10$Xwa97IKVl/Ve66YY0913SONe3Z1Y1Vv5XVZeyHsjXFqKr4aFe/oEu",
        role: "CUSTOMER",
        permissions: [],
        mustChangePassword: false,
        phone: "(11) 99810-5896",
        cpf: "47933955894",
        stampsBalance: 0
      }
    });
    console.log("Semeando endereços para " + userRecord.email);
    await prisma.address.upsert({
      where: { id: "cmq5d6clt000bmvq5vwgny0s0" },
      update: {
        userId: userRecord.id,
        alias: "casa",
        street: "Rua Aluísio Azevedo",
        number: "345",
        district: "Santana",
        city: "São Paulo",
        state: "SP",
        zipCode: "02021030",
        complement: "apto 143",
        reference: null
      },
      create: {
        id: "cmq5d6clt000bmvq5vwgny0s0",
        userId: userRecord.id,
        alias: "casa",
        street: "Rua Aluísio Azevedo",
        number: "345",
        district: "Santana",
        city: "São Paulo",
        state: "SP",
        zipCode: "02021030",
        complement: "apto 143",
        reference: null
      }
    });
  }
  {
    const userRecord = await prisma.user.upsert({
      where: { email: "master@globalpharmahuman.com.br" },
      update: {
        name: "Master Admin",
        passwordHash: "$2a$10$HbClP0AwY51LR9RwP6FDDe8OS8q/9upO3y03he1A8GmTOFxyf4voa",
        role: "ADMIN",
        permissions: [],
        mustChangePassword: false,
        phone: null,
        cpf: "99991111140",
        stampsBalance: 1
      },
      create: {
        id: "cmout10bx0000wth1mqowri8q",
        email: "master@globalpharmahuman.com.br",
        name: "Master Admin",
        passwordHash: "$2a$10$HbClP0AwY51LR9RwP6FDDe8OS8q/9upO3y03he1A8GmTOFxyf4voa",
        role: "ADMIN",
        permissions: [],
        mustChangePassword: false,
        phone: null,
        cpf: "99991111140",
        stampsBalance: 1
      }
    });
    console.log("Semeando endereços para " + userRecord.email);
    await prisma.address.upsert({
      where: { id: "cmovx6oni0003pirb5ke9b6o1" },
      update: {
        userId: userRecord.id,
        alias: null,
        street: "Rua Aluísio Azevedo",
        number: "345",
        district: "Santana",
        city: "São Paulo",
        state: "SP",
        zipCode: "02021030",
        complement: null,
        reference: null
      },
      create: {
        id: "cmovx6oni0003pirb5ke9b6o1",
        userId: userRecord.id,
        alias: null,
        street: "Rua Aluísio Azevedo",
        number: "345",
        district: "Santana",
        city: "São Paulo",
        state: "SP",
        zipCode: "02021030",
        complement: null,
        reference: null
      }
    });
    await prisma.address.upsert({
      where: { id: "cmovxnau20004jn4x5nppty8l" },
      update: {
        userId: userRecord.id,
        alias: null,
        street: "Praça Bento Oliveira Nascimento",
        number: "143",
        district: "Centro",
        city: "Mairiporã",
        state: "SP",
        zipCode: "07600-003",
        complement: null,
        reference: null
      },
      create: {
        id: "cmovxnau20004jn4x5nppty8l",
        userId: userRecord.id,
        alias: null,
        street: "Praça Bento Oliveira Nascimento",
        number: "143",
        district: "Centro",
        city: "Mairiporã",
        state: "SP",
        zipCode: "07600-003",
        complement: null,
        reference: null
      }
    });
  }

  // 4. Categorias
  console.log("Semeando categorias...");
  await prisma.category.upsert({
    where: { slug: "suplementos" },
    update: {
      name: "Suplementos",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmp5tq7v80000sno1fjz7naoe",
      name: "Suplementos",
      slug: "suplementos",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "cosmeticos" },
    update: {
      name: "Cosméticos",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmp5tqbjp0001sno1vavv94cj",
      name: "Cosméticos",
      slug: "cosmeticos",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "complemento-alimentar" },
    update: {
      name: "Complemento Alimentar",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmp5tr97g0004sno1mbbzhc7r",
      name: "Complemento Alimentar",
      slug: "complemento-alimentar",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "controle-de-apetite-7361" },
    update: {
      name: "Controle de Apetite",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1u0074141e376rqlek",
      name: "Controle de Apetite",
      slug: "controle-de-apetite-7361",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "vitaminas" },
    update: {
      name: "Vitaminas",
      description: "Suplementos vitamínicos essenciais",
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmout10c90001wth1po80tz20",
      name: "Vitaminas",
      slug: "vitaminas",
      description: "Suplementos vitamínicos essenciais",
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "manipulados-4703" },
    update: {
      name: "Manipulados",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphf5ak00000141eh3dz720m",
      name: "Manipulados",
      slug: "manipulados-4703",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "saude-capilar-7337" },
    update: {
      name: "Saúde Capilar",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt16006k141efduj0yax",
      name: "Saúde Capilar",
      slug: "saude-capilar-7337",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "cabelos-unhas-7339" },
    update: {
      name: "Cabelos Unhas",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt18006l141e2jn70z6o",
      name: "Cabelos Unhas",
      slug: "cabelos-unhas-7339",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "pele-7340" },
    update: {
      name: "Pele",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1a006m141egjnhkh4e",
      name: "Pele",
      slug: "pele-7340",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "circulacao-7342" },
    update: {
      name: "Circulação",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1b006n141epazh1fev",
      name: "Circulação",
      slug: "circulacao-7342",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "antioxidantes-7343" },
    update: {
      name: "Antioxidantes",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1c006o141e7u6q3x09",
      name: "Antioxidantes",
      slug: "antioxidantes-7343",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "memoria-7344" },
    update: {
      name: "Memória",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1e006p141e2a18za8e",
      name: "Memória",
      slug: "memoria-7344",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "vitalidade-7346" },
    update: {
      name: "Vitalidade",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1f006q141e08lzzanj",
      name: "Vitalidade",
      slug: "vitalidade-7346",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "medicamentos-manipulados-7347" },
    update: {
      name: "Medicamentos Manipulados",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1g006r141enpggkg0g",
      name: "Medicamentos Manipulados",
      slug: "medicamentos-manipulados-7347",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "saude-masculina-7348" },
    update: {
      name: "Saúde Masculina",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1h006s141ed57fvg0q",
      name: "Saúde Masculina",
      slug: "saude-masculina-7348",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "metabolismo-7349" },
    update: {
      name: "Metabolismo",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1i006t141ektvsfn74",
      name: "Metabolismo",
      slug: "metabolismo-7349",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "vitalidade-masculina-7350" },
    update: {
      name: "Vitalidade Masculina",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1j006u141e83uafkh5",
      name: "Vitalidade Masculina",
      slug: "vitalidade-masculina-7350",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "humor-7351" },
    update: {
      name: "Humor",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1k006v141ejmhkxrpw",
      name: "Humor",
      slug: "humor-7351",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "disposicao-7352" },
    update: {
      name: "Disposição",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1m006w141eot9uhnhw",
      name: "Disposição",
      slug: "disposicao-7352",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "tratamento-capilar-7353" },
    update: {
      name: "Tratamento Capilar",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1n006x141ekwusx0v7",
      name: "Tratamento Capilar",
      slug: "tratamento-capilar-7353",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "hormonal-7355" },
    update: {
      name: "Hormonal",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1o006y141ermq62ttj",
      name: "Hormonal",
      slug: "hormonal-7355",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "minerais-7356" },
    update: {
      name: "Minerais",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1p006z141eercih3kz",
      name: "Minerais",
      slug: "minerais-7356",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "cognicao-7357" },
    update: {
      name: "Cognição",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1q0070141eigica40g",
      name: "Cognição",
      slug: "cognicao-7357",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "relaxamento-7358" },
    update: {
      name: "Relaxamento",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1r0071141eq4jp9s7w",
      name: "Relaxamento",
      slug: "relaxamento-7358",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "capilar-7359" },
    update: {
      name: "Capilar",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1s0072141eijc270qb",
      name: "Capilar",
      slug: "capilar-7359",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "saude-hepatica-7360" },
    update: {
      name: "Saúde Hepática",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1t0073141e574gs2cd",
      name: "Saúde Hepática",
      slug: "saude-hepatica-7360",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "energia-celular-7362" },
    update: {
      name: "Energia Celular",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1w0075141e71acbne6",
      name: "Energia Celular",
      slug: "energia-celular-7362",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "foco-7363" },
    update: {
      name: "Foco",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1x0076141ee7nmqd46",
      name: "Foco",
      slug: "foco-7363",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "sono-7364" },
    update: {
      name: "Sono",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1x0077141eirdemjzy",
      name: "Sono",
      slug: "sono-7364",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "fibras-7365" },
    update: {
      name: "Fibras",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1y0078141eab1mbdom",
      name: "Fibras",
      slug: "fibras-7365",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "saude-digestiva-7366" },
    update: {
      name: "Saúde Digestiva",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt1z0079141esl3pa88a",
      name: "Saúde Digestiva",
      slug: "saude-digestiva-7366",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "recuperacao-7367" },
    update: {
      name: "Recuperação",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt20007a141e4e5e8a5z",
      name: "Recuperação",
      slug: "recuperacao-7367",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "pernas-cansadas-7368" },
    update: {
      name: "Pernas Cansadas",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt21007b141ezpfg1mr3",
      name: "Pernas Cansadas",
      slug: "pernas-cansadas-7368",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "saude-intestinal-7369" },
    update: {
      name: "Saúde Intestinal",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt22007c141eusqcto82",
      name: "Saúde Intestinal",
      slug: "saude-intestinal-7369",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "termogenicos-7371" },
    update: {
      name: "Termogênicos",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt25007d141e2tph133q",
      name: "Termogênicos",
      slug: "termogenicos-7371",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "drenagem-7373" },
    update: {
      name: "Drenagem",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt26007e141e927xtwco",
      name: "Drenagem",
      slug: "drenagem-7373",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "beleza-7374" },
    update: {
      name: "Beleza",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt27007f141ev7tnu2ll",
      name: "Beleza",
      slug: "beleza-7374",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "articulacoes-7375" },
    update: {
      name: "Articulações",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt28007g141e76z82ae6",
      name: "Articulações",
      slug: "articulacoes-7375",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "clareadores-7377" },
    update: {
      name: "Clareadores",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2a007i141e64ae5vki",
      name: "Clareadores",
      slug: "clareadores-7377",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "tratamento-facial-7378" },
    update: {
      name: "Tratamento Facial",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2b007j141egg3hpmsw",
      name: "Tratamento Facial",
      slug: "tratamento-facial-7378",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "mobilidade-7379" },
    update: {
      name: "Mobilidade",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2c007k141e3jmuh8g9",
      name: "Mobilidade",
      slug: "mobilidade-7379",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "anti-idade-7380" },
    update: {
      name: "Anti-idade",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2d007l141e4neggnpi",
      name: "Anti-idade",
      slug: "anti-idade-7380",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "limpeza-facial-7381" },
    update: {
      name: "Limpeza Facial",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2f007m141ebj45v161",
      name: "Limpeza Facial",
      slug: "limpeza-facial-7381",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "performance-7382" },
    update: {
      name: "Performance",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2g007n141eg3tx2r45",
      name: "Performance",
      slug: "performance-7382",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "massa-muscular-7383" },
    update: {
      name: "Massa Muscular",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2h007o141ezoftq4we",
      name: "Massa Muscular",
      slug: "massa-muscular-7383",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "imunidade-7385" },
    update: {
      name: "Imunidade",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2i007p141e9apg9vzw",
      name: "Imunidade",
      slug: "imunidade-7385",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "pre-treino-7386" },
    update: {
      name: "Pré-Treino",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt2j007q141e68mdyuhc",
      name: "Pré-Treino",
      slug: "pre-treino-7386",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "academia" },
    update: {
      name: "Academia",
      description: null,
      showOnHome: false,
      homeTitle: "Para dar um UP no treino",
      order: 0
    },
    create: {
      id: "cmp5tqo0h0002sno13un2diwi",
      name: "Academia",
      slug: "academia",
      description: null,
      showOnHome: false,
      homeTitle: "Para dar um UP no treino",
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "energia" },
    update: {
      name: "Energia",
      description: null,
      showOnHome: false,
      homeTitle: "Tenha mais disposição",
      order: 0
    },
    create: {
      id: "cmp5tqwub0003sno1t3d3xwwe",
      name: "Energia",
      slug: "energia",
      description: null,
      showOnHome: false,
      homeTitle: "Tenha mais disposição",
      order: 0
    }
  });
  await prisma.category.upsert({
    where: { slug: "hidratacao-facial-7376" },
    update: {
      name: "Hidratação Facial",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    },
    create: {
      id: "cmphikt29007h141eq5uzmrn1",
      name: "Hidratação Facial",
      slug: "hidratacao-facial-7376",
      description: null,
      showOnHome: false,
      homeTitle: null,
      order: 0
    }
  });

  // 5. Itens de Navegação do Cabeçalho
  console.log("Semeando itens de navegação...");
  await prisma.headerNavItem.upsert({
    where: { id: "cmp4d68kk0003g1v79wc0z697" },
    update: {
      label: "Promoções",
      categoryId: null,
      customUrl: null,
      icon: "Percent",
      iconColor: null,
      order: 0,
      active: true
    },
    create: {
      id: "cmp4d68kk0003g1v79wc0z697",
      label: "Promoções",
      categoryId: null,
      customUrl: null,
      icon: "Percent",
      iconColor: null,
      order: 0,
      active: true
    }
  });
  await prisma.headerNavItem.upsert({
    where: { id: "cmp4d5ki60001g1v7lhugdl6e" },
    update: {
      label: "Manipulados",
      categoryId: null,
      customUrl: "https://wa.me/5511949209864?text=Ol%C3%A1!+Gostaria+de+saber+mais+sobre+os+produtos+manipulados",
      icon: "MessageCircle",
      iconColor: null,
      order: 4,
      active: true
    },
    create: {
      id: "cmp4d5ki60001g1v7lhugdl6e",
      label: "Manipulados",
      categoryId: null,
      customUrl: "https://wa.me/5511949209864?text=Ol%C3%A1!+Gostaria+de+saber+mais+sobre+os+produtos+manipulados",
      icon: "MessageCircle",
      iconColor: null,
      order: 4,
      active: true
    }
  });
  await prisma.headerNavItem.upsert({
    where: { id: "cmp4d72y90005g1v7nlra0ebf" },
    update: {
      label: "Emagreça",
      categoryId: "cmphikt1i006t141ektvsfn74",
      customUrl: null,
      icon: "Apple",
      iconColor: null,
      order: 1,
      active: true
    },
    create: {
      id: "cmp4d72y90005g1v7nlra0ebf",
      label: "Emagreça",
      categoryId: "cmphikt1i006t141ektvsfn74",
      customUrl: null,
      icon: "Apple",
      iconColor: null,
      order: 1,
      active: true
    }
  });
  await prisma.headerNavItem.upsert({
    where: { id: "cmp4d83of0007g1v7wx66keaq" },
    update: {
      label: "Fitness",
      categoryId: "cmp5tq7v80000sno1fjz7naoe",
      customUrl: null,
      icon: "Dumbbell",
      iconColor: null,
      order: 2,
      active: true
    },
    create: {
      id: "cmp4d83of0007g1v7wx66keaq",
      label: "Fitness",
      categoryId: "cmp5tq7v80000sno1fjz7naoe",
      customUrl: null,
      icon: "Dumbbell",
      iconColor: null,
      order: 2,
      active: true
    }
  });
  await prisma.headerNavItem.upsert({
    where: { id: "cmp4d93ms0009g1v7tl0qreum" },
    update: {
      label: "Beleza",
      categoryId: "cmp5tqbjp0001sno1vavv94cj",
      customUrl: null,
      icon: "Smile",
      iconColor: null,
      order: 3,
      active: true
    },
    create: {
      id: "cmp4d93ms0009g1v7tl0qreum",
      label: "Beleza",
      categoryId: "cmp5tqbjp0001sno1vavv94cj",
      customUrl: null,
      icon: "Smile",
      iconColor: null,
      order: 3,
      active: true
    }
  });

  // 6. Produtos e Imagens
  console.log("Semeando produtos...");
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "GLUT-GPH-PO" },
      update: {
        name: "Glutamina 300g",
        slug: "glutamina-300g",
        description: "Glutamina em pó com zinco e vitamina D, sabor neutro e facilmente solúvel, desenvolvida para complementar a rotina nutricional e imune.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Glutamina 300g\n\nTipo: Suplemento alimentar de glutamina com zinco e vitamina D em pó\n\nPeso/Quantidade: 300g\n\nSabor: Neutro\n\nContém:\nGlutamina\nZinco\nVitamina D\n\nGlutamina em pó sabor neutro, formulada com zinco e vitamina D para complementar a rotina nutricional. A embalagem destaca sua relação com o funcionamento do sistema imune e a facilidade de dissolução.\n\nBenefícios:\nAuxilia no funcionamento do sistema imune\nComplementa a rotina nutricional\nFácil preparo\nSabor neutro\n\nDiferenciais:\nCom zinco e vitamina D\nFacilmente solúvel\nSabor neutro\nPote de 300g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nSuplemento alimentar em pó\nArmazenar em local seco e fresco\nConsumir conforme orientação profissional",
        imageUrl: "/uploads/prod-1779490659123.webp",
        price: 70,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt20007a141e4e5e8a5z"},{"id":"cmphikt2i007p141e9apg9vzw"}]
        }
      },
      create: {
        id: "cmphikt8100ay141eqhvnt4og",
        name: "Glutamina 300g",
        slug: "glutamina-300g",
        description: "Glutamina em pó com zinco e vitamina D, sabor neutro e facilmente solúvel, desenvolvida para complementar a rotina nutricional e imune.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Glutamina 300g\n\nTipo: Suplemento alimentar de glutamina com zinco e vitamina D em pó\n\nPeso/Quantidade: 300g\n\nSabor: Neutro\n\nContém:\nGlutamina\nZinco\nVitamina D\n\nGlutamina em pó sabor neutro, formulada com zinco e vitamina D para complementar a rotina nutricional. A embalagem destaca sua relação com o funcionamento do sistema imune e a facilidade de dissolução.\n\nBenefícios:\nAuxilia no funcionamento do sistema imune\nComplementa a rotina nutricional\nFácil preparo\nSabor neutro\n\nDiferenciais:\nCom zinco e vitamina D\nFacilmente solúvel\nSabor neutro\nPote de 300g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nSuplemento alimentar em pó\nArmazenar em local seco e fresco\nConsumir conforme orientação profissional",
        imageUrl: "/uploads/prod-1779490659123.webp",
        price: 70,
        sku: "GLUT-GPH-PO",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt20007a141e4e5e8a5z"},{"id":"cmphikt2i007p141e9apg9vzw"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphismf100az141ev4r775z5" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779490659123.webp",
        order: 0
      },
      create: {
        id: "cmphismf100az141ev4r775z5",
        productId: productRecord.id,
        url: "/uploads/prod-1779490659123.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MINOX-BIOT-GPH-100ML" },
      update: {
        name: "Minoxidil 5% + Biotina 0,01% 100ml",
        slug: "minoxidil-5-biotina-0-01-100ml",
        description: "Solução capilar com minoxidil 5% e biotina 0,01%, desenvolvida para uma rotina completa de cuidado, fortalecimento e crescimento dos fios.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Minoxidil 5% + Biotina 0,01% 100ml\n\nTipo: Solução capilar manipulada\n\nPeso/Quantidade: 100ml\n\nContém:\nMinoxidil 5%\nBiotina 0,01%\n\nSolução capilar manipulada que combina minoxidil 5% com biotina 0,01%, reunindo um ativo de uso tópico para crescimento capilar com um componente associado à rotina de fortalecimento dos fios.\n\nBenefícios:\nAuxilia na rotina de crescimento capilar\nApoio ao fortalecimento dos fios\nUso tópico direcionado\nCombina dois ativos capilares\n\nDiferenciais:\nMinoxidil 5%\nBiotina 0,01%\nFrasco de 100ml\nFórmula manipulada\n\nModo de uso:\nAplicar no couro cabeludo conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826807840.webp",
        price: 50,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1n006x141ekwusx0v7"}]
        }
      },
      create: {
        id: "cmphikt3y008i141eqznzz6w0",
        name: "Minoxidil 5% + Biotina 0,01% 100ml",
        slug: "minoxidil-5-biotina-0-01-100ml",
        description: "Solução capilar com minoxidil 5% e biotina 0,01%, desenvolvida para uma rotina completa de cuidado, fortalecimento e crescimento dos fios.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Minoxidil 5% + Biotina 0,01% 100ml\n\nTipo: Solução capilar manipulada\n\nPeso/Quantidade: 100ml\n\nContém:\nMinoxidil 5%\nBiotina 0,01%\n\nSolução capilar manipulada que combina minoxidil 5% com biotina 0,01%, reunindo um ativo de uso tópico para crescimento capilar com um componente associado à rotina de fortalecimento dos fios.\n\nBenefícios:\nAuxilia na rotina de crescimento capilar\nApoio ao fortalecimento dos fios\nUso tópico direcionado\nCombina dois ativos capilares\n\nDiferenciais:\nMinoxidil 5%\nBiotina 0,01%\nFrasco de 100ml\nFórmula manipulada\n\nModo de uso:\nAplicar no couro cabeludo conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826807840.webp",
        price: 50,
        sku: "MINOX-BIOT-GPH-100ML",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1n006x141ekwusx0v7"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2xfu1000spnnm5hxyys1k" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826807840.webp",
        order: 0
      },
      create: {
        id: "cmpn2xfu1000spnnm5hxyys1k",
        productId: productRecord.id,
        url: "/uploads/prod-1779826807840.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "TRIB-GPH-500MG-60CAP" },
      update: {
        name: "Tribulus Terrestris 500mg c/60 cápsulas",
        slug: "tribulus-terrestris-500mg-c-60-capsulas",
        description: "Tribulus Terrestris 500mg em cápsulas, fitoterápico tradicionalmente usado em rotinas de vitalidade, disposição e bem-estar masculino.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tribulus Terrestris 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nTribulus terrestris 500mg\n\nFitoterápico manipulado tradicionalmente usado em rotinas voltadas à vitalidade, disposição física e bem-estar masculino. A apresentação em cápsulas facilita o uso diário com orientação.\n\nBenefícios:\nSuporte à vitalidade\nApoio à disposição física\nPraticidade para rotina diária\nPode complementar rotinas de bem-estar masculino\n\nDiferenciais:\nAtivo vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826892174.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1j006u141e83uafkh5"}]
        }
      },
      create: {
        id: "cmphikt3d0086141ek6zz1r18",
        name: "Tribulus Terrestris 500mg c/60 cápsulas",
        slug: "tribulus-terrestris-500mg-c-60-capsulas",
        description: "Tribulus Terrestris 500mg em cápsulas, fitoterápico tradicionalmente usado em rotinas de vitalidade, disposição e bem-estar masculino.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tribulus Terrestris 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nTribulus terrestris 500mg\n\nFitoterápico manipulado tradicionalmente usado em rotinas voltadas à vitalidade, disposição física e bem-estar masculino. A apresentação em cápsulas facilita o uso diário com orientação.\n\nBenefícios:\nSuporte à vitalidade\nApoio à disposição física\nPraticidade para rotina diária\nPode complementar rotinas de bem-estar masculino\n\nDiferenciais:\nAtivo vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826892174.webp",
        price: 45,
        sku: "TRIB-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1j006u141e83uafkh5"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2z8kj000ypnnmoqhrm6i9" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826892174.webp",
        order: 0
      },
      create: {
        id: "cmpn2z8kj000ypnnmoqhrm6i9",
        productId: productRecord.id,
        url: "/uploads/prod-1779826892174.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "FENO-GPH-600MG-60CAP" },
      update: {
        name: "Feno Grego 600mg c/60 cápsulas",
        slug: "feno-grego-600mg-c-60-capsulas",
        description: "Feno Grego 600mg em cápsulas, ativo vegetal usado em rotinas de disposição, metabolismo e bem-estar. Uma opção prática para suplementação diária.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Feno Grego 600mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nFeno grego 600mg\n\nFitoterápico manipulado com feno grego, planta tradicionalmente usada em rotinas de bem-estar, energia e suporte metabólico. A dose de 600mg oferece praticidade e padronização no uso.\n\nBenefícios:\nApoio à disposição diária\nSuporte ao metabolismo\nUso prático em cápsulas\nPode complementar rotinas de bem-estar\n\nDiferenciais:\nAtivo vegetal\nDose de 600mg\n60 cápsulas\nManipulado sob medida\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nPode não ser adequado para todos os públicos\nGestantes, lactantes e pessoas em tratamento devem buscar orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826901712.webp",
        price: 85,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt3a0084141e5e23o3nu",
        name: "Feno Grego 600mg c/60 cápsulas",
        slug: "feno-grego-600mg-c-60-capsulas",
        description: "Feno Grego 600mg em cápsulas, ativo vegetal usado em rotinas de disposição, metabolismo e bem-estar. Uma opção prática para suplementação diária.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Feno Grego 600mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nFeno grego 600mg\n\nFitoterápico manipulado com feno grego, planta tradicionalmente usada em rotinas de bem-estar, energia e suporte metabólico. A dose de 600mg oferece praticidade e padronização no uso.\n\nBenefícios:\nApoio à disposição diária\nSuporte ao metabolismo\nUso prático em cápsulas\nPode complementar rotinas de bem-estar\n\nDiferenciais:\nAtivo vegetal\nDose de 600mg\n60 cápsulas\nManipulado sob medida\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nPode não ser adequado para todos os públicos\nGestantes, lactantes e pessoas em tratamento devem buscar orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826901712.webp",
        price: 85,
        sku: "FENO-GPH-600MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2zfif000zpnnmj0ufcr6v" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826901712.webp",
        order: 0
      },
      create: {
        id: "cmpn2zfif000zpnnmj0ufcr6v",
        productId: productRecord.id,
        url: "/uploads/prod-1779826901712.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "TADA-GPH-5MG-30CAP" },
      update: {
        name: "Tadalafila 5mg c/30 cápsulas",
        slug: "tadalafila-5mg-c-30-capsulas",
        description: "Tadalafila 5mg manipulada em cápsulas, indicada para uso sob prescrição profissional. Fórmula com dose individualizada e apresentação prática.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tadalafila 5mg c/30 cápsulas\n\nTipo: Medicamento manipulado em cápsulas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nTadalafila 5mg\n\nMedicamento manipulado em cápsulas com tadalafila 5mg, preparado para uso sob prescrição e acompanhamento profissional. Indicado quando há necessidade de dose individualizada e orientação específica.\n\nBenefícios:\nDose padronizada de 5mg\nApresentação prática em cápsulas\nManipulado conforme demanda\nUso controlado com orientação profissional\n\nDiferenciais:\nMedicamento manipulado\n30 cápsulas\nDose individualizada\nPreparado pela Global Pharma Human\n\nModo de uso:\nUsar somente conforme prescrição ou orientação profissional.\n\nObservações:\nMedicamento sujeito a orientação profissional\nNão usar com nitratos sem avaliação profissional\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826911423.webp",
        price: 40,
        active: true,
        categories: {
          set: [{"id":"cmphikt1g006r141enpggkg0g"},{"id":"cmphikt1h006s141ed57fvg0q"}]
        }
      },
      create: {
        id: "cmphikt360082141eao76wnmw",
        name: "Tadalafila 5mg c/30 cápsulas",
        slug: "tadalafila-5mg-c-30-capsulas",
        description: "Tadalafila 5mg manipulada em cápsulas, indicada para uso sob prescrição profissional. Fórmula com dose individualizada e apresentação prática.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tadalafila 5mg c/30 cápsulas\n\nTipo: Medicamento manipulado em cápsulas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nTadalafila 5mg\n\nMedicamento manipulado em cápsulas com tadalafila 5mg, preparado para uso sob prescrição e acompanhamento profissional. Indicado quando há necessidade de dose individualizada e orientação específica.\n\nBenefícios:\nDose padronizada de 5mg\nApresentação prática em cápsulas\nManipulado conforme demanda\nUso controlado com orientação profissional\n\nDiferenciais:\nMedicamento manipulado\n30 cápsulas\nDose individualizada\nPreparado pela Global Pharma Human\n\nModo de uso:\nUsar somente conforme prescrição ou orientação profissional.\n\nObservações:\nMedicamento sujeito a orientação profissional\nNão usar com nitratos sem avaliação profissional\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826911423.webp",
        price: 40,
        sku: "TADA-GPH-5MG-30CAP",
        active: true,
        categories: {
          connect: [{"id":"cmphikt1g006r141enpggkg0g"},{"id":"cmphikt1h006s141ed57fvg0q"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2zmui0010pnnm8dilpxe2" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826911423.webp",
        order: 0
      },
      create: {
        id: "cmpn2zmui0010pnnm8dilpxe2",
        productId: productRecord.id,
        url: "/uploads/prod-1779826911423.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "BIOT-GPH-5MG-60CAP" },
      update: {
        name: "Biotina 5mg c/60 cápsulas",
        slug: "biotina-5mg-c-60-capsulas",
        description: "Biotina 5mg em cápsulas para complementar a rotina de beleza, com foco em cabelos, unhas e pele. Uma opção simples e prática para cuidados diários.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Biotina 5mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nBiotina 5mg\n\nSuplemento manipulado de biotina, uma vitamina do complexo B associada à manutenção de cabelos, pele e unhas. A apresentação em cápsulas facilita o uso diário e o acompanhamento da rotina de cuidados.\n\nBenefícios:\nAuxilia na manutenção de cabelos e unhas\nContribui para rotina de cuidado da pele\nUso prático no dia a dia\nDose definida por cápsula\n\nDiferenciais:\nBiotina 5mg por cápsula\nFórmula objetiva\n60 cápsulas\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826944079.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt18006l141e2jn70z6o"},{"id":"cmphikt1a006m141egjnhkh4e"}]
        }
      },
      create: {
        id: "cmphikt2q007u141e87poevyr",
        name: "Biotina 5mg c/60 cápsulas",
        slug: "biotina-5mg-c-60-capsulas",
        description: "Biotina 5mg em cápsulas para complementar a rotina de beleza, com foco em cabelos, unhas e pele. Uma opção simples e prática para cuidados diários.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Biotina 5mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nBiotina 5mg\n\nSuplemento manipulado de biotina, uma vitamina do complexo B associada à manutenção de cabelos, pele e unhas. A apresentação em cápsulas facilita o uso diário e o acompanhamento da rotina de cuidados.\n\nBenefícios:\nAuxilia na manutenção de cabelos e unhas\nContribui para rotina de cuidado da pele\nUso prático no dia a dia\nDose definida por cápsula\n\nDiferenciais:\nBiotina 5mg por cápsula\nFórmula objetiva\n60 cápsulas\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826944079.webp",
        price: 35,
        sku: "BIOT-GPH-5MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt18006l141e2jn70z6o"},{"id":"cmphikt1a006m141egjnhkh4e"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn30bze0014pnnm2bntgn7m" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826944079.webp",
        order: 0
      },
      create: {
        id: "cmpn30bze0014pnnm2bntgn7m",
        productId: productRecord.id,
        url: "/uploads/prod-1779826944079.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "PW-GPH-360G" },
      update: {
        name: "Pré Workout 360g",
        slug: "pre-workout-360g",
        description: "Pré Workout sabor uva com beta-alanina, arginina, taurina, tirosina, cafeína, café verde e cromo, criado para a rotina de treinos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Pré Workout 360g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 360g\n\nSabor: Uva\n\nContém:\nBeta-alanina\nArginina\nTaurina\nTirosina\nCafeína\nCafé verde\nCromo\n\nPré Workout é um suplemento alimentar em pó sabor uva, desenvolvido para ser consumido antes do treino. Sua fórmula reúne aminoácidos, cafeína, café verde e cromo em uma opção prática para a rotina de atividades físicas.\n\nBenefícios:\nFórmula pensada para o pré-treino\nAuxilia na disposição para atividades físicas\nFácil preparo\nSabor uva\n\nDiferenciais:\nCom beta-alanina, arginina, taurina e tirosina\nContém cafeína e café verde\nCom cromo\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir antes da atividade física ou conforme orientação profissional.\n\nObservações:\nContém cafeína\nColorido artificialmente\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492713853.webp",
        price: 70,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2j007q141e68mdyuhc"}]
        }
      },
      create: {
        id: "cmphikt7j00ao141esyw8oz5t",
        name: "Pré Workout 360g",
        slug: "pre-workout-360g",
        description: "Pré Workout sabor uva com beta-alanina, arginina, taurina, tirosina, cafeína, café verde e cromo, criado para a rotina de treinos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Pré Workout 360g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 360g\n\nSabor: Uva\n\nContém:\nBeta-alanina\nArginina\nTaurina\nTirosina\nCafeína\nCafé verde\nCromo\n\nPré Workout é um suplemento alimentar em pó sabor uva, desenvolvido para ser consumido antes do treino. Sua fórmula reúne aminoácidos, cafeína, café verde e cromo em uma opção prática para a rotina de atividades físicas.\n\nBenefícios:\nFórmula pensada para o pré-treino\nAuxilia na disposição para atividades físicas\nFácil preparo\nSabor uva\n\nDiferenciais:\nCom beta-alanina, arginina, taurina e tirosina\nContém cafeína e café verde\nCom cromo\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir antes da atividade física ou conforme orientação profissional.\n\nObservações:\nContém cafeína\nColorido artificialmente\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492713853.webp",
        price: 70,
        sku: "PW-GPH-360G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2j007q141e68mdyuhc"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk0n3500b5141eiw0fdiv3" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492713853.webp",
        order: 0
      },
      create: {
        id: "cmphk0n3500b5141eiw0fdiv3",
        productId: productRecord.id,
        url: "/uploads/prod-1779492713853.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "TRAX-GPH-3P-30G" },
      update: {
        name: "Ácido Tranexâmico 3% Creme 30g",
        slug: "acido-tranexamico-3-creme-30g",
        description: "Creme com ácido tranexâmico 3%, desenvolvido para rotinas de cuidado com manchas, melasma e uniformização do tom da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Tranexâmico 3% Creme 30g\n\nTipo: Creme facial manipulado\n\nPeso/Quantidade: 30g\n\nContém:\nÁcido tranexâmico 3%\n\nCreme manipulado com ácido tranexâmico 3%, ativo utilizado em rotinas dermatológicas voltadas ao cuidado com manchas e uniformização do tom da pele.\n\nBenefícios:\nAuxilia na rotina de cuidado com manchas\nPode complementar protocolos para melasma\nContribui para uniformização do tom da pele\nAplicação tópica direcionada\n\nDiferenciais:\nÁcido tranexâmico 3%\nCreme de 30g\nFórmula manipulada\nUso em rotina de skincare orientada\n\nModo de uso:\nAplicar conforme orientação profissional, preferencialmente associado ao uso diário de protetor solar.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nUsar protetor solar durante o dia\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779729954699.webp",
        price: 39.9,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2a007i141e64ae5vki"},{"id":"cmphikt2b007j141egg3hpmsw"}]
        }
      },
      create: {
        id: "cmphikt6s00a8141eewg5ed3q",
        name: "Ácido Tranexâmico 3% Creme 30g",
        slug: "acido-tranexamico-3-creme-30g",
        description: "Creme com ácido tranexâmico 3%, desenvolvido para rotinas de cuidado com manchas, melasma e uniformização do tom da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Tranexâmico 3% Creme 30g\n\nTipo: Creme facial manipulado\n\nPeso/Quantidade: 30g\n\nContém:\nÁcido tranexâmico 3%\n\nCreme manipulado com ácido tranexâmico 3%, ativo utilizado em rotinas dermatológicas voltadas ao cuidado com manchas e uniformização do tom da pele.\n\nBenefícios:\nAuxilia na rotina de cuidado com manchas\nPode complementar protocolos para melasma\nContribui para uniformização do tom da pele\nAplicação tópica direcionada\n\nDiferenciais:\nÁcido tranexâmico 3%\nCreme de 30g\nFórmula manipulada\nUso em rotina de skincare orientada\n\nModo de uso:\nAplicar conforme orientação profissional, preferencialmente associado ao uso diário de protetor solar.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nUsar protetor solar durante o dia\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779729954699.webp",
        price: 39.9,
        sku: "TRAX-GPH-3P-30G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2a007i141e64ae5vki"},{"id":"cmphikt2b007j141egg3hpmsw"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmplh9j74000012dcu7lz8amt" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779729954699.webp",
        order: 0
      },
      create: {
        id: "cmplh9j74000012dcu7lz8amt",
        productId: productRecord.id,
        url: "/uploads/prod-1779729954699.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "COLH-GPH-500MG-60CAP" },
      update: {
        name: "Colágeno Hidrolisado 500mg c/60 cápsulas",
        slug: "colageno-hidrolisado-500mg-c-60-capsulas",
        description: "Colágeno hidrolisado 500mg em cápsulas, opção prática para complementar cuidados com pele, unhas, cabelos e articulações.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Colágeno Hidrolisado 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nColágeno hidrolisado 500mg\n\nColágeno hidrolisado em cápsulas para quem busca praticidade na rotina de cuidados com pele, unhas, cabelos e articulações. A dose de 500mg por cápsula facilita o uso diário orientado.\n\nBenefícios:\nComplementa a ingestão de colágeno\nApoio à rotina de beleza\nSuporte aos cuidados articulares\nUso prático em cápsulas\n\nDiferenciais:\nColágeno hidrolisado 500mg\n60 cápsulas\nFormato prático\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822600472.webp",
        price: 29.9,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt27007f141ev7tnu2ll"},{"id":"cmphikt28007g141e76z82ae6"}]
        }
      },
      create: {
        id: "cmphikt6i00a2141ejc4iujft",
        name: "Colágeno Hidrolisado 500mg c/60 cápsulas",
        slug: "colageno-hidrolisado-500mg-c-60-capsulas",
        description: "Colágeno hidrolisado 500mg em cápsulas, opção prática para complementar cuidados com pele, unhas, cabelos e articulações.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Colágeno Hidrolisado 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nColágeno hidrolisado 500mg\n\nColágeno hidrolisado em cápsulas para quem busca praticidade na rotina de cuidados com pele, unhas, cabelos e articulações. A dose de 500mg por cápsula facilita o uso diário orientado.\n\nBenefícios:\nComplementa a ingestão de colágeno\nApoio à rotina de beleza\nSuporte aos cuidados articulares\nUso prático em cápsulas\n\nDiferenciais:\nColágeno hidrolisado 500mg\n60 cápsulas\nFormato prático\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822600472.webp",
        price: 29.9,
        sku: "COLH-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt27007f141ev7tnu2ll"},{"id":"cmphikt28007g141e76z82ae6"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0f90b0000pnnmn98i61yy" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822600472.webp",
        order: 0
      },
      create: {
        id: "cmpn0f90b0000pnnmn98i61yy",
        productId: productRecord.id,
        url: "/uploads/prod-1779822600472.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "SERUM-GPH-30ML" },
      update: {
        name: "Sérum Facial Anti-Aging 30ml",
        slug: "serum-facial-anti-aging-30ml",
        description: "Sérum facial anti-aging com ácido hialurônico e nano vitamina C, pensado para hidratação, revitalização e cuidado antioxidante com textura leve.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Sérum Facial Anti-Aging 30ml\n\nTipo: Sérum facial\n\nPeso/Quantidade: 30ml\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nSérum facial anti-aging e antioxidante desenvolvido para complementar a rotina de skincare com hidratação, luminosidade e revitalização. A combinação de ácido hialurônico e nano vitamina C entrega cuidado diário em textura leve.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para aparência mais viçosa\nApoia a rotina antioxidante\nAjuda no cuidado anti-idade\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nTextura leve\nFrasco de 30ml prático para rotina facial\n\nModo de uso:\nAplicar algumas gotas sobre a pele limpa e seca, massageando até absorção. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492776102.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt2d007l141e4neggnpi"}]
        }
      },
      create: {
        id: "cmphikt6y00ac141e3muvclic",
        name: "Sérum Facial Anti-Aging 30ml",
        slug: "serum-facial-anti-aging-30ml",
        description: "Sérum facial anti-aging com ácido hialurônico e nano vitamina C, pensado para hidratação, revitalização e cuidado antioxidante com textura leve.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Sérum Facial Anti-Aging 30ml\n\nTipo: Sérum facial\n\nPeso/Quantidade: 30ml\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nSérum facial anti-aging e antioxidante desenvolvido para complementar a rotina de skincare com hidratação, luminosidade e revitalização. A combinação de ácido hialurônico e nano vitamina C entrega cuidado diário em textura leve.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para aparência mais viçosa\nApoia a rotina antioxidante\nAjuda no cuidado anti-idade\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nTextura leve\nFrasco de 30ml prático para rotina facial\n\nModo de uso:\nAplicar algumas gotas sobre a pele limpa e seca, massageando até absorção. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492776102.webp",
        price: 60,
        sku: "SERUM-GPH-30ML",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt2d007l141e4neggnpi"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk1z1700bb141e6ms36cdl" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492776102.webp",
        order: 0
      },
      create: {
        id: "cmphk1z1700bb141e6ms36cdl",
        productId: productRecord.id,
        url: "/uploads/prod-1779492776102.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "HIBI-GPH-500MG-60CAP" },
      update: {
        name: "Hibisco 500mg c/60 cápsulas",
        slug: "hibisco-500mg-c-60-capsulas",
        description: "Hibisco 500mg em cápsulas, planta usada em rotinas de bem-estar, antioxidantes e cuidado com retenção de líquidos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Hibisco 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nHibisco 500mg\n\nHibisco é uma planta tradicionalmente usada em rotinas de bem-estar, cuidado com retenção de líquidos e suporte antioxidante. A apresentação em cápsulas torna o consumo prático.\n\nBenefícios:\nApoio à rotina de bem-estar\nSuporte antioxidante\nPode complementar estratégias para retenção de líquidos\nUso prático em cápsulas\n\nDiferenciais:\nHibisco 500mg\n60 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822609826.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt26007e141e927xtwco"}]
        }
      },
      create: {
        id: "cmphikt6e00a0141e69iz6f4u",
        name: "Hibisco 500mg c/60 cápsulas",
        slug: "hibisco-500mg-c-60-capsulas",
        description: "Hibisco 500mg em cápsulas, planta usada em rotinas de bem-estar, antioxidantes e cuidado com retenção de líquidos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Hibisco 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nHibisco 500mg\n\nHibisco é uma planta tradicionalmente usada em rotinas de bem-estar, cuidado com retenção de líquidos e suporte antioxidante. A apresentação em cápsulas torna o consumo prático.\n\nBenefícios:\nApoio à rotina de bem-estar\nSuporte antioxidante\nPode complementar estratégias para retenção de líquidos\nUso prático em cápsulas\n\nDiferenciais:\nHibisco 500mg\n60 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822609826.webp",
        price: 45,
        sku: "HIBI-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt26007e141e927xtwco"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0fgbs0001pnnmirwq071k" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822609826.webp",
        order: 0
      },
      create: {
        id: "cmpn0fgbs0001pnnmirwq071k",
        productId: productRecord.id,
        url: "/uploads/prod-1779822609826.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "GLIC-GPH-500MG-60CAP" },
      update: {
        name: "Glicina 500mg c/60 cápsulas",
        slug: "glicina-500mg-c-60-capsulas",
        description: "Glicina 500mg em cápsulas, aminoácido usado em rotinas de relaxamento, sono, recuperação e bem-estar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Glicina 500mg c/60 cápsulas\n\nTipo: Aminoácido em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGlicina 500mg\n\nGlicina é um aminoácido utilizado em rotinas de relaxamento, sono e recuperação. A dose de 500mg em cápsulas facilita a inclusão na rotina conforme orientação.\n\nBenefícios:\nApoio à rotina de relaxamento\nPode complementar hábitos de sono\nSuporte à recuperação\nUso prático em cápsulas\n\nDiferenciais:\nGlicina 500mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822837103.webp",
        price: 37,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1x0077141eirdemjzy"},{"id":"cmphikt20007a141e4e5e8a5z"}]
        }
      },
      create: {
        id: "cmphikt5r009m141e3wh4e4sj",
        name: "Glicina 500mg c/60 cápsulas",
        slug: "glicina-500mg-c-60-capsulas",
        description: "Glicina 500mg em cápsulas, aminoácido usado em rotinas de relaxamento, sono, recuperação e bem-estar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Glicina 500mg c/60 cápsulas\n\nTipo: Aminoácido em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGlicina 500mg\n\nGlicina é um aminoácido utilizado em rotinas de relaxamento, sono e recuperação. A dose de 500mg em cápsulas facilita a inclusão na rotina conforme orientação.\n\nBenefícios:\nApoio à rotina de relaxamento\nPode complementar hábitos de sono\nSuporte à recuperação\nUso prático em cápsulas\n\nDiferenciais:\nGlicina 500mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822837103.webp",
        price: 37,
        sku: "GLIC-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1x0077141eirdemjzy"},{"id":"cmphikt20007a141e4e5e8a5z"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0kbem0008pnnmc2i7zxbf" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822837103.webp",
        order: 0
      },
      create: {
        id: "cmpn0kbem0008pnnmc2i7zxbf",
        productId: productRecord.id,
        url: "/uploads/prod-1779822837103.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "PROB-GPH-100CAP" },
      update: {
        name: "Complexo Probiótico c/100 cápsulas",
        slug: "complexo-probiotico-c-100-capsulas",
        description: "Complexo probiótico com Lactobacillus acidophilus, Bifidum, Casei e Rhamnosus, formulado para equilíbrio intestinal e bem-estar digestivo.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Complexo Probiótico c/100 cápsulas\n\nTipo: Probiótico em cápsulas manipuladas\n\nPeso/Quantidade: 100 cápsulas\n\nContém:\nLactobacillus acidophilus 1 bilhão UFC\nBifidum 1 bilhão UFC\nCasei 1 bilhão UFC\nRhamnosus 1 bilhão UFC\n\nComplexo probiótico formulado com diferentes cepas para complementar a rotina de cuidado intestinal. A combinação de Lactobacillus e Bifidobacterium auxilia no equilíbrio da microbiota e no bem-estar digestivo.\n\nBenefícios:\nApoio ao equilíbrio intestinal\nSuporte à microbiota\nPode auxiliar a rotina digestiva\nUso prático em cápsulas\n\nDiferenciais:\nQuatro cepas probióticas\n1 bilhão UFC por cepa informado na fórmula\n100 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nArmazenar conforme orientação da farmácia\nUsar conforme orientação profissional\nManter em local adequado para preservar os probióticos",
        imageUrl: "/uploads/prod-1779822767997.webp",
        price: 85,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt22007c141eusqcto82"}]
        }
      },
      create: {
        id: "cmphikt61009s141ey8ef7ohg",
        name: "Complexo Probiótico c/100 cápsulas",
        slug: "complexo-probiotico-c-100-capsulas",
        description: "Complexo probiótico com Lactobacillus acidophilus, Bifidum, Casei e Rhamnosus, formulado para equilíbrio intestinal e bem-estar digestivo.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Complexo Probiótico c/100 cápsulas\n\nTipo: Probiótico em cápsulas manipuladas\n\nPeso/Quantidade: 100 cápsulas\n\nContém:\nLactobacillus acidophilus 1 bilhão UFC\nBifidum 1 bilhão UFC\nCasei 1 bilhão UFC\nRhamnosus 1 bilhão UFC\n\nComplexo probiótico formulado com diferentes cepas para complementar a rotina de cuidado intestinal. A combinação de Lactobacillus e Bifidobacterium auxilia no equilíbrio da microbiota e no bem-estar digestivo.\n\nBenefícios:\nApoio ao equilíbrio intestinal\nSuporte à microbiota\nPode auxiliar a rotina digestiva\nUso prático em cápsulas\n\nDiferenciais:\nQuatro cepas probióticas\n1 bilhão UFC por cepa informado na fórmula\n100 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nArmazenar conforme orientação da farmácia\nUsar conforme orientação profissional\nManter em local adequado para preservar os probióticos",
        imageUrl: "/uploads/prod-1779822767997.webp",
        price: 85,
        sku: "PROB-GPH-100CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt22007c141eusqcto82"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0iu6x0005pnnmor6nw7e7" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822767997.webp",
        order: 0
      },
      create: {
        id: "cmpn0iu6x0005pnnmor6nw7e7",
        productId: productRecord.id,
        url: "/uploads/prod-1779822767997.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "THEA-GPH-200MG-60CAP" },
      update: {
        name: "L-Teanina 200mg c/60 cápsulas",
        slug: "l-teanina-200mg-c-60-capsulas",
        description: "L-Teanina 200mg em cápsulas, aminoácido usado em rotinas de relaxamento, foco tranquilo e bem-estar mental.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Teanina 200mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-teanina 200mg\n\nL-teanina é um aminoácido naturalmente encontrado no chá verde, muito usado em rotinas de relaxamento, foco tranquilo e bem-estar mental. A apresentação em cápsulas facilita o uso com dose definida.\n\nBenefícios:\nApoio ao relaxamento\nSuporte ao foco tranquilo\nPraticidade no uso diário\nPode ser usada em rotinas de concentração\n\nDiferenciais:\nL-teanina 200mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823004714.webp",
        price: 37,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0076141ee7nmqd46"}]
        }
      },
      create: {
        id: "cmphikt550098141esg0tkh58",
        name: "L-Teanina 200mg c/60 cápsulas",
        slug: "l-teanina-200mg-c-60-capsulas",
        description: "L-Teanina 200mg em cápsulas, aminoácido usado em rotinas de relaxamento, foco tranquilo e bem-estar mental.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Teanina 200mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-teanina 200mg\n\nL-teanina é um aminoácido naturalmente encontrado no chá verde, muito usado em rotinas de relaxamento, foco tranquilo e bem-estar mental. A apresentação em cápsulas facilita o uso com dose definida.\n\nBenefícios:\nApoio ao relaxamento\nSuporte ao foco tranquilo\nPraticidade no uso diário\nPode ser usada em rotinas de concentração\n\nDiferenciais:\nL-teanina 200mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823004714.webp",
        price: 37,
        sku: "THEA-GPH-200MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0076141ee7nmqd46"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0o8o0000fpnnmd58knai8" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823004714.webp",
        order: 0
      },
      create: {
        id: "cmpn0o8o0000fpnnmd58knai8",
        productId: productRecord.id,
        url: "/uploads/prod-1779823004714.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "VD3-GPH-10000UI-60CAP" },
      update: {
        name: "Vitamina D3 10.000 UI c/60 cápsulas",
        slug: "vitamina-d3-10-000-ui-c-60-capsulas",
        description: "Vitamina D3 10.000 UI em cápsulas, indicada para suplementação orientada de vitamina D e suporte à rotina de imunidade, ossos e músculos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Vitamina D3 10.000 UI c/60 cápsulas\n\nTipo: Suplemento vitamínico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nVitamina D3 10.000 UI\n\nSuplemento de vitamina D3 em dose de 10.000 UI, desenvolvido para uso conforme orientação profissional. A vitamina D está associada à manutenção de ossos, músculos e funcionamento do sistema imune.\n\nBenefícios:\nComplementa a ingestão de vitamina D\nApoio à saúde óssea e muscular\nSuporte à rotina imunológica\nUso prático em cápsulas\n\nDiferenciais:\nVitamina D3 10.000 UI\n60 cápsulas\nDose de uso orientado\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nDose elevada, não utilizar sem acompanhamento\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823221946.webp",
        price: 30,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      },
      create: {
        id: "cmphikt4i008u141ekz0tmzea",
        name: "Vitamina D3 10.000 UI c/60 cápsulas",
        slug: "vitamina-d3-10-000-ui-c-60-capsulas",
        description: "Vitamina D3 10.000 UI em cápsulas, indicada para suplementação orientada de vitamina D e suporte à rotina de imunidade, ossos e músculos.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Vitamina D3 10.000 UI c/60 cápsulas\n\nTipo: Suplemento vitamínico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nVitamina D3 10.000 UI\n\nSuplemento de vitamina D3 em dose de 10.000 UI, desenvolvido para uso conforme orientação profissional. A vitamina D está associada à manutenção de ossos, músculos e funcionamento do sistema imune.\n\nBenefícios:\nComplementa a ingestão de vitamina D\nApoio à saúde óssea e muscular\nSuporte à rotina imunológica\nUso prático em cápsulas\n\nDiferenciais:\nVitamina D3 10.000 UI\n60 cápsulas\nDose de uso orientado\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nDose elevada, não utilizar sem acompanhamento\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823221946.webp",
        price: 30,
        sku: "VD3-GPH-10000UI-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn10ya5000mpnnma3i0t9be" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823221946.webp",
        order: 0
      },
      create: {
        id: "cmpn10ya5000mpnnma3i0t9be",
        productId: productRecord.id,
        url: "/uploads/prod-1779823221946.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MGTR-GPH-300MG-60CAP" },
      update: {
        name: "Magnésio Treonato 300mg c/60 cápsulas",
        slug: "magnesio-treonato-300mg-c-60-capsulas",
        description: "Magnésio treonato 300mg em cápsulas, forma de magnésio muito usada em rotinas de foco, relaxamento e bem-estar mental.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Magnésio Treonato 300mg c/60 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMagnésio treonato 300mg\n\nMagnésio treonato é uma forma de magnésio utilizada em rotinas voltadas ao bem-estar mental, foco, relaxamento e qualidade da rotina diária. A fórmula em cápsulas facilita o consumo com dose padronizada.\n\nBenefícios:\nComplementa a ingestão de magnésio\nApoio à rotina de foco e relaxamento\nPraticidade no uso diário\nSuporte ao bem-estar geral\n\nDiferenciais:\nMagnésio treonato 300mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826757479.webp",
        price: 38,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1q0070141eigica40g"},{"id":"cmphikt1r0071141eq4jp9s7w"}]
        }
      },
      create: {
        id: "cmphikt4b008q141el0gxtwqq",
        name: "Magnésio Treonato 300mg c/60 cápsulas",
        slug: "magnesio-treonato-300mg-c-60-capsulas",
        description: "Magnésio treonato 300mg em cápsulas, forma de magnésio muito usada em rotinas de foco, relaxamento e bem-estar mental.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Magnésio Treonato 300mg c/60 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMagnésio treonato 300mg\n\nMagnésio treonato é uma forma de magnésio utilizada em rotinas voltadas ao bem-estar mental, foco, relaxamento e qualidade da rotina diária. A fórmula em cápsulas facilita o consumo com dose padronizada.\n\nBenefícios:\nComplementa a ingestão de magnésio\nApoio à rotina de foco e relaxamento\nPraticidade no uso diário\nSuporte ao bem-estar geral\n\nDiferenciais:\nMagnésio treonato 300mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826757479.webp",
        price: 38,
        sku: "MGTR-GPH-300MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1q0070141eigica40g"},{"id":"cmphikt1r0071141eq4jp9s7w"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2wceq000opnnmem0vhlkw" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826757479.webp",
        order: 0
      },
      create: {
        id: "cmpn2wceq000opnnmem0vhlkw",
        productId: productRecord.id,
        url: "/uploads/prod-1779826757479.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MACA-GPH-500MG-60CAP" },
      update: {
        name: "Maca Peruana 500mg c/60 cápsulas",
        slug: "maca-peruana-500mg-c-60-capsulas",
        description: "Maca Peruana 500mg em cápsulas, uma opção vegetal para rotina de energia, vitalidade e bem-estar. Prática para uso diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Maca Peruana 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMaca peruana 500mg\n\nFitoterápico manipulado usado em rotinas de disposição, vitalidade e bem-estar. A apresentação em cápsulas oferece praticidade para incluir a maca peruana no dia a dia.\n\nBenefícios:\nAuxilia na disposição\nSuporte à vitalidade\nFácil inclusão na rotina\nUso prático em cápsulas\n\nDiferenciais:\nAtivo vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826919432.webp",
        price: 40,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt320080141ecr38bzm0",
        name: "Maca Peruana 500mg c/60 cápsulas",
        slug: "maca-peruana-500mg-c-60-capsulas",
        description: "Maca Peruana 500mg em cápsulas, uma opção vegetal para rotina de energia, vitalidade e bem-estar. Prática para uso diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Maca Peruana 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMaca peruana 500mg\n\nFitoterápico manipulado usado em rotinas de disposição, vitalidade e bem-estar. A apresentação em cápsulas oferece praticidade para incluir a maca peruana no dia a dia.\n\nBenefícios:\nAuxilia na disposição\nSuporte à vitalidade\nFácil inclusão na rotina\nUso prático em cápsulas\n\nDiferenciais:\nAtivo vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826919432.webp",
        price: 40,
        sku: "MACA-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2zt1b0011pnnm6outlxdx" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826919432.webp",
        order: 0
      },
      create: {
        id: "cmpn2zt1b0011pnnm6outlxdx",
        productId: productRecord.id,
        url: "/uploads/prod-1779826919432.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "GINK-GPH-120MG-60CAP" },
      update: {
        name: "Ginkgo Biloba 120mg c/60 cápsulas",
        slug: "ginkgo-biloba-120mg-c-60-capsulas",
        description: "Ginkgo Biloba 120mg em cápsulas, tradicionalmente usado em rotinas de foco, memória e circulação. Fórmula prática para uso diário orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ginkgo Biloba 120mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGinkgo biloba 120mg\n\nFitoterápico manipulado tradicionalmente utilizado em rotinas de suporte à circulação e função cognitiva. A dose de 120mg em cápsulas facilita o uso de forma padronizada e prática.\n\nBenefícios:\nApoio à circulação\nSuporte à memória e concentração\nPraticidade para uso diário\nPode complementar rotinas de foco e cognição\n\nDiferenciais:\nExtrato vegetal\nDose de 120mg\n60 cápsulas\nManipulado sob demanda\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nPode interagir com anticoagulantes\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826928360.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt1e006p141e2a18za8e"}]
        }
      },
      create: {
        id: "cmphikt2y007y141e66exdaxu",
        name: "Ginkgo Biloba 120mg c/60 cápsulas",
        slug: "ginkgo-biloba-120mg-c-60-capsulas",
        description: "Ginkgo Biloba 120mg em cápsulas, tradicionalmente usado em rotinas de foco, memória e circulação. Fórmula prática para uso diário orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ginkgo Biloba 120mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGinkgo biloba 120mg\n\nFitoterápico manipulado tradicionalmente utilizado em rotinas de suporte à circulação e função cognitiva. A dose de 120mg em cápsulas facilita o uso de forma padronizada e prática.\n\nBenefícios:\nApoio à circulação\nSuporte à memória e concentração\nPraticidade para uso diário\nPode complementar rotinas de foco e cognição\n\nDiferenciais:\nExtrato vegetal\nDose de 120mg\n60 cápsulas\nManipulado sob demanda\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nPode interagir com anticoagulantes\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826928360.webp",
        price: 45,
        sku: "GINK-GPH-120MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt1e006p141e2a18za8e"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2zzyz0012pnnm5tmdwa7g" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826928360.webp",
        order: 0
      },
      create: {
        id: "cmpn2zzyz0012pnnm5tmdwa7g",
        productId: productRecord.id,
        url: "/uploads/prod-1779826928360.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "RUTI-GPH-150MG-60CAP" },
      update: {
        name: "Rutina 150mg c/60 cápsulas",
        slug: "rutina-150mg-c-60-capsulas",
        description: "Rutina 150mg em cápsulas, flavonoide usado em rotinas de suporte antioxidante e cuidado vascular. Ideal para complementar cuidados com circulação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Rutina 150mg c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nRutina 150mg\n\nA rutina é um flavonoide utilizado em fórmulas de suporte antioxidante e vascular. Esta versão manipulada em cápsulas é indicada para rotinas que buscam praticidade no cuidado com a circulação e proteção celular.\n\nBenefícios:\nSuporte antioxidante\nApoio à rotina vascular\nUso prático em cápsulas\nPode complementar cuidados com circulação\n\nDiferenciais:\nFlavonoide em dose de 150mg\n60 cápsulas\nFórmula manipulada\nComposição simples e direta\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826935805.webp",
        price: 48,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      },
      create: {
        id: "cmphikt2v007w141ecu0jqe5y",
        name: "Rutina 150mg c/60 cápsulas",
        slug: "rutina-150mg-c-60-capsulas",
        description: "Rutina 150mg em cápsulas, flavonoide usado em rotinas de suporte antioxidante e cuidado vascular. Ideal para complementar cuidados com circulação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Rutina 150mg c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nRutina 150mg\n\nA rutina é um flavonoide utilizado em fórmulas de suporte antioxidante e vascular. Esta versão manipulada em cápsulas é indicada para rotinas que buscam praticidade no cuidado com a circulação e proteção celular.\n\nBenefícios:\nSuporte antioxidante\nApoio à rotina vascular\nUso prático em cápsulas\nPode complementar cuidados com circulação\n\nDiferenciais:\nFlavonoide em dose de 150mg\n60 cápsulas\nFórmula manipulada\nComposição simples e direta\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826935805.webp",
        price: 48,
        sku: "RUTI-GPH-150MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn305vl0013pnnmmawz9k5b" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826935805.webp",
        order: 0
      },
      create: {
        id: "cmpn305vl0013pnnmmawz9k5b",
        productId: productRecord.id,
        url: "/uploads/prod-1779826935805.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "PILL-GPH-60CAP" },
      update: {
        name: "Pill Food c/60 cápsulas",
        slug: "pill-food-c-60-capsulas",
        description: "Fórmula capilar em cápsulas pensada para complementar a rotina de cuidados com cabelos, unhas e pele. Ideal para quem busca praticidade no suporte nutricional diário dos fios.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Pill Food c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nFórmula capilar tipo Pill Food\n\nPill Food é uma fórmula manipulada voltada para a rotina de nutrição capilar, reunindo ativos usados em cuidados com cabelos, unhas e pele. É uma opção prática para quem deseja complementar os cuidados diários com os fios de dentro para fora.\n\nBenefícios:\nAuxilia na rotina de cuidados capilares\nContribui para manutenção de cabelos e unhas\nUso prático em cápsulas\nPode complementar tratamentos capilares orientados\n\nDiferenciais:\nFórmula manipulada\nApresentação com 60 cápsulas\nFoco em cabelo, pele e unhas\nBoa opção para rotina contínua de cuidados\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779827383385.webp",
        price: 25,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt16006k141efduj0yax"}]
        }
      },
      create: {
        id: "cmphikt2k007s141eysaugedd",
        name: "Pill Food c/60 cápsulas",
        slug: "pill-food-c-60-capsulas",
        description: "Fórmula capilar em cápsulas pensada para complementar a rotina de cuidados com cabelos, unhas e pele. Ideal para quem busca praticidade no suporte nutricional diário dos fios.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Pill Food c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nFórmula capilar tipo Pill Food\n\nPill Food é uma fórmula manipulada voltada para a rotina de nutrição capilar, reunindo ativos usados em cuidados com cabelos, unhas e pele. É uma opção prática para quem deseja complementar os cuidados diários com os fios de dentro para fora.\n\nBenefícios:\nAuxilia na rotina de cuidados capilares\nContribui para manutenção de cabelos e unhas\nUso prático em cápsulas\nPode complementar tratamentos capilares orientados\n\nDiferenciais:\nFórmula manipulada\nApresentação com 60 cápsulas\nFoco em cabelo, pele e unhas\nBoa opção para rotina contínua de cuidados\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779827383385.webp",
        price: 25,
        sku: "PILL-GPH-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt16006k141efduj0yax"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn39rc00015pnnm4fqbxgva" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779827383385.webp",
        order: 0
      },
      create: {
        id: "cmpn39rc00015pnnm4fqbxgva",
        productId: productRecord.id,
        url: "/uploads/prod-1779827383385.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "ANDR-GPH-300MG-30CAP" },
      update: {
        name: "Androtase 300mg c/30 cápsulas",
        slug: "androtase-300mg-c-30-capsulas",
        description: "Androtase 300mg em cápsulas, ativo associado ao suporte do equilíbrio de DHT, muito usado em rotinas de pele oleosa, acne e queda capilar por orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Androtase 300mg c/30 cápsulas\n\nTipo: Ativo nutracêutico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nAndrotase 300mg\n\nAndrotase é um ativo nutracêutico utilizado em rotinas de suporte ao equilíbrio de DHT, hormônio associado à oleosidade da pele, acne e queda capilar em alguns perfis. A fórmula deve ser usada com orientação profissional.\n\nBenefícios:\nApoio à rotina de saúde capilar\nPode auxiliar cuidados relacionados à oleosidade da pele\nSuporte ao equilíbrio hormonal orientado\nApresentação prática em cápsulas\n\nDiferenciais:\nAndrotase 300mg\n30 cápsulas\nAtivo usado em protocolos capilares e dermatológicos\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nNão é hormônio e não substitui tratamento prescrito\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826792712.webp",
        price: 195,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt16006k141efduj0yax"},{"id":"cmphikt1o006y141ermq62ttj"}]
        }
      },
      create: {
        id: "cmphikt41008k141ec8nm40go",
        name: "Androtase 300mg c/30 cápsulas",
        slug: "androtase-300mg-c-30-capsulas",
        description: "Androtase 300mg em cápsulas, ativo associado ao suporte do equilíbrio de DHT, muito usado em rotinas de pele oleosa, acne e queda capilar por orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Androtase 300mg c/30 cápsulas\n\nTipo: Ativo nutracêutico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nAndrotase 300mg\n\nAndrotase é um ativo nutracêutico utilizado em rotinas de suporte ao equilíbrio de DHT, hormônio associado à oleosidade da pele, acne e queda capilar em alguns perfis. A fórmula deve ser usada com orientação profissional.\n\nBenefícios:\nApoio à rotina de saúde capilar\nPode auxiliar cuidados relacionados à oleosidade da pele\nSuporte ao equilíbrio hormonal orientado\nApresentação prática em cápsulas\n\nDiferenciais:\nAndrotase 300mg\n30 cápsulas\nAtivo usado em protocolos capilares e dermatológicos\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nNão é hormônio e não substitui tratamento prescrito\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826792712.webp",
        price: 195,
        sku: "ANDR-GPH-300MG-30CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt16006k141efduj0yax"},{"id":"cmphikt1o006y141ermq62ttj"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2x3jp000rpnnmu9kbsznd" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826792712.webp",
        order: 0
      },
      create: {
        id: "cmpn2x3jp000rpnnmu9kbsznd",
        productId: productRecord.id,
        url: "/uploads/prod-1779826792712.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MINOX-GPH-5P-100ML" },
      update: {
        name: "Minoxidil 5% 100ml",
        slug: "minoxidil-5-100ml",
        description: "Minoxidil 5% em solução capilar, indicado para rotinas de cuidado com queda e crescimento dos fios sob orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Minoxidil 5% 100ml\n\nTipo: Solução capilar manipulada\n\nPeso/Quantidade: 100ml\n\nContém:\nMinoxidil 5%\n\nSolução capilar com minoxidil 5%, utilizada em rotinas de cuidado com queda capilar e estímulo ao crescimento dos fios conforme orientação profissional. A apresentação em 100ml facilita o uso contínuo.\n\nBenefícios:\nAuxilia na rotina de crescimento capilar\nApoio ao cuidado contra queda dos fios\nUso tópico direcionado\nPode complementar protocolos capilares\n\nDiferenciais:\nMinoxidil 5%\nFrasco de 100ml\nSolução capilar manipulada\nUso tópico\n\nModo de uso:\nAplicar no couro cabeludo conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826822951.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1n006x141ekwusx0v7"}]
        }
      },
      create: {
        id: "cmphikt3u008g141ea51xjsc3",
        name: "Minoxidil 5% 100ml",
        slug: "minoxidil-5-100ml",
        description: "Minoxidil 5% em solução capilar, indicado para rotinas de cuidado com queda e crescimento dos fios sob orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Minoxidil 5% 100ml\n\nTipo: Solução capilar manipulada\n\nPeso/Quantidade: 100ml\n\nContém:\nMinoxidil 5%\n\nSolução capilar com minoxidil 5%, utilizada em rotinas de cuidado com queda capilar e estímulo ao crescimento dos fios conforme orientação profissional. A apresentação em 100ml facilita o uso contínuo.\n\nBenefícios:\nAuxilia na rotina de crescimento capilar\nApoio ao cuidado contra queda dos fios\nUso tópico direcionado\nPode complementar protocolos capilares\n\nDiferenciais:\nMinoxidil 5%\nFrasco de 100ml\nSolução capilar manipulada\nUso tópico\n\nModo de uso:\nAplicar no couro cabeludo conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826822951.webp",
        price: 35,
        sku: "MINOX-GPH-5P-100ML",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt1n006x141ekwusx0v7"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2xqtn000tpnnmd41yyyhq" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826822951.webp",
        order: 0
      },
      create: {
        id: "cmpn2xqtn000tpnnmd41yyyhq",
        productId: productRecord.id,
        url: "/uploads/prod-1779826822951.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MUCU-GPH-400MG-60CAP" },
      update: {
        name: "Mucuna 400mg c/60 cápsulas",
        slug: "mucuna-400mg-c-60-capsulas",
        description: "Mucuna 400mg em cápsulas, ativo vegetal usado em rotinas de disposição, motivação e bem-estar. Fórmula prática para uso diário orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Mucuna 400mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMucuna pruriens 400mg\n\nMucuna pruriens é um ativo vegetal naturalmente associado à presença de L-Dopa, utilizado em rotinas de bem-estar, disposição e motivação. Esta versão em cápsulas oferece uso prático e padronizado.\n\nBenefícios:\nApoio à disposição\nSuporte à rotina de bem-estar\nPraticidade para uso diário\nAtivo vegetal em cápsulas\n\nDiferenciais:\nMucuna pruriens 400mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nPessoas em tratamento neurológico ou psiquiátrico devem buscar orientação antes do uso\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826859910.webp",
        price: 42,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1k006v141ejmhkxrpw"},{"id":"cmphikt1m006w141eot9uhnhw"}]
        }
      },
      create: {
        id: "cmphikt3n008c141eo0qhrtg6",
        name: "Mucuna 400mg c/60 cápsulas",
        slug: "mucuna-400mg-c-60-capsulas",
        description: "Mucuna 400mg em cápsulas, ativo vegetal usado em rotinas de disposição, motivação e bem-estar. Fórmula prática para uso diário orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Mucuna 400mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nMucuna pruriens 400mg\n\nMucuna pruriens é um ativo vegetal naturalmente associado à presença de L-Dopa, utilizado em rotinas de bem-estar, disposição e motivação. Esta versão em cápsulas oferece uso prático e padronizado.\n\nBenefícios:\nApoio à disposição\nSuporte à rotina de bem-estar\nPraticidade para uso diário\nAtivo vegetal em cápsulas\n\nDiferenciais:\nMucuna pruriens 400mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nPessoas em tratamento neurológico ou psiquiátrico devem buscar orientação antes do uso\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826859910.webp",
        price: 42,
        sku: "MUCU-GPH-400MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1k006v141ejmhkxrpw"},{"id":"cmphikt1m006w141eot9uhnhw"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2yjrg000vpnnmzh5v16at" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826859910.webp",
        order: 0
      },
      create: {
        id: "cmpn2yjrg000vpnnmzh5v16at",
        productId: productRecord.id,
        url: "/uploads/prod-1779826859910.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "LONG-GPH-400MG-30CAP" },
      update: {
        name: "Long Jack 400mg c/30 cápsulas",
        slug: "long-jack-400mg-c-30-capsulas",
        description: "Long Jack 400mg em cápsulas, também conhecido como Tongkat Ali, usado em rotinas de energia, vitalidade e bem-estar masculino.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Long Jack 400mg c/30 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nLong Jack 400mg\n\nLong Jack, também conhecido como Tongkat Ali, é um ativo vegetal utilizado em rotinas de disposição, vitalidade e bem-estar masculino. A apresentação em cápsulas facilita o uso com dose padronizada.\n\nBenefícios:\nApoio à vitalidade\nAuxilia na disposição física\nPraticidade no consumo\nPode complementar rotinas masculinas\n\nDiferenciais:\nAtivo vegetal\nDose de 400mg\n30 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826872523.webp",
        price: 25,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1j006u141e83uafkh5"}]
        }
      },
      create: {
        id: "cmphikt3k008a141eluzody2d",
        name: "Long Jack 400mg c/30 cápsulas",
        slug: "long-jack-400mg-c-30-capsulas",
        description: "Long Jack 400mg em cápsulas, também conhecido como Tongkat Ali, usado em rotinas de energia, vitalidade e bem-estar masculino.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Long Jack 400mg c/30 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nLong Jack 400mg\n\nLong Jack, também conhecido como Tongkat Ali, é um ativo vegetal utilizado em rotinas de disposição, vitalidade e bem-estar masculino. A apresentação em cápsulas facilita o uso com dose padronizada.\n\nBenefícios:\nApoio à vitalidade\nAuxilia na disposição física\nPraticidade no consumo\nPode complementar rotinas masculinas\n\nDiferenciais:\nAtivo vegetal\nDose de 400mg\n30 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826872523.webp",
        price: 25,
        sku: "LONG-GPH-400MG-30CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1j006u141e83uafkh5"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2yt4t000wpnnm0l09kzf1" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826872523.webp",
        order: 0
      },
      create: {
        id: "cmpn2yt4t000wpnnm0l09kzf1",
        productId: productRecord.id,
        url: "/uploads/prod-1779826872523.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CATU-GPH-300MG-30CAP" },
      update: {
        name: "Catuaba 300mg c/30 cápsulas",
        slug: "catuaba-300mg-c-30-capsulas",
        description: "Catuaba 300mg em cápsulas, ativo vegetal brasileiro usado em rotinas de disposição, energia e vitalidade. Prática para uso orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Catuaba 300mg c/30 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nCatuaba 300mg\n\nFitoterápico brasileiro tradicionalmente utilizado em rotinas de energia, disposição e vitalidade. A versão em cápsulas é prática para quem busca incluir a catuaba na rotina de bem-estar.\n\nBenefícios:\nApoio à disposição\nSuporte à vitalidade\nUso prático\nAtivo vegetal tradicional\n\nDiferenciais:\nCápsulas manipuladas\nDose de 300mg\n30 cápsulas\nBoa opção para rotina de bem-estar\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826882369.webp",
        price: 28,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt3g0088141e8r54mzg8",
        name: "Catuaba 300mg c/30 cápsulas",
        slug: "catuaba-300mg-c-30-capsulas",
        description: "Catuaba 300mg em cápsulas, ativo vegetal brasileiro usado em rotinas de disposição, energia e vitalidade. Prática para uso orientado.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Catuaba 300mg c/30 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\nCatuaba 300mg\n\nFitoterápico brasileiro tradicionalmente utilizado em rotinas de energia, disposição e vitalidade. A versão em cápsulas é prática para quem busca incluir a catuaba na rotina de bem-estar.\n\nBenefícios:\nApoio à disposição\nSuporte à vitalidade\nUso prático\nAtivo vegetal tradicional\n\nDiferenciais:\nCápsulas manipuladas\nDose de 300mg\n30 cápsulas\nBoa opção para rotina de bem-estar\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826882369.webp",
        price: 28,
        sku: "CATU-GPH-300MG-30CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2z0hz000xpnnmg9eoamne" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826882369.webp",
        order: 0
      },
      create: {
        id: "cmpn2z0hz000xpnnmg9eoamne",
        productId: productRecord.id,
        url: "/uploads/prod-1779826882369.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "SAWP-GPH-160MG-60CAP" },
      update: {
        name: "Saw Palmetto 160mg c/60 cápsulas",
        slug: "saw-palmetto-160mg-c-60-capsulas",
        description: "Saw Palmetto 160mg em cápsulas, ativo vegetal usado em rotinas de cuidado masculino, próstata e saúde capilar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Saw Palmetto 160mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nSaw palmetto 160mg\n\nSaw Palmetto é um extrato vegetal usado em rotinas de saúde masculina, cuidado prostático e suporte capilar. A dose de 160mg em cápsulas oferece praticidade para uso orientado.\n\nBenefícios:\nApoio à rotina de saúde masculina\nPode complementar cuidados com próstata\nSuporte à rotina capilar\nUso prático em cápsulas\n\nDiferenciais:\nExtrato vegetal\nDose de 160mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826745613.webp",
        price: 30,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1h006s141ed57fvg0q"},{"id":"cmphikt1s0072141eijc270qb"}]
        }
      },
      create: {
        id: "cmphikt4e008s141eh8dccu4v",
        name: "Saw Palmetto 160mg c/60 cápsulas",
        slug: "saw-palmetto-160mg-c-60-capsulas",
        description: "Saw Palmetto 160mg em cápsulas, ativo vegetal usado em rotinas de cuidado masculino, próstata e saúde capilar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Saw Palmetto 160mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nSaw palmetto 160mg\n\nSaw Palmetto é um extrato vegetal usado em rotinas de saúde masculina, cuidado prostático e suporte capilar. A dose de 160mg em cápsulas oferece praticidade para uso orientado.\n\nBenefícios:\nApoio à rotina de saúde masculina\nPode complementar cuidados com próstata\nSuporte à rotina capilar\nUso prático em cápsulas\n\nDiferenciais:\nExtrato vegetal\nDose de 160mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826745613.webp",
        price: 30,
        sku: "SAWP-GPH-160MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1h006s141ed57fvg0q"},{"id":"cmphikt1s0072141eijc270qb"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2w2zy000npnnme4asla63" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826745613.webp",
        order: 0
      },
      create: {
        id: "cmpn2w2zy000npnnme4asla63",
        productId: productRecord.id,
        url: "/uploads/prod-1779826745613.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MGDM-GPH-300MG-90CAP" },
      update: {
        name: "Magnésio Dimalato 300mg c/90 cápsulas",
        slug: "magnesio-dimalato-300mg-c-90-capsulas",
        description: "Magnésio dimalato 300mg em cápsulas, combinação de magnésio com ácido málico para rotinas de energia, músculos e bem-estar diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Magnésio Dimalato 300mg c/90 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 90 cápsulas\n\nContém:\nMagnésio dimalato 300mg\n\nMagnésio dimalato combina magnésio com ácido málico, sendo usado em rotinas de energia, funcionamento muscular e bem-estar. A embalagem com 90 cápsulas favorece o uso contínuo conforme orientação.\n\nBenefícios:\nApoio ao funcionamento muscular\nSuporte à energia e disposição\nComplementa a ingestão de magnésio\nUso prático em cápsulas\n\nDiferenciais:\nMagnésio dimalato 300mg\n90 cápsulas\nMineral quelado ao ácido málico\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826771602.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      },
      create: {
        id: "cmphikt47008o141etkl8mji0",
        name: "Magnésio Dimalato 300mg c/90 cápsulas",
        slug: "magnesio-dimalato-300mg-c-90-capsulas",
        description: "Magnésio dimalato 300mg em cápsulas, combinação de magnésio com ácido málico para rotinas de energia, músculos e bem-estar diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Magnésio Dimalato 300mg c/90 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 90 cápsulas\n\nContém:\nMagnésio dimalato 300mg\n\nMagnésio dimalato combina magnésio com ácido málico, sendo usado em rotinas de energia, funcionamento muscular e bem-estar. A embalagem com 90 cápsulas favorece o uso contínuo conforme orientação.\n\nBenefícios:\nApoio ao funcionamento muscular\nSuporte à energia e disposição\nComplementa a ingestão de magnésio\nUso prático em cápsulas\n\nDiferenciais:\nMagnésio dimalato 300mg\n90 cápsulas\nMineral quelado ao ácido málico\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826771602.webp",
        price: 45,
        sku: "MGDM-GPH-300MG-90CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2wn18000ppnnmobqck49r" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826771602.webp",
        order: 0
      },
      create: {
        id: "cmpn2wn18000ppnnmobqck49r",
        productId: productRecord.id,
        url: "/uploads/prod-1779826771602.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "NAC-GPH-500MG-60CAP" },
      update: {
        name: "N-Acetilcisteína (NAC) 500mg c/60 cápsulas",
        slug: "n-acetilcisteina-nac-500mg-c-60-capsulas",
        description: "NAC 500mg em cápsulas, precursor da glutationa, indicado para rotinas de suporte antioxidante, hepático e proteção celular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: N-Acetilcisteína (NAC) 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nN-acetilcisteína 500mg\n\nN-acetilcisteína, conhecida como NAC, é um derivado do aminoácido cisteína e precursor da glutationa, um dos principais antioxidantes do organismo. É uma opção prática para rotinas de suporte antioxidante e proteção celular.\n\nBenefícios:\nSuporte antioxidante\nApoio à produção de glutationa\nPode complementar rotinas de cuidado hepático\nUso prático em cápsulas\n\nDiferenciais:\nNAC 500mg\n60 cápsulas\nFórmula manipulada\nComposição objetiva\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826782607.webp",
        price: 50,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      },
      create: {
        id: "cmphikt44008m141eceyc5wkk",
        name: "N-Acetilcisteína (NAC) 500mg c/60 cápsulas",
        slug: "n-acetilcisteina-nac-500mg-c-60-capsulas",
        description: "NAC 500mg em cápsulas, precursor da glutationa, indicado para rotinas de suporte antioxidante, hepático e proteção celular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: N-Acetilcisteína (NAC) 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nN-acetilcisteína 500mg\n\nN-acetilcisteína, conhecida como NAC, é um derivado do aminoácido cisteína e precursor da glutationa, um dos principais antioxidantes do organismo. É uma opção prática para rotinas de suporte antioxidante e proteção celular.\n\nBenefícios:\nSuporte antioxidante\nApoio à produção de glutationa\nPode complementar rotinas de cuidado hepático\nUso prático em cápsulas\n\nDiferenciais:\nNAC 500mg\n60 cápsulas\nFórmula manipulada\nComposição objetiva\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779826782607.webp",
        price: 50,
        sku: "NAC-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2wvk9000qpnnmpm2l0vkh" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826782607.webp",
        order: 0
      },
      create: {
        id: "cmpn2wvk9000qpnnmpm2l0vkh",
        productId: productRecord.id,
        url: "/uploads/prod-1779826782607.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "COQ10-GPH-200MG-120CAP" },
      update: {
        name: "Coenzima Q10 200mg c/120 cápsulas",
        slug: "coenzima-q10-200mg-c-120-capsulas",
        description: "Coenzima Q10 200mg em cápsulas, antioxidante usado em rotinas de energia celular, disposição e suporte cardiovascular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Coenzima Q10 200mg c/120 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 120 cápsulas\n\nContém:\nCoenzima Q10 200mg\n\nCoenzima Q10 é um nutriente presente nos processos de produção de energia celular e também associado à ação antioxidante. A versão de 200mg com 120 cápsulas é prática para rotina contínua orientada.\n\nBenefícios:\nSuporte à energia celular\nApoio antioxidante\nPode complementar rotinas cardiovasculares\nUso prático diário\n\nDiferenciais:\nCoenzima Q10 200mg\n120 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823030736.webp",
        price: 145,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt1w0075141e71acbne6"}]
        }
      },
      create: {
        id: "cmphikt510096141efsrluyb4",
        name: "Coenzima Q10 200mg c/120 cápsulas",
        slug: "coenzima-q10-200mg-c-120-capsulas",
        description: "Coenzima Q10 200mg em cápsulas, antioxidante usado em rotinas de energia celular, disposição e suporte cardiovascular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Coenzima Q10 200mg c/120 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 120 cápsulas\n\nContém:\nCoenzima Q10 200mg\n\nCoenzima Q10 é um nutriente presente nos processos de produção de energia celular e também associado à ação antioxidante. A versão de 200mg com 120 cápsulas é prática para rotina contínua orientada.\n\nBenefícios:\nSuporte à energia celular\nApoio antioxidante\nPode complementar rotinas cardiovasculares\nUso prático diário\n\nDiferenciais:\nCoenzima Q10 200mg\n120 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823030736.webp",
        price: 145,
        sku: "COQ10-GPH-200MG-120CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt1w0075141e71acbne6"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0ogvo000gpnnmwvjyqi17" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823030736.webp",
        order: 0
      },
      create: {
        id: "cmpn0ogvo000gpnnmwvjyqi17",
        productId: productRecord.id,
        url: "/uploads/prod-1779823030736.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "BERB-GPH-500MG-60CAP" },
      update: {
        name: "Berberina 500mg c/60 cápsulas",
        slug: "berberina-500mg-c-60-capsulas",
        description: "Berberina 500mg em cápsulas, ativo vegetal usado em rotinas de metabolismo, controle glicêmico e saúde cardiovascular sob orientação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Berberina 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nBerberina 500mg\n\nBerberina é um composto de origem vegetal utilizado em rotinas de suporte metabólico, especialmente relacionadas ao metabolismo da glicose e equilíbrio cardiovascular. A dose de 500mg facilita o uso padronizado.\n\nBenefícios:\nSuporte ao metabolismo\nApoio ao controle glicêmico orientado\nPode complementar rotinas cardiovasculares\nUso prático em cápsulas\n\nDiferenciais:\nBerberina 500mg\n60 cápsulas\nComposto vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional, especialmente se houver uso de medicamentos\nNão substitui tratamento médico\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823046549.webp",
        price: 68,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      },
      create: {
        id: "cmphikt4y0094141ekjt17s7p",
        name: "Berberina 500mg c/60 cápsulas",
        slug: "berberina-500mg-c-60-capsulas",
        description: "Berberina 500mg em cápsulas, ativo vegetal usado em rotinas de metabolismo, controle glicêmico e saúde cardiovascular sob orientação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Berberina 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nBerberina 500mg\n\nBerberina é um composto de origem vegetal utilizado em rotinas de suporte metabólico, especialmente relacionadas ao metabolismo da glicose e equilíbrio cardiovascular. A dose de 500mg facilita o uso padronizado.\n\nBenefícios:\nSuporte ao metabolismo\nApoio ao controle glicêmico orientado\nPode complementar rotinas cardiovasculares\nUso prático em cápsulas\n\nDiferenciais:\nBerberina 500mg\n60 cápsulas\nComposto vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional, especialmente se houver uso de medicamentos\nNão substitui tratamento médico\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823046549.webp",
        price: 68,
        sku: "BERB-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0osrr000hpnnmqfbf4v9s" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823046549.webp",
        order: 0
      },
      create: {
        id: "cmpn0osrr000hpnnmqfbf4v9s",
        productId: productRecord.id,
        url: "/uploads/prod-1779823046549.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CROM-GPH-350MCG-90CAP" },
      update: {
        name: "Picolinato de Cromo 350mcg c/90 cápsulas",
        slug: "picolinato-de-cromo-350mcg-c-90-capsulas",
        description: "Picolinato de cromo 350mcg em cápsulas, mineral usado em rotinas de metabolismo da glicose, equilíbrio alimentar e controle de apetite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Picolinato de Cromo 350mcg c/90 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 90 cápsulas\n\nContém:\nPicolinato de cromo 350mcg\n\nPicolinato de cromo é uma forma de cromo utilizada em rotinas de metabolismo da glicose e equilíbrio alimentar. A dose de 350mcg em cápsulas oferece praticidade para uso com orientação.\n\nBenefícios:\nApoio ao metabolismo da glicose\nPode auxiliar rotinas de controle alimentar\nComplementa a ingestão de cromo\nUso prático em cápsulas\n\nDiferenciais:\nCromo na forma picolinato\nDose de 350mcg\n90 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823070292.webp",
        price: 39,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1u0074141e376rqlek"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      },
      create: {
        id: "cmphikt4v0092141e0e3ykkzu",
        name: "Picolinato de Cromo 350mcg c/90 cápsulas",
        slug: "picolinato-de-cromo-350mcg-c-90-capsulas",
        description: "Picolinato de cromo 350mcg em cápsulas, mineral usado em rotinas de metabolismo da glicose, equilíbrio alimentar e controle de apetite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Picolinato de Cromo 350mcg c/90 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 90 cápsulas\n\nContém:\nPicolinato de cromo 350mcg\n\nPicolinato de cromo é uma forma de cromo utilizada em rotinas de metabolismo da glicose e equilíbrio alimentar. A dose de 350mcg em cápsulas oferece praticidade para uso com orientação.\n\nBenefícios:\nApoio ao metabolismo da glicose\nPode auxiliar rotinas de controle alimentar\nComplementa a ingestão de cromo\nUso prático em cápsulas\n\nDiferenciais:\nCromo na forma picolinato\nDose de 350mcg\n90 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823070292.webp",
        price: 39,
        sku: "CROM-GPH-350MCG-90CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1u0074141e376rqlek"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0pb1k000ipnnmeqxhamo3" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823070292.webp",
        order: 0
      },
      create: {
        id: "cmpn0pb1k000ipnnmeqxhamo3",
        productId: productRecord.id,
        url: "/uploads/prod-1779823070292.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "SILI-GPH-200MG-120CAP" },
      update: {
        name: "Silimarina 200mg c/120 cápsulas",
        slug: "silimarina-200mg-c-120-capsulas",
        description: "Silimarina 200mg em cápsulas, extrato de cardo-mariano usado em rotinas de suporte hepático e proteção antioxidante.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Silimarina 200mg c/120 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 120 cápsulas\n\nContém:\nSilimarina 200mg\n\nSilimarina é um composto extraído do cardo-mariano, tradicionalmente utilizado em rotinas de suporte ao fígado e proteção antioxidante. A apresentação com 120 cápsulas favorece o uso contínuo orientado.\n\nBenefícios:\nApoio à rotina de saúde hepática\nSuporte antioxidante\nUso prático em cápsulas\nPode complementar cuidados metabólicos\n\nDiferenciais:\nSilimarina 200mg\n120 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823081332.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1t0073141e574gs2cd"}]
        }
      },
      create: {
        id: "cmphikt4s0090141enqvmrwid",
        name: "Silimarina 200mg c/120 cápsulas",
        slug: "silimarina-200mg-c-120-capsulas",
        description: "Silimarina 200mg em cápsulas, extrato de cardo-mariano usado em rotinas de suporte hepático e proteção antioxidante.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Silimarina 200mg c/120 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 120 cápsulas\n\nContém:\nSilimarina 200mg\n\nSilimarina é um composto extraído do cardo-mariano, tradicionalmente utilizado em rotinas de suporte ao fígado e proteção antioxidante. A apresentação com 120 cápsulas favorece o uso contínuo orientado.\n\nBenefícios:\nApoio à rotina de saúde hepática\nSuporte antioxidante\nUso prático em cápsulas\nPode complementar cuidados metabólicos\n\nDiferenciais:\nSilimarina 200mg\n120 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823081332.webp",
        price: 60,
        sku: "SILI-GPH-200MG-120CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1t0073141e574gs2cd"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0pl85000jpnnmup7ddb4y" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823081332.webp",
        order: 0
      },
      create: {
        id: "cmpn0pl85000jpnnmup7ddb4y",
        productId: productRecord.id,
        url: "/uploads/prod-1779823081332.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "VITC-GPH-500MG-60CAP" },
      update: {
        name: "Vitamina C 500mg c/60 cápsulas",
        slug: "vitamina-c-500mg-c-60-capsulas",
        description: "Vitamina C 500mg em cápsulas, antioxidante clássico para complementar a rotina de imunidade, pele e produção de colágeno.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Vitamina C 500mg c/60 cápsulas\n\nTipo: Suplemento vitamínico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nVitamina C 500mg\n\nSuplemento de vitamina C em cápsulas, vitamina antioxidante relacionada à formação de colágeno e ao funcionamento do sistema imune. Uma opção prática para complementar a ingestão diária.\n\nBenefícios:\nApoio antioxidante\nContribui para formação de colágeno\nSuporte à rotina imunológica\nFácil uso diário\n\nDiferenciais:\nVitamina C 500mg\n60 cápsulas\nFórmula manipulada\nComposição simples\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823098455.webp",
        price: 29,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      },
      create: {
        id: "cmphikt4o008y141eg6krqccc",
        name: "Vitamina C 500mg c/60 cápsulas",
        slug: "vitamina-c-500mg-c-60-capsulas",
        description: "Vitamina C 500mg em cápsulas, antioxidante clássico para complementar a rotina de imunidade, pele e produção de colágeno.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Vitamina C 500mg c/60 cápsulas\n\nTipo: Suplemento vitamínico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nVitamina C 500mg\n\nSuplemento de vitamina C em cápsulas, vitamina antioxidante relacionada à formação de colágeno e ao funcionamento do sistema imune. Uma opção prática para complementar a ingestão diária.\n\nBenefícios:\nApoio antioxidante\nContribui para formação de colágeno\nSuporte à rotina imunológica\nFácil uso diário\n\nDiferenciais:\nVitamina C 500mg\n60 cápsulas\nFórmula manipulada\nComposição simples\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823098455.webp",
        price: 29,
        sku: "VITC-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0pwn0000kpnnmk0agbte4" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823098455.webp",
        order: 0
      },
      create: {
        id: "cmpn0pwn0000kpnnmk0agbte4",
        productId: productRecord.id,
        url: "/uploads/prod-1779823098455.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "ZINC-GPH-50MG-60CAP" },
      update: {
        name: "Zinco 50mg c/60 cápsulas",
        slug: "zinco-50mg-c-60-capsulas",
        description: "Zinco 50mg em cápsulas para complementar a rotina de imunidade, pele, cabelos e metabolismo. Prático para suplementação diária orientada.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Zinco 50mg c/60 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nZinco 50mg\n\nSuplemento mineral de zinco, nutriente importante para o funcionamento do sistema imune, metabolismo e manutenção de pele, cabelos e unhas. A apresentação em cápsulas facilita o uso diário orientado.\n\nBenefícios:\nComplementa a ingestão de zinco\nApoio ao sistema imune\nContribui para rotina de pele, cabelos e unhas\nUso prático em cápsulas\n\nDiferenciais:\nZinco 50mg\n60 cápsulas\nFórmula objetiva\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823202499.webp",
        price: 21,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      },
      create: {
        id: "cmphikt4l008w141es0xr398w",
        name: "Zinco 50mg c/60 cápsulas",
        slug: "zinco-50mg-c-60-capsulas",
        description: "Zinco 50mg em cápsulas para complementar a rotina de imunidade, pele, cabelos e metabolismo. Prático para suplementação diária orientada.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Zinco 50mg c/60 cápsulas\n\nTipo: Suplemento mineral em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nZinco 50mg\n\nSuplemento mineral de zinco, nutriente importante para o funcionamento do sistema imune, metabolismo e manutenção de pele, cabelos e unhas. A apresentação em cápsulas facilita o uso diário orientado.\n\nBenefícios:\nComplementa a ingestão de zinco\nApoio ao sistema imune\nContribui para rotina de pele, cabelos e unhas\nUso prático em cápsulas\n\nDiferenciais:\nZinco 50mg\n60 cápsulas\nFórmula objetiva\nManipulado pela Global Pharma Human\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779823202499.webp",
        price: 21,
        sku: "ZINC-GPH-50MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1p006z141eercih3kz"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0s541000lpnnmefuit3uj" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779823202499.webp",
        order: 0
      },
      create: {
        id: "cmpn0s541000lpnnmefuit3uj",
        productId: productRecord.id,
        url: "/uploads/prod-1779823202499.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "ALA-GPH-300MG-60CAP" },
      update: {
        name: "Ácido Alfa Lipóico 300mg c/60 cápsulas",
        slug: "acido-alfa-lipoico-300mg-c-60-capsulas",
        description: "Ácido alfa lipóico 300mg em cápsulas, antioxidante usado em rotinas de metabolismo energético e proteção celular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Alfa Lipóico 300mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nÁcido alfa lipóico 300mg\n\nÁcido alfa lipóico é um antioxidante usado em rotinas de suporte ao metabolismo energético e proteção celular. A fórmula em cápsulas oferece praticidade e dose padronizada.\n\nBenefícios:\nApoio antioxidante\nSuporte ao metabolismo energético\nPode complementar rotinas metabólicas\nUso prático em cápsulas\n\nDiferenciais:\nÁcido alfa lipóico 300mg\n60 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822856421.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      },
      create: {
        id: "cmphikt5o009k141egpjp20z6",
        name: "Ácido Alfa Lipóico 300mg c/60 cápsulas",
        slug: "acido-alfa-lipoico-300mg-c-60-capsulas",
        description: "Ácido alfa lipóico 300mg em cápsulas, antioxidante usado em rotinas de metabolismo energético e proteção celular.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Alfa Lipóico 300mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nÁcido alfa lipóico 300mg\n\nÁcido alfa lipóico é um antioxidante usado em rotinas de suporte ao metabolismo energético e proteção celular. A fórmula em cápsulas oferece praticidade e dose padronizada.\n\nBenefícios:\nApoio antioxidante\nSuporte ao metabolismo energético\nPode complementar rotinas metabólicas\nUso prático em cápsulas\n\nDiferenciais:\nÁcido alfa lipóico 300mg\n60 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822856421.webp",
        price: 60,
        sku: "ALA-GPH-300MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"},{"id":"cmphikt1i006t141ektvsfn74"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0kx570009pnnmh99x5hze" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822856421.webp",
        order: 0
      },
      create: {
        id: "cmpn0kx570009pnnmh99x5hze",
        productId: productRecord.id,
        url: "/uploads/prod-1779822856421.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CURC-GPH-400MG-60CAP" },
      update: {
        name: "Cúrcuma 400mg c/60 cápsulas",
        slug: "curcuma-400mg-c-60-capsulas",
        description: "Cúrcuma 400mg em cápsulas, ativo vegetal usado em rotinas antioxidantes, bem-estar articular e cuidado diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Cúrcuma 400mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCúrcuma 400mg\n\nCúrcuma é um ativo vegetal conhecido pela presença de curcuminoides e muito usado em rotinas antioxidantes e de bem-estar. A apresentação em cápsulas torna o uso simples e padronizado.\n\nBenefícios:\nApoio antioxidante\nPode complementar rotinas articulares\nSuporte ao bem-estar geral\nUso prático em cápsulas\n\nDiferenciais:\nCúrcuma 400mg\n60 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822884924.webp",
        price: 48,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      },
      create: {
        id: "cmphikt5l009i141ea0jci4h7",
        name: "Cúrcuma 400mg c/60 cápsulas",
        slug: "curcuma-400mg-c-60-capsulas",
        description: "Cúrcuma 400mg em cápsulas, ativo vegetal usado em rotinas antioxidantes, bem-estar articular e cuidado diário.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Cúrcuma 400mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCúrcuma 400mg\n\nCúrcuma é um ativo vegetal conhecido pela presença de curcuminoides e muito usado em rotinas antioxidantes e de bem-estar. A apresentação em cápsulas torna o uso simples e padronizado.\n\nBenefícios:\nApoio antioxidante\nPode complementar rotinas articulares\nSuporte ao bem-estar geral\nUso prático em cápsulas\n\nDiferenciais:\nCúrcuma 400mg\n60 cápsulas\nAtivo vegetal\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822884924.webp",
        price: 48,
        sku: "CURC-GPH-400MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0lc3h000apnnm93hth9je" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822884924.webp",
        order: 0
      },
      create: {
        id: "cmpn0lc3h000apnnm93hth9je",
        productId: productRecord.id,
        url: "/uploads/prod-1779822884924.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "PSYL-GPH-500MG-60CAP" },
      update: {
        name: "Psyllium 500mg c/60 cápsulas",
        slug: "psyllium-500mg-c-60-capsulas",
        description: "Psyllium 500mg em cápsulas, fibra natural para rotinas de saúde intestinal, saciedade e equilíbrio alimentar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Psyllium 500mg c/60 cápsulas\n\nTipo: Fibra alimentar em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nPsyllium 500mg\n\nPsyllium é uma fibra natural utilizada em rotinas de saúde intestinal, saciedade e equilíbrio alimentar. A versão em cápsulas facilita o consumo para quem prefere praticidade.\n\nBenefícios:\nAuxilia na rotina intestinal\nPode contribuir para saciedade\nApoio ao equilíbrio alimentar\nUso prático em cápsulas\n\nDiferenciais:\nFibra natural\nPsyllium 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar com bastante água, conforme orientação profissional.\n\nObservações:\nConsumir com ingestão adequada de água\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822952519.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1y0078141eab1mbdom"},{"id":"cmphikt1z0079141esl3pa88a"}]
        }
      },
      create: {
        id: "cmphikt5i009g141e6cuqzpzc",
        name: "Psyllium 500mg c/60 cápsulas",
        slug: "psyllium-500mg-c-60-capsulas",
        description: "Psyllium 500mg em cápsulas, fibra natural para rotinas de saúde intestinal, saciedade e equilíbrio alimentar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Psyllium 500mg c/60 cápsulas\n\nTipo: Fibra alimentar em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nPsyllium 500mg\n\nPsyllium é uma fibra natural utilizada em rotinas de saúde intestinal, saciedade e equilíbrio alimentar. A versão em cápsulas facilita o consumo para quem prefere praticidade.\n\nBenefícios:\nAuxilia na rotina intestinal\nPode contribuir para saciedade\nApoio ao equilíbrio alimentar\nUso prático em cápsulas\n\nDiferenciais:\nFibra natural\nPsyllium 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar com bastante água, conforme orientação profissional.\n\nObservações:\nConsumir com ingestão adequada de água\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822952519.webp",
        price: 35,
        sku: "PSYL-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1y0078141eab1mbdom"},{"id":"cmphikt1z0079141esl3pa88a"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0msm7000bpnnm2nvu4abs" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822952519.webp",
        order: 0
      },
      create: {
        id: "cmpn0msm7000bpnnm2nvu4abs",
        productId: productRecord.id,
        url: "/uploads/prod-1779822952519.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "5HTP-GPH-50MG-30CAP" },
      update: {
        name: "5-HTP 50mg c/30 cápsulas",
        slug: "5-htp-50mg-c-30-capsulas",
        description: "5-HTP 50mg em cápsulas, precursor da serotonina usado em rotinas de humor, relaxamento e sono com orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: 5-HTP 50mg c/30 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\n5-HTP 50mg\n\n5-HTP é um precursor da serotonina utilizado em rotinas de bem-estar, humor, relaxamento e sono. A dose de 50mg em cápsulas permite uso orientado e prático.\n\nBenefícios:\nApoio à rotina de bem-estar\nPode complementar hábitos de relaxamento\nSuporte à rotina de sono\nUso prático em cápsulas\n\nDiferenciais:\n5-HTP 50mg\n30 cápsulas\nDose inicial prática\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nNão associar a antidepressivos sem orientação profissional\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822964258.webp",
        price: 28,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1k006v141ejmhkxrpw"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      },
      create: {
        id: "cmphikt5f009e141eha4dr270",
        name: "5-HTP 50mg c/30 cápsulas",
        slug: "5-htp-50mg-c-30-capsulas",
        description: "5-HTP 50mg em cápsulas, precursor da serotonina usado em rotinas de humor, relaxamento e sono com orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: 5-HTP 50mg c/30 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 30 cápsulas\n\nContém:\n5-HTP 50mg\n\n5-HTP é um precursor da serotonina utilizado em rotinas de bem-estar, humor, relaxamento e sono. A dose de 50mg em cápsulas permite uso orientado e prático.\n\nBenefícios:\nApoio à rotina de bem-estar\nPode complementar hábitos de relaxamento\nSuporte à rotina de sono\nUso prático em cápsulas\n\nDiferenciais:\n5-HTP 50mg\n30 cápsulas\nDose inicial prática\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nNão associar a antidepressivos sem orientação profissional\nUsar conforme orientação profissional\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822964258.webp",
        price: 28,
        sku: "5HTP-GPH-50MG-30CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1k006v141ejmhkxrpw"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0n1m5000cpnnm19oozlyz" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822964258.webp",
        order: 0
      },
      create: {
        id: "cmpn0n1m5000cpnnm19oozlyz",
        productId: productRecord.id,
        url: "/uploads/prod-1779822964258.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "GINS-GPH-200MG-60CAP" },
      update: {
        name: "Ginseng 200mg c/60 cápsulas",
        slug: "ginseng-200mg-c-60-capsulas",
        description: "Ginseng 200mg em cápsulas, fitoterápico tradicional para rotinas de energia, disposição, vitalidade e resistência diária.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ginseng 200mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGinseng 200mg\n\nGinseng é um fitoterápico tradicionalmente utilizado em rotinas de energia, disposição e vitalidade. A dose de 200mg em cápsulas torna o uso simples e conveniente no dia a dia.\n\nBenefícios:\nAuxilia na disposição\nSuporte à vitalidade\nPode complementar rotinas de energia\nUso prático em cápsulas\n\nDiferenciais:\nGinseng 200mg\n60 cápsulas\nAtivo vegetal tradicional\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822972995.webp",
        price: 30,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt5b009c141euu8rbvmu",
        name: "Ginseng 200mg c/60 cápsulas",
        slug: "ginseng-200mg-c-60-capsulas",
        description: "Ginseng 200mg em cápsulas, fitoterápico tradicional para rotinas de energia, disposição, vitalidade e resistência diária.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ginseng 200mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGinseng 200mg\n\nGinseng é um fitoterápico tradicionalmente utilizado em rotinas de energia, disposição e vitalidade. A dose de 200mg em cápsulas torna o uso simples e conveniente no dia a dia.\n\nBenefícios:\nAuxilia na disposição\nSuporte à vitalidade\nPode complementar rotinas de energia\nUso prático em cápsulas\n\nDiferenciais:\nGinseng 200mg\n60 cápsulas\nAtivo vegetal tradicional\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822972995.webp",
        price: 30,
        sku: "GINS-GPH-200MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1f006q141e08lzzanj"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0n8h2000dpnnmdnjhgid7" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822972995.webp",
        order: 0
      },
      create: {
        id: "cmpn0n8h2000dpnnmdnjhgid7",
        productId: productRecord.id,
        url: "/uploads/prod-1779822972995.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "GABA-GPH-400MG-60CAP" },
      update: {
        name: "GABA 400mg c/60 cápsulas",
        slug: "gaba-400mg-c-60-capsulas",
        description: "GABA 400mg em cápsulas, opção para rotinas de relaxamento, bem-estar e preparo para o descanso sob orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: GABA 400mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGABA 400mg\n\nGABA é um composto utilizado em rotinas de relaxamento e bem-estar, especialmente quando o objetivo é criar uma rotina mais tranquila no fim do dia. A apresentação em cápsulas favorece o uso prático.\n\nBenefícios:\nApoio à rotina de relaxamento\nPode complementar hábitos de sono\nUso prático em cápsulas\nSuporte ao bem-estar diário\n\nDiferenciais:\nGABA 400mg\n60 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822983219.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      },
      create: {
        id: "cmphikt58009a141efbr03hfk",
        name: "GABA 400mg c/60 cápsulas",
        slug: "gaba-400mg-c-60-capsulas",
        description: "GABA 400mg em cápsulas, opção para rotinas de relaxamento, bem-estar e preparo para o descanso sob orientação profissional.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: GABA 400mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nGABA 400mg\n\nGABA é um composto utilizado em rotinas de relaxamento e bem-estar, especialmente quando o objetivo é criar uma rotina mais tranquila no fim do dia. A apresentação em cápsulas favorece o uso prático.\n\nBenefícios:\nApoio à rotina de relaxamento\nPode complementar hábitos de sono\nUso prático em cápsulas\nSuporte ao bem-estar diário\n\nDiferenciais:\nGABA 400mg\n60 cápsulas\nDose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822983219.webp",
        price: 35,
        sku: "GABA-GPH-400MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0nfxb000epnnmthm7wgic" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822983219.webp",
        order: 0
      },
      create: {
        id: "cmpn0nfxb000epnnmthm7wgic",
        productId: productRecord.id,
        url: "/uploads/prod-1779822983219.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CITR-GPH-500MG-60CAP" },
      update: {
        name: "Citrus Aurantium 500mg c/60 cápsulas",
        slug: "citrus-aurantium-500mg-c-60-capsulas",
        description: "Citrus Aurantium 500mg em cápsulas, extrato vegetal usado em rotinas de metabolismo, energia e controle de apetite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Citrus Aurantium 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCitrus aurantium 500mg\n\nCitrus aurantium é um extrato vegetal usado em rotinas de energia, metabolismo e controle alimentar. A fórmula em cápsulas facilita o uso diário com orientação profissional.\n\nBenefícios:\nApoio ao metabolismo\nPode complementar rotinas de energia\nSuporte à rotina de controle alimentar\nUso prático em cápsulas\n\nDiferenciais:\nExtrato vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nEvitar uso sem avaliação em casos de sensibilidade a estimulantes\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822738871.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmphikt25007d141e2tph133q"}]
        }
      },
      create: {
        id: "cmphikt6b009y141ejfbcc3fw",
        name: "Citrus Aurantium 500mg c/60 cápsulas",
        slug: "citrus-aurantium-500mg-c-60-capsulas",
        description: "Citrus Aurantium 500mg em cápsulas, extrato vegetal usado em rotinas de metabolismo, energia e controle de apetite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Citrus Aurantium 500mg c/60 cápsulas\n\nTipo: Fitoterápico em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCitrus aurantium 500mg\n\nCitrus aurantium é um extrato vegetal usado em rotinas de energia, metabolismo e controle alimentar. A fórmula em cápsulas facilita o uso diário com orientação profissional.\n\nBenefícios:\nApoio ao metabolismo\nPode complementar rotinas de energia\nSuporte à rotina de controle alimentar\nUso prático em cápsulas\n\nDiferenciais:\nExtrato vegetal\nDose de 500mg\n60 cápsulas\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nEvitar uso sem avaliação em casos de sensibilidade a estimulantes\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822738871.webp",
        price: 35,
        sku: "CITR-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmphikt25007d141e2tph133q"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0i7i70002pnnmtdphp6b0" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822738871.webp",
        order: 0
      },
      create: {
        id: "cmpn0i7i70002pnnmtdphp6b0",
        productId: productRecord.id,
        url: "/uploads/prod-1779822738871.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CAPS-GPH-6MG-60CAP" },
      update: {
        name: "Capsiate 6mg c/60 cápsulas",
        slug: "capsiate-6mg-c-60-capsulas",
        description: "Capsiate 6mg em cápsulas, ativo termogênico usado em rotinas de metabolismo, gasto energético e controle corporal.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Capsiate 6mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCapsiate 6mg\n\nCapsiate é um ativo associado a rotinas termogênicas e de metabolismo energético. A apresentação em cápsulas permite uso prático e dose controlada conforme orientação.\n\nBenefícios:\nApoio ao metabolismo energético\nPode complementar rotinas de controle corporal\nUso prático em cápsulas\nSuporte a estratégias de treino e alimentação\n\nDiferenciais:\nCapsiate 6mg\n60 cápsulas\nAtivo termogênico\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nEvitar uso sem avaliação em casos de sensibilidade a estimulantes\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822747249.webp",
        price: 42,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmphikt25007d141e2tph133q"}]
        }
      },
      create: {
        id: "cmphikt68009w141eusfv027k",
        name: "Capsiate 6mg c/60 cápsulas",
        slug: "capsiate-6mg-c-60-capsulas",
        description: "Capsiate 6mg em cápsulas, ativo termogênico usado em rotinas de metabolismo, gasto energético e controle corporal.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Capsiate 6mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nCapsiate 6mg\n\nCapsiate é um ativo associado a rotinas termogênicas e de metabolismo energético. A apresentação em cápsulas permite uso prático e dose controlada conforme orientação.\n\nBenefícios:\nApoio ao metabolismo energético\nPode complementar rotinas de controle corporal\nUso prático em cápsulas\nSuporte a estratégias de treino e alimentação\n\nDiferenciais:\nCapsiate 6mg\n60 cápsulas\nAtivo termogênico\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar com orientação profissional\nEvitar uso sem avaliação em casos de sensibilidade a estimulantes\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822747249.webp",
        price: 42,
        sku: "CAPS-GPH-6MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmphikt25007d141e2tph133q"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0ie340003pnnm04ytdo5c" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822747249.webp",
        order: 0
      },
      create: {
        id: "cmpn0ie340003pnnm04ytdo5c",
        productId: productRecord.id,
        url: "/uploads/prod-1779822747249.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "LCAR-GPH-500MG-60CAP" },
      update: {
        name: "L-Carnitina 500mg c/60 cápsulas",
        slug: "l-carnitina-500mg-c-60-capsulas",
        description: "L-Carnitina 500mg em cápsulas, usada em rotinas de energia, metabolismo de gorduras e performance física.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Carnitina 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-carnitina 500mg\n\nL-carnitina é um nutriente usado em rotinas de energia e metabolismo de gorduras, especialmente associado à prática de atividade física. A dose de 500mg em cápsulas facilita o consumo diário.\n\nBenefícios:\nApoio ao metabolismo energético\nPode complementar rotinas de treino\nPraticidade no uso diário\nSuporte à disposição física\n\nDiferenciais:\nL-carnitina 500mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822757438.webp",
        price: 69,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt64009u141elyq2rv13",
        name: "L-Carnitina 500mg c/60 cápsulas",
        slug: "l-carnitina-500mg-c-60-capsulas",
        description: "L-Carnitina 500mg em cápsulas, usada em rotinas de energia, metabolismo de gorduras e performance física.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Carnitina 500mg c/60 cápsulas\n\nTipo: Suplemento em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-carnitina 500mg\n\nL-carnitina é um nutriente usado em rotinas de energia e metabolismo de gorduras, especialmente associado à prática de atividade física. A dose de 500mg em cápsulas facilita o consumo diário.\n\nBenefícios:\nApoio ao metabolismo energético\nPode complementar rotinas de treino\nPraticidade no uso diário\nSuporte à disposição física\n\nDiferenciais:\nL-carnitina 500mg\n60 cápsulas\nFórmula manipulada\nDose padronizada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822757438.webp",
        price: 69,
        sku: "LCAR-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1i006t141ektvsfn74"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0im5k0004pnnms2g5vbln" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822757438.webp",
        order: 0
      },
      create: {
        id: "cmpn0im5k0004pnnms2g5vbln",
        productId: productRecord.id,
        url: "/uploads/prod-1779822757438.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "DIOS-HESP-GPH-60CAP" },
      update: {
        name: "Diosmina 450mg + Hesperidina 50mg c/60 cápsulas",
        slug: "diosmina-450mg-hesperidina-50mg-c-60-capsulas",
        description: "Diosmina com hesperidina em cápsulas, associação clássica para rotinas de circulação, saúde vascular e sensação de pernas cansadas.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Diosmina 450mg + Hesperidina 50mg c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nDiosmina 450mg\nHesperidina 50mg\n\nAssociação de diosmina e hesperidina utilizada em rotinas de suporte à circulação venosa e saúde vascular. A fórmula é prática para quem busca complementar cuidados com pernas cansadas conforme orientação.\n\nBenefícios:\nApoio à circulação venosa\nSuporte à saúde vascular\nPode auxiliar rotinas para pernas cansadas\nUso prático em cápsulas\n\nDiferenciais:\nDiosmina 450mg\nHesperidina 50mg\n60 cápsulas\nAssociação manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822812062.webp",
        price: 50,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt21007b141ezpfg1mr3"}]
        }
      },
      create: {
        id: "cmphikt5y009q141etotftisg",
        name: "Diosmina 450mg + Hesperidina 50mg c/60 cápsulas",
        slug: "diosmina-450mg-hesperidina-50mg-c-60-capsulas",
        description: "Diosmina com hesperidina em cápsulas, associação clássica para rotinas de circulação, saúde vascular e sensação de pernas cansadas.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Diosmina 450mg + Hesperidina 50mg c/60 cápsulas\n\nTipo: Cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nDiosmina 450mg\nHesperidina 50mg\n\nAssociação de diosmina e hesperidina utilizada em rotinas de suporte à circulação venosa e saúde vascular. A fórmula é prática para quem busca complementar cuidados com pernas cansadas conforme orientação.\n\nBenefícios:\nApoio à circulação venosa\nSuporte à saúde vascular\nPode auxiliar rotinas para pernas cansadas\nUso prático em cápsulas\n\nDiferenciais:\nDiosmina 450mg\nHesperidina 50mg\n60 cápsulas\nAssociação manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822812062.webp",
        price: 50,
        sku: "DIOS-HESP-GPH-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1b006n141epazh1fev"},{"id":"cmphikt21007b141ezpfg1mr3"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0jse20006pnnmxgk134hc" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822812062.webp",
        order: 0
      },
      create: {
        id: "cmpn0jse20006pnnmxgk134hc",
        productId: productRecord.id,
        url: "/uploads/prod-1779822812062.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "TYRO-GPH-500MG-60CAP" },
      update: {
        name: "L-Tirosina 500mg c/60 cápsulas",
        slug: "l-tirosina-500mg-c-60-capsulas",
        description: "L-Tirosina 500mg em cápsulas, aminoácido usado em rotinas de foco, disposição mental e performance cognitiva.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Tirosina 500mg c/60 cápsulas\n\nTipo: Aminoácido em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-tirosina 500mg\n\nL-tirosina é um aminoácido precursor de catecolaminas, usado em rotinas de foco, disposição mental e desempenho cognitivo. A versão em cápsulas oferece uso prático e dose definida.\n\nBenefícios:\nApoio ao foco e concentração\nSuporte à disposição mental\nPode complementar rotinas de estudo e trabalho\nUso prático em cápsulas\n\nDiferenciais:\nL-tirosina 500mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822822364.webp",
        price: 33,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1m006w141eot9uhnhw"},{"id":"cmphikt1x0076141ee7nmqd46"}]
        }
      },
      create: {
        id: "cmphikt5u009o141e542r6ynn",
        name: "L-Tirosina 500mg c/60 cápsulas",
        slug: "l-tirosina-500mg-c-60-capsulas",
        description: "L-Tirosina 500mg em cápsulas, aminoácido usado em rotinas de foco, disposição mental e performance cognitiva.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: L-Tirosina 500mg c/60 cápsulas\n\nTipo: Aminoácido em cápsulas manipuladas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nL-tirosina 500mg\n\nL-tirosina é um aminoácido precursor de catecolaminas, usado em rotinas de foco, disposição mental e desempenho cognitivo. A versão em cápsulas oferece uso prático e dose definida.\n\nBenefícios:\nApoio ao foco e concentração\nSuporte à disposição mental\nPode complementar rotinas de estudo e trabalho\nUso prático em cápsulas\n\nDiferenciais:\nL-tirosina 500mg\n60 cápsulas\nAminoácido em dose padronizada\nFórmula manipulada\n\nModo de uso:\nTomar conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779822822364.webp",
        price: 33,
        sku: "TYRO-GPH-500MG-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1m006w141eot9uhnhw"},{"id":"cmphikt1x0076141ee7nmqd46"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn0k0320007pnnmav0k4w10" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779822822364.webp",
        order: 0
      },
      create: {
        id: "cmpn0k0320007pnnmav0k4w10",
        productId: productRecord.id,
        url: "/uploads/prod-1779822822364.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "ARTRO-GPH-300G" },
      update: {
        name: "Artro Power 300g",
        slug: "artro-power-300g",
        description: "Artro Power sabor tangerina com colágeno tipo II e vitaminas A, D e K, desenvolvido para complementar a rotina de cuidados com articulações e mobilidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Artro Power 300g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 300g\n\nSabor: Tangerina\n\nContém:\nColágeno tipo II\nVitamina K\nVitamina A\nVitamina D\n\nArtro Power é um suplemento alimentar em pó sabor tangerina, desenvolvido para complementar a rotina de cuidados articulares. Sua fórmula combina colágeno tipo II com vitaminas A, D e K em uma apresentação prática e facilmente solúvel.\n\nBenefícios:\nAuxilia na rotina de cuidado das articulações\nFórmula com colágeno tipo II\nFonte de proteínas\nSabor tangerina agradável\n\nDiferenciais:\nZero glúten, lactose e açúcar\nFacilmente solúvel\nAdoçado com stevia\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir conforme orientação profissional.\n\nObservações:\nColorido artificialmente\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492784281.webp",
        price: 90,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt28007g141e76z82ae6"},{"id":"cmphikt2c007k141e3jmuh8g9"}]
        }
      },
      create: {
        id: "cmphikt6v00aa141edkt2snd3",
        name: "Artro Power 300g",
        slug: "artro-power-300g",
        description: "Artro Power sabor tangerina com colágeno tipo II e vitaminas A, D e K, desenvolvido para complementar a rotina de cuidados com articulações e mobilidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Artro Power 300g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 300g\n\nSabor: Tangerina\n\nContém:\nColágeno tipo II\nVitamina K\nVitamina A\nVitamina D\n\nArtro Power é um suplemento alimentar em pó sabor tangerina, desenvolvido para complementar a rotina de cuidados articulares. Sua fórmula combina colágeno tipo II com vitaminas A, D e K em uma apresentação prática e facilmente solúvel.\n\nBenefícios:\nAuxilia na rotina de cuidado das articulações\nFórmula com colágeno tipo II\nFonte de proteínas\nSabor tangerina agradável\n\nDiferenciais:\nZero glúten, lactose e açúcar\nFacilmente solúvel\nAdoçado com stevia\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir conforme orientação profissional.\n\nObservações:\nColorido artificialmente\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492784281.webp",
        price: 90,
        sku: "ARTRO-GPH-300G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt28007g141e76z82ae6"},{"id":"cmphikt2c007k141e3jmuh8g9"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk259h00bc141ewnoeyjqu" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492784281.webp",
        order: 0
      },
      create: {
        id: "cmphk259h00bc141ewnoeyjqu",
        productId: productRecord.id,
        url: "/uploads/prod-1779492784281.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "KOJI-GPH-50G" },
      update: {
        name: "Ácido Kójico Dipalmitato Creme 50g",
        slug: "acido-kojico-dipalmitato-creme-50g",
        description: "Creme com ácido kójico dipalmitato, indicado para rotinas de uniformização do tom da pele e cuidado com manchas.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Kójico Dipalmitato Creme 50g\n\nTipo: Creme facial/corporal manipulado\n\nPeso/Quantidade: 50g\n\nContém:\nÁcido kójico dipalmitato\n\nCreme manipulado com ácido kójico dipalmitato, derivado estável do ácido kójico utilizado em rotinas de uniformização do tom da pele e cuidado com manchas.\n\nBenefícios:\nAuxilia na uniformização da pele\nPode complementar rotinas clareadoras\nUso direcionado em áreas com manchas\nTextura em creme de fácil aplicação\n\nDiferenciais:\nÁcido kójico dipalmitato\nCreme de 50g\nFórmula manipulada\nIndicado para rotina de tratamento facial/corporal\n\nModo de uso:\nAplicar conforme orientação profissional, preferencialmente associado ao uso diário de protetor solar.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nUsar protetor solar durante o dia\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779730022276.webp",
        price: 35,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2a007i141e64ae5vki"},{"id":"cmphikt2b007j141egg3hpmsw"}]
        }
      },
      create: {
        id: "cmphikt6p00a6141e7km8qej7",
        name: "Ácido Kójico Dipalmitato Creme 50g",
        slug: "acido-kojico-dipalmitato-creme-50g",
        description: "Creme com ácido kójico dipalmitato, indicado para rotinas de uniformização do tom da pele e cuidado com manchas.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Kójico Dipalmitato Creme 50g\n\nTipo: Creme facial/corporal manipulado\n\nPeso/Quantidade: 50g\n\nContém:\nÁcido kójico dipalmitato\n\nCreme manipulado com ácido kójico dipalmitato, derivado estável do ácido kójico utilizado em rotinas de uniformização do tom da pele e cuidado com manchas.\n\nBenefícios:\nAuxilia na uniformização da pele\nPode complementar rotinas clareadoras\nUso direcionado em áreas com manchas\nTextura em creme de fácil aplicação\n\nDiferenciais:\nÁcido kójico dipalmitato\nCreme de 50g\nFórmula manipulada\nIndicado para rotina de tratamento facial/corporal\n\nModo de uso:\nAplicar conforme orientação profissional, preferencialmente associado ao uso diário de protetor solar.\n\nObservações:\nUso externo\nEvitar contato com olhos e mucosas\nUsar protetor solar durante o dia\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779730022276.webp",
        price: 35,
        sku: "KOJI-GPH-50G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2a007i141e64ae5vki"},{"id":"cmphikt2b007j141egg3hpmsw"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmplhazey000112dckmepxiub" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779730022276.webp",
        order: 0
      },
      create: {
        id: "cmplhazey000112dckmepxiub",
        productId: productRecord.id,
        url: "/uploads/prod-1779730022276.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "AHIA-GPH-1P-30G" },
      update: {
        name: "Ácido Hialurônico 1% Creme 30g",
        slug: "acido-hialuronico-1-creme-30g",
        description: "Creme com ácido hialurônico 1%, desenvolvido para hidratação, maciez e cuidado diário da pele com textura prática para aplicação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Hialurônico 1% Creme 30g\n\nTipo: Creme facial manipulado\n\nPeso/Quantidade: 30g\n\nContém:\nÁcido hialurônico 1%\n\nCreme facial com ácido hialurônico 1%, ativo reconhecido por sua capacidade de reter água e auxiliar na hidratação da pele. Ideal para compor uma rotina diária de cuidado facial.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para maciez e viço\nPode melhorar a sensação de pele ressecada\nUso prático na rotina de skincare\n\nDiferenciais:\nÁcido hialurônico 1%\nCreme de 30g\nUso facial\nFórmula manipulada\n\nModo de uso:\nAplicar sobre a pele limpa e seca, conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779730030350.webp",
        price: 28,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt29007h141eq5uzmrn1"}]
        }
      },
      create: {
        id: "cmphikt6l00a4141exq5em6t6",
        name: "Ácido Hialurônico 1% Creme 30g",
        slug: "acido-hialuronico-1-creme-30g",
        description: "Creme com ácido hialurônico 1%, desenvolvido para hidratação, maciez e cuidado diário da pele com textura prática para aplicação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Ácido Hialurônico 1% Creme 30g\n\nTipo: Creme facial manipulado\n\nPeso/Quantidade: 30g\n\nContém:\nÁcido hialurônico 1%\n\nCreme facial com ácido hialurônico 1%, ativo reconhecido por sua capacidade de reter água e auxiliar na hidratação da pele. Ideal para compor uma rotina diária de cuidado facial.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para maciez e viço\nPode melhorar a sensação de pele ressecada\nUso prático na rotina de skincare\n\nDiferenciais:\nÁcido hialurônico 1%\nCreme de 30g\nUso facial\nFórmula manipulada\n\nModo de uso:\nAplicar sobre a pele limpa e seca, conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779730030350.webp",
        price: 28,
        sku: "AHIA-GPH-1P-30G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt29007h141eq5uzmrn1"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmplhb5eh000212dc8vd7223p" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779730030350.webp",
        order: 0
      },
      create: {
        id: "cmplhb5eh000212dc8vd7223p",
        productId: productRecord.id,
        url: "/uploads/prod-1779730030350.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "SN-GPH-180-MAR" },
      update: {
        name: "Shot Noturno 180g",
        slug: "shot-noturno-180g",
        description: "Shot noturno sabor maracujá com inositol, triptofano, magnésio, teanina, melatonina e vitamina B6, ideal para complementar a rotina da noite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Shot Noturno 180g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 180g\n\nSabor: Maracujá\n\nContém:\nInositol\nTriptofano\nMagnésio\nTeanina\nMelatonina\nVitamina B6\n\nShot Noturno é um suplemento alimentar em pó desenvolvido para complementar a rotina noturna de forma prática e saborosa. Sua fórmula reúne nutrientes e compostos ideais para o consumo no período da noite.\n\nBenefícios:\nFórmula pensada para rotina noturna\nPraticidade no consumo diário\nFácil preparo\nSabor agradável de maracujá\n\nDiferenciais:\nContém melatonina\nCom magnésio e vitamina B6\nFácil dissolução\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir preferencialmente no período noturno ou conforme orientação profissional.\n\nObservações:\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco\nSuplemento alimentar em pó",
        imageUrl: "/uploads/prod-1779492724199.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      },
      create: {
        id: "cmphikt7f00am141et85ksxma",
        name: "Shot Noturno 180g",
        slug: "shot-noturno-180g",
        description: "Shot noturno sabor maracujá com inositol, triptofano, magnésio, teanina, melatonina e vitamina B6, ideal para complementar a rotina da noite.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Shot Noturno 180g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 180g\n\nSabor: Maracujá\n\nContém:\nInositol\nTriptofano\nMagnésio\nTeanina\nMelatonina\nVitamina B6\n\nShot Noturno é um suplemento alimentar em pó desenvolvido para complementar a rotina noturna de forma prática e saborosa. Sua fórmula reúne nutrientes e compostos ideais para o consumo no período da noite.\n\nBenefícios:\nFórmula pensada para rotina noturna\nPraticidade no consumo diário\nFácil preparo\nSabor agradável de maracujá\n\nDiferenciais:\nContém melatonina\nCom magnésio e vitamina B6\nFácil dissolução\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir preferencialmente no período noturno ou conforme orientação profissional.\n\nObservações:\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco\nSuplemento alimentar em pó",
        imageUrl: "/uploads/prod-1779492724199.webp",
        price: 60,
        sku: "SN-GPH-180-MAR",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt1r0071141eq4jp9s7w"},{"id":"cmphikt1x0077141eirdemjzy"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk0ujs00b6141egf4yo3xg" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492724199.webp",
        order: 0
      },
      create: {
        id: "cmphk0ujs00b6141egf4yo3xg",
        productId: productRecord.id,
        url: "/uploads/prod-1779492724199.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "SM-GPH-180-LAR" },
      update: {
        name: "Shot Matinal Sabor Laranja 180g",
        slug: "shot-matinal-sabor-laranja-180g",
        description: "Shot matinal sabor laranja com glutamina, vinagre de maçã, NAC, gengibre, cúrcuma, própolis, minerais e vitaminas para começar o dia com praticidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Shot Matinal Sabor Laranja 180g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 180g\n\nSabor: Laranja\n\nContém:\nGlutamina\nVinagre de maçã\nN-acetil cisteína\nGengibre\nCúrcuma\nPrópolis\nPimenta preta\nZinco\nCromo\nSelênio\nVitaminas C, D e E\n\nShot Matinal é um suplemento alimentar em pó sabor laranja, desenvolvido para complementar a rotina da manhã com praticidade. A fórmula reúne aminoácido, extratos vegetais, própolis, minerais e vitaminas em uma combinação completa para o início do dia.\n\nBenefícios:\nFórmula pensada para a rotina matinal\nPraticidade no consumo diário\nCombinação de vitaminas, minerais e compostos vegetais\nSabor laranja refrescante\n\nDiferenciais:\nContém glutamina e N-acetil cisteína\nCom cúrcuma, gengibre, própolis e pimenta preta\nCom vitaminas C, D e E\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir preferencialmente pela manhã ou conforme orientação profissional.\n\nObservações:\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco\nSuplemento alimentar em pó",
        imageUrl: "/uploads/prod-1779492731590.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2i007p141e9apg9vzw"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      },
      create: {
        id: "cmphikt7c00ak141eslssdtr4",
        name: "Shot Matinal Sabor Laranja 180g",
        slug: "shot-matinal-sabor-laranja-180g",
        description: "Shot matinal sabor laranja com glutamina, vinagre de maçã, NAC, gengibre, cúrcuma, própolis, minerais e vitaminas para começar o dia com praticidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Shot Matinal Sabor Laranja 180g\n\nTipo: Suplemento alimentar em pó\n\nPeso/Quantidade: 180g\n\nSabor: Laranja\n\nContém:\nGlutamina\nVinagre de maçã\nN-acetil cisteína\nGengibre\nCúrcuma\nPrópolis\nPimenta preta\nZinco\nCromo\nSelênio\nVitaminas C, D e E\n\nShot Matinal é um suplemento alimentar em pó sabor laranja, desenvolvido para complementar a rotina da manhã com praticidade. A fórmula reúne aminoácido, extratos vegetais, própolis, minerais e vitaminas em uma combinação completa para o início do dia.\n\nBenefícios:\nFórmula pensada para a rotina matinal\nPraticidade no consumo diário\nCombinação de vitaminas, minerais e compostos vegetais\nSabor laranja refrescante\n\nDiferenciais:\nContém glutamina e N-acetil cisteína\nCom cúrcuma, gengibre, própolis e pimenta preta\nCom vitaminas C, D e E\nContém aroma sintético idêntico ao natural\n\nModo de uso:\nDiluir em água e consumir preferencialmente pela manhã ou conforme orientação profissional.\n\nObservações:\nContém aroma sintético idêntico ao natural\nArmazenar em local seco e fresco\nSuplemento alimentar em pó",
        imageUrl: "/uploads/prod-1779492731590.webp",
        price: 60,
        sku: "SM-GPH-180-LAR",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2i007p141e9apg9vzw"},{"id":"cmp5tqwub0003sno1t3d3xwwe"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk10n600b7141einxe81mx" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492731590.webp",
        order: 0
      },
      create: {
        id: "cmphk10n600b7141einxe81mx",
        productId: productRecord.id,
        url: "/uploads/prod-1779492731590.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CC-GPH-60" },
      update: {
        name: "Caramelo de Creatina (60 unidades)",
        slug: "caramelo-de-creatina-60-unidades",
        description: "Creatina em formato de caramelo de leite, com 60 unidades de 6,5g cada, uma forma prática e saborosa de incluir creatina na rotina.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Caramelo de Creatina (60 unidades)\n\nTipo: Suplemento alimentar de creatina em caramelo de leite\n\nPeso/Quantidade: 60 caramelos de 6,5g cada\n\nSabor: Caramelo de leite\n\nContém:\nCreatina\n\nCaramelo de creatina em formato de caramelo de leite, criado para deixar o consumo diário de creatina mais prático e saboroso. Uma alternativa interessante para quem busca fugir do pó tradicional.\n\nBenefícios:\nPraticidade para consumir creatina\nFormato fácil de transportar\nSabor caramelo de leite\nAlternativa prática ao pó tradicional\n\nDiferenciais:\n60 caramelos de 6,5g cada\nFormato em caramelo\nContém creatina\nIdeal para rotina corrida\n\nModo de uso:\nConsumir conforme orientação profissional.\n\nObservações:\nSuplemento alimentar\nArmazenar em local seco e fresco\nManter bem fechado após aberto",
        imageUrl: "/uploads/prod-1779492741555.webp",
        price: 180,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      },
      create: {
        id: "cmphikt7800ai141ep3rmokjx",
        name: "Caramelo de Creatina (60 unidades)",
        slug: "caramelo-de-creatina-60-unidades",
        description: "Creatina em formato de caramelo de leite, com 60 unidades de 6,5g cada, uma forma prática e saborosa de incluir creatina na rotina.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Caramelo de Creatina (60 unidades)\n\nTipo: Suplemento alimentar de creatina em caramelo de leite\n\nPeso/Quantidade: 60 caramelos de 6,5g cada\n\nSabor: Caramelo de leite\n\nContém:\nCreatina\n\nCaramelo de creatina em formato de caramelo de leite, criado para deixar o consumo diário de creatina mais prático e saboroso. Uma alternativa interessante para quem busca fugir do pó tradicional.\n\nBenefícios:\nPraticidade para consumir creatina\nFormato fácil de transportar\nSabor caramelo de leite\nAlternativa prática ao pó tradicional\n\nDiferenciais:\n60 caramelos de 6,5g cada\nFormato em caramelo\nContém creatina\nIdeal para rotina corrida\n\nModo de uso:\nConsumir conforme orientação profissional.\n\nObservações:\nSuplemento alimentar\nArmazenar em local seco e fresco\nManter bem fechado após aberto",
        imageUrl: "/uploads/prod-1779492741555.webp",
        price: 180,
        sku: "CC-GPH-60",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk188l00b8141etq847ioi" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492741555.webp",
        order: 0
      },
      create: {
        id: "cmphk188l00b8141etq847ioi",
        productId: productRecord.id,
        url: "/uploads/prod-1779492741555.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CREAT-GPH-180G" },
      update: {
        name: "Creatina 100% Pura 180g",
        slug: "creatina-100-pura-180g",
        description: "Creatina 100% pura em pó, sabor neutro e facilmente solúvel, indicada para auxiliar no aumento do desempenho em exercícios de curta duração e alta intensidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Creatina 100% Pura 180g\n\nTipo: Suplemento alimentar de creatina em pó\n\nPeso/Quantidade: 180g\n\nSabor: Neutro\n\nContém:\nCreatina 100% pura\n\nCreatina 100% pura em pó sabor neutro, desenvolvida para complementar a rotina esportiva. A creatina auxilia no aumento do desempenho físico durante exercícios repetidos de curta duração e alta intensidade.\n\nBenefícios:\nAuxilia no desempenho físico\nApoia treinos de força e alta intensidade\nFácil inclusão na rotina\nSabor neutro para misturar com água ou bebida de preferência\n\nDiferenciais:\n100% creatina\nFacilmente solúvel\nSabor neutro\nPote de 180g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492750176.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      },
      create: {
        id: "cmphikt7500ag141eqd2zki1y",
        name: "Creatina 100% Pura 180g",
        slug: "creatina-100-pura-180g",
        description: "Creatina 100% pura em pó, sabor neutro e facilmente solúvel, indicada para auxiliar no aumento do desempenho em exercícios de curta duração e alta intensidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Creatina 100% Pura 180g\n\nTipo: Suplemento alimentar de creatina em pó\n\nPeso/Quantidade: 180g\n\nSabor: Neutro\n\nContém:\nCreatina 100% pura\n\nCreatina 100% pura em pó sabor neutro, desenvolvida para complementar a rotina esportiva. A creatina auxilia no aumento do desempenho físico durante exercícios repetidos de curta duração e alta intensidade.\n\nBenefícios:\nAuxilia no desempenho físico\nApoia treinos de força e alta intensidade\nFácil inclusão na rotina\nSabor neutro para misturar com água ou bebida de preferência\n\nDiferenciais:\n100% creatina\nFacilmente solúvel\nSabor neutro\nPote de 180g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492750176.webp",
        price: 60,
        sku: "CREAT-GPH-180G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk1ekc00b9141eumqsk2kt" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492750176.webp",
        order: 0
      },
      create: {
        id: "cmphk1ekc00b9141eumqsk2kt",
        productId: productRecord.id,
        url: "/uploads/prod-1779492750176.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "MOUSSE-GPH-150ML" },
      update: {
        name: "Mousse de Limpeza Facial Anti-idade e Antioxidante 150ml",
        slug: "mousse-de-limpeza-facial-anti-idade-e-antioxidante-150ml",
        description: "Mousse de limpeza facial com ácido hialurônico e nano vitamina C, desenvolvido para limpar suavemente enquanto auxilia nos cuidados anti-idade e antioxidantes da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Mousse de Limpeza Facial Anti-idade e Antioxidante 150ml\n\nTipo: Mousse de limpeza facial\n\nPeso/Quantidade: 150ml\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nMousse de limpeza facial anti-idade e antioxidante desenvolvido para a rotina diária de cuidados com a pele. Sua fórmula combina ácido hialurônico e nano vitamina C para limpar suavemente e deixar sensação de pele fresca.\n\nBenefícios:\nLimpeza suave para uso diário\nAuxilia na hidratação e no cuidado da pele\nContribui para uma rotina antioxidante\nAjuda a deixar a pele com sensação limpa e fresca\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nTextura em mousse prática e agradável\nProduto anti-idade e antioxidante\n\nModo de uso:\nAplicar sobre a pele úmida, massagear suavemente e enxaguar. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492764764.webp",
        price: 40,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2f007m141ebj45v161"}]
        }
      },
      create: {
        id: "cmphikt7200ae141eigqdnx9j",
        name: "Mousse de Limpeza Facial Anti-idade e Antioxidante 150ml",
        slug: "mousse-de-limpeza-facial-anti-idade-e-antioxidante-150ml",
        description: "Mousse de limpeza facial com ácido hialurônico e nano vitamina C, desenvolvido para limpar suavemente enquanto auxilia nos cuidados anti-idade e antioxidantes da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Mousse de Limpeza Facial Anti-idade e Antioxidante 150ml\n\nTipo: Mousse de limpeza facial\n\nPeso/Quantidade: 150ml\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nMousse de limpeza facial anti-idade e antioxidante desenvolvido para a rotina diária de cuidados com a pele. Sua fórmula combina ácido hialurônico e nano vitamina C para limpar suavemente e deixar sensação de pele fresca.\n\nBenefícios:\nLimpeza suave para uso diário\nAuxilia na hidratação e no cuidado da pele\nContribui para uma rotina antioxidante\nAjuda a deixar a pele com sensação limpa e fresca\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nTextura em mousse prática e agradável\nProduto anti-idade e antioxidante\n\nModo de uso:\nAplicar sobre a pele úmida, massagear suavemente e enxaguar. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492764764.webp",
        price: 40,
        sku: "MOUSSE-GPH-150ML",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt2f007m141ebj45v161"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk1qlj00ba141etz9tkvwi" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492764764.webp",
        order: 0
      },
      create: {
        id: "cmphk1qlj00ba141etz9tkvwi",
        productId: productRecord.id,
        url: "/uploads/prod-1779492764764.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "HIDRA-GPH-FACIAL" },
      update: {
        name: "Hidratante Facial Antioxidante Anti-idade",
        slug: "hidratante-facial-antioxidante-anti-idade",
        description: "Hidratante facial com ácido hialurônico e nano vitamina C, ideal para hidratação diária, toque macio e cuidado antioxidante da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Hidratante Facial Antioxidante Anti-idade\n\nTipo: Hidratante facial\n\nPeso/Quantidade: 50g\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nHidratante facial anti-idade e antioxidante desenvolvido para auxiliar nos cuidados diários da pele. A combinação de ácido hialurônico e nano vitamina C ajuda a entregar hidratação, maciez e viço à rotina facial.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para maciez e viço\nAjuda na rotina de cuidado anti-idade\nApoio antioxidante para uso diário\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nFórmula voltada para cuidado facial\nIndicado para rotina diária de skincare\n\nModo de uso:\nAplicar sobre a pele limpa e seca, espalhando até completa absorção. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779491090927.webp",
        price: 60,
        active: true,
        categories: {
          set: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt29007h141eq5uzmrn1"}]
        }
      },
      create: {
        id: "cmphikt7x00aw141en358y51w",
        name: "Hidratante Facial Antioxidante Anti-idade",
        slug: "hidratante-facial-antioxidante-anti-idade",
        description: "Hidratante facial com ácido hialurônico e nano vitamina C, ideal para hidratação diária, toque macio e cuidado antioxidante da pele.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Hidratante Facial Antioxidante Anti-idade\n\nTipo: Hidratante facial\n\nPeso/Quantidade: 50g\n\nContém:\nÁcido hialurônico\nNano vitamina C\n\nHidratante facial anti-idade e antioxidante desenvolvido para auxiliar nos cuidados diários da pele. A combinação de ácido hialurônico e nano vitamina C ajuda a entregar hidratação, maciez e viço à rotina facial.\n\nBenefícios:\nAuxilia na hidratação da pele\nContribui para maciez e viço\nAjuda na rotina de cuidado anti-idade\nApoio antioxidante para uso diário\n\nDiferenciais:\nCom ácido hialurônico\nCom nano vitamina C\nFórmula voltada para cuidado facial\nIndicado para rotina diária de skincare\n\nModo de uso:\nAplicar sobre a pele limpa e seca, espalhando até completa absorção. Usar conforme orientação profissional.\n\nObservações:\nUso externo\nEvitar contato com os olhos\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779491090927.webp",
        price: 60,
        sku: "HIDRA-GPH-FACIAL",
        active: true,
        categories: {
          connect: [{"id":"cmp5tqbjp0001sno1vavv94cj"},{"id":"cmphikt29007h141eq5uzmrn1"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphj1vjp00b0141es07ib5ia" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779491090927.webp",
        order: 0
      },
      create: {
        id: "cmphj1vjp00b0141es07ib5ia",
        productId: productRecord.id,
        url: "/uploads/prod-1779491090927.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CREAT-GPH-500G" },
      update: {
        name: "Creatina 100% Pura 500g",
        slug: "creatina-100-pura-500g",
        description: "Creatina 100% pura em pó, sabor neutro e facilmente solúvel, indicada para auxiliar no aumento do desempenho em exercícios de curta duração e alta intensidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Creatina 100% Pura 500g\n\nTipo: Suplemento alimentar de creatina em pó\n\nPeso/Quantidade: 500g\n\nSabor: Neutro\n\nContém:\nCreatina 100% pura\n\nCreatina 100% pura em pó sabor neutro, desenvolvida para complementar a rotina esportiva. A creatina auxilia no aumento do desempenho físico durante exercícios repetidos de curta duração e alta intensidade.\n\nBenefícios:\nAuxilia no desempenho físico\nApoia treinos de força e alta intensidade\nFácil inclusão na rotina\nSabor neutro para misturar com água ou bebida de preferência\n\nDiferenciais:\n100% creatina\nFacilmente solúvel\nSabor neutro\nPote de 500g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779491160772.webp",
        price: 95,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      },
      create: {
        id: "cmphikt7t00au141ekwwp3wkk",
        name: "Creatina 100% Pura 500g",
        slug: "creatina-100-pura-500g",
        description: "Creatina 100% pura em pó, sabor neutro e facilmente solúvel, indicada para auxiliar no aumento do desempenho em exercícios de curta duração e alta intensidade.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Creatina 100% Pura 500g\n\nTipo: Suplemento alimentar de creatina em pó\n\nPeso/Quantidade: 500g\n\nSabor: Neutro\n\nContém:\nCreatina 100% pura\n\nCreatina 100% pura em pó sabor neutro, desenvolvida para complementar a rotina esportiva. A creatina auxilia no aumento do desempenho físico durante exercícios repetidos de curta duração e alta intensidade.\n\nBenefícios:\nAuxilia no desempenho físico\nApoia treinos de força e alta intensidade\nFácil inclusão na rotina\nSabor neutro para misturar com água ou bebida de preferência\n\nDiferenciais:\n100% creatina\nFacilmente solúvel\nSabor neutro\nPote de 500g\n\nModo de uso:\nDiluir em água ou bebida de preferência e consumir conforme orientação profissional.\n\nObservações:\nUsar conforme orientação profissional\nNão substitui uma alimentação equilibrada\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779491160772.webp",
        price: 95,
        sku: "CREAT-GPH-500G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt2g007n141eg3tx2r45"},{"id":"cmphikt2h007o141ezoftq4we"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphj3dku00b1141enfgyj8mp" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779491160772.webp",
        order: 0
      },
      create: {
        id: "cmphj3dku00b1141enfgyj8mp",
        productId: productRecord.id,
        url: "/uploads/prod-1779491160772.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "CURC-GPH-30ML" },
      update: {
        name: "Curcumin ADK Sublingual 30ml",
        slug: "curcumin-adk-sublingual-30ml",
        description: "Curcumin ADK sublingual em gotas com curcumina e vitaminas A, D e K, sabor/aroma laranja, pensado para uso oral prático.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Curcumin ADK Sublingual 30ml\n\nTipo: Suplemento alimentar em gotas sublingual\n\nPeso/Quantidade: 30ml\n\nSabor: Laranja\n\nContém:\nCurcumina\nVitamina A\nVitamina D\nVitamina K\n\nCurcumin ADK é um suplemento alimentar em gotas sublingual que combina curcumina com vitaminas A, D e K. A apresentação líquida facilita o uso oral e traz aroma de laranja para uma experiência mais agradável.\n\nBenefícios:\nPraticidade no uso em gotas\nCombinação de curcumina com vitaminas A, D e K\nUso oral\nAroma de laranja\n\nDiferenciais:\nApresentação sublingual\nFrasco de 30ml\nContém aromatizante sintético idêntico ao natural de laranja\nFórmula ADK\n\nModo de uso:\nUsar por via oral ou sublingual conforme orientação profissional.\n\nObservações:\nUso oral\nContém aromatizante sintético idêntico ao natural de laranja\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492681252.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      },
      create: {
        id: "cmphikt7q00as141e9ckdyneg",
        name: "Curcumin ADK Sublingual 30ml",
        slug: "curcumin-adk-sublingual-30ml",
        description: "Curcumin ADK sublingual em gotas com curcumina e vitaminas A, D e K, sabor/aroma laranja, pensado para uso oral prático.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Curcumin ADK Sublingual 30ml\n\nTipo: Suplemento alimentar em gotas sublingual\n\nPeso/Quantidade: 30ml\n\nSabor: Laranja\n\nContém:\nCurcumina\nVitamina A\nVitamina D\nVitamina K\n\nCurcumin ADK é um suplemento alimentar em gotas sublingual que combina curcumina com vitaminas A, D e K. A apresentação líquida facilita o uso oral e traz aroma de laranja para uma experiência mais agradável.\n\nBenefícios:\nPraticidade no uso em gotas\nCombinação de curcumina com vitaminas A, D e K\nUso oral\nAroma de laranja\n\nDiferenciais:\nApresentação sublingual\nFrasco de 30ml\nContém aromatizante sintético idêntico ao natural de laranja\nFórmula ADK\n\nModo de uso:\nUsar por via oral ou sublingual conforme orientação profissional.\n\nObservações:\nUso oral\nContém aromatizante sintético idêntico ao natural de laranja\nArmazenar em local fresco e ao abrigo da luz",
        imageUrl: "/uploads/prod-1779492681252.webp",
        price: 45,
        sku: "CURC-GPH-30ML",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmout10c90001wth1po80tz20"},{"id":"cmphikt1c006o141e7u6q3x09"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk079c00b3141eypdv8r4v" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492681252.webp",
        order: 0
      },
      create: {
        id: "cmphk079c00b3141eypdv8r4v",
        productId: productRecord.id,
        url: "/uploads/prod-1779492681252.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "COLH-GPH-300G" },
      update: {
        name: "Colágeno Hidrolisado 300g",
        slug: "colageno-hidrolisado-300g",
        description: "Colágeno hidrolisado Peptan sabor uva com vitamina E, biotina, zinco, cobre e selênio, desenvolvido para complementar a rotina de beleza e bem-estar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Colágeno Hidrolisado 300g\n\nTipo: Suplemento alimentar em pó para preparo de colágeno\n\nPeso/Quantidade: 300g\n\nSabor: Uva\n\nContém:\nPeptídeos de colágeno Peptan\nVitamina E\nBiotina\nZinco\nCobre\nSelênio\n\nColágeno hidrolisado em pó sabor uva, formulado com peptídeos de colágeno Peptan, vitamina E, biotina, zinco, cobre e selênio. Uma opção prática para complementar os cuidados com pele, cabelos, unhas e articulações.\n\nBenefícios:\nFonte de proteínas\nAuxilia na rotina de cuidados com pele, cabelos e unhas\nFácil preparo\nSabor uva agradável\n\nDiferenciais:\nCom peptídeos de colágeno Peptan\nCom vitamina E, biotina, zinco, cobre e selênio\nAdoçado com stevia\nAroma idêntico ao natural de uva\n\nModo de uso:\nDiluir em água e consumir conforme orientação profissional.\n\nObservações:\nAdoçado com stevia\nContém aroma idêntico ao natural de uva\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492701131.webp",
        price: 90,
        active: true,
        categories: {
          set: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt27007f141ev7tnu2ll"},{"id":"cmphikt28007g141e76z82ae6"}]
        }
      },
      create: {
        id: "cmphikt7m00aq141ejk5oo176",
        name: "Colágeno Hidrolisado 300g",
        slug: "colageno-hidrolisado-300g",
        description: "Colágeno hidrolisado Peptan sabor uva com vitamina E, biotina, zinco, cobre e selênio, desenvolvido para complementar a rotina de beleza e bem-estar.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Colágeno Hidrolisado 300g\n\nTipo: Suplemento alimentar em pó para preparo de colágeno\n\nPeso/Quantidade: 300g\n\nSabor: Uva\n\nContém:\nPeptídeos de colágeno Peptan\nVitamina E\nBiotina\nZinco\nCobre\nSelênio\n\nColágeno hidrolisado em pó sabor uva, formulado com peptídeos de colágeno Peptan, vitamina E, biotina, zinco, cobre e selênio. Uma opção prática para complementar os cuidados com pele, cabelos, unhas e articulações.\n\nBenefícios:\nFonte de proteínas\nAuxilia na rotina de cuidados com pele, cabelos e unhas\nFácil preparo\nSabor uva agradável\n\nDiferenciais:\nCom peptídeos de colágeno Peptan\nCom vitamina E, biotina, zinco, cobre e selênio\nAdoçado com stevia\nAroma idêntico ao natural de uva\n\nModo de uso:\nDiluir em água e consumir conforme orientação profissional.\n\nObservações:\nAdoçado com stevia\nContém aroma idêntico ao natural de uva\nArmazenar em local seco e fresco",
        imageUrl: "/uploads/prod-1779492701131.webp",
        price: 90,
        sku: "COLH-GPH-300G",
        active: true,
        categories: {
          connect: [{"id":"cmp5tq7v80000sno1fjz7naoe"},{"id":"cmphikt27007f141ev7tnu2ll"},{"id":"cmphikt28007g141e76z82ae6"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmphk0cpw00b4141eau7xj56v" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779492701131.webp",
        order: 0
      },
      create: {
        id: "cmphk0cpw00b4141eau7xj56v",
        productId: productRecord.id,
        url: "/uploads/prod-1779492701131.webp",
        order: 0
      }
    });
  }
  {
    const productRecord = await prisma.product.upsert({
      where: { sku: "TADA-ARGI-GPH-60CAP" },
      update: {
        name: "Tadalafil 5mg + Arginina 250mg c/60 cápsulas",
        slug: "tadalafil-5mg-arginina-250mg-c-60-capsulas",
        description: "Associação manipulada de tadalafil 5mg com arginina 250mg, preparada para uso orientado em rotinas de saúde masculina e circulação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tadalafil 5mg + Arginina 250mg c/60 cápsulas\n\nTipo: Medicamento manipulado em cápsulas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nTadalafil 5mg\nArginina 250mg\n\nFórmula manipulada que associa tadalafil e arginina em cápsulas, preparada para uso sob orientação profissional. A composição reúne um medicamento de prescrição com um aminoácido relacionado à produção de óxido nítrico.\n\nBenefícios:\nAssociação em cápsulas\nDose individualizada\nUso prático sob orientação\nPode integrar rotinas de cuidado masculino prescritas\n\nDiferenciais:\nContém tadalafil 5mg\nContém arginina 250mg\n60 cápsulas\nManipulado sob demanda\n\nModo de uso:\nUsar somente conforme prescrição ou orientação profissional.\n\nObservações:\nMedicamento sujeito a orientação profissional\nNão usar com nitratos sem avaliação profissional\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826844740.webp",
        price: 45,
        active: true,
        categories: {
          set: [{"id":"cmphikt1g006r141enpggkg0g"},{"id":"cmphikt1h006s141ed57fvg0q"}]
        }
      },
      create: {
        id: "cmphikt3r008e141ep0go27si",
        name: "Tadalafil 5mg + Arginina 250mg c/60 cápsulas",
        slug: "tadalafil-5mg-arginina-250mg-c-60-capsulas",
        description: "Associação manipulada de tadalafil 5mg com arginina 250mg, preparada para uso orientado em rotinas de saúde masculina e circulação.",
        details: "Marca: Global Pharma Human\n\nNome do Produto: Tadalafil 5mg + Arginina 250mg c/60 cápsulas\n\nTipo: Medicamento manipulado em cápsulas\n\nPeso/Quantidade: 60 cápsulas\n\nContém:\nTadalafil 5mg\nArginina 250mg\n\nFórmula manipulada que associa tadalafil e arginina em cápsulas, preparada para uso sob orientação profissional. A composição reúne um medicamento de prescrição com um aminoácido relacionado à produção de óxido nítrico.\n\nBenefícios:\nAssociação em cápsulas\nDose individualizada\nUso prático sob orientação\nPode integrar rotinas de cuidado masculino prescritas\n\nDiferenciais:\nContém tadalafil 5mg\nContém arginina 250mg\n60 cápsulas\nManipulado sob demanda\n\nModo de uso:\nUsar somente conforme prescrição ou orientação profissional.\n\nObservações:\nMedicamento sujeito a orientação profissional\nNão usar com nitratos sem avaliação profissional\nManter fora do alcance de crianças",
        imageUrl: "/uploads/prod-1779826844740.webp",
        price: 45,
        sku: "TADA-ARGI-GPH-60CAP",
        active: true,
        categories: {
          connect: [{"id":"cmphikt1g006r141enpggkg0g"},{"id":"cmphikt1h006s141ed57fvg0q"}]
        }
      }
    });
    await prisma.productImage.upsert({
      where: { id: "cmpn2y8b4000upnnmjy3b76ir" },
      update: {
        productId: productRecord.id,
        url: "/uploads/prod-1779826844740.webp",
        order: 0
      },
      create: {
        id: "cmpn2y8b4000upnnmjy3b76ir",
        productId: productRecord.id,
        url: "/uploads/prod-1779826844740.webp",
        order: 0
      }
    });
  }

  // 7. Regras de Envio (Shipping Rules)
  console.log("Semeando regras de envio...");
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001quc9y32q4mvfr" },
    update: {
      name: "06600-001 06699-999    JANDIRA E ITAPEVI",
      zipCode: "06600001",
      price: 0,
      active: true
    },
    create: {
      id: "cmq5f83u5001quc9y32q4mvfr",
      name: "06600-001 06699-999    JANDIRA E ITAPEVI",
      zipCode: "06600001",
      price: 0,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40000uc9ylwvzdqwu" },
    update: {
      name: "01000-000 a 01099-999  Centro (Sé e Republica)",
      zipCode: "01000000-01099999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40000uc9ylwvzdqwu",
      name: "01000-000 a 01099-999  Centro (Sé e Republica)",
      zipCode: "01000000-01099999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40001uc9yp8aukevd" },
    update: {
      name: "01100-000 a 01199-999  Bom Retiro",
      zipCode: "01100000-01199999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40001uc9yp8aukevd",
      name: "01100-000 a 01199-999  Bom Retiro",
      zipCode: "01100000-01199999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40002uc9yn027j6m2" },
    update: {
      name: "01200-000 a 01599-999 Consolação,Liberdade,Bela Vista,Cambuci",
      zipCode: "01200000-01599999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40002uc9yn027j6m2",
      name: "01200-000 a 01599-999 Consolação,Liberdade,Bela Vista,Cambuci",
      zipCode: "01200000-01599999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40003uc9yum64ih1j" },
    update: {
      name: "02000-000 a 02199-999 Zona Norte - V.Maria + Santana",
      zipCode: "02000000-02199999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40003uc9yum64ih1j",
      name: "02000-000 a 02199-999 Zona Norte - V.Maria + Santana",
      zipCode: "02000000-02199999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40004uc9yvmfn77u8" },
    update: {
      name: "02200-000 a 02281-999 Zona Norte - Jaçanã",
      zipCode: "02200000-02281999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40004uc9yvmfn77u8",
      name: "02200-000 a 02281-999 Zona Norte - Jaçanã",
      zipCode: "02200000-02281999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40005uc9yc8fsmpb1" },
    update: {
      name: "02300-000 a 02365-999 Zona Norte - Mandaqui - Vila Mazzei",
      zipCode: "02300000-02365999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40005uc9yc8fsmpb1",
      name: "02300-000 a 02365-999 Zona Norte - Mandaqui - Vila Mazzei",
      zipCode: "02300000-02365999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40006uc9yr22fo4ts" },
    update: {
      name: "02370-000 a 02378-999 Zona Norte - Horto",
      zipCode: "02370000-02378999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40006uc9yr22fo4ts",
      name: "02370-000 a 02378-999 Zona Norte - Horto",
      zipCode: "02370000-02378999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40007uc9yq678joar" },
    update: {
      name: "02400-000 a 02599-999 Zona Norte -Agua Fria/Casa Verde",
      zipCode: "02400000-02599999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40007uc9yq678joar",
      name: "02400-000 a 02599-999 Zona Norte -Agua Fria/Casa Verde",
      zipCode: "02400000-02599999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40008uc9ycc8a1n3a" },
    update: {
      name: "02600-000 a 02675-999 Jd Peri, Vl Amelia, Jd Sta Cruz",
      zipCode: "02600000-02675999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40008uc9ycc8a1n3a",
      name: "02600-000 a 02675-999 Jd Peri, Vl Amelia, Jd Sta Cruz",
      zipCode: "02600000-02675999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u40009uc9y3cbb1umw" },
    update: {
      name: "02700-000 a 02880-000 ZN Limão/Jd Paulistano/Pq São Luiz",
      zipCode: "02700000-02880000",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u40009uc9y3cbb1umw",
      name: "02700-000 a 02880-000 ZN Limão/Jd Paulistano/Pq São Luiz",
      zipCode: "02700000-02880000",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000auc9y2ns9v0jx" },
    update: {
      name: "ZONA NORTE ZONA DE RISCO 02814-050  /  02814-050 / 02878-080",
      zipCode: "02814050",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u4000auc9y2ns9v0jx",
      name: "ZONA NORTE ZONA DE RISCO 02814-050  /  02814-050 / 02878-080",
      zipCode: "02814050",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000buc9yyp7670no" },
    update: {
      name: "02900-000 a 0299-999 Zona Norte - Freguesia do Ó/Pirituba/ TAIPAS",
      zipCode: "02900000",
      price: 30,
      active: true
    },
    create: {
      id: "cmq5f83u4000buc9yyp7670no",
      name: "02900-000 a 0299-999 Zona Norte - Freguesia do Ó/Pirituba/ TAIPAS",
      zipCode: "02900000",
      price: 30,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000cuc9yorq1b9yu" },
    update: {
      name: "03500-999 a 03999-999 ZONA LESTE  TATUAPE / MOOCA /VL PRUDENTE",
      zipCode: "03500999-03999999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u4000cuc9yorq1b9yu",
      name: "03500-999 a 03999-999 ZONA LESTE  TATUAPE / MOOCA /VL PRUDENTE",
      zipCode: "03500999-03999999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000duc9yxa1upxnx" },
    update: {
      name: "04000-000 a 04199-999 Vila Mariana, Aclimação, Saúde,Cursino",
      zipCode: "04000000-04199999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u4000duc9yxa1upxnx",
      name: "04000-000 a 04199-999 Vila Mariana, Aclimação, Saúde,Cursino",
      zipCode: "04000000-04199999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000euc9y51pnvvi2" },
    update: {
      name: "04200-000 a 04299-999 Ipiranga, Sacomã",
      zipCode: "04200000-04299999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u4000euc9y51pnvvi2",
      name: "04200-000 a 04299-999 Ipiranga, Sacomã",
      zipCode: "04200000-04299999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000fuc9y70j76deo" },
    update: {
      name: "04300-000 a 04399-999 Jabaquara,Aeroporto, Cidade Ademar",
      zipCode: "04300000-04399999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u4000fuc9y70j76deo",
      name: "04300-000 a 04399-999 Jabaquara,Aeroporto, Cidade Ademar",
      zipCode: "04300000-04399999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u4000guc9yoewy7srv" },
    update: {
      name: "04500-000 a 04599-990 Moema, Itaim Bibi",
      zipCode: "04500000-04599990",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u4000guc9yoewy7srv",
      name: "04500-000 a 04599-990 Moema, Itaim Bibi",
      zipCode: "04500000-04599990",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000huc9yvhlwsf1d" },
    update: {
      name: "04600-000 a 04699-999 Campo Belo, Campo Grande",
      zipCode: "04600000-04699999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000huc9yvhlwsf1d",
      name: "04600-000 a 04699-999 Campo Belo, Campo Grande",
      zipCode: "04600000-04699999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000iuc9yyez20vyg" },
    update: {
      name: "04700-000 a 04799-999  Santo Amaro,Alto Boa Vista,Socorro",
      zipCode: "04700000-04799999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000iuc9yyez20vyg",
      name: "04700-000 a 04799-999  Santo Amaro,Alto Boa Vista,Socorro",
      zipCode: "04700000-04799999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000juc9y5bx38a7h" },
    update: {
      name: "04400-000 a 04499-990 Cidade ademar",
      zipCode: "04400000-04499990",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000juc9y5bx38a7h",
      name: "04400-000 a 04499-990 Cidade ademar",
      zipCode: "04400000-04499990",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000kuc9y2b4l7gbd" },
    update: {
      name: "04800-000 a 04864-999 São luz , Grajaú",
      zipCode: "04800000-04864999",
      price: 20,
      active: true
    },
    create: {
      id: "cmq5f83u5000kuc9y2b4l7gbd",
      name: "04800-000 a 04864-999 São luz , Grajaú",
      zipCode: "04800000-04864999",
      price: 20,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000luc9ymntneipk" },
    update: {
      name: "04900-000 a 04940-999 M'boi Mirim, Jd Angela",
      zipCode: "04900000-04940999",
      price: 30,
      active: true
    },
    create: {
      id: "cmq5f83u5000luc9ymntneipk",
      name: "04900-000 a 04940-999 M'boi Mirim, Jd Angela",
      zipCode: "04900000-04940999",
      price: 30,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000muc9yiznstcnb" },
    update: {
      name: "04935-050/   04942-040/  04965-000",
      zipCode: "04935050",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u5000muc9yiznstcnb",
      name: "04935-050/   04942-040/  04965-000",
      zipCode: "04935050",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000nuc9ynk8skaam" },
    update: {
      name: "04941-999  a 04999-999 jd são luiz , jd angela",
      zipCode: "04941999-04999999",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u5000nuc9ynk8skaam",
      name: "04941-999  a 04999-999 jd são luiz , jd angela",
      zipCode: "04941999-04999999",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000ouc9ycpy6y9ml" },
    update: {
      name: "05000-000 a 05099-999 Lapa, Perdizes, Pompéia",
      zipCode: "05000000-05099999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000ouc9ycpy6y9ml",
      name: "05000-000 a 05099-999 Lapa, Perdizes, Pompéia",
      zipCode: "05000000-05099999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000puc9y4rd16ppb" },
    update: {
      name: "05100-000 a 05139-999 Parque São Domingos",
      zipCode: "05100000-05139999",
      price: 30,
      active: true
    },
    create: {
      id: "cmq5f83u5000puc9y4rd16ppb",
      name: "05100-000 a 05139-999 Parque São Domingos",
      zipCode: "05100000-05139999",
      price: 30,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000quc9y7jojbl2m" },
    update: {
      name: "05140-000 a 05179-999 Pirituba - Jaragua",
      zipCode: "05140000-05179999",
      price: 30,
      active: true
    },
    create: {
      id: "cmq5f83u5000quc9y7jojbl2m",
      name: "05140-000 a 05179-999 Pirituba - Jaragua",
      zipCode: "05140000-05179999",
      price: 30,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000ruc9yd0sjyvre" },
    update: {
      name: "05180-000 a 05299-000 JARAGUA AFASTADADO E Perus",
      zipCode: "05180000-05299000",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u5000ruc9yd0sjyvre",
      name: "05180-000 a 05299-000 JARAGUA AFASTADADO E Perus",
      zipCode: "05180000-05299000",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000suc9ym8gkolnp" },
    update: {
      name: "05300-000 a 05399-999 Jaguaré, Cid Universitária, Leopoldina",
      zipCode: "05300000-05399999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000suc9ym8gkolnp",
      name: "05300-000 a 05399-999 Jaguaré, Cid Universitária, Leopoldina",
      zipCode: "05300000-05399999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000tuc9y4rjbhp6n" },
    update: {
      name: "05400-000 a 05499-999 Vila Madalena,Pinheiros",
      zipCode: "05400000-05499999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000tuc9y4rjbhp6n",
      name: "05400-000 a 05499-999 Vila Madalena,Pinheiros",
      zipCode: "05400000-05499999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000uuc9y4xvz0up6" },
    update: {
      name: "05500-000 a 05599-999 Butantã",
      zipCode: "05500000-05599999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000uuc9y4xvz0up6",
      name: "05500-000 a 05599-999 Butantã",
      zipCode: "05500000-05599999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000vuc9yv0h4dvdn" },
    update: {
      name: "05600-000 a 05699-999 Morumbi",
      zipCode: "05600000-05699999",
      price: 15,
      active: true
    },
    create: {
      id: "cmq5f83u5000vuc9yv0h4dvdn",
      name: "05600-000 a 05699-999 Morumbi",
      zipCode: "05600000-05699999",
      price: 15,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000wuc9yxwa95k0a" },
    update: {
      name: "05700-000 a 05799-999 Morumbi, Campo Limpo, Pirajussara",
      zipCode: "05700000-05799999",
      price: 20,
      active: true
    },
    create: {
      id: "cmq5f83u5000wuc9yxwa95k0a",
      name: "05700-000 a 05799-999 Morumbi, Campo Limpo, Pirajussara",
      zipCode: "05700000-05799999",
      price: 20,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000xuc9yrxepoolz" },
    update: {
      name: "05800-000 a 05999-999  CAPÃO REDONDO , JD ANGELA",
      zipCode: "05800000-05999999",
      price: 20,
      active: true
    },
    create: {
      id: "cmq5f83u5000xuc9yrxepoolz",
      name: "05800-000 a 05999-999  CAPÃO REDONDO , JD ANGELA",
      zipCode: "05800000-05999999",
      price: 20,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000yuc9yrhliug7p" },
    update: {
      name: "08000-000  a 08199-999 São Miguel, Itaim Paulista",
      zipCode: "08000000-08199999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5000yuc9yrhliug7p",
      name: "08000-000  a 08199-999 São Miguel, Itaim Paulista",
      zipCode: "08000000-08199999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5000zuc9yyq8copji" },
    update: {
      name: "08200-000 a 08299-999 Itaquera, Cidade Lider",
      zipCode: "08200000-08299999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5000zuc9yyq8copji",
      name: "08200-000 a 08299-999 Itaquera, Cidade Lider",
      zipCode: "08200000-08299999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50010uc9yta30ml2n" },
    update: {
      name: "08300-000 a 08499-000 Guaianazes , cidade tiradente",
      zipCode: "08300000-08499000",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u50010uc9yta30ml2n",
      name: "08300-000 a 08499-000 Guaianazes , cidade tiradente",
      zipCode: "08300000-08499000",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50012uc9ybolm0664" },
    update: {
      name: "06000-000 a 06299-999 OSASCO",
      zipCode: "06000000-06299999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u50012uc9ybolm0664",
      name: "06000-000 a 06299-999 OSASCO",
      zipCode: "06000000-06299999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50013uc9yyolfejzp" },
    update: {
      name: "06300-000 A 6399-999 CARAPICUIBA",
      zipCode: "06300000",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u50013uc9yyolfejzp",
      name: "06300-000 A 6399-999 CARAPICUIBA",
      zipCode: "06300000",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50014uc9yb50lx3dw" },
    update: {
      name: "06400-000 A 06499-999 BARUERI / ALPHAVILLE",
      zipCode: "06400000-06499999",
      price: 30,
      active: true
    },
    create: {
      id: "cmq5f83u50014uc9yb50lx3dw",
      name: "06400-000 A 06499-999 BARUERI / ALPHAVILLE",
      zipCode: "06400000-06499999",
      price: 30,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50015uc9yrfx185vu" },
    update: {
      name: "06539-000 A 06549-999 SANTANA PARNAIBA / ALPHAVILLE",
      zipCode: "06539000-06549999",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u50015uc9yrfx185vu",
      name: "06539-000 A 06549-999 SANTANA PARNAIBA / ALPHAVILLE",
      zipCode: "06539000-06549999",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50016uc9yz0hx1xiv" },
    update: {
      name: "06700-001 06718-999 COTIA CENTRAL",
      zipCode: "06700001",
      price: 35,
      active: true
    },
    create: {
      id: "cmq5f83u50016uc9yz0hx1xiv",
      name: "06700-001 06718-999 COTIA CENTRAL",
      zipCode: "06700001",
      price: 35,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50017uc9ynigv4wja" },
    update: {
      name: "06719-000 A 06750-000 COTIA AFASTADO",
      zipCode: "06719000-06750000",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u50017uc9ynigv4wja",
      name: "06719-000 A 06750-000 COTIA AFASTADO",
      zipCode: "06719000-06750000",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50018uc9y2yo26ypy" },
    update: {
      name: "06750-001 A 06799-999 TABOÃO DA SERRA",
      zipCode: "06750001-06799999",
      price: 35,
      active: true
    },
    create: {
      id: "cmq5f83u50018uc9y2yo26ypy",
      name: "06750-001 A 06799-999 TABOÃO DA SERRA",
      zipCode: "06750001-06799999",
      price: 35,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u50019uc9y0dpvq2bc" },
    update: {
      name: "06800-000 A  06899-000  EMBU",
      zipCode: "06800000-06899000",
      price: 35,
      active: true
    },
    create: {
      id: "cmq5f83u50019uc9y0dpvq2bc",
      name: "06800-000 A  06899-000  EMBU",
      zipCode: "06800000-06899000",
      price: 35,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001auc9y8crm5j3s" },
    update: {
      name: "07000-000 a 07299-999  Guarulhos",
      zipCode: "07000000-07299999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5001auc9y8crm5j3s",
      name: "07000-000 a 07299-999  Guarulhos",
      zipCode: "07000000-07299999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001buc9yqx4a2jwf" },
    update: {
      name: "09000-000 A 09299-999 STO ANDRE",
      zipCode: "09000000-09299999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5001buc9yqx4a2jwf",
      name: "09000-000 A 09299-999 STO ANDRE",
      zipCode: "09000000-09299999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001cuc9y0fhiejy2" },
    update: {
      name: "09500-000 A 09999-999 ABCD",
      zipCode: "09500000-09999999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5001cuc9y0fhiejy2",
      name: "09500-000 A 09999-999 ABCD",
      zipCode: "09500000-09999999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001duc9y31l8brb7" },
    update: {
      name: "09000-000 A 09299-999 STO ANDRE",
      zipCode: "09000000-09299999",
      price: 25,
      active: true
    },
    create: {
      id: "cmq5f83u5001duc9y31l8brb7",
      name: "09000-000 A 09299-999 STO ANDRE",
      zipCode: "09000000-09299999",
      price: 25,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001euc9yvbknhx1l" },
    update: {
      name: "09300-000 A 09399-999 MAUA",
      zipCode: "09300000-09399999",
      price: 35,
      active: true
    },
    create: {
      id: "cmq5f83u5001euc9yvbknhx1l",
      name: "09300-000 A 09399-999 MAUA",
      zipCode: "09300000-09399999",
      price: 35,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001fuc9yplsyuj4m" },
    update: {
      name: "CAIEIRAS , CAJAMAR  CEP 07700-000 A 07799-000",
      zipCode: "07700000-07799000",
      price: 45,
      active: true
    },
    create: {
      id: "cmq5f83u5001fuc9yplsyuj4m",
      name: "CAIEIRAS , CAJAMAR  CEP 07700-000 A 07799-000",
      zipCode: "07700000-07799000",
      price: 45,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001guc9yuhqq3h23" },
    update: {
      name: "PARELHEIROS  CEP 04970-000",
      zipCode: "04970000",
      price: 40,
      active: true
    },
    create: {
      id: "cmq5f83u5001guc9yuhqq3h23",
      name: "PARELHEIROS  CEP 04970-000",
      zipCode: "04970000",
      price: 40,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001iuc9y0l87lvwl" },
    update: {
      name: "POA, SUZANO    08500-000 a 08599-999",
      zipCode: "08500000-08599999",
      price: 50,
      active: true
    },
    create: {
      id: "cmq5f83u5001iuc9y0l87lvwl",
      name: "POA, SUZANO    08500-000 a 08599-999",
      zipCode: "08500000-08599999",
      price: 50,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001ouc9y1w7pqzah" },
    update: {
      name: "FRANCO DA ROCHA E FRANCISCO MORATO  CEP 07800-000 A 07899-000",
      zipCode: "07800000-07899000",
      price: 0,
      active: true
    },
    create: {
      id: "cmq5f83u5001ouc9y1w7pqzah",
      name: "FRANCO DA ROCHA E FRANCISCO MORATO  CEP 07800-000 A 07899-000",
      zipCode: "07800000-07899000",
      price: 0,
      active: true
    }
  });
  await prisma.shippingRule.upsert({
    where: { id: "cmq5f83u5001puc9ywiaw817l" },
    update: {
      name: "ARUÃ, MOGI       08700-000 a 08799-999",
      zipCode: "08700000-08799999",
      price: 0,
      active: true
    },
    create: {
      id: "cmq5f83u5001puc9ywiaw817l",
      name: "ARUÃ, MOGI       08700-000 a 08799-999",
      zipCode: "08700000-08799999",
      price: 0,
      active: true
    }
  });

  console.log("Semeadura finalizada com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a semeadura:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
