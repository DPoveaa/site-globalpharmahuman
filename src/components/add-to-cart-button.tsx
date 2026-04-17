"use client";

import { useState } from "react";

type Props = {
  productId: string;
};

export function AddToCartButton({ productId }: Props) {
  const [loading, setLoading] = useState(false);

  async function onAdd() {
    setLoading(true);
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (!response.ok) {
        alert("Faça login para adicionar ao carrinho.");
        return;
      }

      alert("Produto adicionado ao carrinho!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onAdd}
      disabled={loading}
      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
    >
      {loading ? "Adicionando..." : "Adicionar ao carrinho"}
    </button>
  );
}

