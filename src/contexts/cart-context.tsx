"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

type CartContextType = {
  cartCount: number;
  refreshCart: () => Promise<void>;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  async function refreshCart() {
    if (!session?.user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        const count = data.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (error) {
      console.error("Erro ao atualizar carrinho", error);
    }
  }

  useEffect(() => {
    refreshCart();
  }, [session]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
