"use client";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";

type Setting = {
  key: string;
  value: string;
};

export default function AdminSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [cepOrigem, setCepOrigem] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  function formatDisplayPhone(value: string) {
    const digits = value.replace(/\D/g, "");
    let clean = digits;
    if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
      clean = digits.substring(2);
    }
    
    if (clean.length <= 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return clean.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const digits = value.replace(/\D/g, "");
    
    if (value.length < whatsappNumber.length) {
      setWhatsappNumber(value);
      return;
    }

    if (digits.length > 11) return;

    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 6) {
      if (digits.length <= 10) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      }
    }
    setWhatsappNumber(formatted);
  }

  async function fetchSettings() {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const settingsJson: unknown = await response.json();
        if (Array.isArray(settingsJson)) {
          const settings = settingsJson as Setting[];
          const whatsapp = settings.find((s) => s.key === "whatsapp_number");
          const cep = settings.find((s) => s.key === "CEP_ORIGEM");
          
          if (whatsapp?.value) {
            setWhatsappNumber(formatDisplayPhone(whatsapp.value));
          }
          if (cep?.value) {
            setCepOrigem(cep.value);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      const valueToSave = cleanNumber.startsWith("55") ? cleanNumber : `55${cleanNumber}`;

      await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "whatsapp_number", value: valueToSave })
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "CEP_ORIGEM", value: cepOrigem.replace(/\D/g, "") })
        })
      ]);

      toast.success("Configurações salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-100 p-2 text-slate-600">
          <Settings size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações Gerais</h1>
      </div>

      <section className="max-w-xl space-y-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Contato</h2>
          
          <div className="space-y-2">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700">
              Número do WhatsApp (com DDD, apenas números)
            </label>
            <input
              id="whatsapp"
              type="text"
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={whatsappNumber}
              onChange={handlePhoneChange}
            />
            <p className="text-xs text-slate-500">
              Este número será usado para o botão flutuante em todo o site.
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">ConectEnvios</h2>
          
          <div className="space-y-2">
            <label htmlFor="cepOrigem" className="block text-sm font-medium text-slate-700">
              CEP de Origem (para cálculo de frete)
            </label>
            <input
              id="cepOrigem"
              type="text"
              placeholder="00000-000"
              className="w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={cepOrigem}
              onChange={(e) => setCepOrigem(e.target.value)}
              maxLength={9}
            />
            <p className="text-xs text-slate-500">
              Este CEP será usado como ponto de partida para o cálculo de frete da ConectEnvios.
            </p>
          </div>
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
      </section>
    </div>
  );
}
