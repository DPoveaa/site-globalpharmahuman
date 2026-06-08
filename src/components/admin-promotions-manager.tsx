"use client";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/toast";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Power, PowerOff, Percent, Tag, Calendar, Clock, ChevronUp, ChevronDown } from "lucide-react";

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
  products?: { id: string; name: string }[];
};

type Product = {
  id: string;
  name: string;
};

type Props = {
  promotions: Promotion[];
  products: Product[];
};

export function AdminPromotionsManager({ promotions, products }: Props) {
  const [loading, setLoading] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const isExpired = (endsAt: string) => new Date(endsAt) < new Date();

  // Quando entrar em modo de edição, preenche os produtos selecionados
  useEffect(() => {
    if (editingPromotion) {
      const ids = editingPromotion.products?.map(p => p.id) || [];
      setSelectedProductIds(ids);
      setIsFormExpanded(true);
    } else {
      setSelectedProductIds([]);
    }
  }, [editingPromotion]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const endsAt = new Date(String(formData.get("endsAt"))).toISOString();
    
    // Se a promoção estava expirada e o admin tentou salvar, validamos se a nova data é futura
    if (new Date(endsAt) < new Date()) {
      toast.error("A data de término deve ser no futuro para ativar a promoção.");
      setLoading(false);
      return;
    }

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      type: String(formData.get("type") ?? "PERCENT"),
      value: Number(formData.get("value") ?? 0),
      startsAt: new Date(String(formData.get("startsAt"))).toISOString(),
      endsAt,
      active: editingPromotion ? editingPromotion.active : true,
      productIds: selectedProductIds
    };

    const url = editingPromotion 
      ? `/api/admin/promotions?id=${editingPromotion.id}` 
      : "/api/admin/promotions";
    const method = editingPromotion ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message ?? "Erro ao salvar promoção.");
      } else {
        setEditingPromotion(null);
        setSelectedProductIds([]);
        setIsFormExpanded(false);
        if (formRef.current) formRef.current.reset();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function removePromotion(id: string) {
    if (!await confirmAction("Tem certeza que deseja excluir esta promoção?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/promotions?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Erro ao remover promoção.");
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(promotion: Promotion) {
    const expired = isExpired(promotion.endsAt);
    
    if (!promotion.active && expired) {
      toast.error("Esta promoção já expirou. Altere a data de término para reativar.");
      setEditingPromotion(promotion);
      setIsFormExpanded(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const action = promotion.active ? "desativar" : "ativar";
    if (!await confirmAction(`Tem certeza que deseja ${action} esta promoção?`)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/promotions?id=${promotion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promotion.active })
      });

      if (!response.ok) {
        toast.error("Erro ao alterar status.");
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Form Section - Collapsible */}
      <section className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden">
        <div 
          onClick={() => {
            if (!editingPromotion) {
              setIsFormExpanded(!isFormExpanded);
            }
          }}
          className={`flex w-full items-center justify-between px-6 py-4 transition-colors ${
            !editingPromotion ? "cursor-pointer hover:bg-brand-50/50" : ""
          } ${
            isFormExpanded ? "bg-brand-50 border-b border-brand-100" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${editingPromotion ? "bg-orange-100 text-orange-600" : "bg-brand-100 text-slate-600"}`}>
              {editingPromotion ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingPromotion ? `Editando: ${editingPromotion.title}` : "Nova Promoção"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {editingPromotion && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPromotion(null);
                  setIsFormExpanded(false);
                  if (formRef.current) formRef.current.reset();
                }}
                className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Cancelar Edição
              </button>
            )}
            <div className="rounded-full bg-white p-2 shadow-sm border border-brand-100">
              {isFormExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
            </div>
          </div>
        </div>

        {isFormExpanded && (
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Título da Promoção</label>
                <input 
                  name="title" 
                  required 
                  defaultValue={editingPromotion?.title}
                  placeholder="Ex: Oferta de Verão" 
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Desconto</label>
                <select 
                  name="type" 
                  required 
                  defaultValue={editingPromotion?.type ?? "PERCENT"}
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                >
                  <option value="PERCENT">Percentual (%)</option>
                  <option value="FIXED">Valor Fixo (R$)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Valor do Desconto</label>
                <input
                  name="value"
                  required
                  type="number"
                  step="0.01"
                  defaultValue={editingPromotion?.value}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Início</label>
                  <input 
                    name="startsAt" 
                    required 
                    type="datetime-local"
                    defaultValue={editingPromotion?.startsAt ? new Date(editingPromotion.startsAt).toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T') : ""}
                    className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Término</label>
                  <input 
                    name="endsAt" 
                    required 
                    type="datetime-local"
                    defaultValue={editingPromotion?.endsAt ? new Date(editingPromotion.endsAt).toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T') : ""}
                    className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                  />
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrição</label>
                <input
                  name="description"
                  defaultValue={editingPromotion?.description ?? ""}
                  placeholder="Uma breve descrição da promoção..."
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Aplicar a produtos específicos</p>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-brand-100 bg-brand-50/30 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {products.map((product) => (
                    <label 
                      key={product.id} 
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-brand-100 bg-white p-3 transition hover:border-brand-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds([...selectedProductIds, product.id]);
                          } else {
                            setSelectedProductIds(selectedProductIds.filter((id) => id !== product.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-brand-300 text-slate-600 focus:ring-brand-500"
                      />
                      <span className="text-sm font-medium text-slate-800">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-[10px] italic text-slate-400">
                Se nenhum produto for selecionado, a promoção não será aplicada automaticamente.
              </p>
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-brand-700 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Processando..." : (
                <>
                  <Check size={20} />
                  {editingPromotion ? "Atualizar Promoção" : "Criar Promoção"}
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* List Section */}
      <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100">
          <h2 className="text-lg font-bold text-slate-900">Promoções Cadastradas</h2>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-brand-50/50 text-xs font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Promoção</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {promotions.map((promotion) => {
                const expired = isExpired(promotion.endsAt);
                return (
                  <tr key={promotion.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{promotion.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{promotion.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        {promotion.type === "PERCENT" ? <Percent size={14} /> : <Tag size={14} />}
                        {promotion.type === "PERCENT" ? `${promotion.value}%` : `R$ ${promotion.value.toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(promotion.startsAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="opacity-0" />
                          até {new Date(promotion.endsAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(promotion)}
                        disabled={loading}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                          expired
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : promotion.active 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {expired ? <Clock size={12} /> : promotion.active ? <Power size={12} /> : <PowerOff size={12} />}
                        {expired ? "Expirada" : promotion.active ? "Ativa" : "Inativa"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPromotion(promotion);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="rounded-lg p-2 text-slate-600 hover:bg-brand-100 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => removePromotion(promotion.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
