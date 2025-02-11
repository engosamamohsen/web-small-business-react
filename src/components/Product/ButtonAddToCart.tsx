"use client";

import { ProductType } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

function ButtonAddToCart({ product }: { product: ProductType }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (product?.is_variation) {
          router.push(`/products/${product?.id}`);
        } else {
          // HandleAddToCart(product);
          console.log("add to cart", product);
        }
      }}
      className="absolute bottom-2 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white"
    >
      <ShoppingCart className="h-6 w-6 text-[var(--main-color)]" />
    </button>
  );
}
export default ButtonAddToCart;
