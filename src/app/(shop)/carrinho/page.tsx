"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type CartResponse = {
  items: Array<{
    id: string;
    quantity: number;
    subtotal: number;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
      stock: number;
      price: number;
      finalPrice: number;
    };
  }>;
  total: number;
};

export default function CarrinhoPage() {
  const [cart, setCart] = useState<CartResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  async function loadCart() {
    setLoading(true);
    const response = await fetch("/api/cart");
    const data = await response.json();
    setCart(data);
    setLoading(false);
  }

  async function removeItem(productId: string) {
    await fetch(`/api/cart/items?productId=${productId}`, { method: "DELETE" });
    await loadCart();
  }

  async function checkout() {
    setCheckingOut(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message ?? "Erro ao finalizar compra.");
      setCheckingOut(false);
      return;
    }

    alert(`Pedido criado com sucesso! Código: ${data.orderId}`);
    await loadCart();
    setCheckingOut(false);
  }

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-bold text-brand-900">Carrinho</h1>
      {loading ? (
        <p className="mt-4">Carregando...</p>
      ) : cart.items.length === 0 ? (
        <p className="mt-4 text-brand-700">Seu carrinho está vazio.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {cart.items.map((item) => (
            <article
              key={item.id}
              className="grid items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4 md:grid-cols-[90px_1fr_auto_auto]"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                <Image
                  src={item.product.imageUrl || "/gph_logo.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-brand-900">{item.product.name}</h2>
                <p className="text-sm text-brand-700">Quantidade: {item.quantity}</p>
              </div>
              <p className="font-semibold text-brand-900">{formatCurrency(item.subtotal)}</p>
              <button
                onClick={() => removeItem(item.product.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
              >
                Remover
              </button>
            </article>
          ))}
          <div className="flex items-center justify-between rounded-2xl bg-brand-50 p-4">
            <p className="text-lg font-bold text-brand-900">Total: {formatCurrency(cart.total)}</p>
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="rounded-lg bg-accent-500 px-5 py-3 text-sm font-bold text-white"
            >
              {checkingOut ? "Processando..." : "Finalizar compra"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

