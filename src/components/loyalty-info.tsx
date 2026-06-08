"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  Star, Gift, Clock, 
  CheckCircle2, Copy, Ticket, AlertCircle 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type LoyaltyData = {
  stampsBalance: number;
  loyaltyTransactions: Array<{
    id: string;
    stamps: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
  loyaltyCoupons: Array<{
    id: string;
    code: string;
    isUsed: boolean;
    createdAt: string;
  }>;
};

export function LoyaltyInfo() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    fetchLoyalty();
  }, []);

  async function fetchLoyalty() {
    try {
      const res = await fetch("/api/user/loyalty");
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Erro ao buscar fidelidade:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    setSubmittingOrder(true);
    try {
      const res = await fetch("/api/user/loyalty/register-order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Pedido cadastrado com sucesso!");
        if (result.couponGenerated) {
          toast.success("Parabéns! Você ganhou um cupom de 50% de desconto!");
        }
        setOrderNumber("");
        fetchLoyalty();
      } else {
        toast.error(result.message || "Erro ao cadastrar pedido.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setSubmittingOrder(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Código copiado!");
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Carregando dados de fidelidade...</div>;

  return (
    <div className="space-y-8">
      {/* Saldo de Selos */}
      <section className="relative overflow-hidden rounded-[32px] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Meus Selos (Fórmulas Manipuladas)</p>
            <div className="flex items-center gap-3">
              <Star className="text-amber-400" fill="currentColor" size={32} />
              <h2 className="text-5xl font-black">{data?.stampsBalance || 0} / 5</h2>
            </div>
            {data?.stampsBalance === 5 && (
              <p className="text-sm font-black text-amber-400 mt-2">Você completou 5 selos! Ganhou um cupom!</p>
            )}
          </div>
          
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 max-w-sm">
            <p className="text-xs font-bold text-slate-300">Como funciona?</p>
            <p className="text-sm font-medium mt-1">A cada fórmula manipulada, cadastre o número do pedido abaixo. Ao juntar 5 selos, sua 6ª fórmula sai com 50% de desconto!</p>
          </div>
        </div>

        {/* Efeito Visual */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Cadastrar Número do Pedido */}
        <section className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gift size={24} className="text-rose-500" /> Cadastrar Pedido
          </h3>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 transition hover:shadow-lg">
            <p className="text-sm text-slate-500 mb-4">Insira o número do pedido da sua fórmula manipulada para ganhar um selo.</p>
            <form onSubmit={handleRegisterOrder} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Ex: 12345"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={submittingOrder || !orderNumber.trim()}
                className="rounded-2xl bg-slate-900 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {submittingOrder ? "Cadastrando..." : "Cadastrar e Ganhar Selo"}
              </button>
            </form>
          </div>
        </section>

        {/* Meus Cupons Resgatados */}
        <section className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Ticket size={24} className="text-amber-500" /> Meus Cupons
          </h3>
          <div className="grid gap-4">
            {!data?.loyaltyCoupons?.length ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 font-medium">Você ainda não possui cupons.</p>
              </div>
            ) : (
              data.loyaltyCoupons.map((coupon) => (
                <div key={coupon.id} className={`group rounded-3xl border p-5 transition-all ${coupon.isUsed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-amber-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Desconto de 50% na Fórmula</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-black tracking-wider">
                          {coupon.code}
                        </code>
                        {!coupon.isUsed && (
                          <button onClick={() => copyToClipboard(coupon.code)} className="text-slate-400 hover:text-slate-600 transition">
                            <Copy size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {coupon.isUsed ? (
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded">Utilizado</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-1 rounded animate-pulse">Disponível</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Histórico de Pontos */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock size={24} className="text-blue-500" /> Histórico de Selos
        </h3>
        <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-50">
            {!data?.loyaltyTransactions?.length ? (
              <div className="p-8 text-center text-slate-400">Nenhuma transação encontrada.</div>
            ) : (
              data.loyaltyTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tx.stamps > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.stamps > 0 ? <CheckCircle2 size={20} /> : <Gift size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${tx.stamps > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.stamps > 0 ? `+${tx.stamps} selo(s)` : `${tx.stamps} selo(s)`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
