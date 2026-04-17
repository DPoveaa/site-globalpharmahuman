import { ProductCard } from "@/components/product-card";

type Props = {
  searchParams: Promise<{ q?: string; categoria?: string }>;
};

export default async function CatalogoPage({ searchParams }: Props) {
  const filters = await searchParams;
  const query = filters.q?.trim() || "";
  const categorySlug = filters.categoria?.trim() || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const fetchOptions = { cache: "no-store" as RequestCache };

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${apiUrl}/catalog/products?q=${query}&category=${categorySlug}`, fetchOptions),
    fetch(`${apiUrl}/catalog/categories`, fetchOptions)
  ]);

  const products = productsRes.ok ? await productsRes.json() : [];
  const categories = categoriesRes.ok ? await categoriesRes.json() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-bold text-brand-900">Catálogo</h1>
      <form className="mt-5 grid gap-3 rounded-2xl border border-brand-100 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar vitaminas, manipulados..."
          className="rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-brand-500"
        />
        <select
          name="categoria"
          defaultValue={categorySlug}
          className="rounded-lg border border-brand-200 px-3 py-2 outline-none focus:border-brand-500"
        >
          <option value="">Todas categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">Filtrar</button>
      </form>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: Number(product.price),
              promotion: product.promotion
                ? {
                    ...product.promotion,
                    value: Number(product.promotion.value)
                  }
                : null
            }}
          />
        ))}
      </div>
    </div>
  );
}

