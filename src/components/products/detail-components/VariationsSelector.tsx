import { Variation, Choice } from "@/lib/types";
import { currency } from "@/constants/constansts";
import { memo } from "react";
import {
    CHOICE_UNAVAILABLE_LABEL,
    NO_CHOICE_AVAILABLE_MESSAGE,
    NO_CHOICE_LABEL,
    availableChoices,
    choicePrice,
    isChoiceAvailable,
    isGroupRequired,
    visibleGroups,
} from "@/lib/product/variations";

interface VariationsSelectorProps {
    variations: Variation[];
    handleRadioChange: (variationId: string, choice: Choice) => void;
    /** Optional groups: a choice, or `null` for «بدون» (empties the group). */
    handleOptionalChange: (variationId: string, choice: Choice | null) => void;
    isChoiceSelected: (variationId: string, choiceId: string) => boolean;
}

const optionClass = (available: boolean, selected: boolean) =>
    `flex w-full items-center gap-2 rounded-md border p-3 ${
        !available
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : selected
              ? "cursor-pointer border-[var(--second-color)] bg-orange-100"
              : "cursor-pointer border-gray-300 bg-white"
    }`;

const radioClass = "mr-2 h-4 w-4 accent-[var(--second-color)]";

// Every group is a native radio group: at most one choice per group (the server refuses
// more). An optional group adds a «بدون» radio, checked while nothing is picked, so the
// customer can leave it empty or clear a pick with the keyboard or a screen reader.
export const VariationsSelector = memo(({
    variations,
    handleRadioChange,
    handleOptionalChange,
    isChoiceSelected,
}: VariationsSelectorProps) => {
    const groups = visibleGroups(variations);
    if (groups.length === 0) {
        return null;
    }

    return (
        <>
            {groups.map((variation) => {
                const required = isGroupRequired(variation);
                const noneAvailable = required && availableChoices(variation).length === 0;
                const name = `variation-${variation.id}`;
                const headingId = `${name}-label`;
                const hasPick = (variation.choices ?? []).some(
                    (c) => isChoiceAvailable(c) && isChoiceSelected(variation.id, c.id),
                );
                return (
                <div
                    key={variation.id}
                    className="mt-6"
                    role="radiogroup"
                    aria-labelledby={headingId}
                    aria-required={required || undefined}
                >
                    <div className="flex items-start justify-between gap-2">
                        <h3 id={headingId} className="mb-3 text-lg font-semibold">{variation.name}</h3>
                        <span
                            className={`rounded px-2 py-1 text-xs ${
                                required
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}>
                            {required ? "مطلوب" : "اختياري"}
                        </span>
                    </div>
                    {noneAvailable && (
                        <p role="status" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                            {NO_CHOICE_AVAILABLE_MESSAGE}
                        </p>
                    )}
                    <div className="flex flex-col gap-3">
                        {!required && (
                            <div className="flex items-center">
                                <label className={optionClass(true, !hasPick)}>
                                    <input
                                        type="radio"
                                        name={name}
                                        value=""
                                        checked={!hasPick}
                                        onChange={() => handleOptionalChange(variation.id, null)}
                                        className={radioClass}
                                    />
                                    <span className="flex-1">{NO_CHOICE_LABEL}</span>
                                </label>
                            </div>
                        )}
                        {(variation.choices ?? []).map((choice) => {
                            const available = isChoiceAvailable(choice);
                            const selected = available && isChoiceSelected(variation.id, choice.id);
                            const price = choicePrice(choice);
                            return (
                            <div key={choice.id} className="flex items-center">
                                <label
                                    className={optionClass(available, selected)}
                                    aria-disabled={!available || undefined}
                                >
                                    <input
                                        type="radio"
                                        name={name}
                                        value={choice.id}
                                        checked={selected}
                                        disabled={!available}
                                        onChange={() =>
                                            required
                                                ? handleRadioChange(variation.id, choice)
                                                : handleOptionalChange(variation.id, choice)
                                        }
                                        className={radioClass}
                                    />
                                    <span className={`flex-1 ${!available ? "line-through" : ""}`}>{choice.name}</span>
                                    {!available ? (
                                        <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                            {CHOICE_UNAVAILABLE_LABEL}
                                        </span>
                                    ) : (
                                        price > 0 && (
                                            <span className="text-sm font-medium text-gray-600">
                                                +{price} {currency}
                                            </span>
                                        )
                                    )}
                                </label>
                            </div>
                            );
                        })}
                    </div>
                </div>
                );
            })}
        </>
    );
});

VariationsSelector.displayName = "VariationsSelector";
