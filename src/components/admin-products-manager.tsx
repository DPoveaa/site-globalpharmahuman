"use client";

import { FormEvent, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Check, Power, PowerOff } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  price: number;
  sku: string;
  active: boolean;
  categoryId: string;
  promotionId: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Promotion = {
  id: string;
  title: string;
};

type Props = {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
};

export function AdminProductsManager({ products, categories, promotions }: Props) {
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      details: String(formData.get("details") ?? ""),
      price: Number(formData.get("price") ?? 0),
      sku: String(formData.get("sku") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      promotionId: String(formData.get("promotionId") ?? ""),
      active: editingProduct ? editingProduct.active : true
    };

    const url = editingProduct 
      ? `/api/admin/products?id=${editingProduct.id}` 
      : "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      alert(data.message ?? "Erro ao salvar produto.");
      return;
    }
    
    setEditingProduct(null);
    if (formRef.current) formRef.current.reset();
    window.location.reload();
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      alert("Erro ao remover.");
      return;
    }
    window.location.reload();
  }

  async function toggleActive(product: Product) {
    setLoading(true);
    const response = await fetch(`/api/admin/products?id=${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active })
    });

    if (!response.ok) {
      alert("Erro ao alterar status.");
    } else {
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-100 p-2 text-brand-600">
              {editingProduct ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <h2 className="text-xl font-bold text-brand-900">
              {editingProduct ? `Editando: ${editingProduct.name}` : "Novo Produto"}
            </h2>
          </div>
          {editingProduct && (
            <button
              onClick={() => {
                setEditingProduct(null);
                if (formRef.current) formRef.current.reset();
              }}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-900"
            >
              <X size={16} />
              Cancelar Edição
            </button>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Nome do Produto</label>
              <input 
                name="name" 
                required 
                defaultValue={editingProduct?.name}
                placeholder="Ex: Vitamina C 1000mg" 
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">SKU / Código</label>
              <input 
                name="sku" 
                required 
                defaultValue={editingProduct?.sku}
                placeholder="Ex: VIT-C-1000" 
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Preço (R$)</label>
              <input
                name="price"
                required
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price}
                placeholder="0.00"
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Categoria</label>
              <select 
                name="categoryId" 
                required 
                defaultValue={editingProduct?.categoryId}
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
              >
                <option value="">Selecionar Categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Promoção (Opcional)</label>
              <select 
                name="promotionId" 
                defaultValue={editingProduct?.promotionId ?? ""}
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
              >
                <option value="">Sem promoção</option>
                {promotions.map((promotion) => (
                  <option key={promotion.id} value={promotion.id}>
                    {promotion.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">URL da Imagem</label>
              <input
                name="imageUrl"
                defaultValue={editingProduct?.imageUrl ?? ""}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Descrição Curta</label>
              <input
                name="description"
                required
                defaultValue={editingProduct?.description}
                placeholder="Uma breve descrição do produto..."
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-500">Detalhes / Especificações</label>
              <textarea
                name="details"
                defaultValue={editingProduct?.details ?? ""}
                placeholder="Informações detalhadas, modo de uso, composição..."
                rows={4}
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition resize-none"
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-brand-700 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Processando..." : (
              <>
                <Check size={20} />
                {editingProduct ? "Atualizar Produto" : "Criar Produto"}
              </>
            )}
          </button>
        </form>
      </section>

      {/* List Section */}
      <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100">
          <h2 className="text-lg font-bold text-brand-900">Produtos Cadastrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/50 text-xs font-bold uppercase tracking-wider text-brand-600">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-brand-900">{product.name}</p>
                    <p className="text-xs text-brand-500">{product.sku}</p>
                  </td>
                  <td className="px-6 py-4 text-brand-700 font-medium">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product)}
                      disabled={loading}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                        product.active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {product.active ? <Power size={12} /> : <PowerOff size={12} />}
                      {product.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-lg p-2 text-brand-600 hover:bg-brand-100 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
