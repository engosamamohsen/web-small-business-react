"use client";

import { ProductType } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { HandleAddToCart } from "./ProductModal";

function ButtonAddToCart({ product }: { product: ProductType }) {
  const addToCart = HandleAddToCart();

  return (
    <button
      onClick={(e) => addToCart(product, e)}
      className="rounded-full p-2 text-orange-500 transition-colors hover:bg-orange-50"
      aria-label="Add to cart"
    >
      <ShoppingCart size={20} />
    </button>
  );
}
export default ButtonAddToCart;
