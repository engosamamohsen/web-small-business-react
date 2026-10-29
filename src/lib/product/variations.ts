// ─── Product option groups (variations) ──────────────────────────────────────
//
// The API sends each product's option groups as
//   { id, name, is_required, enable, choices: [{ id, name, enable, price }] }
// (Laravel ProductVariationResource / HomeController). The rules, in one place so
// the product page, the product-card quick add, the cart and the order payloads agree:
//
//   • A group with `enable: false` is switched off by the owner: not shown, never sent.
//   • A choice with `enable: false` is unavailable: shown disabled, never selected.
//   • Required group, exactly ONE available choice → selected for the customer (its
//     extra price is part of the price shown and of the cart line).
//   • Required group, several available choices → nothing pre-selected; the customer
//     must pick before the product can be added. The API has no "default" flag.
//   • Required group with NO available choice → the product can't be added.
//   • Optional group → may stay empty; nothing is ever pre-selected (a paid extra
//     must be the customer's choice). It is single-select like a required group (a
//     radio list with a «بدون» choice); picking «بدون» clears it.
//   • At most ONE choice per group, required or optional (the server refuses more).
//     Its extra price is counted exactly once. The payload builders enforce it too.
//   • Orders send choice ids only ({ main_variation_id, choices: [id] }); the server
//     prices them itself.

import type { Choice, Variation } from "@/lib/types";

/** Selected choice per group id. */
export type VariationSelection = Record<string, Choice>;

/** Cart / order shape: names and prices for the cart UI and the WhatsApp message. */
export interface CartVariation {
    main_variation_id: string;
    main_variation_name: string;
    choices: { id: string; name: string; price: number }[];
}

/** What the basket and guest-buy endpoints read. */
export interface ApiVariation {
    main_variation_id: number | string;
    choices: Array<number | string>;
}

export const NO_CHOICE_AVAILABLE_MESSAGE = "لا يوجد خيار متاح لهذا المنتج حاليًا";
export const CHOICE_UNAVAILABLE_LABEL = "غير متاح";
/** The "no pick" radio of an optional group. */
export const NO_CHOICE_LABEL = "بدون";

export function missingChoiceMessage(groupName?: string): string {
    return groupName ? `من فضلك اختر ${groupName} أولًا` : "من فضلك اختر الخيارات المطلوبة أولًا";
}

/** The API sends booleans, but older endpoints sent 1/0 or "1"/"0". */
export function flag(value: unknown, fallback = false): boolean {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "string") return value === "1" || value.toLowerCase() === "true";
    return Boolean(value);
}

const sameId = (a: unknown, b: unknown) => String(a) === String(b);

export function isGroupActive(group: Variation): boolean {
    return flag(group?.enable, true);
}

export function isGroupRequired(group: Variation): boolean {
    return flag(group?.is_required);
}

export function isChoiceAvailable(choice: Choice): boolean {
    return flag(choice?.enable, true);
}

