"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login?error=expired" });
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm font-bold text-slate-500">Sua sessão expirou. Encerrando...</p>
    </div>
  );
}
