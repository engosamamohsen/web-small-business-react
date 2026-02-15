import { SizeOption, ColorOption } from "@/lib/types";
import { memo } from "react";

interface ProductOptionsProps {
    sizes?: SizeOption[];
    colors?: ColorOption[];
    selectedSize: SizeOption | null;
    selectedColor: ColorOption | null;
    onSizeSelect: (size: SizeOption) => void;
    onColorSelect: (color: ColorOption) => void;
}

export const ProductOptions = memo(({
    sizes,
    colors,
    selectedSize,
    selectedColor,
    onSizeSelect,
    onColorSelect,
}: ProductOptionsProps) => {
    return (
        <>
            {sizes && sizes.length > 0 && (
                <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">الحجم</h3>
                    <div className="flex gap-2">
                        {sizes.map((sizeOption) => (
                            <button
                                key={sizeOption.id}
                                aria-label={`Select size ${sizeOption.size}`}
                                className={`rounded-md border px-4 py-2 ${selectedSize?.id === sizeOption.id
                                    ? "border-[var(--main-color)] text-[var(--main-color)]"
                                    : "border-gray-300"
                                    }`}
                                onClick={() => onSizeSelect(sizeOption)}
                            >
                                <bdi>{sizeOption.size}</bdi>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {colors && colors.length > 0 && (
                <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">اللون</h3>
                    <div className="flex gap-2">
                        {colors.map((colorOption) => (
                            <button
                                key={colorOption.id}
                                aria-label={`Select color ${colorOption.color}`}
                                className={`rounded-md border px-4 py-2 ${selectedColor?.id === colorOption.id
                                    ? "border-[var(--main-color)] text-[var(--main-color)]"
                                    : "border-gray-300"
                                    }`}
                                onClick={() => onColorSelect(colorOption)}
                            >
                                <bdi> {colorOption.color}</bdi>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
});

ProductOptions.displayName = "ProductOptions";
