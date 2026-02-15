import { useState, useEffect, useMemo } from "react";
import { ProductType, Choice, SizeOption, ColorOption } from "@/lib/types";

export type FormattedVariations = Record<string, Choice>;

export function useProductOptions(product: ProductType) {
    const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
    const [selectedVariations, setSelectedVariations] = useState<FormattedVariations>({});

    // Initialize defaults
    useEffect(() => {
        if (product) {
            if (product.sizes?.length) setSelectedSize(product.sizes[0]);
            if (product.colors?.length) setSelectedColor(product.colors[0]);

            // Initialize variations with default selections if any
            const initialVariations: FormattedVariations = {};
            if (product.variations) {
                product.variations.forEach(variation => {
                    const defaultChoice = variation.choices.find(c => c.enable);
                    if (defaultChoice) {
                        initialVariations[variation.id] = defaultChoice;
                    }
                });
                setSelectedVariations(initialVariations);
            }
        }
    }, [product]);

    const handleRadioChange = (variationId: string, choice: Choice) => {
        setSelectedVariations(prev => ({
            ...prev,
            [variationId]: choice
        }));
    };

    const handleCheckboxChange = (variationId: string, choice: Choice, checked: boolean) => {
        // For checkboxes, we might want to handle multiple selections differently
        // This implementation assumes single choice per variation for simplicity
        // or you might want to adapt based on your specific needs
        if (checked) {
            handleRadioChange(variationId, choice);
        } else {
            const newVariations = { ...selectedVariations };
            delete newVariations[variationId];
            setSelectedVariations(newVariations);
        }
    };

    const isChoiceSelected = (variationId: string, choiceId: string) => {
        return selectedVariations[variationId]?.id === choiceId;
    };

    // Calculate dynamic price based on selections
    const currentPrice = useMemo(() => {
        let price = product.price_after || product.price;

        // Add variations price
        Object.values(selectedVariations).forEach(choice => {
            if (choice.price) price += choice.price;
        });

        // Add size price diff if applicable
        if (selectedSize?.price) {
            const sizePrice = typeof selectedSize.price === 'string' ? parseFloat(selectedSize.price) : selectedSize.price;
            if (!isNaN(sizePrice)) price = sizePrice;
        }

        return price;
    }, [product, selectedVariations, selectedSize]);

    return {
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        selectedVariations,
        handleRadioChange,
        handleCheckboxChange,
        isChoiceSelected,
        currentPrice
    };
}

