"use client";
import toast from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { calculatePriceWithPromotion, formatCurrency, getImageUrl } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    price: number;
    promotion: {
      active: boolean;
      type: "PERCENT" | "FIXED";
      value: number;
      startsAt: Date;
      endsAt: Date;
    } | null;
  };
  isFavorited?: boolean;
};

export function ProductCard({ product, isFavorited = false }: ProductCardProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  const finalPrice = calculatePriceWithPromotion(product.price, product.promotion);
  const hasDiscount = finalPrice < product.price;

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Você precisa estar logado para favoritar produtos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id })
      });

      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/produto/${product.slug}`} className="block h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition-[transform,shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl animate-fade-in [transform:translateZ(0)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[23px] bg-brand-50 [transform:translateZ(0)]">
        <Image
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
        />
        
        {/* Botão de Favoritar */}
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white/80 shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-95 ${
            favorited ? "text-red-500" : "text-slate-300 hover:text-red-400"
          }`}
        >
          <Heart size={20} fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 space-y-1">
          <h3 className="line-clamp-1 text-sm font-bold text-slate-900 md:text-lg">{product.name}</h3>
          <p className="line-clamp-2 text-[10px] leading-tight text-slate-500 md:text-sm">{product.description}</p>
        </div>
        
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col justify-end min-h-[32px] md:min-h-[40px]">
            {hasDiscount && (
              <p className="text-[10px] font-medium text-slate-400 line-through md:text-xs">
                {formatCurrency(product.price)}
              </p>
            )}
            <p className="text-base font-black text-slate-900 md:text-xl leading-tight">
              {formatCurrency(finalPrice)}
            </p>
          </div>
          <AddToCartButton productId={product.id} variant="compact" />
        </div>
      </div>
      </article>
    </Link>
  );
}

