import { AdminProductsManager } from "@/components/admin-products-manager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  images?: { id: string; url: string; order: number }[];
  price: number;
  sku: string;
  active: boolean;
  categories: Category[];
  promotionId: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Promotion = {
  id: string;
  title: string;
  value: number;
};

export default async function AdminProdutosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  
  console.log(`[AdminProdutosPage] Session: ${!!session}, Role: ${session?.user?.role}, Token: ${token ? "Yes" : "No"}`);

  const fetchOptions = { cache: "no-store" as RequestCache };

  // Chamada DIRETA ao backend
  const [productsRes, categoriesRes, promotionsRes] = await Promise.all([
    fetch(`${apiUrl}/admin/products`, {
      ...fetchOptions,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
    fetch(`${apiUrl}/catalog/categories`, fetchOptions),
    fetch(`${apiUrl}/admin/promotions`, {
      ...fetchOptions,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  ]);

  // Logs detalhados de erro se falhar
  if (!productsRes.ok) {
    console.error(`[AdminProducts] Error fetching products: ${productsRes.status}`);
    if (productsRes.status === 401) {
      console.error("[AdminProducts] Backend returned 401 - Token might be invalid or expired. Redirecting to logout.");
      redirect("/logout");
    }
  }
  if (!categoriesRes.ok) console.error(`[AdminProducts] Error fetching categories: ${categoriesRes.status}`);
  if (!promotionsRes.ok) {
    console.error(`[AdminProducts] Error fetching promotions: ${promotionsRes.status}`);
    if (promotionsRes.status === 401) {
      console.error("[AdminProducts] Backend returned 401 - Token might be invalid or expired. Redirecting to logout.");
      redirect("/logout");
    }
  }  const productsJson: unknown = productsRes.ok ? await productsRes.json() : [];
  const categoriesJson: unknown = categoriesRes.ok ? await categoriesRes.json() : [];
  const promotionsJson: unknown = promotionsRes.ok ? await promotionsRes.json() : [];

  const products = Array.isArray(productsJson) ? (productsJson as AdminProduct[]) : [];
  const categories = Array.isArray(categoriesJson) ? (categoriesJson as Category[]) : [];
  const promotions = Array.isArray(promotionsJson) ? (promotionsJson as Promotion[]) : [];

  const serializedProducts = products.map((product) => ({ ...product, price: Number(product.price) }));
  const serializedPromotions = promotions.map((promotion) => ({ ...promotion, value: Number(promotion.value) }));

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold text-slate-900">Gerenciar Produtos</h1>
      <AdminProductsManager
        products={serializedProducts}
        categories={categories}
        promotions={serializedPromotions}
      />
    </div>
  );
}
