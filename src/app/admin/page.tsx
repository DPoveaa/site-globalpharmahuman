import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  let stats = { products: 0, orders: 0, users: 0, revenue: 0 };
  
  try {
    const res = await fetch(`${apiUrl}/admin/dashboard`, { cache: "no-store" });
    if (res.ok) {
      stats = await res.json();
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas do admin:", error);
  }

  const cards = [
    { title: "Produtos", value: stats.products.toString() },
    { title: "Pedidos", value: stats.orders.toString() },
    { title: "Clientes", value: stats.users.toString() },
    {
      title: "Faturamento",
      value: formatCurrency(stats.revenue)
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-brand-100 bg-white p-5">
            <p className="text-sm text-brand-700">{card.title}</p>
            <p className="mt-2 text-2xl font-bold text-brand-900">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

