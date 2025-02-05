import { ProductType } from "@/lib/types";
import React from "react";
import Image from "next/image";
import ButtonAddToCart from "./ButtonAddToCart";

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
  return (
    <>
      <div className="relative h-40 sm:h-48">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm sm:text-base font-semibold mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-orange-500">
            {product.price} ج.م
          </span>
          <ButtonAddToCart product={product} />
        </div>
      </div>
    </>
  );
}
