"use client";
import toast from "react-hot-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const digits = value.replace(/\D/g, "");
    
    if (value.length < cpf.length) {
      setCpf(value);
      return;
    }

    if (digits.length > 11) return;

    let formatted = digits;
    if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
    setCpf(formatted);
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const digits = value.replace(/\D/g, "");

    if (value.length < phone.length) {
      setPhone(value);
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
    setPhone(formatted);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      cpf: String(formData.get("cpf") ?? "").replace(/\D/g, ""),
      password: String(formData.get("password") ?? "")
    };

    setLoading(true);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setLoading(false);
      toast.error(data.message ?? "Erro ao cadastrar.");
      return;
    }

    if (payload.phone) {
      localStorage.setItem("gph_whatsapp", payload.phone);
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Junte-se a nós</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Criar Nova Conta</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-[32px] border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nome Completo</label>
          <input
            name="name"
            required
            placeholder="Ex: João da Silva"
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>

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
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Telefone / WhatsApp</label>
          <input
            name="phone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CPF</label>
          <input
            name="cpf"
            required
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Senha</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="No mínimo 6 caracteres"
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
          />
        </div>

        <button 
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-brand-900 py-4 font-black text-white transition hover:bg-brand-950 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Criando Conta..." : "Criar Minha Conta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-bold text-slate-500">
        Já possui cadastro?{" "}
        <Link href="/login" className="text-slate-600 hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}

