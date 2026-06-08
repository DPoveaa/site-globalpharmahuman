"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 2000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '16px',
              padding: '16px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
            },
          }} 
        />
      </CartProvider>
    </SessionProvider>
  );
}

