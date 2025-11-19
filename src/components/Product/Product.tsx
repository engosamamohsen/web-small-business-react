import { ProductType } from "@/lib/types";
import React from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import Link from "next/link";
import { ButtonAddToCart } from "./ButtonAddToCart";

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
  const descount = product?.discount || "0";
  const imageSrc =
    product?.main_image ||
    product?.gallery_images?.[0] ||
    product.image ||
    "";

  return (
    <div className="flex h-full min-h-[350px] flex-col">
      {/* Image block */}
      <div className="relative">
        <Link href={`/products/${product?.id}`} className="block">
          <div className="relative w-full aspect-square">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product?.name || ""}
                fill
                quality={80}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-all duration-200 group-hover:brightness-90"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-500">لا توجد صورة</span>
              </div>
            )}
          </div>
        </Link>

        {/* Discount flame */}
        {+descount > 0 ? (
          <div className="absolute right-4 top-4">
            <Flame fill="red" className="h-8 w-8 text-transparent" />
          </div>
        ) : null}

        {/* Add to cart button over image (if not variation) */}
        {!product?.is_variation ? <ButtonAddToCart product={product} /> : null}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col items-start justify-between gap-2 px-4 pb-6 pt-4">
        <h3 className="my-2 line-clamp-2 text-sm font-semibold sm:text-base">
          {product.name}
        </h3>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <PriceContent product={product} />
          </div>
        </div>
        {/* 'عرض المزيد' removed as you requested */}
      </div>
    </div>
  );
}

function PriceContent({ product }: { product: ProductType }) {
  const descount = product?.discount || "0";
  return +descount > 0 ? (
    <>
      <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
        {product.price_after} ج.م
      </span>

      {product.price_after !== product.price && (
        <span className="text-sm text-gray-500 line-through">
          {product.price} ج.م
        </span>
      )}
      {product?.discount && parseInt(product?.discount) > 0 && (
        <span className="text-sm font-bold text-green-600">
          {product.discount}%
        </span>
      )}
    </>
  ) : (
    <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
      {product.price} ج.م
    </span>
  );
}
