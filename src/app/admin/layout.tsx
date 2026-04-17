import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr] md:px-8">
      <aside className="h-fit rounded-2xl border border-brand-100 bg-white p-4">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">Painel Admin</p>
        <nav className="space-y-2 text-sm">
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin">
            Dashboard
          </Link>
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin/produtos">
            Produtos
          </Link>
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin/promocoes">
            Promoções
          </Link>
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin/pedidos">
            Pedidos
          </Link>
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin/usuarios">
            Usuários
          </Link>
          <Link className="block rounded px-3 py-2 hover:bg-brand-50" href="/admin/configuracoes">
            Configurações
          </Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}

