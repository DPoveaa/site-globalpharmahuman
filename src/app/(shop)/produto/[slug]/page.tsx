import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductReviews } from "@/components/product-reviews";
import { ProductGallery } from "@/components/product-gallery";
import { calculatePriceWithPromotion, formatCurrency, getImageUrl } from "@/lib/utils";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductFavoriteButton } from "@/components/product-favorite-button";
import { ShippingCalculator } from "@/components/shipping-calculator";

type Props = {
  params: Promise<{ slug: string }>;
};

type Product = {
  id: string;
  name: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  price: number;
  images?: { id: string; url: string; order: number }[];
  promotion: {
    active: boolean;
    type: "PERCENT" | "FIXED";
    value: number;
    startsAt: string;
    endsAt: string;
  } | null;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const session = await getServerSession(authOptions);

  const [res, favoritesRes] = await Promise.all([
    fetch(`${apiUrl}/catalog/products/${slug}`, { cache: "no-store" }),
    session?.accessToken
      ? fetch(`${apiUrl}/user/favorites`, { headers: { Authorization: `Bearer ${session.accessToken}` } })
      : Promise.resolve(null)
  ]);

  if (!res.ok) return notFound();

  const rawProduct: Product = await res.json();
  let isFavorited = false;
  if (favoritesRes?.ok) {
    const favorites = await favoritesRes.json();
    isFavorited = Array.isArray(favorites) && favorites.some((f: any) => f.id === rawProduct.id);
  }
  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
    promotion: rawProduct.promotion
      ? {
          ...rawProduct.promotion,
          value: Number(rawProduct.promotion.value),
          startsAt: new Date(rawProduct.promotion.startsAt),
          endsAt: new Date(rawProduct.promotion.endsAt)
        }
      : null
  };

  const imageList =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.imageUrl || "/gph_logo.png"];

  const finalPrice = calculatePriceWithPromotion(product.price, product.promotion);
  const hasDiscount = finalPrice < product.price;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
      <section className="grid gap-8 rounded-3xl border border-brand-100 bg-white p-6 md:grid-cols-2">
        <div className="space-y-3">
          <ProductGallery images={imageList} productName={product.name} />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
          <p className="text-slate-700">{product.description}</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-slate-900">{formatCurrency(finalPrice)}</p>
            {hasDiscount && <p className="text-slate-400 line-through">{formatCurrency(product.price)}</p>}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <AddToCartButton 
                  productId={product.id} 
                />
                <AddToCartButton 
                  productId={product.id} 
                  isBuyNow 
                />
              </div>
              <ProductFavoriteButton productId={product.id} isFavorited={isFavorited} />
            </div>
          </div>

          <ShippingCalculator />

        </div>
      </section>

      {product.details && (
        <section className="rounded-3xl border border-brand-100 bg-white p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Detalhes do Produto</h2>
          <div className="text-slate-700 whitespace-pre-wrap text-sm md:text-base">
            {product.details}
          </div>
        </section>
      )}

      <ProductReviews productId={product.id} />
    </div>
  );
}
