import { ProductCard } from "@/components/product-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CatalogFilters } from "@/components/shop/catalog-filters";
import { Search } from "lucide-react";

type Props = {
  searchParams: Promise<{ 
    q?: string; 
    categoria?: string; 
    promocoes?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  price: number | string;
  promotion: {
    active: boolean;
    type: "PERCENT" | "FIXED";
    value: number | string;
    startsAt: string;
    endsAt: string;
  } | null;
};

export default async function CatalogoPage({ searchParams }: Props) {
  const filters = await searchParams;
  const query = filters.q?.trim() || "";
  const categorySlug = filters.categoria?.trim() || "";
  const promotionsOnly = filters.promocoes === "1";
  const minPrice = filters.minPrice || "";
  const maxPrice = filters.maxPrice || "";
  const sort = filters.sort || "newest";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);

  const fetchOptions = { cache: "no-store" as RequestCache };

  const [productsRes, categoriesRes, favoritesRes] = await Promise.all([
    fetch(
      `${apiUrl}/catalog/products?q=${query}&category=${categorySlug}&promotions=${promotionsOnly ? "1" : ""}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`,
      fetchOptions
    ),
    fetch(`${apiUrl}/catalog/categories`, fetchOptions),
    session?.accessToken
      ? fetch(`${apiUrl}/user/favorites`, { headers: { Authorization: `Bearer ${session.accessToken}` } })
      : Promise.resolve(null)
  ]);

  async function safeJson(res: Response | null, defaultValue: any = []) {
    if (!res || !res.ok) return defaultValue;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return defaultValue;
    return res.json();
  }

  const productsJson = await safeJson(productsRes);
  const categoriesJson = await safeJson(categoriesRes);
  const favoritesJson = await safeJson(favoritesRes as Response | null);

  const products = Array.isArray(productsJson) ? (productsJson as Product[]) : [];
  const categories = Array.isArray(categoriesJson) ? (categoriesJson as Category[]) : [];
  const favoriteIds = Array.isArray(favoritesJson) ? favoritesJson.map((f: any) => f.id) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-10 text-center md:text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600">Explore Nossa Linha</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Catálogo de Produtos</h1>
      </div>

      <CatalogFilters categories={categories} />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-6 text-slate-400">
            <Search size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nenhum produto encontrado</h3>
          <p className="mt-1 text-slate-500">Tente ajustar seus filtros para encontrar o que procura.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {products.map((product: Product) => (
            <div key={product.id} className="h-full">
              <ProductCard
                isFavorited={favoriteIds.includes(product.id)}
                product={{
                  ...product,
                  price: Number(product.price),
                  promotion: product.promotion
                    ? {
                      ...product.promotion,
                      value: Number(product.promotion.value),
                      startsAt: new Date(product.promotion.startsAt),
                      endsAt: new Date(product.promotion.endsAt)
                    }
                    : null
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
