"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, 
  Calendar, ShoppingBag, ArrowLeft, Loader2, Sparkles
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type CouponDetails = {
  code: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  user: {
    name: string;
    cpf: string;
    email: string;
  };
  contributionHistory: Array<{
    id: string;
    description: string;
    createdAt: string;
    order: {
      id: string;
      createdAt: string;
      total: number;
      items: Array<{
        id: string;
        productName: string;
        sku: string | null;
        quantity: number;
      }>;
    } | null;
  }>;
};

export default function ValidarCupomPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [coupon, setCoupon] = useState<CouponDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // States for "Hold to Consume" button
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [consuming, setConsuming] = useState(false);
  
  const isPressingRef = useRef(false);
  isPressingRef.current = isPressing;

  useEffect(() => {
    if (code) {
      fetchCouponDetails();
    } else {
      setLoading(false);
      setErrorMsg("Nenhum código de cupom foi fornecido.");
    }
  }, [code]);

  // Smooth progress animation loop
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds to complete
    const startProgress = progress;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (isPressing) {
        // Grow progress
        const nextProgress = Math.min(100, startProgress + (elapsed / duration) * 100);
        setProgress(nextProgress);
        if (nextProgress < 100) {
          animId = requestAnimationFrame(tick);
        } else {
          // Reached 100%
          setIsPressing(false);
          handleConsume();
        }
      } else {
        // Decline progress smoothly to 0 in 300ms
        const shrinkDuration = 300;
        const nextProgress = Math.max(0, startProgress - (elapsed / shrinkDuration) * startProgress);
        setProgress(nextProgress);
        if (nextProgress > 0) {
          animId = requestAnimationFrame(tick);
        }
      }
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isPressing]);

  async function fetchCouponDetails() {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/public/coupon-details/${code}`);
      const data = await res.json();
      
      if (res.ok) {
        setCoupon(data);
      } else {
        setErrorMsg(data.message || "Não foi possível carregar os detalhes do cupom.");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do cupom:", error);
      setErrorMsg("Erro de conexão ao buscar os detalhes do cupom.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConsume() {
    if (!code || consuming || coupon?.isUsed) return;

    // Double Confirmation
    const confirmUse = window.confirm(
      `ATENÇÃO: Você deseja marcar o cupom ${code} como UTILIZADO?\n\nEsta ação descontará o benefício física/presencialmente e não poderá ser desfeita.`
    );

    if (!confirmUse) {
      setProgress(0);
      return;
    }

    setConsuming(true);
    try {
      const res = await fetch("/api/public/consume-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Cupom consumido com sucesso!");
        fetchCouponDetails(); // Reload details to reflect "Used" state
      } else {
        toast.error(result.message || "Erro ao consumir cupom.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao conectar com o servidor.");
    } finally {
      setConsuming(false);
      setProgress(0);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-slate-600" />
        <p className="mt-4 font-bold text-slate-900">Consultando veracidade do cupom...</p>
      </div>
    );
  }

  if (errorMsg || !coupon) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100 shadow-sm mb-6">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Validação Recusada</h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {errorMsg || "Cupom inválido ou inexistente em nosso sistema de fidelidade."}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-lg active:scale-95"
          >
            <ArrowLeft size={14} /> Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Voltar */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={14} /> Voltar para o site
        </Link>
      </div>

      {/* Card Principal de Validação */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-2xl shadow-slate-900/5">
        
        {/* Glows de background */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        {/* Cabeçalho do Cupom */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 space-y-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg border ${
            coupon.isUsed 
              ? "bg-slate-100 text-slate-400 border-slate-200" 
              : "bg-emerald-500 text-white border-emerald-400 animate-pulse"
          }`}>
            {coupon.isUsed ? <AlertTriangle size={32} /> : <ShieldCheck size={32} />}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Autenticidade de Fidelidade</span>
            <h1 className="text-3xl font-black text-slate-900">{coupon.code}</h1>
            <p className="text-xs text-slate-400 font-semibold">
              Gerado em {new Date(coupon.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>

          {/* Badge de Status */}
          <div className="pt-2">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              coupon.isUsed 
                ? "bg-rose-50 text-rose-600 border border-rose-100" 
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              <span className={`h-2 w-2 rounded-full ${coupon.isUsed ? "bg-rose-600" : "bg-emerald-600 animate-ping"}`} />
              {coupon.isUsed ? "Cupom Utilizado / Consumido" : "Cupom Ativo / Disponível"}
            </span>
          </div>

          {coupon.isUsed && coupon.usedAt && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-xl mt-2">
              Consumido em: {new Date(coupon.usedAt).toLocaleString("pt-BR")}
            </p>
          )}
        </div>

        {/* Detalhes do Cliente */}
        <div className="py-6 border-b border-slate-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" /> Beneficiário do Cupom
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Nome do Cliente</p>
              <p className="text-sm font-bold text-slate-800 truncate">{coupon.user.name}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">CPF</p>
              <p className="text-sm font-bold text-slate-800">{coupon.user.cpf}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">E-mail</p>
              <p className="text-sm font-bold text-slate-800 truncate">{coupon.user.email}</p>
            </div>
          </div>
        </div>

        {/* Histórico que Gerou os Selos */}
        <div className="py-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <ShoppingBag size={14} className="text-blue-500" /> Histórico de Fórmulas e Pedidos
          </h3>
          
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
            {coupon.contributionHistory.map((tx) => (
              <div key={tx.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {tx.order && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
                      Pedido #{tx.order.id.slice(-8).toUpperCase()}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-700">{tx.description}</p>

                {tx.order && (
                  <div className="pl-4 border-l-2 border-slate-200 mt-2 space-y-1.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Produtos do Pedido:</p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {tx.order.items.map((item) => (
                        <li key={item.id} className="flex justify-between font-medium">
                          <span>{item.quantity}x {item.productName}</span>
                          {item.sku && <span className="text-[10px] text-slate-400">SKU: {item.sku}</span>}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[10px] font-bold text-slate-500 text-right mt-1">
                      Total Pedido: {formatCurrency(Number(tx.order.total))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Consumo (Presencial) */}
        {!coupon.isUsed && (
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest leading-relaxed">
              Uso Presencial: clique e segure o botão abaixo para resgatar
            </p>

            <button
              type="button"
              disabled={consuming}
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              className="relative overflow-hidden w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold transition-all duration-300 shadow-xl text-center select-none active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {/* Background Progress Filler */}
              <div 
                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />

              {/* Progress Text Content */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
                {consuming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                  </>
                ) : isPressing ? (
                  `Segure para Utilizar (${Math.round(progress)}%)`
                ) : (
                  "Pressione e Segure para Utilizar"
                )}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
