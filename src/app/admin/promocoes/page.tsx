import { AdminPromotionsManager } from "@/components/admin-promotions-manager";

export default async function AdminPromocoesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  const fetchOptions = { cache: "no-store" as RequestCache };

  const [promotionsRes, productsRes] = await Promise.all([
    fetch(`${apiUrl}/admin/promotions`, fetchOptions),
    fetch(`${apiUrl}/admin/products`, fetchOptions) // Assumindo que o admin pode ver todos os produtos
  ]);

  const promotions = promotionsRes.ok ? await promotionsRes.json() : [];
  const products = productsRes.ok ? await productsRes.json() : [];

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold text-brand-900">Gerenciar Promoções</h1>
      <AdminPromotionsManager
        promotions={promotions.map((promotion: any) => ({
          ...promotion,
          value: Number(promotion.value)
        }))}
        products={products}
      />
    </div>
  );
}

