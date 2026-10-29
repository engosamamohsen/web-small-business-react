import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { VariationsSelector } from "./VariationsSelector";
import type { Choice, Variation } from "@/lib/types";
import { clearChoice, selectChoice, type VariationSelection } from "@/lib/product/variations";

const vars = [
    { id: "1", name: "الحجم", is_required: true, enable: true, choices: [
        { id: "11", name: "صغير", enable: true, price: 0 },
        { id: "12", name: "كبير", enable: false, price: 10 },
    ] },
    { id: "2", name: "الإضافات", is_required: false, enable: true, choices: [
        { id: "21", name: "جبنة", enable: true, price: 15 },
        { id: "22", name: "زيتون", enable: true, price: 5 },
        { id: "23", name: "بيض", enable: false, price: 7 },
    ] },
    { id: "3", name: "مخفي", is_required: true, enable: false, choices: [{ id: "31", name: "x", enable: true, price: 1 }] },
    { id: "4", name: "الصوص", is_required: true, enable: true, choices: [{ id: "41", name: "حار", enable: false, price: 0 }] },
] as unknown as Variation[];

const noop = () => {};

function render(selection: VariationSelection) {
    return renderToStaticMarkup(
        <VariationsSelector
            variations={vars}
            handleRadioChange={noop}
            handleOptionalChange={noop}
            isChoiceSelected={(g, c) => String(selection[g]?.id) === String(c)}
        />,
    );
}

/** The <input>s of one group (by radio name), in order. */
const groupInputs = (html: string, groupId: string) =>
    html.match(new RegExp(`<input[^>]*name="variation-${groupId}"[^>]*>`, "g")) ?? [];
const checkedValues = (html: string, groupId: string) =>
    groupInputs(html, groupId)
        .filter((i) => /\schecked=""/.test(i))
        .map((i) => i.match(/value="([^"]*)"/)?.[1]);

// The selector's element tree (no DOM in this repo's tests): lets a test fire an input's
// onChange the way a click would, with a stand-in for the useProductOptions state.
function inputsOf(node: ReactNode, out: ReactElement<any>[] = []): ReactElement<any>[] {
    if (Array.isArray(node)) node.forEach((n) => inputsOf(n, out));
    else if (isValidElement(node)) {
        const el = node as ReactElement<any>;
        if (el.type === "input") out.push(el);
        inputsOf(el.props?.children, out);
    }
    return out;
}

function harness() {
    let selection: VariationSelection = {};
    const props = () => ({
        variations: vars,
        handleRadioChange: (g: string, c: Choice) => { selection = selectChoice(vars, selection, g, c); },
        // Same as useProductOptions.handleOptionalChange.
        handleOptionalChange: (g: string, c: Choice | null) => {
            selection = c ? selectChoice(vars, selection, g, c) : clearChoice(vars, selection, g);
        },
        isChoiceSelected: (g: string, c: string) => String(selection[g]?.id) === String(c),
    });
    const tree = () => (VariationsSelector as any).type(props()) as ReactNode;
    const click = (groupId: string, value: string) => {
        const input = inputsOf(tree()).find((i) => i.props.name === `variation-${groupId}` && i.props.value === value);
        if (!input) throw new Error(`no input ${groupId}/${value}`);
        if (!input.props.disabled) input.props.onChange({ target: { checked: true } });
    };
    return { click, get selection() { return selection; }, html: () => render(selection) };
}

describe("VariationsSelector", () => {
    const html = render({});

    it("shows an unavailable choice disabled with «غير متاح», never checked", () => {
        expect(html).toContain("غير متاح");
        for (const value of ["12", "23"]) {
            const input = html.match(new RegExp(`<input[^>]*value="${value}"[^>]*>`))?.[0] ?? "";
            expect(input).toContain("disabled");
            expect(input).not.toContain("checked");
        }
    });

    it("every group is a radio group, never checkboxes, with its badge", () => {
        expect(html).not.toContain('type="checkbox"');
        for (const g of ["1", "2"]) {
            expect(groupInputs(html, g).every((i) => i.includes('type="radio"'))).toBe(true);
        }
        expect(html).toContain('role="radiogroup"');
        expect(html).toContain("مطلوب");
        expect(html).toContain("اختياري");
    });

    it("an optional group has a «بدون» radio, checked by default", () => {
        const inputs = groupInputs(html, "2");
        expect(inputs[0]).toContain('value=""');
        expect(html).toContain("بدون");
        expect(checkedValues(html, "2")).toEqual([""]);
    });

    it("a required group has no «بدون» radio", () => {
        expect(groupInputs(html, "1").some((i) => i.includes('value=""'))).toBe(false);
    });

    it("hides switched-off groups", () => {
        expect(html).not.toContain("مخفي");
    });

    it("tells the customer when a required group has no available choice", () => {
        expect(html).toContain("لا يوجد خيار متاح لهذا المنتج حاليًا");
    });
});

describe("VariationsSelector: optional group is single-select and can be cleared", () => {
    it("picking a choice checks it and unchecks «بدون»", () => {
        const h = harness();
        h.click("2", "21");
        expect(h.selection["2"]?.id).toBe("21");
        expect(checkedValues(h.html(), "2")).toEqual(["21"]);
    });

    it("picking another choice replaces the first (never two in one group)", () => {
        const h = harness();
        h.click("2", "21");
        h.click("2", "22");
        expect(h.selection["2"]?.id).toBe("22");
        expect(checkedValues(h.html(), "2")).toEqual(["22"]);
    });

    it("«بدون» clears the pick back to none", () => {
        const h = harness();
        h.click("2", "21");
        h.click("2", "");
        expect(h.selection).toEqual({});
        expect(checkedValues(h.html(), "2")).toEqual([""]);
    });

    it("a disabled choice can't be picked", () => {
        const h = harness();
        h.click("2", "23");
        expect(h.selection).toEqual({});
    });

    it("required groups keep one radio checked", () => {
        const h = harness();
        h.click("1", "11");
        expect(checkedValues(h.html(), "1")).toEqual(["11"]);
    });
});
