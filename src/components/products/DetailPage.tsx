"use client";
import parse from "html-react-parser";
import { ProductType } from "@/lib/types";
import { useProductOptions } from "./hooks/useProductOptions";
import { useMemo } from "react";

// Import all components
import {
    ProductGallery,
    PriceDisplay,
    VariationsSelector,
    ProductOptions,
    CartActions,
    ProductSpecifications,
} from "./detail-components";

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
        currentPrice,
    } = useProductOptions(product);

    // Convert selectedVariations to the format expected by CartActions
    const formattedVariations = useMemo(() => {
        const variations = Object.entries(selectedVariations).map(([variationId, choice]) => ({
            main_variation_id: variationId,
            choices: [choice.id],
        }));
        return { variations };
    }, [selectedVariations]);

    // Memoize the parsed HTML description
    const parsedDescription = useMemo(() => {
        return parse(product?.description || "");
    }, [product?.description]);

    return (
        <div className="container flex min-h-screen flex-col items-center justify-center py-10">
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
                    <div className="mt-4">{parsedDescription}</div>
                    {product?.steps?.length && (
                        <ul className="mt-4 list-disc">
                            {product?.steps?.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    )}

                    {/* Description steps */}
                    {product?.description_steps && product.description_steps.length > 0 && (
                        <div className="mt-4">
                            <h3 className="mb-3 text-lg font-semibold">المواصفات الأساسية</h3>
                            <ul className="space-y-2">
                                {product.description_steps.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="ml-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]"></span>
                                        <span className="text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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

                    {/* Cart actions */}
                    <CartActions
                        product={product}
                        productVariations={product?.variations || []}
                        totalPrice={currentPrice}
                        currentColor={selectedColor}
                        currentSize={selectedSize}
                        selectedVariations={formattedVariations}
                    />
                </div>
            </div>
            {/* Product specifications table */}
            <div className="flex w-full items-center justify-between">
                {product.technicalInformation &&
                    product.technicalInformation.length > 0 && (
                        <ProductSpecifications
                            specifications={product.technicalInformation}
                            className="w-full flex-1"
                        />
                    )}
            </div>
        </div>
    );
}
