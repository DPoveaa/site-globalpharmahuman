"use client";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  productId: string;
  isFavorited: boolean;
};

export function ProductFavoriteButton({ productId, isFavorited }: Props) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ productId })
      });

      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
        toast.success(data.favorited ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-white shadow-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-70 ${
        favorited ? "text-red-500" : "text-slate-400 hover:text-red-400"
      }`}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart size={24} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
