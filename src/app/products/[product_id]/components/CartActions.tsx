import { useState } from "react";
import { Button } from "primereact/button";
import { useCartHook } from "@/hooks/cart/cart";
import { ProductType, SizeOption, ColorOption } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface CartActionsProps {
  product: ProductType;
  currentColor: ColorOption | null;
  currentSize: SizeOption | null;
  selectedVariations: Record<string, string[]>;
}

export const CartActions = ({
  product,
  currentColor,
  currentSize,
  selectedVariations,
}: CartActionsProps) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const token = Cookies.get("app_token");
  const { loading, addToCart } = useCartHook();
  
  const handleAddToCart = () => {
    if (!token) {
      router.push("/login");
    } else {
      // Transform selected variations to match the required cart model structure
      const variations = Object.entries(selectedVariations).map(
        ([main_variation_id, choices]) => ({
          main_variation_id,
          choices,
        }),
      );

      addToCart({
        ...product,
        count,
        currentColor,
        currentSize,
        product_note: "", // Optional note field
        variations, // Add variations to cart item
      });
    }
  };

  return (
    <div className="mt-6 flex items-center justify-between gap-3 max-sm:flex-col-reverse">
      <Button
        loading={loading}
        disabled={loading}
        onClick={handleAddToCart}
        loadingIcon="pi pi-spin pi-spinner absolute"
        className="w-fit rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-sm:w-full"
        aria-label="Add product to cart"
      >
        أضف إلى السلة
      </Button>
      <div className="flex w-40 items-center justify-between gap-1 rounded-lg border bg-white p-4 max-sm:w-full">
        <Button
          icon="pi pi-plus"
          className="p-button-text mx-0 !shadow-none !outline-none hover:text-[var(--second-color)]"
          onClick={() => setCount((prev) => prev + 1)}
        />

        <span className="text-xl font-semibold">{count}</span>
        <Button
          icon="pi pi-minus"
          className="p-button-text mx-0 !shadow-none !outline-none hover:text-[var(--second-color)]"
          onClick={() => {
            if (count > 1) {
              setCount((prev) => Math.max(prev - 1, 0));
            }
          }}
        />
      </div>
    </div>
  );
};
