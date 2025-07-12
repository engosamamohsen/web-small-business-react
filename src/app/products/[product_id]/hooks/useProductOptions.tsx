import { useState } from "react";
import { useUpdateEffect } from "react-use";
import { ProductType, SizeOption, ColorOption, Variation } from "@/lib/types";

interface UseProductOptionsReturn {
  selectedSize: SizeOption | null;
  setSelectedSize: (size: SizeOption) => void;
  selectedColor: ColorOption | null;
  setSelectedColor: (color: ColorOption) => void;
  currentPrice: number;
  selectedVariations: Record<string, string[]>;
  handleRadioChange: (variationId: string, choiceId: string) => void;
  handleCheckboxChange: (variationId: string, choiceId: string) => void;
  isChoiceSelected: (variationId: string, choiceId: string) => boolean;
  calculateTotalPrice: () => void;
}

export function useProductOptions(product: ProductType): UseProductOptionsReturn {
  // Initialize state at the top level as per React Hook rules
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    product?.sizes?.[0] || null
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    product?.colors?.[0] || null
  );
  const [basePrice] = useState<number>(product?.price_after || product.price);
  const [currentPrice, setCurrentPrice] = useState<number>(
    product?.price_after || product.price
  );
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
      typeof basePrice === "number" ? basePrice : parseFloat(String(basePrice)) || 0;

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
          : parseFloat(String(fallbackPrice)) || 0
      );
    }
  };

  useUpdateEffect(() => {
    calculateTotalPrice();
  }, [selectedVariations, selectedSize]);

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
    calculateTotalPrice
  };
}
