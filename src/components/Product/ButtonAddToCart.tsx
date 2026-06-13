"use client";

import { useCartHook } from "@/hooks/cart/cart";
import { ProductType } from "@/lib/types";
import { buildProductPath } from "@/lib/product-url";
import { storeConfig } from "@/lib/store-config";
import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import { ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { Button } from "primereact/button";

export function ButtonAddToCart({ product }: { product: ProductType }) {
  const router = useRouter();
  const token = Cookies.get("app_token");
  const { loading, addToCart } = useCartHook();

  const hasVariations = (product?.variations?.length ?? 0) > 0;

  if (hasVariations) {
    return (
      <button
        type="button"
        onClick={() => router.push(buildProductPath(product))}
        className="items-center gap-1.5 rounded-full bg-[var(--main-color)] px-3 py-1.5 text-xs font-semibold text-white shadow transition-opacity hover:opacity-90"
        aria-label={`اختر خيارات ${product?.name ?? "المنتج"}`}
      >
        {/* <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0" /> */}
        اختر الخيارات
      </button>
    );
  }

  return (
    <Button
  aria-label="أضف إلى السلة"
  disabled={loading}
  loading={loading}
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
    "flex h-10 w-10 items-center justify-center rounded-full !border-2 !border-[var(--main-color)] !bg-white shadow-sm",
    loading && "!cursor-not-allowed",
  )}
>
  {!loading && (
    <ShoppingCart className="h-5 w-5 text-[var(--main-color)]" />
  )}
</Button>
  );
}
