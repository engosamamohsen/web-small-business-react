import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CategorySwiper from "./CategorySwiper";

// Style sheets are not needed to render the markup (the unit-test config has no PostCSS)
vi.mock("./style.module.css", () => ({ default: {} }));
vi.mock("swiper/css", () => ({}));
vi.mock("swiper/css/navigation", () => ({}));

afterEach(() => vi.unstubAllGlobals());

const categories = (list: Array<{ id: number; name: string; slug?: string | null }>) => ({
    categoriesData: list.map((c) => ({ icon: "", ...c })),
});

const STRIP = categories([
    { id: 1, name: "Null slug", slug: null },
    { id: 2, name: "No slug" },
    { id: 3, name: "Empty slug", slug: "" },
    { id: 4, name: "With slug", slug: "pizza" },
]);

/** The aria-labels of the chips marked selected in the HTML. */
const pressed = (html: string) =>
    [...html.matchAll(/aria-pressed="true"[^>]*aria-label="([^"]+)"/g)].map((m) => m[1]);

// The home page crashed ("Cannot read properties of null (reading 'toString')") when a category had no slug
// (QA 2026-11-23). The strip must render every category, whatever its slug.
describe("the category strip", () => {
    it("renders categories with a null, missing or empty slug", () => {
        const html = renderToStaticMarkup(<CategorySwiper categories={STRIP} />);
        for (const name of ["Null slug", "No slug", "Empty slug", "With slug"]) {
            expect(html).toContain(name);
        }
    });
});

// A direct link (?category=...) showed "All" selected: the server can't read the browser URL (QA 2026-11-23).
describe("the category strip on a direct link (server HTML)", () => {
    it("marks the linked category, with or without a slug", () => {
        const cases: Array<[string, string]> = [
            ["4-pizza", "Category With slug"],
            ["4", "Category With slug"],          // bare id for a category that has a slug
            ["4-old-slug", "Category With slug"], // a link saved before the slug changed
            ["1", "Category Null slug"],
            ["2", "Category No slug"],
            ["3", "Category Empty slug"],
        ];
        for (const [param, label] of cases) {
            const html = renderToStaticMarkup(<CategorySwiper categories={STRIP} initialCategory={param} />);
            expect(pressed(html), param).toEqual([label]);
        }
    });

    it("marks \"All\" when no category is linked", () => {
        for (const initial of [undefined, null, ""]) {
            const html = renderToStaticMarkup(<CategorySwiper categories={STRIP} initialCategory={initial} />);
            expect(pressed(html)).toEqual(["كل الفئات"]);
        }
    });

    it("gives the browser the same first HTML as the server, so the selection survives hydration", () => {
        for (const param of ["4-pizza", "1", "3", null]) {
            const server = renderToStaticMarkup(<CategorySwiper categories={STRIP} initialCategory={param} />);
            vi.stubGlobal("window", { location: { pathname: "/", search: param ? `?category=${param}` : "" } });
            const browser = renderToStaticMarkup(<CategorySwiper categories={STRIP} initialCategory={param} />);
            vi.unstubAllGlobals();
            expect(browser, String(param)).toBe(server);
        }
    });
});
