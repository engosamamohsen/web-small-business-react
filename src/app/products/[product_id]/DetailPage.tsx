"use client";
import parse from "html-react-parser";
import { ProductType } from "@/lib/types";
import { useProductOptions } from "./hooks/useProductOptions";
import type { FormattedVariations } from "./hooks/useProductOptions";

// Import all components
import {
  ProductGallery,
  PriceDisplay,
  VariationsSelector,
  ProductOptions,
  CartActions,
} from "./components";

export default function DetailPage({ product }: { product: ProductType }) {
  // Extract all product options logic to a custom hook
  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    selectedVariations,
    handleRadioChange,
    handleCheckboxChange,
    isChoiceSelected,
    totalPrice,
  } = useProductOptions(product);
  // Instead, use it in event handlers or useEffect with proper dependencies
  console.log("product", product);

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="grid grid-cols-1 gap-8 bg-gray-100 p-8 lg:grid-cols-2">
        {/* Product gallery */}
        <div>
          <ProductGallery product={product} />
        </div>

        <div>
          <h1 className="mb-4 text-2xl font-semibold">{product.name}</h1>
          <h5 className="my-2 w-fit rounded-lg bg-white px-6 py-2">
            <>الفئة : </> <span>{product?.category?.name}</span>
          </h5>

          {/* Price display */}
          <PriceDisplay product={product} currentPrice={product?.price || 0} />

          {/* Product description */}
          <div className="mt-4">{parse(product?.description || "")}</div>

          {/* Variations selector */}
          {product.variations && product.variations.length > 0 && (
            <VariationsSelector
              variations={product.variations}
              handleRadioChange={handleRadioChange}
              handleCheckboxChange={handleCheckboxChange}
              isChoiceSelected={isChoiceSelected}
            />
          )}

          {/* Size and color options */}
          <ProductOptions
            sizes={product.sizes}
            colors={product.colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeSelect={setSelectedSize}
            onColorSelect={setSelectedColor}
          />
          <div className="mt-10 flex items-center justify-between font-semibold">
            <h6> اجمالي السعر </h6>
            <h5 className="flex items-center gap-1">
              {" "}
              {totalPrice}
              <span>جنية</span>
            </h5>
          </div>
          {/* Cart actions */}
          <CartActions
            product={product}
            totalPrice={totalPrice}
            currentColor={selectedColor}
            currentSize={selectedSize}
            selectedVariations={selectedVariations as FormattedVariations}
          />
        </div>
      </div>
    </div>
  );
}

// Clean up commented code at the end of the file
/* HTMLReactParserOptions have been moved or are no longer used */
