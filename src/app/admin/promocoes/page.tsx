import { AdminPromotionsManager } from "@/components/admin-promotions-manager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

type ProductSummary = {
  id: string;
  name: string;
};

export default async function AdminPromocoesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  
  const fetchOptions = { cache: "no-store" as RequestCache };

  const [promotionsRes, productsRes] = await Promise.all([
    fetch(`${apiUrl}/admin/promotions`, {
      ...fetchOptions,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
    fetch(`${apiUrl}/admin/products`, {
      ...fetchOptions,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  ]);

  const promotionsJson: unknown = promotionsRes.ok ? await promotionsRes.json() : [];
  const productsJson: unknown = productsRes.ok ? await productsRes.json() : [];

  const promotions = Array.isArray(promotionsJson) ? (promotionsJson as Promotion[]) : [];
  const products = Array.isArray(productsJson) ? (productsJson as ProductSummary[]) : [];

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold text-slate-900">Gerenciar Promoções</h1>
      <AdminPromotionsManager
        promotions={promotions.map((promotion) => ({ ...promotion, value: Number(promotion.value) }))}
        products={products}
      />
    </div>
  );
}
