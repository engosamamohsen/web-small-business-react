import { ProductType } from "@/lib/types";
import React from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import ButtonAddToCart from "./ButtonAddToCart";
import Link from "next/link";

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
  const descount = product?.discount || "0";

  return (
    <div className="min-h-[350px]">
      <div className="relative h-[208px] max-sm:h-48">
        <Image
          src={product?.image}
          alt={product?.name || ""}
          width={321}
          height={208}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          quality={80}
          className="max-h-52 !w-full !max-w-full object-center transition-all duration-200 group-hover:brightness-90"
        />
        {+descount > 0 ? (
          <div className="absolute right-4 top-4">
            <Flame fill="red" className="h-8 w-8 text-transparent" />
          </div>
        ) : null}
        <ButtonAddToCart product={product} />
      </div>
      <div className="flex flex-col items-start justify-start gap-2 px-4 pb-6 pt-4">
        <h3 className="my-2 line-clamp-2 text-sm font-semibold sm:text-base">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <PriceContent product={product} />
          </div>
        </div>
        <Link
          href={`/products/${product?.id}`}
          className="text-sm hover:text-[var(--second-color)] hover:underline"
        >
          {" "}
          عرض المزيد
        </Link>
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
