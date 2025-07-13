import { useState } from "react";
import { Button } from "primereact/button";
import { useCartHook } from "@/hooks/cart/cart";
import { ProductType, SizeOption, ColorOption } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUpdateEffect } from "react-use";
import { cn } from "@/utils/utils";

interface FormattedVariation {
  main_variation_id: string;
  choices: string[];
}

interface FormattedVariations {
  variations: FormattedVariation[];
}

interface CartActionsProps {
  product: ProductType;
  totalPrice: number;
  currentColor: ColorOption | null;
  currentSize: SizeOption | null;
  selectedVariations: FormattedVariations;
  productVariations: { is_required?: boolean; id?: string }[];
}

export const CartActions = ({
  product,
  currentColor,
  currentSize,
  selectedVariations,
  productVariations,
  totalPrice,
}: CartActionsProps) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const token = Cookies.get("app_token");
  const [isAvailable, setIsAvailable] = useState(true);
  const { loading, addToCart } = useCartHook();

  const handleAddToCart = () => {
    if (!token) {
      router.push("/login");
    } else {
      // The variations are already in the required format
      const { variations } = selectedVariations;

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

  /**
   * Updates the availability state of the product based on selected variations.
   *
   * This function checks if all required variations have been selected. If so, it sets the availability state to true. Otherwise, it sets it to false.
   */
  useUpdateEffect(() => {
    const requiredVariations = productVariations.filter(
      (variation) => variation.is_required,
    );
    const isAvailable = requiredVariations.every((main_variation) => {
      return selectedVariations.variations.some(
        (variation) => variation.main_variation_id == main_variation.id,
      );
    });
    setIsAvailable(isAvailable);
  }, [productVariations, selectedVariations]);
  return (
    <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col-reverse">
      <Button
        loading={loading}
        disabled={loading || !isAvailable}
        onClick={handleAddToCart}
        loadingIcon="pi pi-spin pi-spinner absolute"
        className={cn(
          "flex w-fit items-center justify-center gap-4 rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-sm:w-full",
          !isAvailable && "bg-gray-500",
        )}
        aria-label="Add product to cart"
      >
        <span>أضف إلى السلة</span>{" "}
        <span>
          {totalPrice * count} <span>جنية</span>
        </span>
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
