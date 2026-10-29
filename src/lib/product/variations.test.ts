import { describe, it, expect } from "vitest";
import type { Choice, Variation } from "@/lib/types";
import {
    NO_CHOICE_AVAILABLE_MESSAGE,
    autoSelectedExtra,
    cartLineKey,
    cartVariationsExtra,
    clearChoice,
    initialSelection,
    quickAddPlan,
    sanitizeSelection,
    selectChoice,
    selectionExtra,
    toApiVariations,
    toCartVariations,
    validateSelection,
    visibleGroups,
} from "./variations";

const choice = (id: number, price = 0, enable: boolean | number = true): Choice =>
    ({ id: id as unknown as string, name: `c${id}`, price, enable }) as Choice;

const group = (
    id: number,
    choices: Choice[],
    is_required: boolean | number | string = true,
    enable: boolean | number = true,
): Variation => ({ id: id as unknown as string, name: `g${id}`, is_required, enable, choices }) as Variation;

describe("required group with exactly one available choice", () => {
    const vars = [group(1, [choice(11, 5)])];

    it("is auto-selected and its extra is in the price", () => {
        const sel = initialSelection(vars);
        expect(sel["1"]?.id).toBe(11);
        expect(selectionExtra(vars, sel)).toBe(5);
        expect(validateSelection(vars, sel)).toEqual({ ok: true });
    });

    it("counts only the available choice when the others are unavailable", () => {
        const v = [group(1, [choice(11, 3, false), choice(12, 7), choice(13, 9, 0)])];
        expect(initialSelection(v)["1"]?.id).toBe(12);
        expect(autoSelectedExtra(v)).toBe(7);
    });

    it("accepts the API's older 1/0 and '1' flags", () => {
        const v = [group(1, [choice(11, 2)], 1), group(2, [choice(21, 4)], "1")];
        expect(Object.keys(initialSelection(v)).sort()).toEqual(["1", "2"]);
    });
});

describe("required group with several available choices", () => {
    const vars = [group(1, [choice(11, 0), choice(12, 10)])];

    it("pre-selects nothing", () => {
        expect(initialSelection(vars)).toEqual({});
    });

    it("blocks adding until the customer picks, with an Arabic message naming the group", () => {
        const check = validateSelection(vars, {});
        expect(check.ok).toBe(false);
        if (!check.ok) {
            expect(check.reason).toBe("missing_choice");
            expect(check.message).toContain("g1");
            expect(check.message).toMatch(/اختر/);
        }
        const picked = selectChoice(vars, {}, "1", choice(12, 10));
        expect(validateSelection(vars, picked)).toEqual({ ok: true });
        expect(selectionExtra(vars, picked)).toBe(10);
    });

    it("replaces the pick instead of adding a second choice", () => {
        let sel = selectChoice(vars, {}, "1", choice(11));
        sel = selectChoice(vars, sel, "1", choice(12, 10));
        expect(Object.keys(sel)).toEqual(["1"]);
        expect(selectionExtra(vars, sel)).toBe(10);
    });

    it("can't be emptied once picked", () => {
        const sel = selectChoice(vars, {}, "1", choice(11));
        expect(clearChoice(vars, sel, "1")).toBe(sel);
    });
});

describe("unavailable choices", () => {
    const vars = [group(1, [choice(11, 5, false), choice(12, 1)])];

    it("are never selected", () => {
        const sel = selectChoice(vars, {}, "1", choice(11, 5));
        expect(sel).toEqual({});
        // Even if the UI passes a stale "enabled" copy, the product's own choice wins.
        expect(selectChoice(vars, {}, "1", choice(11, 5, true))).toEqual({});
    });

    it("are dropped from a stale selection and never priced", () => {
        const stale = { "1": choice(11, 5, true) };
        expect(sanitizeSelection(vars, stale)).toEqual({});
        expect(selectionExtra(vars, stale)).toBe(0);
    });

    it("a required group with no available choice blocks the product", () => {
        const none = [group(1, [choice(11, 0, false), choice(12, 3, false)]), group(2, [choice(21)])];
        const check = validateSelection(none, initialSelection(none));
        expect(check).toMatchObject({ ok: false, reason: "no_choice_available", message: NO_CHOICE_AVAILABLE_MESSAGE });
        expect(quickAddPlan(none)).toEqual({ kind: "unavailable", message: NO_CHOICE_AVAILABLE_MESSAGE });
    });

    it("a required group with no choices at all blocks the product too", () => {
        expect(validateSelection([group(1, [])], {})).toMatchObject({ ok: false, reason: "no_choice_available" });
    });
});

