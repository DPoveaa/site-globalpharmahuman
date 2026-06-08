"use client";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/toast";

import { useState, useEffect, useRef } from "react";
import { Truck, Plus, Trash2, Save, Power, PowerOff, Pencil, Upload, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";

type ShippingRule = {
  id: string;
  name: string;
  zipCode: string | null;
  price: number;
  active: boolean;
};

export default function AdminShippingPage() {
  const [rules, setRules] = useState<ShippingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<ShippingRule>>({
    name: "",
    zipCode: "",
    price: 0,
    active: true
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<{name: string; zipCode: string; price: string}>({ name: "", zipCode: "", price: "" });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipping");
      if (res.ok) setRules(await res.json());
    } catch (error) {
      console.error("Erro ao buscar regras de frete:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const isEditing = !!editingRule;
      const url = isEditing ? `/api/admin/shipping/${editingRule.id}` : "/api/admin/shipping";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRule,
          price: Number(newRule.price),
          zipCode: newRule.zipCode?.trim() || null
        })
      });
      
      if (res.ok) {
        setIsAdding(false);
        setEditingRule(null);
        setNewRule({ name: "", zipCode: "", price: 0, active: true });
        toast.success(isEditing ? "Regra atualizada!" : "Regra criada!");
        fetchRules();
      } else {
        toast.error("Erro ao salvar regra.");
      }
    } catch (error) {
      toast.error("Erro ao conectar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!await confirmAction("Tem certeza que deseja excluir esta regra?")) return;
    try {
      const res = await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
      if (res.ok) fetchRules();
    } catch (error) {
      toast.error("Erro ao excluir.");
    }
  }

  async function handleClearAll() {
    if (!await confirmAction("Tem certeza absoluta que deseja excluir TODAS as regras de frete? Esta ação não pode ser desfeita.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipping/all", { method: "DELETE" });
      if (res.ok) {
        toast.success("Todas as regras foram excluídas.");
        fetchRules();
      } else {
        toast.error("Erro ao excluir regras.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleRuleActive(rule: ShippingRule) {
    const action = rule.active ? "desativar" : "ativar";
    if (!await confirmAction(`Tem certeza que deseja ${action} esta regra de frete?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/shipping/${rule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !rule.active })
      });

      if (!response.ok) {
        toast.error("Erro ao alterar status.");
      } else {
        fetchRules();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
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

      const autoMap = { name: "", zipCode: "", price: "" };
      columns.forEach(col => {
        const lower = col.toLowerCase();
        if (lower.includes("cep")) autoMap.zipCode = col;
        if (lower.includes("valor") || lower.includes("preço") || lower.includes("preco")) {
          if (!lower.includes("boys")) autoMap.price = col;
        }
        if (lower.includes("nome") || lower.includes("regra") || lower.includes("desc") || lower.includes("atendimento")) autoMap.name = col;
      });

      if (!autoMap.name && autoMap.zipCode) {
        autoMap.name = autoMap.zipCode;
      }

      setColumnMapping(autoMap);
      setIsImportModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImport = async () => {
    if (!columnMapping.price) {
      toast.error("Você precisa mapear a coluna de Preço.");
      return;
    }

    setIsImporting(true);
    try {
      const rulesToImport = excelData.map((row, index) => {
        let priceVal = row[columnMapping.price];
        if (typeof priceVal === 'string') {
          const clean = priceVal.replace(/[^\d.,]/g, '').replace(',', '.');
          priceVal = parseFloat(clean);
        }
        
        let zipVal = columnMapping.zipCode ? row[columnMapping.zipCode] : null;
        if (zipVal !== undefined && zipVal !== null) {
           zipVal = String(zipVal).trim();
           const rangeMatch = zipVal.match(/(\d{5}-?\d{3})\s*(a|-|até)\s*(\d{5}-?\d{3})/i);
           if (rangeMatch) {
             zipVal = `${rangeMatch[1].replace(/\D/g, '')}-${rangeMatch[3].replace(/\D/g, '')}`;
           } else {
             const singleMatch = zipVal.match(/\d{5}-?\d{3}/);
             if (singleMatch) {
               zipVal = singleMatch[0].replace(/\D/g, '');
             } else {
               zipVal = zipVal.replace(/\D/g, '');
             }
           }
        } else {
           zipVal = null;
        }

        let nameVal = columnMapping.name ? row[columnMapping.name] : null;
        if (!nameVal || String(nameVal).trim() === "") {
          nameVal = zipVal ? `Regra CEP ${zipVal}` : `Regra Importada ${index + 1}`;
        } else {
          nameVal = String(nameVal).trim();
        }

        return {
          name: nameVal,
          zipCode: zipVal,
          price: Number(priceVal) || 0,
          active: true
        };
      });

      const res = await fetch("/api/admin/shipping/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rulesToImport)
      });

      if (res.ok) {
        toast.success("Regras importadas com sucesso!");
        setIsImportModalOpen(false);
        fetchRules();
      } else {
        toast.error("Erro ao importar regras.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com servidor.");
    } finally {
      setIsImporting(false);
    }
  };


  if (loading) return <div className="p-8 text-center text-slate-600">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-100 p-2 text-slate-600">
            <Truck size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações de Frete</h1>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button
            onClick={handleClearAll}
            disabled={rules.length === 0}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={20} /> Limpar Todos
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2 font-bold text-brand-700 transition hover:bg-brand-50"
          >
            <Upload size={20} /> Importar Excel
          </button>
          <button
            onClick={() => {
              if (isAdding || editingRule) {
                setIsAdding(false);
                setEditingRule(null);
                setNewRule({ name: "", zipCode: "", price: 0, active: true });
              } else {
                setIsAdding(true);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 font-bold text-white transition hover:bg-brand-700"
          >
            {isAdding || editingRule ? "Cancelar" : <><Plus size={20} /> Nova Regra</>}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600 mb-6">
          Defina regras de frete para CEPs específicos (Ex: "01" para todos os CEPs começando com 01) ou uma regra geral (deixe o campo de CEP em branco). O sistema sempre prioriza regras mais específicas primeiro.
        </p>

        {(isAdding || editingRule) && (
          <form onSubmit={handleSaveRule} className="mb-8 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 p-6">
            <h3 className="mb-4 text-sm font-bold text-slate-800">
              {editingRule ? "Editar Regra" : "Cadastrar Nova Regra"}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1 lg:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nome da Regra</label>
                <input
                  required
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  placeholder="Ex: Sedex SP"
                  value={newRule.name}
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Prefixo de CEP (Opcional)</label>
                <input
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  placeholder="Ex: 01"
                  value={newRule.zipCode || ""}
                  onChange={e => setNewRule({ ...newRule, zipCode: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preço (R$)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  value={newRule.price}
                  onChange={e => setNewRule({ ...newRule, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <button type="submit" className="mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-700">
              <Save size={16} /> Salvar Regra
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-bold rounded-tl-lg">Nome da Regra</th>
                <th className="px-4 py-3 font-bold">CEP / Prefixo</th>
                <th className="px-4 py-3 font-bold">Preço</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-right rounded-tr-lg">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Nenhuma regra cadastrada. O frete será exibido como "Grátis".
                  </td>
                </tr>
              ) : rules.map(rule => (
                <tr key={rule.id} className="transition hover:bg-brand-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{rule.name}</td>
                  <td className="px-4 py-3">
                    {rule.zipCode ? (
                      <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-slate-700">{rule.zipCode}</span>
                    ) : (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Geral</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-600">{formatCurrency(rule.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleRuleActive(rule)}
                      disabled={loading}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${rule.active
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                    >
                      {rule.active ? <Power size={12} /> : <PowerOff size={12} />}
                      {rule.active ? "ATIVO" : "INATIVO"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setNewRule({
                            name: rule.name,
                            zipCode: rule.zipCode || "",
                            price: rule.price,
                            active: rule.active
                          });
                          setIsAdding(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="rounded p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
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
      </div>

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Mapear Colunas do Excel</h2>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Encontramos <strong>{excelData.length}</strong> linhas. Vincule as colunas do seu Excel com os campos que o sistema precisa.
            </p>

            <div className="space-y-4">
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
                <label className="text-sm font-bold text-slate-700">CEP / Prefixo</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.zipCode}
                  onChange={e => setColumnMapping(prev => ({ ...prev, zipCode: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nome da Regra</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  value={columnMapping.name}
                  onChange={e => setColumnMapping(prev => ({ ...prev, name: e.target.value }))}
                >
                  <option value="">Selecione a coluna (opcional)...</option>
                  {excelColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
                <p className="text-xs text-slate-500 mt-1">Se não selecionado, geraremos um nome automaticamente.</p>
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
                disabled={isImporting || !columnMapping.price}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {isImporting ? "Importando..." : "Confirmar Importação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
