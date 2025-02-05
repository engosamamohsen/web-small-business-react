"use client";

import { ProductType } from "@/lib/types";
import { HandleAddToCart } from "./ProductGrid";
import { ShoppingCart } from "lucide-react";

function ButtonAddToCart({ product }: { product: ProductType }) {
  const addToCart = HandleAddToCart();

  return (
    <button
      onClick={(e) => addToCart(product, e)}
      className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
      aria-label="Add to cart"
    >
      <ShoppingCart size={20} />
    </button>
  );
}
export default ButtonAddToCart;