export function choicePrice(choice: Pick<Choice, "price"> | null | undefined): number {
    const n = Number(choice?.price);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Groups the customer sees (the owner's switched-off groups are left out). */
export function visibleGroups(variations: Variation[] | null | undefined): Variation[] {
    return (variations ?? []).filter((g) => g && isGroupActive(g));
}

export function availableChoices(group: Variation): Choice[] {
    return (group?.choices ?? []).filter(isChoiceAvailable);
}

/** Pre-selection: only required groups with exactly one available choice. */
export function initialSelection(variations: Variation[] | null | undefined): VariationSelection {
    const selection: VariationSelection = {};
    for (const group of visibleGroups(variations)) {
        if (!isGroupRequired(group)) continue;
        const available = availableChoices(group);
        if (available.length === 1) selection[String(group.id)] = available[0];
    }
    return selection;
}

function findGroup(variations: Variation[] | null | undefined, groupId: string): Variation | undefined {
    return visibleGroups(variations).find((g) => sameId(g.id, groupId));
}

/**
 * Pick `choice` in its group (replacing the previous pick). Unavailable choices,
 * unknown or switched-off groups leave the selection unchanged.
 */
export function selectChoice(
    variations: Variation[] | null | undefined,
    selection: VariationSelection,
    groupId: string,
    choice: Choice,
): VariationSelection {
    const group = findGroup(variations, groupId);
    if (!group || !isChoiceAvailable(choice)) return selection;
    const real = (group.choices ?? []).find((c) => sameId(c.id, choice.id));
    if (!real || !isChoiceAvailable(real)) return selection;
    return { ...selection, [String(group.id)]: real };
}

/**
 * Clear a group's pick. Only optional groups can be emptied; a required group keeps
 * its pick (the customer switches it by picking another choice).
 */
export function clearChoice(
    variations: Variation[] | null | undefined,
    selection: VariationSelection,
    groupId: string,
): VariationSelection {
    const group = findGroup(variations, groupId);
    if (!group || isGroupRequired(group) || !(String(group.id) in selection)) return selection;
    const next = { ...selection };
    delete next[String(group.id)];
    return next;
}

/** Drop picks for unknown / switched-off groups and unavailable choices. */
export function sanitizeSelection(
    variations: Variation[] | null | undefined,
    selection: VariationSelection,
): VariationSelection {
    const clean: VariationSelection = {};
    for (const group of visibleGroups(variations)) {
        const picked = selection[String(group.id)];
        if (!picked) continue;
        const real = (group.choices ?? []).find((c) => sameId(c.id, picked.id));
        if (real && isChoiceAvailable(real)) clean[String(group.id)] = real;
    }
    return clean;
}

export type SelectionCheck =
    | { ok: true }
    | { ok: false; reason: "no_choice_available" | "missing_choice"; groupId: string; message: string };

/** Can the product be added with this selection? First problem wins (in group order). */
export function validateSelection(
    variations: Variation[] | null | undefined,
    selection: VariationSelection,
): SelectionCheck {
    const clean = sanitizeSelection(variations, selection);
    const groups = visibleGroups(variations).filter(isGroupRequired);
    // A required group that can never be satisfied blocks the product outright.
    for (const group of groups) {
        if (availableChoices(group).length === 0) {
            return { ok: false, reason: "no_choice_available", groupId: String(group.id), message: NO_CHOICE_AVAILABLE_MESSAGE };
        }
    }
    for (const group of groups) {
        if (!clean[String(group.id)]) {
            return { ok: false, reason: "missing_choice", groupId: String(group.id), message: missingChoiceMessage(group.name) };
        }
    }
    return { ok: true };
}

/** Sum of the selected extras: one choice per group, each counted once. */
export function selectionExtra(variations: Variation[] | null | undefined, selection: VariationSelection): number {
    const total = Object.values(sanitizeSelection(variations, selection)).reduce((sum, c) => sum + choicePrice(c), 0);
    return Math.round(total * 100) / 100;
}

/** Selection in the cart's shape, in a stable order (by group id) so equal picks compare equal. */
export function toCartVariations(
    variations: Variation[] | null | undefined,
    selection: VariationSelection,
): CartVariation[] {
    const clean = sanitizeSelection(variations, selection);
    return visibleGroups(variations)
        .filter((g) => clean[String(g.id)])
        .map((g) => {
            const c = clean[String(g.id)];
            return {
                main_variation_id: String(g.id),
                main_variation_name: g.name ?? "",
                choices: [{ id: c.id, name: c.name, price: choicePrice(c) }],
            };
        })
        .sort(compareGroupIds);
}

function compareGroupIds(a: { main_variation_id: unknown }, b: { main_variation_id: unknown }): number {
    const x = Number(a.main_variation_id);
    const y = Number(b.main_variation_id);
    if (Number.isFinite(x) && Number.isFinite(y)) return x - y;
    return String(a.main_variation_id).localeCompare(String(b.main_variation_id));
}

const asId = (id: unknown): number | string => {
    const n = Number(id);
    return Number.isFinite(n) && String(id).trim() !== "" ? n : String(id);
};

const rawChoiceId = (c: any): unknown => (c && typeof c === "object" ? c.id : c);
const hasId = (id: unknown) => id != null && String(id).trim() !== "";

/**
 * A cart line's variations reduced to the server's rule: each group once (the first
 * entry for a group id wins) and at most ONE choice in it (its first choice with an id).
 * Guards against old carts saved while optional groups allowed several ticks.
 */
function onePerGroup(cartVariations: unknown): Array<{ groupId: unknown; choice: any }> {
    if (!Array.isArray(cartVariations)) return [];
    const seen = new Set<string>();
    const out: Array<{ groupId: unknown; choice: any }> = [];
    for (const v of cartVariations) {
        if (!v || !hasId(v.main_variation_id) || !Array.isArray(v.choices)) continue;
        const key = String(v.main_variation_id);
        if (seen.has(key)) continue;
        const choice = v.choices.find((c: any) => hasId(rawChoiceId(c)));
        if (choice === undefined) continue;
        seen.add(key);
        out.push({ groupId: v.main_variation_id, choice });
    }
    return out;
}

/**
 * Cart variations (rich or already ids) → the API's `{ main_variation_id, choices: [id] }`.
 * Ids only (the server prices them), numbers where numeric, groups sorted, every group
 * once with exactly one choice id, so the server accepts it and its "same line" check
 * (it compares the JSON) matches re-adds.
 */
export function toApiVariations(cartVariations: unknown): ApiVariation[] {
    return onePerGroup(cartVariations)
        .map(({ groupId, choice }) => ({
            main_variation_id: asId(groupId),
            choices: [asId(rawChoiceId(choice))],
        }))
        .sort(compareGroupIds);
}

/** Extras inside a cart line's variations: the same one choice per group that is sent. */
export function cartVariationsExtra(cartVariations: unknown): number {
    const total = onePerGroup(cartVariations).reduce((sum, { choice }) => sum + choicePrice(choice), 0);
    return Math.round(total * 100) / 100;
}

/** Two adds are the same cart line when product, choice ids, size, colour and note match. */
export function cartLineKey(product: {
    id?: unknown;
    variations?: unknown;
    currentSize?: { id?: unknown } | null;
    currentColor?: { id?: unknown } | null;
    product_note?: string | null;
}): string {
    return JSON.stringify([
        product?.id != null ? String(product.id) : null,
        toApiVariations(product?.variations).map((v) => [String(v.main_variation_id), v.choices.map(String).sort()]),
        product?.currentSize?.id ?? null,
        product?.currentColor?.id ?? null,
        product?.product_note || null,
    ]);
}

export type QuickAddPlan =
    | { kind: "add"; variations: CartVariation[]; extra: number }
    | { kind: "choose" }
    | { kind: "unavailable"; message: string };

/**
 * What a product card's "add" button does. It adds straight away only when no group
 * needs the customer: every required group has exactly one available choice and no
 * optional group has anything to offer. Otherwise it opens the product page.
 */
export function quickAddPlan(variations: Variation[] | null | undefined): QuickAddPlan {
    const groups = visibleGroups(variations);
    const auto = initialSelection(groups);
    const check = validateSelection(groups, auto);
    if (!check.ok && check.reason === "no_choice_available") {
        return { kind: "unavailable", message: check.message };
    }
    const optionalWithChoices = groups.some((g) => !isGroupRequired(g) && availableChoices(g).length > 0);
    if (!check.ok || optionalWithChoices) return { kind: "choose" };
    return { kind: "add", variations: toCartVariations(groups, auto), extra: selectionExtra(groups, auto) };
}

/** Extra included in the price a product card shows (the auto-selected choices only). */
export function autoSelectedExtra(variations: Variation[] | null | undefined): number {
    return selectionExtra(variations, initialSelection(variations));
}
