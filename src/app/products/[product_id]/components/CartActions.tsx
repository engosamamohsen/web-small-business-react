import { useState } from "react";
import { Button } from "primereact/button";
import { useCartHook } from "@/hooks/cart/cart";
import { ProductType, SizeOption, ColorOption } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUpdateEffect } from "react-use";
import { cn } from "@/utils/utils";
import { InputTextarea } from "primereact/inputtextarea";

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
  const [productNote, setProductNote] = useState("");
  const token = Cookies.get("app_token");
  const [isAvailable, setIsAvailable] = useState(true);
  const { loading, addToCart } = useCartHook();
  const discount = product.discount ? parseInt(product.discount, 10) : 0;

  function getDiscountedPrice(price: number, discount: number): number {
    const discountedPrice = price - (price * discount) / 100;
    return parseFloat(discountedPrice.toFixed(2));
  }

  const handleAddToCart = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Get variations in the required format
      const { variations } = selectedVariations;

      // Call the API to add the product to cart
      await addToCart({
        ...product,
        count,
        currentColor,
        currentSize,
        product_note: productNote, // Include product note from state
        variations, // Include variations
      });

      // Clear product note after successful addition
      setProductNote("");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  /**
   * Updates the availability state of the product based on selected variations.
   *
   * This function checks if all required variations have been selected. If so, it sets the availability state to true. Otherwise, it sets it to false.
   */
  useUpdateEffect(() => {
    if (!productVariations.length) return;
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
    <div className="mt-4 flex flex-col gap-4">
      {/* Product Note Input */}
      <div className="mt-6 w-full">
        <label
          htmlFor="product-note"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          ملاحظات المنتج (اختياري)
        </label>
        <InputTextarea
          id="product-note"
          value={productNote}
          onChange={(e) => setProductNote(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-[var(--main-color)] focus:outline-none"
          placeholder="اكتب أي ملاحظات خاصة بالمنتج هنا..."
        />
      </div>

      <div className="flex items-center justify-between gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:flex-col-reverse max-md:bg-white max-md:px-8 max-md:py-6 max-md:pb-10 max-md:shadow-[0_0_10px_0_rgba(0,0,0,0.2)]">
        <Button
          loading={loading}
          disabled={loading || !isAvailable}
          onClick={handleAddToCart}
          loadingIcon="pi pi-spin pi-spinner absolute"
          className={cn(
            "flex w-fit items-center justify-center gap-4 rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-md:w-full",
            !isAvailable && "bg-gray-500",
          )}
          aria-label="Add product to cart"
        >
          <span>أضف إلى السلة</span>
          <span>
            {discount > 0 ? getDiscountedPrice(product?.price, discount) : totalPrice * count} <span>جنية</span>
          </span>
        </Button>
        <div className="flex w-40 items-center justify-between gap-1 rounded-lg border bg-white p-4 max-md:w-full">
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
    </div>
  );
};
