"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, ShieldAlert, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ForcePasswordChange() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, mustChangePassword: false })
      });

      if (!res.ok) {
        toast.error("Erro ao alterar senha.");
      } else {
        toast.success("Senha alterada com sucesso! Faça login novamente.");
        // Força logout para renovar a sessão com as novas informações
        setTimeout(() => signOut({ callbackUrl: "/login" }), 1500);
      }
    } catch {
      toast.error("Erro ao conectar com servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-amber-50 p-6 flex flex-col items-center justify-center border-b border-amber-100 text-center">
          <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-1">Ação Necessária</h2>
          <p className="text-sm text-slate-600 font-medium">
            Por questões de segurança, você precisa definir uma senha definitiva para o seu primeiro acesso.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Nova Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Confirmar Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Senha e Continuar"}
            </button>
          </div>
        </form>
        
        <div className="px-6 pb-6 text-center border-t border-slate-50 pt-4 bg-slate-50/50">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            <LogOut size={14} />
            Sair e fazer depois
          </button>
        </div>
      </div>
    </div>
  );
}
