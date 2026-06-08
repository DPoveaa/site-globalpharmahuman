"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock, Copy, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

type OrderDetail = {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  paymentUrl?: string;
};

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshCart } = useCart();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [canceling, setCanceling] = useState(false);

  async function handleCancelAndRestore() {
    if (!orderId) return;

    setCanceling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel-and-restore`, {
        method: "POST"
      });

      if (res.ok) {
        toast.success("Pedido cancelado com sucesso!");
        await refreshCart();
        router.push("/carrinho");
      } else {
        const data = await res.json();
        toast.error(data.message || "Erro ao cancelar o pedido.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setCanceling(false);
    }
  }

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setLoading(false);

          // Stop polling if order is paid or canceled
          if (data.status === "PAID" || data.status === "CANCELED") {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrder();

    // Poll every 5 seconds
    intervalId = setInterval(fetchOrder, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, router]);

  const copyToClipboard = () => {
    if (!order?.pixCopyPaste) return;
    navigator.clipboard.writeText(order.pixCopyPaste);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        <p className="mt-4 font-bold text-slate-700">Carregando detalhes do seu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Pedido não encontrado</h1>
        <p className="mt-2 text-slate-600">Não conseguimos localizar o pedido informado.</p>
        <Link href="/" className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white shadow-lg">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const isPaid = order.status === "PAID";
  const isPix = order.paymentMethod === "PIX";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {isPaid ? (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-xl shadow-green-100">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-green-600">Pagamento Confirmado</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Muito obrigado!</h1>
            <p className="mt-4 text-slate-600">
              Seu pedido <span className="font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</span> foi pago com sucesso e já está sendo preparado para entrega.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between border-b border-brand-50 pb-4 text-sm font-bold text-slate-500">
              <span>Método de Pagamento</span>
              <span className="text-slate-900">{isPix ? "Pix" : "Cartão de Crédito"}</span>
            </div>
            <div className="flex justify-between pt-4 text-lg font-black text-slate-900">
              <span>Valor Pago</span>
              <span className="text-brand-600">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/conta"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-900 px-8 py-3.5 font-black uppercase tracking-wider text-white shadow-lg hover:bg-brand-950 transition active:scale-95"
            >
              Meus Pedidos
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/catalogo"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-8 py-3.5 font-black uppercase tracking-wider text-slate-700 hover:bg-slate-200 transition active:scale-95"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {isPix ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Clock size={40} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Aguardando Pagamento</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">Finalize o pagamento via Pix</h1>
                <p className="mt-2 text-slate-600">
                  Seu pedido <span className="font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</span> foi reservado. Pague o Pix abaixo para confirmar.
                </p>
              </div>

              {/* QR Code and Copy/Paste code */}
              <div className="mx-auto max-w-sm rounded-[32px] border border-brand-100 bg-white p-6 shadow-xl space-y-4">
                {/* Passo a Passo Informativo */}
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left">
                  <p className="text-xs font-black text-amber-900 uppercase tracking-wider">Como Pagar:</p>
                  <ol className="mt-2 list-decimal list-inside text-xs text-amber-800 space-y-1.5 font-medium">
                    <li>Abra o aplicativo do seu <strong>banco</strong> no celular.</li>
                    <li>Acesse a área <strong>Pix</strong> e selecione a opção <strong>Ler QR Code</strong>.</li>
                    <li>Aponte a câmera para o QR Code abaixo.</li>
                  </ol>
                </div>

                {order.pixQrCode && (
                  <div className="mx-auto relative h-64 w-64 overflow-hidden rounded-2xl border-4 border-slate-50 bg-white p-2 shadow-inner">
                    <img
                      src={`data:image/png;base64,${order.pixQrCode}`}
                      alt="Pix QR Code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Ou copie o código copia e cola:</p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-brand-100 bg-slate-50 p-2.5">
                    <input
                      readOnly
                      value={order.pixCopyPaste || ""}
                      className="w-full bg-transparent text-xs text-slate-600 outline-none select-all"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white transition hover:bg-brand-950 active:scale-90"
                      title="Copiar Código"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="mt-2.5 text-[10px] text-slate-400 font-medium leading-relaxed">
                    Copie o código acima e cole na opção <strong>Pix Copia e Cola</strong> do seu aplicativo bancário.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCancelAndRestore}
                  disabled={canceling}
                  className="mx-auto max-w-sm w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-700 transition active:scale-95 disabled:opacity-50"
                >
                  {canceling ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <span>Cancelar e Voltar ao Carrinho</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="animate-spin text-brand-600" size={18} />
                <span className="text-sm font-bold text-slate-600">Identificando pagamento automaticamente...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Loader2 size={40} className="animate-spin" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Aguardando Autorização</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">Processando seu cartão</h1>
                <p className="mt-2 text-slate-600">
                  Estamos aguardando a resposta da operadora do cartão para o pedido <span className="font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</span>.
                </p>
              </div>
            </div>
          )}

          <div className="my-8 h-px bg-brand-50" />

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Valor Total</span>
              <span className="text-slate-900 font-black">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/conta"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-900 px-8 py-3.5 font-black uppercase tracking-wider text-white shadow-lg hover:bg-brand-950 transition active:scale-95"
            >
              Ver Pedidos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        <p className="mt-4 font-bold text-slate-700">Carregando...</p>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
