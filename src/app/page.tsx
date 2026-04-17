import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { ShoppingBag, Zap, ShieldCheck, Truck, CreditCard, Shield, ChevronRight } from "lucide-react";
import { Carousel } from "@/components/carousel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const fetchOptions = { cache: "no-store" as RequestCache };

  const [categoriesRes, featuredRes, latestRes] = await Promise.all([
    fetch(`${apiUrl}/catalog/categories-with-products`, fetchOptions),
    fetch(`${apiUrl}/catalog/products/featured`, fetchOptions),
    fetch(`${apiUrl}/catalog/products/latest`, fetchOptions)
  ]);

  const categories = categoriesRes.ok ? await categoriesRes.json() : [];
  const featuredProducts = featuredRes.ok ? await featuredRes.json() : [];
  const latestProducts = latestRes.ok ? await latestRes.json() : [];

  const mapProduct = (p: any) => ({
    ...p,
    price: Number(p.price),
    promotion: p.promotion ? { ...p.promotion, value: Number(p.promotion.value) } : null
  });

  return (
    <div className="space-y-8 pb-16 pt-8">
      {/* Hero Carousel */}
      <Carousel />

      {/* Trust Badges / Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-brand-50/50 p-6 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left">
            <div className="rounded-2xl bg-white p-3 text-brand-600 shadow-sm">
              <Shield size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Compra Segura</p>
              <p className="text-[10px] font-medium text-brand-500">Seus dados protegidos</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left border-l border-brand-100 md:pl-8">
            <div className="rounded-2xl bg-white p-3 text-brand-600 shadow-sm">
              <Truck size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Frete Grátis</p>
              <p className="text-[10px] font-medium text-brand-500">Consulte sua região</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left border-l border-brand-100 md:pl-8">
            <div className="rounded-2xl bg-white p-3 text-brand-600 shadow-sm">
              <CreditCard size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Até 10x Sem Juros</p>
              <p className="text-[10px] font-medium text-brand-500">No cartão de crédito</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left border-l border-brand-100 md:pl-8">
            <div className="rounded-2xl bg-white p-3 text-brand-600 shadow-sm">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Entrega Express</p>
              <p className="text-[10px] font-medium text-brand-500">Receba hoje mesmo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section (Only for non-logged users) */}
      {!session?.user && (
        <section className="relative overflow-hidden bg-brand-900 py-16 text-white md:py-20 rounded-3xl mx-4 md:mx-8">
          <div className="mx-auto max-w-7xl px-8 md:px-12">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
                  Seja bem-vindo à <span className="text-accent-400">Global Pharma Human</span>
                </h2>
                <p className="max-w-lg text-lg text-brand-200">
                  Cadastre-se para ter acesso a ofertas exclusivas, histórico de pedidos e atendimento personalizado.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/cadastro"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-accent-600 active:scale-95"
                  >
                    Criar minha conta agora
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="relative z-10 aspect-square overflow-hidden rounded-3xl bg-brand-800/30 backdrop-blur-sm">
                  <Image
                    src="/gph_logo.png"
                    alt="Global Pharma Human"
                    fill
                    className="object-contain p-12 opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promoções */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between border-b border-brand-50 pb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Ofertas Imperdíveis</p>
              <h2 className="text-3xl font-extrabold text-brand-900">Em Destaque</h2>
            </div>
            <Link href="/catalogo" className="group flex items-center gap-1 text-sm font-bold text-brand-600 transition hover:text-brand-900">
              Ver tudo <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={mapProduct(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Categorias Populares */}
      {categories.map(cat => cat.products.length > 0 && (
        <section key={cat.id} className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between border-b border-brand-50 pb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Pensou em {cat.name.split(' ')[0]}:</p>
              <h2 className="text-3xl font-extrabold text-brand-900">{cat.name}</h2>
            </div>
            <Link href={`/catalogo?categoria=${cat.slug}`} className="group flex items-center gap-1 text-sm font-bold text-brand-600 transition hover:text-brand-900">
              Explorar categoria <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cat.products.map(p => (
              <ProductCard key={p.id} product={mapProduct(p)} />
            ))}
          </div>
        </section>
      ))}

      {/* Últimos Produtos */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-end justify-between border-b border-brand-50 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Novidades Fresquinhas</p>
            <h2 className="text-3xl font-extrabold text-brand-900">Lançamentos</h2>
          </div>
          <Link href="/catalogo" className="group flex items-center gap-1 text-sm font-bold text-brand-600 transition hover:text-brand-900">
            Catálogo completo <ChevronRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestProducts.map(p => (
            <ProductCard key={p.id} product={mapProduct(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}

