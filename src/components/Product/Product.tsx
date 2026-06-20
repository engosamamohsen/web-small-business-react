"use client";

import { ProductType } from "@/lib/types";
import React, { useState, useRef } from "react";
import Image from "@/components/common/Image";
import { Flame } from "lucide-react";
import Link from "@/components/common/Link";
import { ButtonAddToCart } from "./ButtonAddToCart";
import { buildProductPath } from "@/lib/product-url";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDiscountedPrice(price: number, discount: number): number {
  return parseFloat((price - (price * discount) / 100).toFixed(2));
}

function fmt(n: number) {
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductProps {
  product: ProductType;
  defaultImage?: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProductSkeleton() {
  return (
    <div
      className="flex h-full flex-col rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full bg-gray-200" style={{ aspectRatio: "4/3" }} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="h-3.5 w-3/4 rounded-full bg-gray-200 mr-auto" />
        <div className="h-3 w-1/2 rounded-full bg-gray-100 mr-auto" />
        <div className="mt-auto h-5 w-2/5 rounded-full bg-orange-100 mr-auto" />
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export function Product({ product, defaultImage }: ProductProps) {
  const rawDiscount = product?.discount ?? 0;
  const discountValue =
    typeof rawDiscount === "number"
      ? rawDiscount
      : parseFloat(String(rawDiscount)) || 0;
  const hasDiscount = discountValue > 0;

  // Build image list — main image first, then gallery.
  // defaultImage is a FALLBACK ONLY: used just when the product has no image of
  // its own. It is NEVER appended to a product that already has an image, so the
  // shared settings image can't show up as an extra thumbnail on every card.
  const productImages: string[] = [
    product?.product_image,
    ...(product?.gallery_images ?? []),
  ].filter(Boolean) as string[];
  const images =
    productImages.length > 0
      ? productImages
      : defaultImage
        ? [defaultImage]
        : [""];

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Images served from browser cache (e.g. after navigating back from product
  // details) finish loading BEFORE React hydrates, so onLoad never fires and
  // the image would stay at opacity-0 behind the skeleton forever. Checking
  // .complete on mount catches those.
  const handleImgRef = (node: HTMLImageElement | null) => {
    if (node?.complete) setImgLoaded(true);
  };

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 44) {
      // RTL: right = prev, left = next
      if (delta > 0) {
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else {
        setActiveIdx((i) => Math.min(i + 1, images.length - 1));
      }
    }
    touchStartX.current = null;
  };

  const currentImage = images[activeIdx] || "";
  const categoryName = product?.category?.name;
  const productAlt = product?.name
    ? `صورة المنتج ${product.name}`
    : "صورة منتج";

  return (
    <article className="group flex h-full flex-col rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-lg">
      {/* ── Image section ─────────────────────────────────────────────── */}
      <div className="relative">
        {/* Main image */}
        <Link
          href={buildProductPath(product)}
          aria-label={`عرض تفاصيل ${product?.name ?? "المنتج"}`}
        >
          <div
            className="relative w-full overflow-hidden bg-gray-50"
            style={{ aspectRatio: "4/3" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Skeleton shimmer — shown until image loads */}
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" />
            )}

            {currentImage ? (
              // Absolutely fill the 4/3 box (the shared <Image> wrapper ignores
              // `fill`, so the positioning is set here). The image stays visible
              // by default — it is NOT hidden behind a JS-only opacity flip — so
              // it shows as soon as the browser paints it; the skeleton simply
              // sits behind it until then.
              <Image
                ref={handleImgRef}
                src={currentImage}
                alt={productAlt}
                fill
                quality={80}
                loading="lazy"
                sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="absolute inset-0 h-full w-full object-cover"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">لا توجد صورة</span>
              </div>
            )}

            {/* Mobile swipe dots */}
            {images.length > 1 && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden"
                aria-hidden="true"
              >
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={[
                      "block rounded-full transition-all duration-200",
                      i === activeIdx
                        ? "w-4 h-[5px] bg-white shadow"
                        : "w-[5px] h-[5px] bg-white/60",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-sm ring-1 ring-orange-100/80">
            <Flame
              fill="orange"
              className="h-3.5 w-3.5 text-transparent"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-orange-600">
              <span className="sr-only">خصم بنسبة </span>
              {discountValue}%
            </span>
          </div>
        )}



      </div>

      {/* ── Thumbnail strip — desktop only ────────────────────────────── */}
      {images.length > 1 && (
        <div
          className="hidden md:flex gap-1.5 overflow-x-auto px-3 pt-2 pb-0.5"
          role="tablist"
          aria-label="معرض صور المنتج"
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`الصورة ${i + 1}`}
              onClick={() => setActiveIdx(i)}
              className={[
                "relative h-[38px] w-[52px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-[var(--main-color)]",
                i === activeIdx
                  ? "ring-[var(--main-color)] opacity-100"
                  : "ring-transparent opacity-50 hover:opacity-90 hover:ring-gray-300",
              ].join(" ")}
            >
              {src && (
                <Image
                  src={src}
                  alt={`المنتج ${product?.name ?? ""} — الصورة ${i + 1}`}
                  fill
                  sizes="52px"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-between gap-2 px-4 pb-4 pt-3">
        <div className="w-full space-y-1 text-right">
          <Link href={buildProductPath(product)}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-[var(--main-color)] sm:text-base">
              {product.name}
            </h3>
          </Link>

          {categoryName && (
            <p className="text-[11px] font-medium text-slate-400 sm:text-xs">
              {categoryName}
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-between">
          <PriceContent product={product} />
          
          {/* Add to cart / Choose options */}
          <ButtonAddToCart product={product} />
        </div>
      </div>
    </article>
  );
}

// ─── Price ────────────────────────────────────────────────────────────────────

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

  if (hasDiscount) {
    return (
      <div className="flex flex-col items-start gap-0.5 text-right" dir="rtl">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-lg font-bold text-orange-500 sm:text-xl">
            {fmt(finalPrice)} ج.م
          </span>
          <span className="text-xs text-gray-400 line-through sm:text-sm">
            {fmt(basePrice)} ج.م
          </span>
        </div>
        {saving > 0 && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
            وفرت {fmt(saving)} ج.م
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className="text-lg font-bold text-orange-500 sm:text-xl"
      dir="rtl"
    >
      {fmt(basePrice)} ج.م
    </span>
  );
}
