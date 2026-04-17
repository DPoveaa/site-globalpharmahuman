import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { calculatePriceWithPromotion, formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
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
};

export function ProductCard({ product }: ProductCardProps) {
  const finalPrice = calculatePriceWithPromotion(product.price, product.promotion);
  const hasDiscount = finalPrice < product.price;

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-brand-50">
        <Image
          src={product.imageUrl || "/gph_logo.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-brand-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-brand-700">{product.description}</p>
        <div className="flex items-end gap-2">
          <p className="text-xl font-bold text-brand-900">{formatCurrency(finalPrice)}</p>
          {hasDiscount && (
            <p className="text-sm text-brand-600 line-through">{formatCurrency(product.price)}</p>
          )}
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}

