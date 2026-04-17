"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

    setLoading(false);
    if (result?.error) {
      alert("Credenciais inválidas.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-900">Entrar</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border border-brand-100 bg-white p-6">
        <input
          name="email"
          type="email"
          required
          placeholder="Seu e-mail"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Sua senha"
          className="w-full rounded-lg border border-brand-200 px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-brand-800">
        Ainda não possui conta?{" "}
        <Link href="/cadastro" className="font-semibold text-brand-700">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