describe("optional groups", () => {
    const vars = [group(1, [choice(11, 15)], false), group(2, [choice(21, 0), choice(22, 4)], false)];

    it("are never pre-selected, even a single paid choice", () => {
        expect(initialSelection(vars)).toEqual({});
        expect(autoSelectedExtra(vars)).toBe(0);
    });

    it("can be left empty", () => {
        expect(validateSelection(vars, {})).toEqual({ ok: true });
    });

    it("can be picked and unpicked", () => {
        const sel = selectChoice(vars, {}, "1", choice(11, 15));
        expect(selectionExtra(vars, sel)).toBe(15);
        expect(clearChoice(vars, sel, "1")).toEqual({});
    });

    it("are single-select: a second pick replaces the first", () => {
        const sel = selectChoice(vars, selectChoice(vars, {}, "2", choice(21, 0)), "2", choice(22, 4));
        expect(Object.keys(sel)).toEqual(["2"]);
        expect(sel["2"].id).toBe(22);
        expect(selectionExtra(vars, sel)).toBe(4);
        expect(toCartVariations(vars, sel)).toEqual([
            { main_variation_id: "2", main_variation_name: "g2", choices: [{ id: 22, name: "c22", price: 4 }] },
        ]);
    });

    it("can be cleared back to none and stay valid", () => {
        const sel = clearChoice(vars, selectChoice(vars, {}, "2", choice(22, 4)), "2");
        expect(sel).toEqual({});
        expect(validateSelection(vars, sel)).toEqual({ ok: true });
        expect(toApiVariations(toCartVariations(vars, sel))).toEqual([]);
    });

    it("an optional group with no available choice does not block", () => {
        const v = [group(1, [choice(11, 0, false)], false)];
        expect(validateSelection(v, {})).toEqual({ ok: true });
        expect(quickAddPlan(v).kind).toBe("add");
    });
});

describe("switched-off groups (enable: false)", () => {
    const vars = [group(1, [choice(11, 5)], true, false), group(2, [choice(21, 2)])];

    it("are hidden, not required, and never priced or sent", () => {
        expect(visibleGroups(vars).map((g) => g.id)).toEqual([2]);
        const sel = { ...initialSelection(vars), "1": choice(11, 5) };
        expect(validateSelection(vars, sel)).toEqual({ ok: true });
        expect(selectionExtra(vars, sel)).toBe(2);
        expect(toCartVariations(vars, sel).map((v) => v.main_variation_id)).toEqual(["2"]);
    });
});

