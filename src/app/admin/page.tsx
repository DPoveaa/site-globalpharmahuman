import { formatCurrency, getImageUrl, translateOrderStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Clock, Layout, ShieldCheck } from "lucide-react";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const role = session?.user?.role;
  const permissions = session?.user?.permissions || [];

  const resolvedSearchParams = await searchParams;
  const days = resolvedSearchParams?.days || "30";

  // Se for funcionário e não tiver permissão de dashboard, mostra página de boas-vindas
  if (role === "EMPLOYEE" && !permissions.includes("view_dashboard")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-brand-100 to-brand-50 p-6 text-brand-600 shadow-inner">
          <ShieldCheck size={64} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Bem-vindo, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-4 max-w-md text-lg font-medium text-slate-500">
          Use o menu lateral para acessar as ferramentas permitidas para o seu cargo.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Layout size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Acesso Seguro</p>
              <p className="text-xs text-slate-500">Seu perfil possui permissões específicas definidas pela administração.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Suporte Interno</p>
              <p className="text-xs text-slate-500">Qualquer dúvida sobre seus acessos, entre em contato com o administrador.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let stats = {
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    recentOrders: [],
    topProducts: []
  };

  try {
    const res = await fetch(`${apiUrl}/admin/dashboard?days=${days}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (res.ok) {
      stats = await res.json();
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas do admin:", error);
  }

  const cards = [
    { title: "Faturamento", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pedidos", value: stats.orders.toString(), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Novos Clientes", value: stats.users.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Produtos Cadastrados", value: stats.products.toString(), icon: Package, color: "text-orange-600", bg: "bg-orange-100" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Visão geral do desempenho da loja.</p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-brand-100 bg-white p-1 shadow-sm overflow-x-auto">
          {[
            { label: "7 dias", value: "7" },
            { label: "30 dias", value: "30" },
            { label: "90 dias", value: "90" },
            { label: "Tudo", value: "all" }
          ].map((option) => (
            <Link
              key={option.value}
              href={`/admin?days=${option.value}`}
              className={`whitespace-nowrap px-4 py-2 text-sm font-bold rounded-lg transition-colors ${days === option.value
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-brand-50"
                }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.title}</p>
                <p className="text-2xl font-black text-slate-900">{card.value}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Últimos Pedidos */}
        <section className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 border-b border-brand-50 bg-brand-50/30 px-6 py-4">
            <Clock size={20} className="text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">Últimos Pedidos</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-brand-50/50 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">ID / Cliente</th>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="transition hover:bg-brand-50/30">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="line-clamp-1">{order.user?.name || "Cliente Excluído"}</div>
                        <div className="text-[10px] font-bold text-slate-400">#{order.id.slice(-6).toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${order.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                            order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                              order.status === "PAID" ? "bg-blue-100 text-blue-700" :
                                order.status === "CANCELED" ? "bg-red-100 text-red-700" :
                                  "bg-slate-100 text-slate-700"
                          }`}>
                          {translateOrderStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-slate-400">
                <Package size={32} className="mb-2 opacity-20" />
                <p>Nenhum pedido encontrado neste período.</p>
              </div>
            )}
          </div>
        </section>

        {/* Produtos Mais Vendidos */}
        <section className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 border-b border-brand-50 bg-brand-50/30 px-6 py-4">
            <TrendingUp size={20} className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">Mais Vendidos</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-brand-50/50 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Produto</th>
                    <th className="px-6 py-3 text-center">Unidades</th>
                    <th className="px-6 py-3 text-right">Receita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {stats.topProducts.map((product: any) => (
                    <tr key={product.id} className="transition hover:bg-brand-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-50 border border-brand-100">
                            <Image
                              src={getImageUrl(product.imageUrl)}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized={getImageUrl(product.imageUrl).includes("devtunnels.ms")}
                            />
                          </div>
                          <p className="font-bold text-slate-900 line-clamp-2">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-slate-600">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-green-600">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-slate-400">
                <TrendingUp size={32} className="mb-2 opacity-20" />
                <p>Nenhuma venda registrada neste período.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

