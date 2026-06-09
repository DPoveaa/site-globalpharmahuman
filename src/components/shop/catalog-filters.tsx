"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("categoria") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [promotions, setPromotions] = useState(searchParams.get("promocoes") === "1");
  const [fidelidade, setFidelidade] = useState(searchParams.get("fidelidade") === "1");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("categoria", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (promotions) params.set("promocoes", "1");
    if (fidelidade) params.set("fidelidade", "1");

    router.push(`/catalogo?${params.toString()}`);
  }, [q, category, minPrice, maxPrice, sort, promotions, fidelidade, router]);

  const clearFilters = () => {
    setQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPromotions(false);
    setFidelidade(false);
    router.push("/catalogo");
  };

  // Sync state with URL when it changes (back/forward buttons)
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setCategory(searchParams.get("categoria") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "newest");
    setPromotions(searchParams.get("promocoes") === "1");
    setFidelidade(searchParams.get("fidelidade") === "1");
  }, [searchParams]);

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="h-14 w-full rounded-2xl border border-brand-100 bg-white pl-12 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Mobile Toggle & Desktop Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex h-14 items-center gap-2 rounded-2xl border px-6 text-sm font-black uppercase tracking-widest transition active:scale-95 ${isOpen || searchParams.toString()
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-brand-100 bg-white text-slate-600 hover:bg-brand-50"
              }`}
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>

          <button
            onClick={applyFilters}
            className="flex h-14 items-center gap-2 rounded-2xl bg-brand-900 px-8 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-950 active:scale-95 shadow-lg shadow-brand-900/20"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Expanded Filters Drawer/Panel */}
      {isOpen && (
        <div className="mt-6 grid gap-6 rounded-[32px] border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoria</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-brand-50 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 focus:bg-white transition"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Faixa de Preço (R$)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-brand-50 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 focus:bg-white transition"
                />
                <span className="text-slate-300">/</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-brand-50 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ordenar por</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-brand-50 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 focus:bg-white transition"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="oldest">Mais antigos</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opções Especiais</label>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-50 bg-slate-50 px-4 py-2.5 transition hover:bg-white hover:border-brand-500">
                  <input
                    type="checkbox"
                    checked={promotions}
                    onChange={(e) => setPromotions(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-brand-200 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Somente Promoções</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-50 bg-slate-50 px-4 py-2.5 transition hover:bg-white hover:border-brand-500">
                  <input
                    type="checkbox"
                    checked={fidelidade}
                    onChange={(e) => setFidelidade(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-brand-200 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Acumulam Selos</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
