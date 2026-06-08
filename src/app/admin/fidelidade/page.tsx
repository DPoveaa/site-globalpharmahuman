"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Star, Plus, Search,
  CheckCircle2, Ticket, Users, AlertCircle, Copy
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Coupon = {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: string;
  usedAt: string | null;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminLoyaltyPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [givingStamp, setGivingStamp] = useState(false);

  const [stampIdentifier, setStampIdentifier] = useState("");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/loyalty/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch (error) {
      toast.error("Erro ao carregar cupons.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGiveStamp(e: React.FormEvent) {
    e.preventDefault();
    if (!stampIdentifier.trim()) return;

    setGivingStamp(true);
    try {
      const res = await fetch("/api/admin/loyalty/give-stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: stampIdentifier })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (data.couponGenerated) {
          toast.success("O cliente ganhou um cupom!");
          fetchCoupons();
        }
        setStampIdentifier("");
      } else {
        toast.error(data.message || "Erro ao dar selo.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setGivingStamp(false);
    }
  }

  async function handleValidateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidating(true);
    try {
      const res = await fetch("/api/admin/loyalty/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setCouponCode("");
        fetchCoupons();
      } else {
        toast.error(data.message || "Erro ao validar cupom.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 shadow-sm">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sistema de Selos</h1>
            <p className="text-sm font-medium text-slate-500">Gerencie selos manuais e valide cupons de desconto.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Dar Selo Manual */}
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900">Dar Selo Manualmente</h2>
            </div>

            <form onSubmit={handleGiveStamp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">Identificador do Cliente</label>
                <input
                  type="text"
                  placeholder="CPF, E-mail ou Telefone"
                  value={stampIdentifier}
                  onChange={(e) => setStampIdentifier(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
                <p className="text-[11px] text-slate-400 px-1 italic">
                  Busque o cliente para dar um selo extra.
                </p>
              </div>

              <button
                type="submit"
                disabled={givingStamp}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
              >
                {givingStamp ? "Adicionando..." : <><Plus size={18} /> Adicionar Selo</>}
              </button>
            </form>
          </div>
        </section>

        {/* Validar Cupom */}
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm border-amber-200 bg-amber-50/10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Ticket size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900">Validar Cupom de 50%</h2>
            </div>

            <form onSubmit={handleValidateCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">Código do Cupom</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: SELO-1234AB"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold focus:border-amber-500 outline-none transition-all"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={16} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={validating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 text-sm font-bold text-white transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {validating ? "Validando..." : <><CheckCircle2 size={18} /> Validar e Usar Cupom</>}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Lista de Cupons Gerados */}
      <section>
        <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="font-black text-slate-900 flex items-center gap-2">
              <Ticket size={20} className="text-blue-500" /> Todos os Cupons Gerados
            </h2>
            <span className="text-xs font-bold bg-white text-slate-500 px-3 py-1 rounded-full border border-slate-200">
              {coupons.length} cupons
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse">Carregando cupons...</div>
            ) : coupons.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Nenhum cupom gerado ainda.</div>
            ) : (
              coupons.map((coupon, idx) => (
                <div key={coupon.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${coupon.isUsed ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-600'}`}>
                      <Ticket size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{coupon.user.name}</h3>
                      <p className="text-xs text-slate-500">{coupon.user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-black tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {coupon.code}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="text-right">
                      {coupon.isUsed ? (
                        <>
                          <span className="inline-block text-[10px] font-black uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded mb-1">
                            Utilizado
                          </span>
                          {coupon.usedAt && <p className="text-[10px] text-slate-400">Em: {new Date(coupon.usedAt).toLocaleDateString("pt-BR")}</p>}
                        </>
                      ) : (
                        <span className="inline-block text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-1 rounded">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
