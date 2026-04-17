import clsx, { ClassValue } from "clsx";

type PromotionLike = {
  active: boolean;
  type: "PERCENT" | "FIXED";
  value: number;
  startsAt: Date;
  endsAt: Date;
};

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function promotionIsActive(promotion?: PromotionLike | null) {
  if (!promotion?.active) return false;
  const now = new Date();
  return now >= promotion.startsAt && now <= promotion.endsAt;
}

export function calculatePriceWithPromotion(
  basePrice: number,
  promotion?: PromotionLike | null
) {
  if (!promotionIsActive(promotion)) return basePrice;

  if (promotion?.type === "PERCENT") {
    const discounted = basePrice - basePrice * (promotion.value / 100);
    return Math.max(discounted, 0);
  }

  const discounted = basePrice - promotion!.value;
  return Math.max(discounted, 0);
}

export function getWhatsappLink(number: string, message: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function whatsappLink(message: string, number?: string) {
  const fallback = process.env.WHATSAPP_NUMBER ?? "5511999999999";
  return getWhatsappLink(number ?? fallback, message);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
