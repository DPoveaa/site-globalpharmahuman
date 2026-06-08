"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  MapPin, Plus, Trash2, Edit2, Save, X,
  Phone, Map, Image as ImageIcon, Power, PowerOff
} from "lucide-react";

type Unit = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  mapsUrl: string;
  imageUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  active: boolean;
  order: number;
};

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Partial<Unit> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/units");
      if (res.ok) setUnits(await res.json());
    } catch {
      toast.error("Erro ao carregar unidades.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveUnit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUnit) return;

    setSaving(true);
    try {
      const isNew = !editingUnit.id;
      const res = await fetch(isNew ? "/api/admin/units" : `/api/admin/units?id=${editingUnit.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUnit)
      });

      if (res.ok) {
        toast.success(isNew ? "Unidade criada!" : "Unidade atualizada!");
        setShowModal(false);
        fetchUnits();
      } else throw new Error();
    } catch {
      toast.error("Erro ao salvar unidade.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(unit: Unit) {
    const toastId = toast.loading("Alterando status...");
    try {
      const res = await fetch(`/api/admin/units?id=${unit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !unit.active })
      });
      if (res.ok) {
        toast.success(unit.active ? "Unidade desativada." : "Unidade ativada.", { id: toastId });
        fetchUnits();
      } else throw new Error();
    } catch {
      toast.error("Erro ao alterar status.", { id: toastId });
    }
  }

  async function handleDeleteUnit(id: string) {
    if (!confirm("Deseja realmente excluir esta unidade?")) return;
    try {
      const res = await fetch(`/api/admin/units?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Unidade excluída.");
        fetchUnits();
      } else throw new Error();
    } catch {
      toast.error("Erro ao excluir unidade.");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        setEditingUnit(prev => prev ? { ...prev, imageUrl: data.url } : null);
        toast.success("Imagem enviada com sucesso!");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload da imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 shadow-sm">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Unidades Físicas</h1>
            <p className="text-sm font-medium text-slate-500">Gerencie os locais presenciais da farmácia na página inicial.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingUnit({ name: "", phone: "", mapsUrl: "", active: true, order: 0, openTime: "08:00", closeTime: "18:00" });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
        >
          <Plus size={18} />
          Nova Unidade
        </button>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-slate-900 flex items-center gap-2">
            <MapPin size={20} className="text-blue-500" /> Lista de Unidades
          </h2>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse">Carregando unidades...</div>
          ) : units.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <MapPin size={32} className="mb-2 text-slate-300" />
              <p>Nenhuma unidade cadastrada ainda.</p>
            </div>
          ) : (
            units.map((unit) => (
              <div key={unit.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative border border-slate-200">
                    {unit.imageUrl ? (
                      <img src={process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") + unit.imageUrl} alt={unit.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 truncate">
                      {unit.name}
                      {!unit.active && <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded font-black uppercase">Inativa</span>}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">{unit.address || "Sem endereço"}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {unit.phone && <span className="text-xs text-slate-500 flex items-center gap-1 font-medium"><Phone size={12} /> {unit.phone}</span>}
                      {unit.openTime && unit.closeTime && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          🕒 {unit.openTime} - {unit.closeTime}
                        </span>
                      )}
                      <a href={unit.mapsUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 flex items-center gap-1 hover:underline font-medium"><Map size={12} /> Ver no mapa</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(unit)}
                    title={unit.active ? "Desativar" : "Ativar"}
                    className={`p-2 rounded-xl transition-all ${unit.active ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                  >
                    {unit.active ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingUnit(unit);
                      setShowModal(true);
                    }}
                    title="Editar"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    title="Excluir"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Criar/Editar */}
      {showModal && editingUnit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content container */}
          <div className="relative w-full max-w-xl mx-auto my-6 px-4 z-[101] animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8 sm:py-6 bg-white shrink-0">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin size={24} className="text-blue-500 shrink-0" />
                  <span className="truncate">{editingUnit.id ? "Editar Unidade" : "Nova Unidade"}</span>
                </h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2 transition-colors hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body - Scrollable */}
              <form onSubmit={handleSaveUnit} className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                
                <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 bg-slate-100 rounded-3xl overflow-hidden relative border-2 border-dashed border-slate-200 group shrink-0">
                    {editingUnit.imageUrl ? (
                      <img src={process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") + editingUnit.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center px-2">Sem Imagem</span>
                      </div>
                    )}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                    >
                      <Plus size={24} className="mb-1" />
                      <span className="text-xs font-bold">Trocar Foto</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploadingImage && <p className="text-xs font-bold text-blue-500 animate-pulse">Enviando imagem...</p>}
                  <p className="text-[11px] text-slate-400 italic text-center">
                    Recomendado: Imagem da fachada (quadrada ou paisagem).
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Nome da Unidade</label>
                    <input
                      required
                      value={editingUnit.name}
                      onChange={e => setEditingUnit({ ...editingUnit, name: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      placeholder="Ex: Unidade Centro"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Endereço Completo</label>
                    <input
                      value={editingUnit.address || ""}
                      onChange={e => setEditingUnit({ ...editingUnit, address: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      placeholder="Ex: Rua das Flores, 123 - Centro"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Telefone / WhatsApp</label>
                      <input
                        value={editingUnit.phone || ""}
                        onChange={e => setEditingUnit({ ...editingUnit, phone: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Ordem de Exibição</label>
                      <input
                        type="number"
                        value={editingUnit.order}
                        onChange={e => setEditingUnit({ ...editingUnit, order: Number(e.target.value) })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Abre às</label>
                      <input
                        type="time"
                        value={editingUnit.openTime || ""}
                        onChange={e => setEditingUnit({ ...editingUnit, openTime: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Fecha às</label>
                      <input
                        type="time"
                        value={editingUnit.closeTime || ""}
                        onChange={e => setEditingUnit({ ...editingUnit, closeTime: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Link do Google Maps</label>
                    <input
                      required
                      type="url"
                      value={editingUnit.mapsUrl}
                      onChange={e => setEditingUnit({ ...editingUnit, mapsUrl: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingUnit.active}
                    onChange={e => setEditingUnit({ ...editingUnit, active: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="active" className="text-sm font-bold text-slate-700 cursor-pointer">Unidade Ativa no Site</label>
                </div>

                {/* Footer button inside form for sticky effect if needed, or just part of scroll */}
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 disabled:opacity-50 sticky bottom-0"
                >
                  {saving ? "Salvando..." : "Salvar Unidade"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
