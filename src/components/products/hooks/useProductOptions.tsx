import { useState, useEffect, useMemo, useRef } from "react";
import { ProductType, Choice, SizeOption, ColorOption } from "@/lib/types";
import {
    clearChoice,
    initialSelection,
    selectChoice,
    selectionExtra,
    validateSelection,
} from "@/lib/product/variations";

export type FormattedVariations = Record<string, Choice>;

export function useProductOptions(product: ProductType) {
    // Defaults. Option groups follow src/lib/product/variations.ts: only a required
    // group with exactly one available choice is pre-selected; everything else waits
    // for the customer (no defaults, never a paid optional extra). They are the
    // INITIAL state, so the server-rendered HTML already shows them ticked and the
    // price includes them: no flash before hydration, no hydration mismatch.
    const [selectedSize, setSelectedSize] = useState<SizeOption | null>(() => product?.sizes?.[0] ?? null);
    const [selectedColor, setSelectedColor] = useState<ColorOption | null>(() => product?.colors?.[0] ?? null);
    const [selectedVariations, setSelectedVariations] = useState<FormattedVariations>(() =>
        product ? initialSelection(product.variations) : {},
    );

    // A different product (client-side change): reset to its defaults. The first
    // product is already covered by the initial state above.
    const initialProduct = useRef(product);
    useEffect(() => {
        if (product === initialProduct.current) return;
        initialProduct.current = product;
        if (product) {
            if (product.sizes?.length) setSelectedSize(product.sizes[0]);
            if (product.colors?.length) setSelectedColor(product.colors[0]);
            setSelectedVariations(initialSelection(product.variations));
        }
    }, [product]);

    // Required groups: pick (replaces the group's previous pick). Unavailable choices are ignored.
    const handleRadioChange = (variationId: string, choice: Choice) => {
        setSelectedVariations(prev => selectChoice(product.variations, prev, variationId, choice));
    };

    // Optional groups: single-select like required ones (at most one choice per group,
    // the server refuses more). `null` is the «بدون» radio: it empties the group.
    const handleOptionalChange = (variationId: string, choice: Choice | null) => {
        setSelectedVariations(prev =>
            choice
                ? selectChoice(product.variations, prev, variationId, choice)
                : clearChoice(product.variations, prev, variationId),
        );
    };

    const isChoiceSelected = (variationId: string, choiceId: string) => {
        return String(selectedVariations[variationId]?.id) === String(choiceId);
    };

    // Whether the current selection can be added, and why not (Arabic message).
    const selectionCheck = useMemo(
        () => validateSelection(product?.variations, selectedVariations),
        [product, selectedVariations],
    );

    // Per-piece prices, the way the server prices the order (OrderCalculationService):
    //   basePrice    - product price (or the selected size's own price), BEFORE discount
    //   optionsExtra - the selected paid extras, each choice once
    //   currentPrice - basePrice + optionsExtra (the pre-discount total)
    // The product discount applies to the BASE only; extras are added at full price,
    // once per piece: price 100, +10 extra, 10% off -> 90 + 10 = 100 (not 110 x 0.9 = 99).
    // PriceDisplay / CartActions do that with getLinePrices (src/lib/pricing-utils.ts).
    const basePrice = useMemo(() => {
        let price = Number(product.price) || 0;
        // A size with its own price replaces the base price (not the extras)
        if (selectedSize?.price) {
            const sizePrice = typeof selectedSize.price === 'string' ? parseFloat(selectedSize.price) : selectedSize.price;
            if (!isNaN(sizePrice)) price = sizePrice;
        }
        return price;
    }, [product, selectedSize]);

    const optionsExtra = useMemo(
        () => selectionExtra(product.variations, selectedVariations),
        [product, selectedVariations],
    );

    const currentPrice = Math.round((basePrice + optionsExtra) * 100) / 100;

    return {
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        selectedVariations,
        handleRadioChange,
        handleOptionalChange,
        isChoiceSelected,
        selectionCheck,
        basePrice,
        optionsExtra,
        currentPrice
    };
}

