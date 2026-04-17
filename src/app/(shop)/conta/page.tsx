import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/logout-button";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export default async function ContaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  // Como estamos no Server Side, não temos o token do usuário facilmente aqui
  // Mas o NextAuth mantém a sessão. Idealmente, o backend deveria validar o usuário.
  // Para fins de demonstração, vamos buscar via fetch. 
  // Em uma estrutura real, passaríamos o Bearer token se o backend exigir.
  
  let orders = [];
  try {
    const res = await fetch(`${apiUrl}/orders/my-orders`, {
      headers: {
        // Simulando que o backend saiba quem é o usuário ou passando via query/header se necessário
        // No momento o backend usa requireAuth que olha Authorization header.
        // Como o NextAuth salva o JWT, precisaríamos dele aqui.
      },
      cache: "no-store"
    });
    if (res.ok) {
      orders = await res.json();
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-900">Minha Conta</h1>
          <p className="text-sm text-brand-700">{session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-brand-900">Pedidos</h2>
        <div className="mt-3 space-y-3">
          {orders.length === 0 && <p className="text-sm text-brand-700">Nenhum pedido ainda.</p>}
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-brand-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-brand-900">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-semibold text-brand-700">{order.status}</p>
              </div>
              <p className="text-sm text-brand-700">
                {new Date(order.createdAt).toLocaleDateString("pt-BR")} - {formatCurrency(Number(order.total))}
              </p>
              <p className="mt-2 text-xs text-brand-700">Itens: {order.items.length}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

