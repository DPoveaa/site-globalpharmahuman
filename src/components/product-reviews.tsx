"use client";
import toast from "react-hot-toast";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";

type ReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
};

type ReviewsResponse = {
  average: number;
  count: number;
  items: ReviewItem[];
};

type EligibilityResponse = {
  canReview: boolean;
  alreadyReviewed: boolean;
  myReview: ReviewItem | null;
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < value ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewsResponse>({ average: 0, count: 0, items: [] });
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const loadReviews = useCallback(async () => {
    const res = await fetch(`/api/reviews/product/${productId}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setReviews(data);
  }, [productId]);

  const loadEligibility = useCallback(async () => {
    if (!session?.user) {
      setEligibility(null);
      return;
    }
    const res = await fetch(`/api/reviews/eligibility/${productId}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setEligibility(data);
    if (data?.myReview) {
      setRating(data.myReview.rating);
      setTitle(data.myReview.title || "");
      setComment(data.myReview.comment || "");
    }
  }, [productId, session?.user]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    void loadEligibility();
  }, [loadEligibility]);

  const canSubmit = useMemo(() => {
    if (!session?.user || !eligibility) return false;
    return eligibility.canReview;
  }, [session?.user, eligibility]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    const payload = { productId, rating, title, comment };

    try {
      const hasReview = Boolean(eligibility?.alreadyReviewed && eligibility?.myReview?.id);
      const url = hasReview ? `/api/reviews/${eligibility!.myReview!.id}` : "/api/reviews";
      const method = hasReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Erro ao salvar avaliação.");
        return;
      }

      await Promise.all([loadReviews(), loadEligibility()]);
      toast.success("Avaliação salva com sucesso!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-brand-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Avaliações</h2>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Stars value={Math.round(reviews.average)} />
          <span>{reviews.average.toFixed(1)} ({reviews.count})</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.items.map((item) => (
          <article key={item.id} className="rounded-xl border border-brand-100 p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{item.user.name}</p>
              <Stars value={item.rating} />
            </div>
            {item.title && <p className="mt-2 text-sm font-semibold text-slate-800">{item.title}</p>}
            {item.comment && <p className="mt-1 text-sm text-slate-700">{item.comment}</p>}
          </article>
        ))}
        {reviews.items.length === 0 && (
          <p className="text-sm text-slate-500">Ainda não há avaliações para este produto.</p>
        )}
      </div>

      {session?.user && !eligibility ? (
        <div className="animate-pulse rounded-xl border border-brand-100 bg-brand-50/40 p-6 text-center">
          <p className="text-sm font-semibold text-slate-400">Verificando elegibilidade para avaliação...</p>
        </div>
      ) : canSubmit ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-brand-100 bg-brand-50/40 p-6">
          <p className="text-sm font-bold text-slate-900">Sua avaliação</p>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, idx) => {
              const value = idx + 1;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setRating(value)}
                  className="rounded-md p-1"
                >
                  <Star
                    size={24}
                    className={value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                  />
                </button>
              );
            })}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional)"
            className="w-full rounded-lg border border-brand-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Conte como foi sua experiência com esse produto."
            className="w-full rounded-lg border border-brand-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto rounded-lg bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : eligibility?.alreadyReviewed ? "Atualizar avaliação" : "Enviar avaliação"}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">
            {!session?.user 
              ? "Faça login para avaliar este produto." 
              : "Somente clientes que já compraram e receberam este produto podem avaliá-lo."}
          </p>
        </div>
      )}
    </section>
  );
}
