"use client";

import { FormEvent, useState } from "react";

type Promotion = {
  id: string;
  title: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  async function createPromotion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      type: String(formData.get("type") ?? "PERCENT"),
      value: Number(formData.get("value") ?? 0),
      startsAt: new Date(String(formData.get("startsAt"))).toISOString(),
      endsAt: new Date(String(formData.get("endsAt"))).toISOString(),
      active: true,
      productIds: selectedProductIds
    };

    const response = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      alert(data.message ?? "Erro ao criar promoção.");
      return;
    }

    window.location.reload();
  }

  async function removePromotion(id: string) {
    const response = await fetch(`/api/admin/promotions?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      alert("Erro ao remover promoção.");
      return;
    }
    window.location.reload();
  }

  async function editPromotion(promotion: Promotion) {
    const title = window.prompt("Título da promoção:", promotion.title) ?? promotion.title;
    const value = Number(window.prompt("Valor:", String(promotion.value)) ?? promotion.value);

    const response = await fetch(`/api/admin/promotions?id=${promotion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, value })
    });

    if (!response.ok) {
      alert("Erro ao editar promoção.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createPromotion}
        className="space-y-3 rounded-2xl border border-brand-100 bg-white p-5"
      >
        <h2 className="text-lg font-bold text-brand-900">Nova promoção</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Título" className="rounded-lg border px-3 py-2" />
          <select name="type" className="rounded-lg border px-3 py-2">
            <option value="PERCENT">Percentual (%)</option>
            <option value="FIXED">Valor fixo (R$)</option>
          </select>
          <input
            name="value"
            required
            type="number"
            step="0.01"
            placeholder="Valor"
            className="rounded-lg border px-3 py-2"
          />
          <input name="startsAt" required type="datetime-local" className="rounded-lg border px-3 py-2" />
          <input name="endsAt" required type="datetime-local" className="rounded-lg border px-3 py-2" />
          <input
            name="description"
            placeholder="Descrição"
            className="rounded-lg border px-3 py-2 md:col-span-2"
          />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-brand-700">Aplicar a produtos específicos:</p>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-brand-100 p-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 cursor-pointer">
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
                    className="rounded border-brand-200 text-brand-600 focus:ring-brand-500"
                  />
                  {product.name}
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-brand-500">
            Se nenhum produto for selecionado, a promoção ficará criada mas não será aplicada a nenhum produto.
          </p>
        </div>

        <button
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Salvando..." : "Salvar promoção"}
        </button>
      </form>

      <div className="rounded-2xl border border-brand-100 bg-white p-5">
        <h2 className="text-lg font-bold text-brand-900">Promoções ativas</h2>
        <div className="mt-4 space-y-2">
          {promotions.map((promotion) => (
            <article
              key={promotion.id}
              className="grid items-center gap-3 rounded-lg border border-brand-100 p-3 md:grid-cols-[1fr_auto_auto_auto]"
            >
              <div>
                <p className="font-semibold text-brand-900">{promotion.title}</p>
                <p className="text-sm text-brand-700">
                  {promotion.type === "PERCENT" ? `${promotion.value}%` : `R$ ${promotion.value.toFixed(2)}`}
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-700">
                {promotion.active ? "Ativa" : "Inativa"}
              </span>
              <button
                onClick={() => editPromotion(promotion)}
                className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700"
              >
                Editar
              </button>
              <button
                onClick={() => removePromotion(promotion.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
              >
                Remover
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
