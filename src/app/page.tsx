import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Zap, Truck, CreditCard, Shield, ChevronRight, Pill, Heart, Dumbbell, Leaf, Apple, Baby, Package, Sparkles } from "lucide-react";
import { Carousel } from "@/components/carousel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PharmacyUnits } from "@/components/pharmacy-units";
import { SocialFeed } from "@/components/social-feed";

type Promotion = {
  value: number | string;
  type: "PERCENT" | "FIXED";
  active: boolean;
  startsAt: string;
  endsAt: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  price: number | string;
  promotion?: Promotion | null;
};

type CategoryWithProducts = {
  id: string;
  name: string;
  slug: string;
  homeTitle?: string;
  products: Product[];
};

export default async function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);

  const fetchOptions = { cache: "no-store" as RequestCache };

  const [categoriesRes, featuredRes, latestRes, favoritesRes, bannersRes, featuredConfigRes, latestConfigRes, socialFeedRes] = await Promise.all([
    fetch(`${apiUrl}/catalog/categories-with-products`, fetchOptions),
    fetch(`${apiUrl}/catalog/products/featured`, fetchOptions),
    fetch(`${apiUrl}/catalog/products/latest`, fetchOptions),
    session?.accessToken
      ? fetch(`${apiUrl}/user/favorites`, { headers: { Authorization: `Bearer ${session.accessToken}` } })
      : Promise.resolve(null),
    fetch(`${apiUrl}/catalog/settings/HOME_BANNERS`, fetchOptions),
    fetch(`${apiUrl}/catalog/settings/HOME_FEATURED_CONFIG`, fetchOptions),
    fetch(`${apiUrl}/catalog/settings/HOME_LATEST_CONFIG`, fetchOptions),
    fetch(`${apiUrl}/catalog/settings/SHOW_SOCIAL_FEED`, fetchOptions)
  ]);

  async function safeJson(res: Response | null, defaultValue: any = []) {
    if (!res || !res.ok) return defaultValue;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return defaultValue;
    return res.json();
  }

  const categoriesJson = await safeJson(categoriesRes);
  const featuredJson = await safeJson(featuredRes);
  const latestJson = await safeJson(latestRes);
  const favoritesJson = await safeJson(favoritesRes as Response | null);
  const bannersJson = await safeJson(bannersRes, null);
  const featuredConfigJson = await safeJson(featuredConfigRes, null);
  const latestConfigJson = await safeJson(latestConfigRes, null);
  const socialFeedJson = await safeJson(socialFeedRes, null);
  const showSocialFeed = !socialFeedJson || socialFeedJson.value !== "false";

  let customBanners = undefined;
  if (bannersJson?.value) {
    try {
      const parsed = JSON.parse(bannersJson.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customBanners = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      }
    } catch(e) {}
  }

  const categories = Array.isArray(categoriesJson) ? (categoriesJson as CategoryWithProducts[]) : [];
  const featuredProducts = Array.isArray(featuredJson) ? (featuredJson as Product[]) : [];
  const latestProducts = Array.isArray(latestJson) ? (latestJson as Product[]) : [];
  const favoriteIds = Array.isArray(favoritesJson) ? favoritesJson.map((f: any) => f.id) : [];

  const mapProduct = (p: Product) => ({
    ...p,
    price: Number(p.price),
    promotion: p.promotion ? {
      ...p.promotion,
      value: Number(p.promotion.value),
      startsAt: new Date(p.promotion.startsAt),
      endsAt: new Date(p.promotion.endsAt)
    } : null
  });

  const featuredConfig = featuredConfigJson?.value ? JSON.parse(featuredConfigJson.value) : { showOnHome: true, order: -10, homeTitle: "Ofertas Imperdíveis" };
  const latestConfig = latestConfigJson?.value ? JSON.parse(latestConfigJson.value) : { showOnHome: true, order: 1000, homeTitle: "Novidades Fresquinhas" };

  function getCategoryIcon(slug: string) {
    const normalized = slug.toLowerCase();
    if (normalized.includes("vitamina") || normalized.includes("suplemento")) return Pill;
    if (normalized.includes("beleza") || normalized.includes("colageno") || normalized.includes("cosmetico")) return Heart;
    if (normalized.includes("imunidade") || normalized.includes("defesa")) return Shield;
    if (normalized.includes("energia") || normalized.includes("performance") || normalized.includes("esport")) return Dumbbell;
    if (normalized.includes("emagrece") || normalized.includes("fit") || normalized.includes("natural")) return Leaf;
    if (normalized.includes("saude") || normalized.includes("bem-estar")) return Apple;
    if (normalized.includes("infantil") || normalized.includes("kids") || normalized.includes("bebe")) return Baby;
    return Package;
  }

  const sections = [
    ...(featuredConfig.showOnHome && featuredProducts.length > 0 ? [{
      id: "featured",
      type: "FEATURED",
      title: "Em Destaque",
      homeTitle: featuredConfig.homeTitle,
      order: featuredConfig.order,
      products: featuredProducts,
      link: "/catalogo"
    }] : []),
    ...(latestConfig.showOnHome && latestProducts.length > 0 ? [{
      id: "latest",
      type: "LATEST",
      title: "Lançamentos",
      homeTitle: latestConfig.homeTitle,
      order: latestConfig.order,
      products: latestProducts,
      link: "/catalogo"
    }] : []),
    ...categories.filter(c => c.products.length > 0).map(c => ({
      id: c.id,
      type: "CATEGORY",
      title: c.name,
      homeTitle: c.homeTitle || `Pensou em ${c.name.split(' ')[0]}:`,
      order: (c as any).order ?? 0,
      products: c.products,
      link: `/catalogo?categoria=${c.slug}`
    }))
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Carousel */}
      <Carousel initialSlides={customBanners} />

      {/* Trust Badges / Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="flex gap-4 overflow-x-auto rounded-2xl bg-brand-50/50 p-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-8 md:rounded-[32px] md:p-6 md:[&::-webkit-scrollbar]:auto">
          <div className="flex w-max shrink-0 snap-start items-center gap-2 md:w-auto md:text-left">
            <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm md:rounded-2xl md:p-3">
              <Shield size={16} strokeWidth={1.5} className="md:size-6" />
            </div>
            <div className="pr-2 md:pr-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900 md:text-xs">Compra Segura</p>
              <p className="text-[9px] font-medium text-slate-500 md:text-[10px]">Seus dados protegidos</p>
            </div>
          </div>
          <div className="flex w-max shrink-0 snap-start items-center gap-2 md:w-auto md:text-left md:border-l md:border-brand-100 md:pl-8">
            <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm md:rounded-2xl md:p-3">
              <Truck size={16} strokeWidth={1.5} className="md:size-6" />
            </div>
            <div className="pr-2 md:pr-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900 md:text-xs">Frete Grátis*</p>
              <p className="text-[9px] font-medium text-slate-500 md:text-[10px]">Consulte sua região</p>
            </div>
          </div>
          <div className="flex w-max shrink-0 snap-start items-center gap-2 md:w-auto md:text-left md:border-l md:border-brand-100 md:pl-8">
            <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm md:rounded-2xl md:p-3">
              <CreditCard size={16} strokeWidth={1.5} className="md:size-6" />
            </div>
            <div className="pr-2 md:pr-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900 md:text-xs">Até 10x S/ Juros</p>
              <p className="text-[9px] font-medium text-slate-500 md:text-[10px]">No cartão de crédito</p>
            </div>
          </div>
          <div className="flex w-max shrink-0 snap-start items-center gap-2 md:w-auto md:text-left md:border-l md:border-brand-100 md:pl-8">
            <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm md:rounded-2xl md:p-3">
              <Zap size={16} strokeWidth={1.5} className="md:size-6" />
            </div>
            <div className="pr-4 md:pr-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900 md:text-xs">Entrega Express</p>
              <p className="text-[9px] font-medium text-slate-500 md:text-[10px]">Receba hoje mesmo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore por Categoria Quick Section */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="mb-4 flex flex-col justify-between border-b border-brand-50 pb-3 md:mb-6 sm:flex-row sm:items-end">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navegue por Fórmulas</p>
              <h2 className="text-xl font-black text-slate-900 md:text-2xl">Explore por Categoria</h2>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 lg:grid-cols-6 lg:gap-4 md:[&::-webkit-scrollbar]:auto">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.slug);
              return (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="flex w-max shrink-0 snap-start items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md md:w-auto text-left group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white">
                    <IconComponent size={20} />
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="truncate text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                      {cat.products.length} {cat.products.length === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Seções Dinâmicas (Destaque, Lançamentos, Categorias) */}
      {sections.map((section) => (
        <section key={section.id} className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-6 flex items-end justify-between border-b border-brand-50 pb-4 md:mb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{section.homeTitle}</p>
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl flex items-center gap-2 flex-wrap">
                <span>{section.title}</span>
                {section.type === "CATEGORY" && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm animate-scale-in">
                    {section.products.length} {section.products.length === 1 ? "produto" : "produtos"}
                  </span>
                )}
              </h2>
            </div>
            <Link href={section.link} className="group flex items-center gap-1 text-xs font-bold text-slate-600 transition hover:text-slate-900 md:text-sm">
              Ver tudo <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden lg:gap-6 lg:[&::-webkit-scrollbar]:auto">
            {section.products.map((p) => (
              <div key={p.id} className="w-[160px] shrink-0 snap-start sm:w-[220px] lg:w-[280px]">
                <ProductCard product={mapProduct(p)} isFavorited={favoriteIds.includes(p.id)} />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Unidades da Farmácia */}
      <PharmacyUnits />

      {/* Mural de Redes Sociais */}
      {showSocialFeed && <SocialFeed />}
    </div>
  );
}
