import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import MealHelperFab from "@/components/MealHelper/MealHelperFab";

vi.mock("@/components/MealHelper/MealHelper", () => ({ default: () => null }));

// The floating "ساعدني أختار" button covered the review text box on a 390px phone (QA 2026-11-23). The reviews page
// keeps it off its content on phones and tablets: room at the end of the page, and the button steps aside while the
// customer types (src/styles/reviews.css).
const css = readFileSync(resolve(__dirname, "../../styles/reviews.css"), "utf8");
const mobileBlock = css.match(/@media \(max-width: (\d+)px\) \{([\s\S]*?)\n\}/g)?.find((b) => b.includes("data-floating-helper")) ?? "";

describe("the floating helper button on the reviews page", () => {
    it("can be found by the page's styles", () => {
        expect(renderToStaticMarkup(<MealHelperFab />)).toContain('data-floating-helper=""');
    });

    it("applies on every phone and tablet width", () => {
        const width = Number(mobileBlock.match(/max-width: (\d+)px/)?.[1]);
        expect(width).toBeGreaterThanOrEqual(1023);
    });

    it("leaves room at the end of the page to scroll the send button clear of it", () => {
        // the button is 56px high and sits 24-32px from the bottom: at least 88px, plus a gap
        const room = Number(mobileBlock.match(/main\.ct-rv \{ padding-bottom: (\d+)px; \}/)?.[1]);
        expect(room).toBeGreaterThanOrEqual(88 + 16);
    });

    it("steps aside while the customer types in the form", () => {
        expect(mobileBlock).toMatch(
            /body:has\(main\.ct-rv :is\(input, textarea, select\):focus\) \[data-floating-helper\] \{[^}]*visibility: hidden;[^}]*pointer-events: none;/,
        );
    });
});
