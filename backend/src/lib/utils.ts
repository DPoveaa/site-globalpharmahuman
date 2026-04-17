import { PromotionType } from "@prisma/client";

type PromotionLike = {
  active: boolean;
  type: PromotionType;
  value: number;
  startsAt: Date;
  endsAt: Date;
};

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

  if (promotion?.type === PromotionType.PERCENT) {
    const discounted = basePrice - basePrice * (promotion.value / 100);
    return Math.max(discounted, 0);
  }

  const discounted = basePrice - promotion!.value;
  return Math.max(discounted, 0);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
