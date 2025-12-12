import { useState, useMemo, useCallback } from "react";
import { ProductType, SizeOption, ColorOption, Variation, Choice } from "@/lib/types";

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

type RawVariationsState = Record<string, string[]>;

export function useProductOptions(product: ProductType): UseProductOptionsReturn {
  const [rawSelectedVariations, setRawSelectedVariations] = useState<RawVariationsState>(() => {
    const initial: RawVariationsState = {};
    if (product?.variations) {
      product.variations.forEach((variation: Variation) => {
        if (variation.enable && variation.choices?.length > 0) {
          initial[variation.id] = [];
        }
      });
    }
    return initial;
  });

  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const basePrice: number = useMemo((): number => {
    const price = product?.price_after ?? product?.price ?? 0;
    return typeof price === "number" ? price : parseFloat(String(price)) || 0;
  }, [product?.price_after, product?.price]);

  const currentPrice: number = useMemo((): number => {
    let total: number = basePrice;

    if (product?.variations) {
      product.variations.forEach((variation: Variation) => {
        const selectedChoices: string[] = rawSelectedVariations[variation.id] || [];
        selectedChoices.forEach((choiceId: string) => {
          const choice: Choice | undefined = variation.choices.find((c: Choice) => c.id === choiceId);
          if (choice?.price) {
            const choicePrice: number = typeof choice.price === "number" ? choice.price : parseFloat(String(choice.price)) || 0;
            total += choicePrice;
          }
        });
      });
    }

    if (selectedSize?.price) {
      const sizePrice: number = typeof selectedSize.price === "number" ? selectedSize.price : parseFloat(String(selectedSize.price)) || 0;
      total = sizePrice + (total - basePrice);
    }

    return parseFloat(total.toFixed(2));
  }, [basePrice, product?.variations, rawSelectedVariations, selectedSize]);

  const selectedVariations: FormattedVariations = useMemo((): FormattedVariations => {
    const entries = Object.entries(rawSelectedVariations) as Array<[string, string[]]>;
    const formatted: FormattedVariation[] = entries
      .filter((entry) => entry[1].length > 0)
      .map((entry) => ({
        main_variation_id: entry[0],
        choices: entry[1],
      }));

    return { variations: formatted };
  }, [rawSelectedVariations]);

  const handleRadioChange = useCallback((variationId: string, choiceId: string): void => {
    setRawSelectedVariations((prev: RawVariationsState): RawVariationsState => ({
      ...prev,
      [variationId]: [choiceId],
    }));
  }, []);

  const handleCheckboxChange = useCallback((variationId: string, choiceId: string): void => {
    setRawSelectedVariations((prev: RawVariationsState): RawVariationsState => {
      const currentSelections: string[] = prev[variationId] || [];
      const newSelections: string[] = currentSelections.includes(choiceId)
        ? currentSelections.filter((id: string) => id !== choiceId)
        : [...currentSelections, choiceId];

      return {
        ...prev,
        [variationId]: newSelections,
      };
    });
  }, []);

  const isChoiceSelected = useCallback((variationId: string, choiceId: string): boolean => {
    return rawSelectedVariations[variationId]?.includes(choiceId) ?? false;
  }, [rawSelectedVariations]);

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
    totalPrice: currentPrice,
  };
}