describe("extra prices counted exactly once", () => {
    const vars = [group(2, [choice(21, 2.5)]), group(1, [choice(11, 0), choice(12, 10)]), group(3, [choice(31, 4)], false)];
    const sel = selectChoice(vars, selectChoice(vars, initialSelection(vars), "1", choice(12, 10)), "3", choice(31, 4));

    it("in the shown price", () => {
        expect(selectionExtra(vars, sel)).toBe(16.5);
    });

    it("in the cart line (same total from the cart shape)", () => {
        const cart = toCartVariations(vars, sel);
        expect(cartVariationsExtra(cart)).toBe(16.5);
        expect(cart.map((v) => v.main_variation_id)).toEqual(["1", "2", "3"]);
        expect(cart.every((v) => v.choices.length === 1)).toBe(true);
    });

    it("the order payload carries choice ids only, no prices", () => {
        const api = toApiVariations(toCartVariations(vars, sel));
        expect(api).toEqual([
            { main_variation_id: 1, choices: [12] },
            { main_variation_id: 2, choices: [21] },
            { main_variation_id: 3, choices: [31] },
        ]);
        expect(JSON.stringify(api)).not.toContain("price");
    });

    it("toApiVariations accepts id lists, de-duplicates and drops empty groups", () => {
        expect(
            toApiVariations([
                { main_variation_id: "5", choices: ["9", 9, { id: 9 }] },
                { main_variation_id: "4", choices: [] },
            ]),
        ).toEqual([{ main_variation_id: 5, choices: [9] }]);
        expect(toApiVariations(undefined)).toEqual([]);
    });

    it("toApiVariations sends at most one choice per group and each group once (old multi-tick carts)", () => {
        const api = toApiVariations([
            { main_variation_id: "7", choices: [{ id: 71, price: 15 }, { id: 72, price: 5 }] },
            { main_variation_id: 7, choices: [{ id: 73, price: 9 }] },
            { main_variation_id: "6", choices: [null, "", { id: 61 }] },
        ]);
        expect(api).toEqual([
            { main_variation_id: 6, choices: [61] },
            { main_variation_id: 7, choices: [71] },
        ]);
        expect(api.every((v) => v.choices.length <= 1)).toBe(true);
        const ids = api.flatMap((v) => v.choices.map(String));
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("cartVariationsExtra prices exactly what is sent (one choice per group)", () => {
        expect(
            cartVariationsExtra([
                { main_variation_id: "7", choices: [{ id: 71, price: 15 }, { id: 72, price: 5 }] },
                { main_variation_id: "7", choices: [{ id: 73, price: 9 }] },
            ]),
        ).toBe(15);
    });
});

describe("re-adding the same product with the same choices", () => {
    const vars = [group(1, [choice(11, 0), choice(12, 10)]), group(2, [choice(21, 3)])];

    it("gives the same cart line key whatever the pick order", () => {
        const a = selectChoice(vars, initialSelection(vars), "1", choice(12, 10));
        const b = { "1": choice(12, 10), ...initialSelection(vars) };
        const keyA = cartLineKey({ id: 7, variations: toCartVariations(vars, a) });
        const keyB = cartLineKey({ id: "7", variations: toCartVariations(vars, b).slice().reverse() });
        expect(keyA).toBe(keyB);
    });

    it("different choices or notes are different lines", () => {
        const a = cartLineKey({ id: 7, variations: [{ main_variation_id: "1", choices: [{ id: 11 }] }] });
        const b = cartLineKey({ id: 7, variations: [{ main_variation_id: "1", choices: [{ id: 12 }] }] });
        const c = cartLineKey({ id: 7, variations: [{ main_variation_id: "1", choices: [{ id: 11 }] }], product_note: "x" });
        expect(new Set([a, b, c]).size).toBe(3);
    });

    it("a name/price change on the same ids is still the same line", () => {
        const a = cartLineKey({ id: 7, variations: [{ main_variation_id: "1", choices: [{ id: 11, name: "a", price: 1 }] }] });
        const b = cartLineKey({ id: 7, variations: [{ main_variation_id: 1, choices: [11] }] });
        expect(a).toBe(b);
    });
});

describe("product card quick add", () => {
    it("adds with the auto-selected choices when nothing needs the customer", () => {
        const plan = quickAddPlan([group(1, [choice(11, 6)]), group(2, [choice(21, 0, false), choice(22, 1)])]);
        expect(plan).toEqual({
            kind: "add",
            extra: 7,
            variations: [
                { main_variation_id: "1", main_variation_name: "g1", choices: [{ id: 11, name: "c11", price: 6 }] },
                { main_variation_id: "2", main_variation_name: "g2", choices: [{ id: 22, name: "c22", price: 1 }] },
            ],
        });
    });

    it("opens the product page when a required group has several choices", () => {
        expect(quickAddPlan([group(1, [choice(11), choice(12)])])).toEqual({ kind: "choose" });
    });

    it("opens the product page when there is an optional group to offer", () => {
        expect(quickAddPlan([group(1, [choice(11)]), group(2, [choice(21, 5)], false)])).toEqual({ kind: "choose" });
    });

    it("adds plainly when the product has no option groups", () => {
        expect(quickAddPlan(undefined)).toEqual({ kind: "add", variations: [], extra: 0 });
    });
});
