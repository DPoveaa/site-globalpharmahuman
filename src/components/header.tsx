import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";
import { Search, ShoppingCart, User, HelpCircle, Heart } from "lucide-react";

export async function Header() {
  const session = await getServerSession(authOptions);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  let categories = [];
  try {
    const res = await fetch(`${apiUrl}/catalog/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      categories = (await res.json()).slice(0, 6);
    }
  } catch (error) {
    console.error("Erro ao buscar categorias no Header:", error);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white shadow-sm">
      {/* Top Bar: Logo, Search, User Actions */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 transition hover:opacity-80">
          <Image
            src="/gph_logo_extensa.png"
            alt={SITE_NAME}
            width={200}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 md:block max-w-2xl">
          <form action="/catalogo" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="O que você está buscando?"
              className="w-full rounded-full border border-brand-200 bg-brand-50/50 py-2.5 pl-5 pr-12 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-brand-500 shadow-sm transition hover:bg-brand-500 hover:text-white">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-5 text-brand-800">
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            {!session?.user ? (
              <>
                <Link href="/cadastro" className="hover:text-brand-500">Criar conta</Link>
                <span className="text-brand-200">|</span>
                <Link href="/login" className="hover:text-brand-500">Entrar</Link>
              </>
            ) : (
              <span className="text-brand-500">Olá, {session.user.name?.split(' ')[0]}</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/ajuda" className="transition hover:text-brand-500" title="Ajuda">
              <HelpCircle size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/favoritos" className="transition hover:text-brand-500" title="Favoritos">
              <Heart size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/carrinho" className="relative transition hover:text-brand-500" title="Carrinho">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">0</span>
            </Link>
            {session?.user && (
              <Link href="/conta" className="transition hover:text-brand-500" title="Minha Conta">
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="rounded-lg bg-brand-100 px-3 py-1 text-xs font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white">
                ADMIN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar: Categories */}
      <div className="border-t border-brand-50 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav className="flex items-center justify-center gap-8 py-3 text-xs font-bold uppercase tracking-widest text-brand-700">
            <Link href="/catalogo" className="transition hover:text-brand-500">Ver Todos</Link>
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                href={`/catalogo?categoria=${cat.slug}`} 
                className="transition hover:text-brand-500"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

