import { AdminProductsManager } from "@/components/admin-products-manager";

export default async function AdminProdutosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  const fetchOptions = { cache: "no-store" as RequestCache };

  const [productsRes, categoriesRes, promotionsRes] = await Promise.all([
    fetch(`${apiUrl}/admin/products`, fetchOptions),
    fetch(`${apiUrl}/catalog/categories`, fetchOptions),
    fetch(`${apiUrl}/admin/promotions`, fetchOptions)
  ]);

  const products = productsRes.ok ? await productsRes.json() : [];
  const categories = categoriesRes.ok ? await categoriesRes.json() : [];
  const promotions = promotionsRes.ok ? await promotionsRes.json() : [];

  const serializedProducts = products.map((product: any) => ({
    ...product,
    price: Number(product.price)
  }));

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold text-brand-900">Gerenciar Produtos</h1>
      <AdminProductsManager
        products={serializedProducts as any}
        categories={categories}
        promotions={promotions.map((promotion: any) => ({
          ...promotion,
          value: Number(promotion.value)
        }))}
      />
    </div>
  );
}

