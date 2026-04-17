import { formatCurrency } from "@/lib/utils";

export default async function AdminPedidosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  let orders = [];
  try {
    const res = await fetch(`${apiUrl}/admin/orders`, { cache: "no-store" });
    if (res.ok) {
      orders = await res.json();
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos no admin:", error);
  }

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold text-brand-900">Pedidos</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-brand-100 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-brand-900">Pedido #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm font-semibold text-brand-700">{order.status}</p>
            </div>
            <p className="text-sm text-brand-700">
              Cliente: {order.user.name} ({order.user.email})
            </p>
            <p className="text-sm text-brand-700">Itens: {order.items.length}</p>
            <p className="text-sm font-semibold text-brand-900">
              Total: {formatCurrency(Number(order.total))}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

