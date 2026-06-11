"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Star, Plus, Search,
  CheckCircle2, Ticket, Users, AlertCircle, Copy, X, Settings, Check
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

  const [products, setProducts] = useState<{ id: string; name: string; sku: string }[]>([]);
  const [qualifyingProductIds, setQualifyingProductIds] = useState<string[]>([]);
  const [tempProductIds, setTempProductIds] = useState<string[]>([]);
  const [ruleMode, setRuleMode] = useState<"INCLUSION" | "EXCLUSION">("INCLUSION");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  useEffect(() => {
    fetchCoupons();
    fetchProductsAndSettings();
  }, []);

  useEffect(() => {
    if (isProductModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isProductModalOpen]);

  async function fetchProductsAndSettings() {
    try {
      const [productsRes, settingsRes, ruleModeRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/catalog/settings/LOYALTY_QUALIFYING_PRODUCTS").catch(() => null),
        fetch("/api/catalog/settings/LOYALTY_RULE_MODE").catch(() => null)
      ]);

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(prodData.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku })));
      }

      if (settingsRes && settingsRes.ok) {
        const setting = await settingsRes.json();
        if (setting?.value) {
          setQualifyingProductIds(JSON.parse(setting.value));
        }
      }

      if (ruleModeRes && ruleModeRes.ok) {
        const modeSetting = await ruleModeRes.json();
        if (modeSetting?.value) {
          setRuleMode(modeSetting.value as "INCLUSION" | "EXCLUSION");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar produtos e configurações:", error);
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "LOYALTY_RULE_MODE",
          value: ruleMode
        })
      });

      if (res.ok) {
        toast.success("Modo de operação da regra salvo com sucesso!");
      } else {
        toast.error("Erro ao salvar modo da regra.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setSavingSettings(false);
    }
  }

  const handleExportSKUs = () => {
    try {
      const skus = qualifyingProductIds
        .map((id) => {
          const prod = products.find((p) => p.id === id);
          return prod?.sku;
        })
        .filter(Boolean);

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(skus, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `fidelidade_skus_${ruleMode.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Lista de SKUs exportada com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar SKUs.");
    }
  };

  const handleImportSKUs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let skus: string[] = [];

        try {
          skus = JSON.parse(text);
        } catch {
          skus = text
            .split(/[\n,;]/)
            .map((s) => s.trim())
            .filter(Boolean);
        }

        if (!Array.isArray(skus)) {
          toast.error("Formato inválido. O arquivo deve ser um JSON array ou texto com SKUs separados por vírgula/linha.");
          return;
        }

        const matchedIds: string[] = [];
        const missingSkus: string[] = [];

        skus.forEach((sku) => {
          const cleanSku = sku.trim();
          if (!cleanSku) return;
          const prod = products.find((p) => p.sku.toLowerCase() === cleanSku.toLowerCase());
          if (prod) {
            matchedIds.push(prod.id);
          } else {
            missingSkus.push(cleanSku);
          }
        });

        if (matchedIds.length === 0) {
          toast.error("Nenhum SKU do arquivo corresponde aos produtos cadastrados no sistema.");
          return;
        }

        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "LOYALTY_QUALIFYING_PRODUCTS",
            value: JSON.stringify(matchedIds)
          })
        });

        if (res.ok) {
          setQualifyingProductIds(matchedIds);
          if (missingSkus.length > 0) {
            toast.success(`Importação parcial: ${matchedIds.length} produtos carregados. ${missingSkus.length} SKUs não encontrados: ${missingSkus.slice(0, 5).join(", ")}${missingSkus.length > 5 ? "..." : ""}`, { duration: 6000 });
          } else {
            toast.success(`Importação concluída! ${matchedIds.length} produtos adicionados.`);
          }
        } else {
          toast.error("Erro ao salvar as configurações no servidor.");
        }
      } catch (error) {
        toast.error("Erro ao processar o arquivo.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

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
          toast.success("O cliente completou 5 selos e ganhou um vale de 50%!");
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
        toast.success("Vale de 50% validado e utilizado com sucesso!");
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 shadow-sm">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fidelidade e Selos</h1>
            <p className="text-sm font-medium text-slate-500">Gerencie regras de pontuação de selos, vales de 50% e relatórios.</p>
          </div>
        </div>
      </div>

      {/* Regras e Configuração do Programa */}
      <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6 md:p-8">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Configuração de Elegibilidade</h2>
            <p className="text-xs text-slate-500 mt-0.5">Determine como o sistema analisa as fórmulas nos pedidos para dar os selos.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Seleção do Modo de Regra */}
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Modo de Operação</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRuleMode("INCLUSION")}
                  className={`flex flex-col items-start gap-2 rounded-2xl p-4 border text-left transition-all ${ruleMode === "INCLUSION"
                      ? "border-amber-500 bg-amber-50/20 shadow-sm ring-2 ring-amber-500/20"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    }`}
                >
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${ruleMode === "INCLUSION" ? "border-amber-500 text-amber-500" : "border-slate-300"
                    }`}>
                    {ruleMode === "INCLUSION" && <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Lista de Inclusão</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal">
                      O pedido ganha 1 selo se tiver pelo menos um produto selecionado.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRuleMode("EXCLUSION")}
                  className={`flex flex-col items-start gap-2 rounded-2xl p-4 border text-left transition-all ${ruleMode === "EXCLUSION"
                      ? "border-amber-500 bg-amber-50/20 shadow-sm ring-2 ring-amber-500/20"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    }`}
                >
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${ruleMode === "EXCLUSION" ? "border-amber-500 text-amber-500" : "border-slate-300"
                    }`}>
                    {ruleMode === "EXCLUSION" && <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Lista de Exclusão</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal">
                      O pedido ganha 1 selo se tiver pelo menos um produto não excluído.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed space-y-1">
              <p className="font-bold text-slate-800">Resumo da Regra Ativa:</p>
              {ruleMode === "INCLUSION" ? (
                <p>O cliente ganha 1 selo por pedido que contenha pelo menos um dos produtos marcados na lista.</p>
              ) : (
                <p>O cliente ganha 1 selo por pedido com qualquer produto, a menos que o pedido contenha apenas produtos excluídos.</p>
              )}
              {qualifyingProductIds.length === 0 && (
                <p className="text-amber-600 font-bold mt-1">
                  ⚠️ Nenhum produto configurado. Todos os produtos pontuarão por padrão.
                </p>
              )}
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              {savingSettings ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

          {/* Gerenciador de Produtos e Lista */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                {ruleMode === "INCLUSION" ? "Produtos Elegíveis" : "Produtos Excluídos"} ({qualifyingProductIds.length})
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSKUs}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition shadow-sm cursor-pointer font-sans"
                  title="Exportar lista de SKUs em formato JSON"
                >
                  Exportar
                </button>
                <label className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition shadow-sm cursor-pointer font-sans">
                  Importar
                  <input
                    type="file"
                    accept=".json,.txt"
                    onChange={handleImportSKUs}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTempProductIds([...qualifyingProductIds]);
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm cursor-pointer"
                >
                  <Plus size={14} className="text-amber-500" />
                  Gerenciar Lista
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-3xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 min-h-[140px] custom-scrollbar">
              {qualifyingProductIds.map((id) => {
                const prod = products.find((p) => p.id === id);
                return (
                  <div key={id} className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-slate-800">{prod ? prod.name : "Produto Removido / Carregando..."}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {prod?.sku || "---"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const updatedList = qualifyingProductIds.filter((item) => item !== id);
                        try {
                          const res = await fetch("/api/admin/settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              key: "LOYALTY_QUALIFYING_PRODUCTS",
                              value: JSON.stringify(updatedList)
                            })
                          });
                          if (res.ok) {
                            setQualifyingProductIds(updatedList);
                            toast.success("Fórmula removida com sucesso!");
                          } else {
                            toast.error("Erro ao remover fórmula da regra.");
                          }
                        } catch {
                          toast.error("Erro de conexão ao remover fórmula.");
                        }
                      }}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer shrink-0"
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
              {qualifyingProductIds.length === 0 && (
                <div className="text-center text-xs text-slate-400 italic py-10">
                  Nenhum produto adicionado. Clique em "Gerenciar Lista" acima para configurar.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Operações */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Dar Selo Manual */}
        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
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

        {/* Validar Vale de 50% */}
        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm border-amber-200 bg-amber-50/10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Ticket size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900">Validar Vale de 50%</h2>
            </div>

            <form onSubmit={handleValidateCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">Código do Vale / Leitor QR</label>
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
                {validating ? "Validando..." : <><CheckCircle2 size={18} /> Validar e Dar Desconto</>}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Lista de Vales de 50% Gerados */}
      <section>
        <div className="rounded-[32px] border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="font-black text-slate-900 flex items-center gap-2">
              <Ticket size={20} className="text-amber-500" /> Todos os Vales Gerados (50%)
            </h2>
            <span className="text-xs font-bold bg-white text-slate-500 px-3 py-1 rounded-full border border-slate-200">
              {coupons.length} vales
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse">Carregando vales...</div>
            ) : coupons.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Nenhum vale gerado ainda.</div>
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

      {/* Modal Seletor de Produtos */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsProductModalOpen(false)}
          />

          {/* Modal Body */}
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-2xl animate-scale-in flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>📦 Gerenciar Fórmulas da Regra</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Marque as fórmulas que definem se o pedido é elegível para 1 selo na lista de {ruleMode === "INCLUSION" ? "inclusão" : "exclusão"}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="rounded-full bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 shadow-sm border border-slate-100 transition animate-scale-in"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produto por nome ou SKU..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-amber-500 focus:bg-white transition"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </div>
              </div>
              {productSearchQuery && (
                <button
                  type="button"
                  onClick={() => setProductSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold shrink-0"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30 max-h-[45vh] custom-scrollbar">
              {(() => {
                const filtered = products.filter(p =>
                  p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                  p.sku.toLowerCase().includes(productSearchQuery.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center text-slate-400 text-xs italic">
                      Nenhum produto correspondente encontrado.
                    </div>
                  );
                }

                return filtered.map((p) => {
                  const isChecked = tempProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setTempProductIds(tempProductIds.filter(id => id !== p.id));
                        } else {
                          setTempProductIds([...tempProductIds, p.id]);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl bg-white border transition-all duration-300 text-left group ${isChecked
                          ? "border-amber-500 bg-amber-50/10 shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                        }`}
                    >
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className={`font-bold transition-colors ${isChecked ? "text-amber-800" : "text-slate-800"}`}>
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
                          SKU: {p.sku}
                        </span>
                      </div>
                      <div className="flex items-center shrink-0">
                        {isChecked ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-slate-200 bg-white group-hover:border-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
              <span className="text-xs font-bold text-slate-500">
                {tempProductIds.length} selecionado(s)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/admin/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          key: "LOYALTY_QUALIFYING_PRODUCTS",
                          value: JSON.stringify(tempProductIds)
                        })
                      });
                      if (res.ok) {
                        setQualifyingProductIds(tempProductIds);
                        setIsProductModalOpen(false);
                        toast.success("Lista de fórmulas atualizada com sucesso!");
                      } else {
                        toast.error("Erro ao salvar fórmulas da regra.");
                      }
                    } catch {
                      toast.error("Erro de conexão ao salvar fórmulas.");
                    }
                  }}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 transition"
                >
                  Confirmar Seleção
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
