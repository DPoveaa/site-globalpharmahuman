import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClipboardList } from "lucide-react";
import { OrderList } from "@/components/admin/order-list";

export default async function AdminPedidosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  
  let orders = [];
  try {
    const res = await fetch(`${apiUrl}/admin/orders`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (res.ok) {
      orders = await res.json();
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos no admin:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-100 p-2 text-slate-600">
          <ClipboardList size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Pedidos</h1>
      </div>

      <OrderList initialOrders={orders} />
    </div>
  );
}
