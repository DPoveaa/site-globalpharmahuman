"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Loader2, ShoppingCart } from "lucide-react";

type Props = {
  productId: string;
  isBuyNow?: boolean;
  className?: string;
  variant?: "default" | "compact";
};

export function AddToCartButton({ productId, isBuyNow, className, variant = "default", label }: Props & { label?: string }) {
  const [loading, setLoading] = useState(false);
  const { refreshCart, setCartCount } = useCart();
  const router = useRouter();
  const { status } = useSession();

  async function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (status === "unauthenticated") {
      toast.error("Faça login para adicionar ao carrinho.");
      router.push("/login");
      return;
    }

    setLoading(true);

    if (isBuyNow) {
      router.push("/carrinho");
    } else {
      toast.success("Adicionado ao carrinho!");
    }
    setCartCount(prev => prev + 1);

    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (!response.ok) {
        setCartCount(prev => prev - 1);
        toast.error("Erro ao sincronizar carrinho.");
        return;
      }
      
      refreshCart();

    } catch {
      setCartCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "compact") {
    return (
      <button
        onClick={onAdd}
        disabled={loading}
        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition hover:scale-110 active:scale-95 disabled:opacity-70 ${className}`}
        title="Adicionar ao carrinho"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
      </button>
    );
  }

  const defaultClasses = isBuyNow
    ? "w-full rounded-xl bg-accent-500 px-3 h-12 text-xs font-black uppercase text-white shadow-md transition hover:scale-[1.02] hover:bg-accent-600 active:scale-95 disabled:opacity-70 md:text-sm"
    : "w-full rounded-xl bg-brand-600 px-3 h-12 text-xs font-black uppercase text-white shadow-sm transition hover:scale-[1.02] hover:bg-brand-700 active:scale-95 disabled:opacity-70 md:text-sm";

  return (
    <button
      onClick={onAdd}
      disabled={loading}
      className={`${className || defaultClasses} flex items-center justify-center gap-2`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : (
        <ShoppingCart className="h-4 w-4 shrink-0" />
      )}
      <span className="whitespace-nowrap">
        {label || (isBuyNow ? (
          <>
            <span className="sm:hidden">Comprar</span>
            <span className="hidden sm:inline">Comprar Agora</span>
          </>
        ) : (
          <>
            <span className="sm:hidden">Carrinho</span>
            <span className="hidden sm:inline">Adicionar ao carrinho</span>
          </>
        ))}
      </span>
    </button>
  );
}

