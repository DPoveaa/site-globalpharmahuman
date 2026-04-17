"use client";

import { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const settings = await response.json();
          const whatsapp = settings.find((s: any) => s.key === "whatsapp_number");
          if (whatsapp) setWhatsappNumber(whatsapp.value);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "whatsapp_number", value: whatsappNumber })
      });

      if (!response.ok) {
        alert("Erro ao salvar configuração.");
      } else {
        alert("Configuração salva com sucesso!");
      }
    } catch (error) {
      alert("Erro ao salvar configuração.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-100 p-2 text-brand-600">
          <Settings size={24} />
        </div>
        <h1 className="text-3xl font-bold text-brand-900">Configurações Gerais</h1>
      </div>

      <div className="max-w-xl space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900">Contato</h2>
        
        <div className="space-y-2">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-brand-700">
            Número do WhatsApp (com DDD, apenas números)
          </label>
          <input
            id="whatsapp"
            type="text"
            placeholder="Ex: 5511999999999"
            className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <p className="text-xs text-brand-500">
            Este número será usado para o botão flutuante em todo o site.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : (
            <>
              <Save size={20} />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
}
