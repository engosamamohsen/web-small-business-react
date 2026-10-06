"use client";

import { useCartHook } from "@/hooks/cart/cart";
import { ProductType } from "@/lib/types";
import { buildProductPath } from "@/lib/product-url";
import { storeConfig } from "@/lib/store-config";
import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import { Loader2, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useRouter } from "@/lib/navigation";

export function ButtonAddToCart({ product }: { product: ProductType }) {
  const router = useRouter();
  const token = Cookies.get("app_token");
  const { loading, addToCart } = useCartHook();

  const hasVariations = (product?.variations?.length ?? 0) > 0;

  // Made from a recipe and an item ran out (API `in_stock`): no quick add.
  if (product?.in_stock === false) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
        غير متاح حالياً
      </span>
    );
  }

  if (hasVariations) {
    return (
      <button
        type="button"
        onClick={() => router.push(buildProductPath(product))}
        // ct-choose / ct-choose__icon: restyled by the themes (themed.css); Classic looks as before.
        className="ct-choose items-center gap-1.5 rounded-full bg-[var(--main-color)] px-3 py-1.5 text-xs font-semibold text-white shadow transition-opacity hover:opacity-90"
        aria-label={`اختر خيارات ${product?.name ?? "المنتج"}`}
      >
        <SlidersHorizontal className="ct-choose__icon hidden h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        <span className="ct-choose__label">اختر الخيارات</span>
      </button>
    );
  }

  // A plain button (no PrimeReact): product cards are on every home page, and PrimeReact
  // added ~45 KB of JavaScript there just for this. Same look as before.
  return (
    <button
  type="button"
  aria-label="أضف إلى السلة"
  aria-busy={loading || undefined}
  disabled={loading}
  onClick={async () => {
    if (storeConfig.canAuthenticate && !token) {
      router.push("/auth/login");
      return;
    }

    try {
      await addToCart(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }}
  className={cn(
    "flex h-10 w-10 items-center justify-center rounded-full !border-2 !border-[var(--main-color)] !bg-white shadow-sm transition-[background-color,color,border-color,box-shadow] duration-200",
    loading && "!cursor-not-allowed opacity-60",
  )}
>
  {loading ? (
    <Loader2 className="h-5 w-5 animate-spin text-[var(--main-color)]" aria-hidden="true" />
  ) : (
    <ShoppingCart className="h-5 w-5 text-[var(--main-color)]" aria-hidden="true" />
  )}
</button>
  );
}
