import { useState } from "react";
import { useUpdateEffect } from "react-use";
import { ProductType, SizeOption, ColorOption } from "@/lib/types";

export interface FormattedVariation {
  main_variation_id: string;
  choices: string[];
}

export interface FormattedVariations {
  variations: FormattedVariation[];
}

interface UseProductOptionsReturn {
  selectedSize: SizeOption | null;
  setSelectedSize: (size: SizeOption) => void;
  selectedColor: ColorOption | null;
  setSelectedColor: (color: ColorOption) => void;
  currentPrice: number;
  selectedVariations: FormattedVariations;
  handleRadioChange: (variationId: string, choiceId: string) => void;
  handleCheckboxChange: (variationId: string, choiceId: string) => void;
  isChoiceSelected: (variationId: string, choiceId: string) => boolean;
  totalPrice: number;
}

export function useProductOptions(
  product: ProductType,
): UseProductOptionsReturn {
  // Initialize state at the top level as per React Hook rules
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    product?.sizes?.[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    product?.colors?.[0] || null,
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [basePrice] = useState<number>(product?.price_after || product.price);
  const [currentPrice, setCurrentPrice] = useState<number>(
    product?.price_after || product.price,
  );
  const [rawSelectedVariations, setRawSelectedVariations] = useState<
    Record<string, string[]>
  >({});
  const [selectedVariations, setSelectedVariations] =
    useState<FormattedVariations>({
      variations: [],
    });

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
            initialVariations[variation.id] = [];
          }
        }
      });
      setRawSelectedVariations(initialVariations);
    }
    calculateTotalPrice();
  }, [product]);

  // Calculate total price based on selected variations
  const calculateTotalPrice = () => {
    // Ensure basePrice is a number
    let total =
      typeof basePrice === "number"
        ? basePrice
        : parseFloat(String(basePrice)) || 0;

    // Add price from selected variations
    if (product?.variations) {
      // Debug the product variations and rawSelectedVariations to see what we're working with
      Object.entries(rawSelectedVariations).forEach(
        ([variationId, choiceIds]) => {
          // Add type coercion as a precaution in case ID types don't match
          const variation = product.variations?.find(
            (v) => String(v.id) === String(variationId),
          );

          if (variation) {
            choiceIds.forEach((choiceId) => {
              const choice = variation.choices.find((c) => c.id === choiceId);
              if (choice) {
                // Ensure price is a number
                const choicePrice =
                  typeof choice.price === "number"
                    ? choice.price
                    : parseFloat(String(choice.price)) || 0;

                // Add the choice price to the total
                total += choicePrice;
                setTotalPrice(total);
              }
            });
          }
        },
      );
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
            : parseFloat(String(basePrice)) || 0));
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

  // Format selected variations in the required structure
  const formatSelectedVariations = () => {
    const formatted: FormattedVariation[] = Object?.entries(
      rawSelectedVariations,
    )
      .filter(([, choices]) => choices.length > 0) // Only include variations with selected choices
      .map(([variationId, choices]) => ({
        main_variation_id: variationId,
        choices,
      }));

    setSelectedVariations({ variations: formatted });
  };

  useUpdateEffect(() => {
    formatSelectedVariations();
    calculateTotalPrice();
  }, [rawSelectedVariations]);

  useUpdateEffect(() => {
    calculateTotalPrice();
  }, [selectedSize]);

  // Handle radio button selection (required variations)
  const handleRadioChange = (variationId: string, choiceId: string) => {
    setRawSelectedVariations((prev) => ({
      ...prev,
      [variationId]: [choiceId],
    }));
  };

  // Handle checkbox selection (optional variations)
  const handleCheckboxChange = (variationId: string, choiceId: string) => {
    setRawSelectedVariations((prev) => {
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
    return rawSelectedVariations[variationId]?.includes(choiceId) || false;
  };

  return {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    currentPrice,
    selectedVariations,
    handleRadioChange,
    handleCheckboxChange,
    isChoiceSelected,
    totalPrice,
  };
}
