"use client";

import { useCartHook } from "@/hooks/cart/cart";
import { ProductType } from "@/lib/types";
import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

function ButtonAddToCart({ product }: { product: ProductType }) {
  const router = useRouter();
  const token = Cookies.get("app_token");
  const { loading, addToCart } = useCartHook();
  return (
    <Button
      aria-label="Add product to cart"
      disabled={loading}
      loading={loading}
      loadingIcon="pi pi-spin pi-spinner absolute"
      onClick={async () => {
        if (product?.is_variation) {
          router.push(`/products/${product?.id}`);
        } else {
          if (!token) router.push("/login");
          else {
            try {
              await addToCart(product);
            } catch (error: any) {
              console.error("error", error);
              return;
            }
          }
        }
      }}
      className={cn(
        "absolute bottom-2 left-4 flex h-10 w-10 items-center justify-center rounded-full !bg-white !opacity-[1]",
        loading && "!cursor-not-allowed",
      )}
    >
      {!loading && (
        <ShoppingCart className="h-6 w-6 text-[var(--main-color)]" />
      )}
    </Button>
  );
}
export default ButtonAddToCart;
