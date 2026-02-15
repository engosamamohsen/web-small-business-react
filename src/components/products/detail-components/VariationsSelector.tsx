import { Variation, Choice } from "@/lib/types";
import { currency } from "@/constants/constansts";
import { memo } from "react";

interface VariationsSelectorProps {
    variations: Variation[];
    handleRadioChange: (variationId: string, choice: Choice) => void;
    handleCheckboxChange: (variationId: string, choice: Choice, checked: boolean) => void;
    isChoiceSelected: (variationId: string, choiceId: string) => boolean;
}

export const VariationsSelector = memo(({
    variations,
    handleRadioChange,
    handleCheckboxChange,
    isChoiceSelected,
}: VariationsSelectorProps) => {
    if (!variations || variations.length === 0) {
        return null;
    }

    return (
        <>
            {variations.map((variation) => (
                <div key={variation.id} className="mt-6">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="mb-3 text-lg font-semibold">{variation.name}</h3>
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
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id)
                                            ? "border-[var(--second-color)] bg-orange-100"
                                            : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`variation-${variation.id}`}
                                            value={choice.id}
                                            checked={isChoiceSelected(variation.id, choice.id)}
                                            onChange={() =>
                                                handleRadioChange(variation.id, choice)
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
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id)
                                            ? "border-[var(--second-color)] bg-orange-100"
                                            : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={`variation-${variation.id}`}
                                            value={choice.id}
                                            checked={isChoiceSelected(variation.id, choice.id)}
                                            onChange={(e) =>
                                                handleCheckboxChange(variation.id, choice, e.target.checked)
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
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
});

VariationsSelector.displayName = "VariationsSelector";
