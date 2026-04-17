"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
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
      alert(data.message ?? "Erro ao cadastrar.");
      return;
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
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-900">Criar conta</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border border-brand-100 bg-white p-6">
        <input
          name="name"
          required
          placeholder="Nome completo"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <input
          name="phone"
          placeholder="Telefone / WhatsApp"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Senha"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
      <p className="mt-4 text-sm text-brand-800">
        Já possui cadastro?{" "}
        <Link href="/login" className="font-semibold text-brand-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}

