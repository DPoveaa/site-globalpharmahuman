"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-slate-700"
    >
      Sair
    </button>
  );
}

