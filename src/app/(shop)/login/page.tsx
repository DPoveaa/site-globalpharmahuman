"use client";
import toast from "react-hot-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setLoading(false);
      toast.error("Credenciais inválidas.");
      return;
    }

    const session = await getSession();
    if (session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYEE") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bem-vindo de volta</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Acessar Conta</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-[32px] border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">E-mail</label>
          <input
            name="email"
            type="email"
            required
            placeholder="exemplo@email.com"
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Senha</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>

        <button 
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-brand-900 py-4 font-black text-white transition hover:bg-brand-950 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar na Conta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-bold text-slate-500">
        Não tem uma conta?{" "}
        <Link href="/cadastro" className="text-slate-600 hover:underline">
          Criar conta agora
        </Link>
      </p>
    </div>
  );
}

