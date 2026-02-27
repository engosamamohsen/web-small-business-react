import { ProductType } from "@/lib/types";
import React from "react";
import Image from "@/components/common/Image";
import { Flame } from "lucide-react";
import Link from "@/components/common/Link";
import { ButtonAddToCart } from "./ButtonAddToCart";

interface ProductProps {
  product: ProductType;
  defaultImage?: string;
}

function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export function Product({ product, defaultImage }: ProductProps) {
  const rawDiscount = product?.discount ?? 0;
  const discountValue =
    typeof rawDiscount === "number"
      ? rawDiscount
      : parseFloat(String(rawDiscount)) || 0;

  const hasDiscount = discountValue > 0;

  const imageSrc =
    product?.product_image ||
    product?.gallery_images?.[0] ||
    defaultImage ||
    "";

  const categoryName = product?.category?.name;

  return (
    <div className="flex h-full min-h-[350px] flex-col">
      <div className="relative">
        <Link href={`/products/${product?.slug}`} className="block">
          <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product?.name ? `صورة المنتج ${product.name}` : "صورة منتج"}
                fill
                quality={80}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-all duration-200 group-hover:scale-[1.03] group-hover:brightness-95"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-500">لا توجد صورة</span>
              </div>
            )}
          </div>
        </Link>

        {hasDiscount && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-sm">
            <Flame fill="red" className="h-4 w-4 text-transparent" />
            <span className="text-xs font-semibold text-orange-600">
              خصم {discountValue}%
            </span>
          </div>
        )}

        {!product?.is_variation ? <ButtonAddToCart product={product} /> : null}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col justify-between gap-3 px-4 pb-5 pt-3 sm:pb-6 sm:pt-4">
        <div className="w-full space-y-1 text-right">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 sm:text-base">
            {product.name}
          </h3>

          {categoryName && (
            <p className="text-[11px] font-medium text-slate-400 sm:text-xs">
              {categoryName}
            </p>
          )}
        </div>

        <div className="flex w-full items-end justify-between">
          <PriceContent product={product} />
        </div>
      </div>
    </div>
  );
}

function PriceContent({ product }: { product: ProductType }) {
  const basePrice = Number(product?.price) || 0;
  const rawDiscount = product?.discount ?? 0;
  const discountValue =
    typeof rawDiscount === "number"
      ? rawDiscount
      : parseFloat(String(rawDiscount)) || 0;

  const hasDiscount = basePrice > 0 && discountValue > 0;

  const finalPrice = hasDiscount
    ? getDiscountedPrice(basePrice, discountValue)
    : basePrice;

  const saving = hasDiscount ? basePrice - finalPrice : 0;

  const finalPriceDisplay =
    finalPrice % 1 === 0 ? finalPrice.toString() : finalPrice.toFixed(2);
  const basePriceDisplay =
    basePrice % 1 === 0 ? basePrice.toString() : basePrice.toFixed(2);
  const savingDisplay =
    saving > 0
      ? saving % 1 === 0
        ? saving.toString()
        : saving.toFixed(2)
      : null;

  if (hasDiscount) {
    return (
      <div className="flex flex-col items-start gap-0.5 text-right">
        <div className="flex flex-wrap items-baseline gap-1 text-sm sm:text-base">
          {/* Final price (primary) */}
          <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
            {finalPriceDisplay} ج.م
          </span>

          {/* Original price (crossed out) */}
          <span className="text-xs text-gray-400 line-through sm:text-sm">
            {basePriceDisplay} ج.م
          </span>
        </div>

        {savingDisplay && (
          <span className="text-[11px] font-medium text-green-600 sm:text-xs">
            وفرت {savingDisplay} ج.م
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
      {basePriceDisplay} ج.م
    </span>
  );
}
