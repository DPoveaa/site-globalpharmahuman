"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  Star, Gift, Clock, 
  CheckCircle2, Copy, Ticket, AlertCircle,
  ChevronLeft, ChevronRight, ChevronDown, X
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

  // Estados para detecção de pedidos elegíveis
  const [orders, setOrders] = useState<any[]>([]);
  const [qualifyingProductIds, setQualifyingProductIds] = useState<string[]>([]);
  const [ruleMode, setRuleMode] = useState<"INCLUSION" | "EXCLUSION">("INCLUSION");
  const [eligibleOrders, setEligibleOrders] = useState<any[]>([]);

  // Estados para celebração de resgate de vale
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<any>(null);

  // Estados para origem (URL) e controle de cupons ativos/utilizados
  const [origin, setOrigin] = useState("");
  const [isVouchersModalOpen, setIsVouchersModalOpen] = useState(false);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);
  const [isUsedCouponsExpanded, setIsUsedCouponsExpanded] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchLoyalty();
  }, []);

  async function fetchLoyalty() {
    try {
      const [loyaltyRes, ordersRes, productsSettingRes, modeSettingRes] = await Promise.all([
        fetch("/api/user/loyalty"),
        fetch("/api/orders").catch(() => null),
        fetch("/api/catalog/settings/LOYALTY_QUALIFYING_PRODUCTS").catch(() => null),
        fetch("/api/catalog/settings/LOYALTY_RULE_MODE").catch(() => null)
      ]);

      let loyaltyData: LoyaltyData | null = null;
      if (loyaltyRes.ok) {
        loyaltyData = await loyaltyRes.json();
        setData(loyaltyData);
      }

      let ordersData: any[] = [];
      if (ordersRes && ordersRes.ok) {
        ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      let qProductIds: string[] = [];
      if (productsSettingRes && productsSettingRes.ok) {
        const setting = await productsSettingRes.json();
        if (setting?.value) qProductIds = JSON.parse(setting.value);
        setQualifyingProductIds(qProductIds);
      }

      let rMode: "INCLUSION" | "EXCLUSION" = "INCLUSION";
      if (modeSettingRes && modeSettingRes.ok) {
        const setting = await modeSettingRes.json();
        if (setting?.value) rMode = setting.value as "INCLUSION" | "EXCLUSION";
        setRuleMode(rMode);
      }

      // Calcula os pedidos pagos e elegíveis que ainda não foram resgatados
      if (loyaltyData && ordersData.length > 0) {
        const claimedOrderIds = new Set(
          loyaltyData.loyaltyTransactions
            .filter((tx: any) => tx.type === "EARN" && tx.externalOrderNumber)
            .map((tx: any) => tx.externalOrderNumber)
        );

        const eligible = ordersData.filter((order: any) => {
          // 1. Status deve ser Pago ou superior (PAID, PROCESSING, SHIPPED, DELIVERED)
          const isValidStatus = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status);
          if (!isValidStatus) return false;

          // 2. Não pode ter sido resgatado ainda
          if (claimedOrderIds.has(order.id)) return false;

          // 3. Deve possuir produto participante com base no modo da regra
          if (qProductIds.length > 0) {
            const hasMatchingProduct = order.items.some((item: any) => qProductIds.includes(item.productId));
            if (rMode === "INCLUSION") {
              return hasMatchingProduct;
            } else {
              // Exclusão: pelo menos um produto não excluído deve estar no pedido
              const hasStampGivingProduct = order.items.some((item: any) => !qProductIds.includes(item.productId));
              return hasStampGivingProduct;
            }
          }

          // Sem produtos configurados: qualquer pedido pago serve
          return true;
        });

        setEligibleOrders(eligible);
      }
    } catch (error) {
      console.error("Erro ao buscar fidelidade:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    await handleClaimOrder(orderNumber);
  }

  async function handleClaimOrder(codeOrId: string) {
    setSubmittingOrder(true);
    try {
      const res = await fetch("/api/user/loyalty/register-order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: codeOrId })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Selo resgatado com sucesso!");
        setOrderNumber("");
        
        if (result.couponGenerated) {
          setGeneratedCoupon(result.coupon);
          setIsCelebrationOpen(true);
        }
        
        fetchLoyalty();
      } else {
        toast.error(result.message || "Erro ao cadastrar pedido.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro de conexão com o servidor.");
    } finally {
      setSubmittingOrder(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Código copiado!");
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-400">Carregando dados de fidelidade...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Saldo de Selos e Cartão Integrado */}
      <section className="relative overflow-hidden rounded-[32px] bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20 md:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Meus Selos (Fórmulas)</p>
              {data?.stampsBalance === 5 ? (
                <p className="text-sm font-black text-amber-400 mt-1 animate-pulse">Você completou 5 selos! Seu vale foi gerado!</p>
              ) : (
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Você tem <strong className="text-white font-extrabold">{data?.stampsBalance || 0}</strong> de 5 selos. Faltam {5 - (data?.stampsBalance || 0)} para ganhar seu vale de 50%.
                </p>
              )}
            </div>
            
            {/* Visual dos Slots de Selo no Card Preto */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-2">
              {[1, 2, 3, 4, 5].map((slotIndex) => {
                const isFilled = slotIndex <= (data?.stampsBalance || 0);
                return (
                  <div
                    key={slotIndex}
                    className={`relative flex flex-col items-center justify-center h-16 w-16 rounded-2xl border-2 transition-all duration-500 ${
                      isFilled
                        ? "border-amber-400 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-105"
                        : "border-white/10 bg-white/5 text-white/20 border-dashed"
                    }`}
                  >
                    {isFilled ? (
                      <div className="relative animate-scale-in">
                        <Star size={24} fill="currentColor" className="text-slate-950" />
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-white mt-0.5">
                          {slotIndex}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Star size={20} className="text-white/25" />
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-white/40 mt-0.5">
                          {slotIndex}
                        </div>
                      </div>
                    )}
                    
                    {isFilled && (
                      <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-amber-400 text-[8px] font-black border border-amber-400 shadow-sm animate-scale-in">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Caixa Informativa */}
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 max-w-md shrink-0 lg:w-80 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-300">Como funciona?</p>
              <p className="text-xs font-medium mt-1.5 leading-relaxed text-slate-200">
                A cada fórmula manipulada, cadastre o número do pedido abaixo. Ao juntar 5 selos, você ganha automaticamente um vale de 50% de desconto na 6ª fórmula!
              </p>
            </div>
            <Link
              href="/catalogo?fidelidade=1"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 transition active:scale-95 shadow-lg shadow-amber-400/20 text-center cursor-pointer font-sans"
            >
              <Star size={14} fill="currentColor" />
              Ver Fórmulas Participantes
            </Link>
          </div>
        </div>

        {/* Efeito Visual */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Notificação de Pedidos com Selo Pendente */}
      {eligibleOrders.length > 0 && (
        <section className="rounded-[32px] border border-amber-200 bg-amber-50/10 p-6 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 animate-pulse">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">
                🎉 Selos Disponíveis para Resgate!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Identificamos {eligibleOrders.length} {eligibleOrders.length === 1 ? "pedido pago" : "pedidos pagos"} em sua conta com fórmulas válidas para pontuar no programa de fidelidade.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {eligibleOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl bg-white border border-amber-100 p-4 shadow-sm"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-black text-slate-900">
                    Pedido #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Total: {formatCurrency(Number(order.total))}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submittingOrder}
                  onClick={() => handleClaimOrder(order.id)}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white transition active:scale-95 disabled:opacity-50 shrink-0 shadow-sm font-sans cursor-pointer"
                >
                  {submittingOrder ? "Processando..." : "Resgatar Selo"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid de Cadastrar Pedido Manual e Vales */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Cadastrar Número do Pedido */}
        <section className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gift size={24} className="text-rose-500" /> Cadastrar Pedido Manualmente
          </h3>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 transition hover:shadow-lg">
            <p className="text-sm text-slate-500 mb-4">Se seu pedido não apareceu acima, digite o código dele para resgatar o selo.</p>
            <form onSubmit={handleRegisterOrder} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Ex: D2B4C12E ou #D2B4C12E"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={submittingOrder || !orderNumber.trim()}
                className="rounded-2xl bg-slate-900 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {submittingOrder ? "Cadastrando..." : "Cadastrar e Ganhar Selo"}
              </button>
            </form>
          </div>
        </section>

        {/* Meus Vales Resgatados */}
        <section className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Ticket size={24} className="text-amber-500" /> Meus Vales de 50%
          </h3>
          <div className="grid gap-6">
            {(() => {
              const activeCoupons = data?.loyaltyCoupons?.filter((coupon) => !coupon.isUsed) || [];
              const usedCoupons = data?.loyaltyCoupons?.filter((coupon) => coupon.isUsed) || [];

              return (
                <>
                  {/* Cupons Ativos */}
                  {activeCoupons.length === 0 ? (
                    <div className="rounded-[32px] border border-dashed border-slate-200 p-12 text-center bg-white">
                      <AlertCircle size={36} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400 font-black uppercase tracking-wider">Você ainda não possui vales ativos</p>
                      <p className="text-xs text-slate-400 mt-1">Acumule 5 selos para ganhar seu primeiro vale de desconto!</p>
                    </div>
                  ) : (
                    /* Apenas um botão limpo e responsivo para visualizar os vales ativos */
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 transition hover:shadow-lg flex flex-col justify-center items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentCouponIndex(0);
                          setIsVouchersModalOpen(true);
                        }}
                        className="w-full rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 py-4 px-6 text-sm font-black uppercase tracking-widest transition active:scale-95 shadow-lg shadow-amber-400/20 text-center cursor-pointer font-sans flex items-center justify-center gap-2"
                      >
                        <Ticket size={18} />
                        Visualizar Meus Vales ({activeCoupons.length})
                      </button>
                    </div>
                  )}

                  {/* Cupons Utilizados (Accordion) */}
                  {usedCoupons.length > 0 && (
                    <div className="mt-2 border border-slate-100 rounded-[32px] bg-white overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => setIsUsedCouponsExpanded(!isUsedCouponsExpanded)}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Ticket size={20} className="text-slate-400" />
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            Ver Cupons Utilizados / Histórico ({usedCoupons.length})
                          </span>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={`text-slate-400 transition-transform duration-300 ${isUsedCouponsExpanded ? "rotate-180" : ""}`} 
                        />
                      </button>
                      
                      {isUsedCouponsExpanded && (
                        <div className="p-6 pt-0 divide-y divide-slate-100 max-h-96 overflow-y-auto custom-scrollbar">
                          {usedCoupons.map((coupon) => (
                            <div
                              key={coupon.id}
                              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-60"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                    Utilizado
                                  </span>
                                  <span className="text-xs font-bold text-slate-400">
                                    Gerado em {new Date(coupon.createdAt).toLocaleDateString("pt-BR")}
                                  </span>
                                </div>
                                <h5 className="text-base font-black text-slate-800 mt-1.5">{coupon.code}</h5>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <span>Cupom utilizado no caixa ou checkout online</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
      </div>

      {/* Histórico de Selos */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock size={24} className="text-blue-500" /> Histórico de Selos
        </h3>
        <div className="rounded-[32px] border border-slate-100 bg-white overflow-hidden shadow-sm">
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

      {/* Celebração Modal Pop-up */}
      {isCelebrationOpen && generatedCoupon && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsCelebrationOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[36px] bg-slate-900 border border-slate-800 text-white shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col p-6 sm:p-8 text-center space-y-6">
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/20 shadow-xl shadow-amber-500/5 animate-bounce">
              <Star size={36} fill="currentColor" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-amber-400 uppercase tracking-tight">Parabéns!</h2>
              <h3 className="text-xl font-extrabold leading-tight">Você completou seu cartão de selos!</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Seu vale de 50% de desconto na sua próxima fórmula manipulada foi gerado com sucesso.
              </p>
            </div>

            {/* Visual do Voucher no Popup */}
            <div className="relative bg-white rounded-3xl p-5 text-slate-900 shadow-lg border border-amber-200/50 flex flex-col items-center animate-scale-in">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                Vale Disponível
              </span>
              <h4 className="text-xl font-black mt-2">Desconto de 50%</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Código: {generatedCoupon.code}</p>

              <div className="mt-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${origin}/validar-cupom?code=${generatedCoupon.code}`)}`}
                  alt="QR Code Vale"
                  className="h-28 w-28 object-contain"
                />
              </div>

              <span className="text-[9px] font-bold text-slate-400 mt-2">Apresente este QR Code no caixa</span>
            </div>

            <button
              onClick={() => setIsCelebrationOpen(false)}
              className="w-full rounded-2xl bg-amber-500 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-amber-600 active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Uau, Obrigado!
            </button>
          </div>
        </div>
      )}
      {/* Modal de Carrossel de Vales Ativos */}
      {isVouchersModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsVouchersModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[36px] bg-slate-900 border border-slate-800 text-white shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col p-6 sm:p-8 text-center space-y-6">
            
            {/* Glows */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            {(() => {
              const activeCoupons = data?.loyaltyCoupons?.filter((coupon) => !coupon.isUsed) || [];
              if (activeCoupons.length === 0) return <p className="text-sm text-slate-400">Nenhum cupom ativo.</p>;
              
              // Garante que o index esteja dentro dos limites
              const safeIndex = currentCouponIndex >= activeCoupons.length ? 0 : currentCouponIndex;
              const coupon = activeCoupons[safeIndex];

              return (
                <>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider">Meus Vales de 50%</h3>
                    <button 
                      type="button"
                      onClick={() => setIsVouchersModalOpen(false)}
                      className="p-1 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Slide/Card do Cupom Atual */}
                  <div className="relative bg-white rounded-3xl p-6 text-slate-900 shadow-lg border border-amber-200/50 flex flex-col items-center animate-scale-in">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      Vale Ativo
                    </span>
                    <h4 className="text-xl font-black mt-2">Desconto de 50%</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      Gerado em {new Date(coupon.createdAt).toLocaleDateString("pt-BR")}
                    </p>

                    <div className="mt-4 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/validar-cupom?code=${coupon.code}`)}`}
                        alt={`QR Code ${coupon.code}`}
                        className="h-36 w-36 object-contain"
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                      <code className="text-xs font-black tracking-wider text-slate-700">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title="Copiar código do vale"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-2">Apresente este QR Code no caixa</span>
                  </div>

                  {/* Controles de Navegação */}
                  {activeCoupons.length > 1 && (
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-1">
                      <button
                        type="button"
                        onClick={() => setCurrentCouponIndex(prev => (prev > 0 ? prev - 1 : activeCoupons.length - 1))}
                        className="p-2.5 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-xs font-black tracking-widest text-slate-300">
                        CUPOM {safeIndex + 1} DE {activeCoupons.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentCouponIndex(prev => (prev < activeCoupons.length - 1 ? prev + 1 : 0))}
                        className="p-2.5 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setIsVouchersModalOpen(false)}
                    className="w-full rounded-2xl bg-amber-500 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-amber-600 active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Fechar Vales
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
