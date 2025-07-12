"use client";
import parse from "html-react-parser";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import styles from "./style.module.css";
import { useUpdateEffect } from "react-use";
import { currency } from "@/constants/constansts";
import { Button } from "primereact/button";
import { ProductType } from "@/lib/types";
import Cookies from "js-cookie";
import { useCartHook } from "@/hooks/cart/cart";
import { useRouter } from "next/navigation";

function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export default function DetailPage({ product }: { product: ProductType }) {
  console.log("product", product);
  const [selectedSize, setSelectedSize] = useState<any | null>(
    product?.sizes?.[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState<any | null>(
    product?.colors?.[0] || null,
  );
  const [basePrice] = useState<number>(product?.price_after || product.price);
  const [currentPrice, setCurrentPrice] = useState<number>(
    product?.price_after || product.price,
  );
  // State to track selected variation choices
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string[]>
  >({});

  // Initialize selected variations with required choices if available
  useUpdateEffect(() => {
    if (product?.variations) {
      const initialVariations: Record<string, string[]> = {};
      product.variations.forEach((variation) => {
        if (variation.enable && variation.choices?.length > 0) {
          if (variation.is_required) {
            // For required variations, select a default option
            const defaultChoice =
              variation.choices.find((c) => c.enable && c.price === 0) ||
              variation.choices[0];
            initialVariations[variation.id] = [defaultChoice.id];
          } else {
            // For optional variations, initialize with empty array
            // This ensures the key exists in the selectedVariations object
            initialVariations[variation.id] = [];
          }
        }
      });
      setSelectedVariations(initialVariations);
    }
    calculateTotalPrice();
  }, [product]);

  // Calculate total price based on selected variations
  const calculateTotalPrice = () => {
    // Ensure basePrice is a number
    let total =
      typeof basePrice === "number" ? basePrice : parseFloat(basePrice) || 0;

    // Add price from selected variations
    if (product?.variations) {
      Object.entries(selectedVariations).forEach(([variationId, choiceIds]) => {
        const variation = product.variations?.find((v) => v.id === variationId);
        if (variation) {
          choiceIds.forEach((choiceId) => {
            const choice = variation.choices.find((c) => c.id === choiceId);
            if (choice && choice.enable) {
              // Ensure price is a number
              const choicePrice =
                typeof choice.price === "number"
                  ? choice.price
                  : parseFloat(String(choice.price)) || 0;
              total += choicePrice;
            }
          });
        }
      });
    }

    // Add price from selected size if applicable
    if (selectedSize?.price) {
      const sizePrice =
        typeof selectedSize.price === "number"
          ? selectedSize.price
          : parseFloat(String(selectedSize.price)) || 0;
      total =
        sizePrice +
        (total -
          (typeof basePrice === "number"
            ? basePrice
            : parseFloat(basePrice) || 0));
    }

    // Ensure total is a number before using toFixed
    if (typeof total === "number" && !isNaN(total)) {
      setCurrentPrice(parseFloat(total.toFixed(2)));
    } else {
      // Fallback to base price if total is not a valid number
      const fallbackPrice = product?.price_after || product.price || 0;
      setCurrentPrice(
        typeof fallbackPrice === "number"
          ? fallbackPrice
          : parseFloat(String(fallbackPrice)) || 0,
      );
    }
  };

  useUpdateEffect(() => {
    calculateTotalPrice();
  }, [selectedVariations, selectedSize]);

  const handleSizeSelect = (sizeOption: any) => {
    setSelectedSize(sizeOption);
  };

  // Handle radio button selection (required variations)
  const handleRadioChange = (variationId: string, choiceId: string) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [variationId]: [choiceId],
    }));
  };

  // Handle checkbox selection (optional variations)
  const handleCheckboxChange = (variationId: string, choiceId: string) => {
    setSelectedVariations((prev) => {
      const currentSelections = prev[variationId] || [];
      let newSelections: string[];

      if (currentSelections.includes(choiceId)) {
        // Remove if already selected
        newSelections = currentSelections.filter((id) => id !== choiceId);
      } else {
        // Add if not selected
        newSelections = [...currentSelections, choiceId];
      }

      return {
        ...prev,
        [variationId]: newSelections,
      };
    });
  };

  // Check if a choice is selected
  const isChoiceSelected = (variationId: string, choiceId: string): boolean => {
    return selectedVariations[variationId]?.includes(choiceId) || false;
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="grid grid-cols-1 gap-8 bg-gray-100 p-8 lg:grid-cols-2">
        {/* معرض الصور */}
        <div>
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation
            autoplay
            className={`${styles["product-swiper"]} max-md:h-80`}
          >
            <SwiperSlide>
              {" "}
              <div className="relative aspect-square w-full">
                <Image
                  src={product?.image || "/placeholder-image.jpg"}
                  alt={product?.name || "Product image"}
                  width={321}
                  height={400}
                  // sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  priority
                  className="h-[608px] !w-full !max-w-full object-fill transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
                />
              </div>
            </SwiperSlide>

            {product?.gallery?.map((data: any) => (
              <SwiperSlide key={data?.id}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={data?.image || "/placeholder-image.jpg"}
                    alt={product?.name || "Product image"}
                    width={321}
                    height={400}
                    // sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority
                    className="h-[608px] !w-full !max-w-full object-fill transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <h1 className="mb-4 text-2xl font-semibold">{product.name}</h1>
          <h5 className="my-2 w-fit rounded-lg bg-white px-6 py-2">
            <>الفئة : </> <span>{product?.category?.name}</span>
          </h5>
          <PriceContent product={product} currentPrice={currentPrice} />
          <div className="mt-4">{parse(product?.description || "")}</div>

          {/* Render variations (radio buttons and checkboxes) */}
          {product.variations &&
            product.variations.length > 0 &&
            product.variations.map((variation) => (
              <div key={variation.id} className="mt-6">
                <div className="flex items-center gap-2">
                  <h3 className="mb-2 text-lg font-semibold">
                    {variation.name}
                  </h3>
                  {variation.is_required && (
                    <span className="ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-600">
                      مطلوب
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {variation.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center">
                      {variation.is_required ? (
                        // Radio buttons for required variations
                        <label
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"}`}
                        >
                          <input
                            type="radio"
                            name={`variation-${variation.id}`}
                            value={choice.id}
                            checked={isChoiceSelected(variation.id, choice.id)}
                            onChange={() =>
                              handleRadioChange(variation.id, choice.id)
                            }
                            className="mr-2 h-4 w-4 accent-[var(--second-color)]"
                          />
                          <span className="flex-1">{choice.name}</span>
                          {choice.price > 0 && (
                            <span className="text-sm font-medium text-gray-600">
                              +{choice.price} {currency}
                            </span>
                          )}
                        </label>
                      ) : (
                        // Checkboxes for optional variations
                        <label
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"}`}
                        >
                          <input
                            type="checkbox"
                            name={`variation-${variation.id}`}
                            value={choice.id}
                            checked={isChoiceSelected(variation.id, choice.id)}
                            onChange={() =>
                              handleCheckboxChange(variation.id, choice.id)
                            }
                            className="mr-2 h-4 w-4 accent-[var(--main-color)]"
                          />
                          <span className="flex-1">{choice.name}</span>
                          {choice.price > 0 && (
                            <span className="text-sm font-medium text-gray-600">
                              +{choice.price} {currency}
                            </span>
                          )}
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">الحجم</h3>
              <div className="flex gap-2">
                {product.sizes.map((sizeOption: any) => (
                  <button
                    key={sizeOption.id}
                    aria-label={`Select size ${sizeOption.size}`}
                    className={`rounded-md border px-4 py-2 ${
                      selectedSize?.id === sizeOption.id
                        ? "border-[var(--main-color)] text-[var(--main-color)]"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSizeSelect(sizeOption)}
                  >
                    <bdi>{sizeOption.size}</bdi>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">اللون</h3>
              <div className="flex gap-2">
                {product.colors.map((colorOption: any) => (
                  <button
                    key={colorOption.id}
                    aria-label={`Select color ${colorOption.color}`}
                    className={`rounded-md border px-4 py-2 ${
                      selectedColor?.id === colorOption.id
                        ? "border-[var(--main-color)] text-[var(--main-color)]"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedColor(colorOption)}
                  >
                    <bdi> {colorOption.color}</bdi>
                  </button>
                ))}
              </div>
            </div>
          )}

          <CartActions
            product={product}
            currentColor={selectedColor}
            currentSize={selectedSize}
            selectedVariations={selectedVariations}
          />
        </div>
      </div>
    </div>
  );
}

function PriceContent({
  product,
  currentPrice,
}: {
  product: any;
  currentPrice: any;
}) {
  if (+product?.discount > 0) {
    const priceDiscount = getDiscountedPrice(currentPrice, product.discount);
    return (
      <div className="flex flex-col items-start justify-start gap-1">
        {" "}
        <div className="mb-2 text-lg text-gray-500">
          {product.discount ? (
            <bdi>
              <span> السعر قبل الخصم</span> <span> : </span>
              <span className="line-through">
                {product.price} {currency}
              </span>
            </bdi>
          ) : null}
        </div>
        <bdi className="mb-2 text-xl font-bold text-gray-900">
          <bdi> السعر بعد الخصم</bdi> <span> : </span>
          <span>
            {priceDiscount} {currency}{" "}
          </span>
        </bdi>
        {product.discount ? (
          <bdi className="flex items-center text-lg font-semibold text-green-600">
            <div className="ml-1">
              <span>وفرْت </span>
              <span> : </span>
            </div>
            <span className="ml-1">
              {currentPrice - priceDiscount} {currency}
            </span>
            <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600">
              {product.discount}% خصم
            </span>
          </bdi>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start justify-start gap-1">
        <bdi className="mb-2 text-xl font-bold text-gray-900">
          <bdi>السعر</bdi> <span> : </span>
          <span>
            {currentPrice} {currency}{" "}
          </span>
        </bdi>
      </div>
    );
  }
}

const CartActions = ({
  product,
  currentColor,
  currentSize,
  selectedVariations,
}: {
  product: ProductType;
  currentColor: any;
  currentSize: any;
  selectedVariations: Record<string, string[]>;
}) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const token = Cookies.get("app_token");
  const { loading, addToCart } = useCartHook();
  return (
    <div className="mt-6 flex items-center justify-between gap-3 max-sm:flex-col-reverse">
      <Button
        loading={loading}
        disabled={loading}
        onClick={() => {
          if (!token) router.push("/login");
          else {
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
        }}
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
//  const options: HTMLReactParserOptions = {
//   replace: (domNode) => {
//     // Ensure that the node is an HTML element
//     if (domNode instanceof Element) {
//       // If the element is a <p> and doesn't have a class, add the class "said"
//       if (domNode.name === 'p' && !domNode.attribs?.class) {
//         domNode.attribs.class = 'said';
//       }
//       // If the element is an <h1>
//       if (domNode.name === 'h1') {
//         // If the element already has a class
//         if (domNode.attribs?.class) {
//           // Add the class "said-h1" alongside the existing class
//           domNode.attribs.class += ' said-h1';
//         } else {
//           // If the element doesn't have a class, add the class "said-h1"
//           domNode.attribs.class = 'said-h1';
//         }
//       }
//     }
//     return null; // Don't replace the element itself
//   },
// };
