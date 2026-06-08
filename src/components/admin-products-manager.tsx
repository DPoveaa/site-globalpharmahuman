"use client";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/toast";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Power, PowerOff, FolderPlus, Save, Upload, ChevronUp, ChevronDown, Star, ChevronDown as ChevronDownIcon, FileSpreadsheet, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  images?: { id: string; url: string; order: number }[];
  price: number;
  sku: string;
  active: boolean;
  categories: Category[];
  promotionId: string | null;
};

type Category = {
  id: string;
  name: string;
  showOnHome?: boolean;
  homeTitle?: string;
  order?: number;
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

export function AdminProductsManager({ products, categories: initialCategories, promotions }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Categorias locais para evitar reload total
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Importação Excel
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<{name: string; price: string; sku: string; description: string; details: string; categoriesString: string}>({ name: "", price: "", sku: "", description: "", details: "", categoriesString: "" });
  const [isImporting, setIsImporting] = useState(false);

  // Exclusão em Massa
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Sincroniza categorias se as props mudarem
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Sincroniza o campo de imagem ao entrar no modo de edição
  useEffect(() => {
    if (editingProduct) {
      setImageUrl(editingProduct.imageUrl || "");
      setImageUrls(
        editingProduct.images && editingProduct.images.length > 0
          ? editingProduct.images.map((img) => img.url)
          : editingProduct.imageUrl
            ? [editingProduct.imageUrl]
            : []
      );
      setSelectedCategoryIds(editingProduct.categories?.map(c => c.id) || []);
    } else {
      setImageUrl("");
      setImageUrls([]);
      setSelectedCategoryIds([]);
    }
  }, [editingProduct]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrls((prev) => {
          if (prev.includes(data.url)) return prev;
          const newUrls = [...prev, data.url];
          if (prev.length === 0) setImageUrl(data.url);
          return newUrls;
        });
      } else {
        toast.error("Erro ao fazer upload da imagem.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData.length === 0) {
        toast.error("O arquivo Excel está vazio.");
        return;
      }

      const columns = Object.keys(jsonData[0] as object);
      setExcelColumns(columns);
      setExcelData(jsonData);

      const autoMap = { name: "", price: "", sku: "", description: "", details: "", categoriesString: "" };
      columns.forEach(col => {
        const lower = col.toLowerCase();
        if (lower.includes("nome") || lower.includes("produto")) autoMap.name = col;
        if (lower.includes("valor") || lower.includes("preço") || lower.includes("preco")) autoMap.price = col;
        if (lower.includes("sku") || lower.includes("código") || lower.includes("codigo")) autoMap.sku = col;
        if (lower.includes("descrição curta") || lower.includes("resumo")) autoMap.description = col;
        else if (lower.includes("desc") || lower.includes("detalhe")) autoMap.details = col;
        if (lower.includes("categoria")) autoMap.categoriesString = col;
      });

      setColumnMapping(autoMap);
      setIsImportModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
    if (importFileInputRef.current) importFileInputRef.current.value = "";
    setIsDropdownOpen(false);
  };

  const confirmImport = async () => {
    if (!columnMapping.name || !columnMapping.price) {
      toast.error("Você precisa mapear as colunas de Nome e Preço.");
      return;
    }

    setIsImporting(true);
    try {
      const productsToImport = excelData.map((row, index) => {
        let priceVal = row[columnMapping.price];
        if (typeof priceVal === 'string') {
          const clean = priceVal.replace(/[^\d.,]/g, '').replace(',', '.');
          priceVal = parseFloat(clean);
        }
        
        let nameVal = String(row[columnMapping.name] || "").trim();
        let skuVal = columnMapping.sku ? String(row[columnMapping.sku] || "").trim() : "";
        if (!skuVal) {
          skuVal = `IMP-${Date.now().toString().slice(-6)}-${index}`;
        }
        
        let detailsVal = columnMapping.details ? String(row[columnMapping.details] || "").trim() : "";
        let descVal = columnMapping.description ? String(row[columnMapping.description] || "").trim() : "";
        
        // Se a descrição curta estiver vazia, pegamos um resumo dos detalhes
        if (!descVal && detailsVal) {
          descVal = detailsVal.split("\n")[0].substring(0, 100);
        }
        
        if (!descVal || descVal.length < 10) {
          descVal = `Produto importado: ${nameVal}. ${descVal}`;
        }
        
        let catStringVal = columnMapping.categoriesString ? String(row[columnMapping.categoriesString] || "").trim() : "";

        return {
          name: nameVal || `Produto ${index + 1}`,
          price: Number(priceVal) || 0,
          sku: skuVal,
          description: descVal,
          details: detailsVal,
          categoriesString: catStringVal,
          active: true
        };
      });

      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productsToImport)
      });

      if (res.ok) {
        toast.success("Produtos importados com sucesso!");
        setIsImportModalOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao importar produtos.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com servidor.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    
    if (!await confirmAction(`Tem certeza que deseja excluir ${selectedProductIds.length} produtos selecionados?`)) return;
    if (!await confirmAction("ATENÇÃO: Esta ação é irreversível. Deseja mesmo continuar com a exclusão?")) return;

    setIsDeletingBulk(true);
    const toastId = toast.loading("Excluindo produtos...");
    
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedProductIds })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${data.deletedCount} excluídos, ${data.deactivatedCount} desativados.`, { id: toastId, duration: 5000 });
        setSelectedProductIds([]);
        router.refresh();
      } else {
        toast.error(data.message || "Erro ao excluir produtos.", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro de conexão.", { id: toastId });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === products.length && products.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };


  async function refreshCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erro ao atualizar categorias:", error);
    }
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `/api/admin/categories?id=${editingCategory.id}`
      : "/api/admin/categories";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCategoryName
        })
      });

      if (res.ok) {
        setNewCategoryName("");
        setEditingCategory(null);
        // Em vez de reload, apenas atualiza a lista local
        await refreshCategories();
        // Não fecha o modal automaticamente se quiser criar várias, 
        // mas o usuário pediu para não perder progresso, então o modal aberto está ok.
        // Se quiser fechar: setIsCategoryModalOpen(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Erro ao salvar categoria.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!await confirmAction("Tem certeza que deseja excluir esta categoria?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || "Erro ao excluir categoria.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

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
      imageUrl: imageUrl, // Usa o estado controlado
      imageUrls,
      categoryIds: selectedCategoryIds,
      promotionId: String(formData.get("promotionId") ?? "") || null, // Garante null se vazio
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
      toast.error(data.message ?? "Erro ao salvar produto.");
      return;
    }

    setEditingProduct(null);
    setImageUrl("");
    setImageUrls([]);
    setIsFormOpen(false);
    if (formRef.current) formRef.current.reset();
    router.refresh(); // Usa refresh do router em vez de window.location.reload()
  }

  async function removeProduct(id: string) {
    if (!await confirmAction("Tem certeza que deseja excluir este produto?")) return;

    const toastId = toast.loading("Removendo produto...");
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao remover.", { id: toastId });
      } else {
        if (data.message) {
          toast.success(data.message, { id: toastId, duration: 5000 });
        } else {
          toast.success("Produto removido com sucesso!", { id: toastId });
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(product: Product) {
    const action = product.active ? "desativar" : "ativar";
    if (!await confirmAction(`Tem certeza que deseja ${action} este produto?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active })
      });

      if (!response.ok) {
        toast.error("Erro ao alterar status.");
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      {isFormOpen && (
        <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-100 p-2 text-slate-600">
                {editingProduct ? <Pencil size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? `Editando: ${editingProduct.name}` : "Novo Produto"}
              </h2>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setImageUrl("");
                setImageUrls([]);
                setIsFormOpen(false);
                if (formRef.current) formRef.current.reset();
              }}
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>

          <form ref={formRef} key={editingProduct?.id || "new"} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome do Produto</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  placeholder="Ex: Vitamina C 1000mg"
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">SKU / Código</label>
                <input
                  name="sku"
                  required
                  defaultValue={editingProduct?.sku}
                  placeholder="Ex: VIT-C-1000"
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Preço (R$)</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Promoção (Opcional)</label>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Categorias (Selecione 1 ou mais)</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    <Plus size={14} />
                    Gerenciar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 rounded-xl border border-brand-200 bg-white p-3 min-h-[60px] content-start">
                  {categories.map((category) => {
                    const isSelected = selectedCategoryIds.includes(category.id);
                    return (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryIds(prev =>
                            prev.includes(category.id)
                              ? prev.filter(id => id !== category.id)
                              : [...prev, category.id]
                          );
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all border ${isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm hover:bg-brand-700'
                          : 'bg-brand-50 text-slate-600 border-transparent hover:bg-brand-100 hover:border-brand-200'
                          }`}
                      >
                        {category.name}
                        {isSelected && <X size={12} className="inline-block ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Imagens do Produto</label>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {imageUrls.length === 0 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 py-4 text-sm font-bold text-slate-600 transition hover:bg-brand-100 hover:border-brand-400 disabled:opacity-50"
                    >
                      <Upload size={20} />
                      {loading ? "Enviando..." : "Adicionar Imagem (Upload)"}
                    </button>
                  )}
                </div>
                {imageUrls.length > 0 && (
                  <div className="mt-3 space-y-2 rounded-lg border border-brand-100 p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Galeria e capa</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-bold text-slate-600 border border-brand-200 transition hover:bg-brand-100 disabled:opacity-50"
                      >
                        <Plus size={12} />
                        {loading ? "Enviando..." : "Adicionar"}
                      </button>
                    </div>
                    {imageUrls.map((url, index) => (
                      <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-lg border border-brand-100 p-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-brand-100">
                          <Image src={getImageUrl(url)} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 text-xs text-slate-700 truncate">{url}</div>
                        {index === 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                            <Star size={10} />
                            Capa
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setImageUrls((prev) => {
                              if (index === 0) return prev;
                              const clone = [...prev];
                              [clone[index - 1], clone[index]] = [clone[index], clone[index - 1]];
                              setImageUrl(clone[0] || "");
                              return clone;
                            })
                          }
                          className="rounded-md border border-brand-200 p-1 text-slate-600"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setImageUrls((prev) => {
                              if (index === prev.length - 1) return prev;
                              const clone = [...prev];
                              [clone[index + 1], clone[index]] = [clone[index], clone[index + 1]];
                              setImageUrl(clone[0] || "");
                              return clone;
                            })
                          }
                          className="rounded-md border border-brand-200 p-1 text-slate-600"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setImageUrls((prev) => {
                              const clone = prev.filter((_, i) => i !== index);
                              setImageUrl(clone[0] || "");
                              return clone;
                            })
                          }
                          className="rounded-md border border-red-200 p-1 text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrição Curta</label>
                <input
                  name="description"
                  required
                  defaultValue={editingProduct?.description}
                  placeholder="Uma breve descrição do produto..."
                  className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Detalhes / Especificações</label>
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
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Gerenciar Categorias</h3>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setNewCategoryName("");
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="mb-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {editingCategory ? "Editar Nome" : "Nova Categoria"}
              </label>
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da categoria"
                  className="w-full rounded-xl border border-brand-200 px-4 py-2 outline-none focus:border-brand-500 transition"
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {editingCategory ? <Save size={20} /> : <Plus size={20} />}
                </button>
              </div>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategoryName("");
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancelar Edição
                </button>
              )}
            </form>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-brand-100">
              <ul className="divide-y divide-brand-100">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between p-3 hover:bg-brand-50 transition">
                    <span className="text-sm font-medium text-slate-800">{cat.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewCategoryName(cat.name);
                        }}
                        className="p-1.5 text-slate-500 hover:bg-brand-100 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Import Mapping Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Mapear Colunas do Excel</h2>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Encontramos <strong>{excelData.length}</strong> linhas. Vincule as colunas do seu Excel com os campos do sistema.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nome (Obrigatório)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.name}
                  onChange={e => setColumnMapping(prev => ({ ...prev, name: e.target.value }))}
                >
                  <option value="">Selecione a coluna...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Preço (Obrigatório)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.price}
                  onChange={e => setColumnMapping(prev => ({ ...prev, price: e.target.value }))}
                >
                  <option value="">Selecione a coluna...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">SKU (Opcional)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.sku}
                  onChange={e => setColumnMapping(prev => ({ ...prev, sku: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Descrição Curta (Opcional)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.description}
                  onChange={e => setColumnMapping(prev => ({ ...prev, description: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Detalhes / Especificações (Texto Longo)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.details}
                  onChange={e => setColumnMapping(prev => ({ ...prev, details: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Categorias (Opcional)</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.categoriesString}
                  onChange={e => setColumnMapping(prev => ({ ...prev, categoriesString: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Separe múltiplas categorias usando <strong className="text-slate-700">,</strong> (vírgula), <strong className="text-slate-700">;</strong> (ponto e vírgula), <strong className="text-slate-700">|</strong> (barra) ou a palavra <strong className="text-slate-700">" e "</strong> na sua planilha do Excel.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmImport}
                disabled={isImporting || !columnMapping.name || !columnMapping.price}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {isImporting ? "Importando..." : "Confirmar Importação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Section */}
      <section className="rounded-2xl border border-brand-100 bg-white shadow-sm relative">
        <div className="bg-brand-50 rounded-t-2xl px-6 py-4 border-b border-brand-100 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-bold text-slate-900">Produtos Cadastrados</h2>
          
          <div className="flex items-center gap-3">
            {selectedProductIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Excluir Selecionados ({selectedProductIds.length})
              </button>
            )}

            {!isFormOpen && (
              <div className="relative">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  ref={importFileInputRef} 
                  className="hidden" 
                  onChange={handleExcelUpload} 
                />
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  <Plus size={16} />
                  Adicionar
                  <ChevronDownIcon size={16} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-brand-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setEditingProduct(null);
                          setImageUrl("");
                          setImageUrls([]);
                          setSelectedCategoryIds([]);
                          setIsFormOpen(true);
                          if (formRef.current) formRef.current.reset();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50"
                      >
                        <Plus size={16} />
                        Adicionar 1
                      </button>
                      <button
                        onClick={() => importFileInputRef.current?.click()}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50"
                      >
                        <Download size={16} />
                        Importar Planilha
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar rounded-b-2xl">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-brand-50/50 text-xs font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={products.length > 0 && selectedProductIds.length === products.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
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
                    <input 
                      type="checkbox" 
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => {
                        setSelectedProductIds(prev => 
                          prev.includes(product.id) 
                            ? prev.filter(id => id !== product.id)
                            : [...prev, product.id]
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        <Image
                          src={getImageUrl(product.imageUrl)}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product)}
                      disabled={loading}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${product.active
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
                          setIsFormOpen(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-lg p-2 text-slate-600 hover:bg-brand-100 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        disabled={loading}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
