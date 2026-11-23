import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Categories from "./Categories";

// Style sheets are not needed to render the markup (the unit-test config has no PostCSS)
vi.mock("./style.module.css", () => ({ default: {} }));
vi.mock("swiper/css", () => ({}));
vi.mock("swiper/css/navigation", () => ({}));
vi.mock("swiper/css/free-mode", () => ({}));
vi.mock("swiper/css/scrollbar", () => ({}));

afterEach(() => vi.unstubAllGlobals());

const DATA = [
    {
        id: 10, name: "Bakery", slug: "bakery", icon: "",
        subcategories: [
            { id: 11, name: "Cakes sub", slug: "cakes", icon: "" },
            { id: 12, name: "Pies sub", slug: null, icon: "" },
        ],
    },
    { id: 20, name: "Drinks", slug: null, icon: "", subcategories: [] },
] as any;

const render = (initialCategory?: string | null, initialSubCategory?: string | null) =>
    renderToStaticMarkup(
        <Categories categoriesData={DATA} isSuccess initialCategory={initialCategory} initialSubCategory={initialSubCategory} />,
    );

/** Names of the sub-category chips drawn selected. */
const activeSubs = (html: string) =>
    [...html.matchAll(/<button[^>]*class="([^"]*)"[^>]*>.*?<span[^>]*>([^<]+)<\/span>/g)]
        .filter((m) => m[1].includes("text-white"))
        .map((m) => m[2]);

// A direct link (?category=...&sub_category=...) must render its selection in the server HTML (QA 2026-11-23).
describe("the Classic categories section on a direct link (server HTML)", () => {
    it("shows the linked category's sub-categories, with or without its slug", () => {
        for (const param of ["10-bakery", "10"]) {
            const html = render(param);
            expect(html, param).toContain("Cakes sub");
            expect(html, param).toContain("Pies sub");
            expect(html, param).toMatch(/aria-pressed="true"[^>]*aria-label="Category Bakery"/);
        }
    });

    it("marks the linked sub-category, also one without a slug", () => {
        expect(activeSubs(render("10-bakery", "11-cakes"))).toEqual(["Cakes sub"]);
        expect(activeSubs(render("10-bakery", "12"))).toEqual(["Pies sub"]);
        expect(activeSubs(render("10-bakery"))).toEqual([]);
    });

    it("shows no sub-categories without a linked category, or for a category without any", () => {
        for (const param of [undefined, null, "20"]) {
            const html = render(param);
            expect(html).not.toContain("Cakes sub");
        }
        expect(render("20")).toMatch(/aria-pressed="true"[^>]*aria-label="Category Drinks"/);
    });

    it("gives the browser the same first HTML as the server, so the selection survives hydration", () => {
        const cases: Array<[string | null, string | null]> = [["10-bakery", "12"], ["10", "11-cakes"], ["20", null], [null, null]];
        for (const [category, sub] of cases) {
            const server = render(category, sub);
            const search = new URLSearchParams();
            if (category) search.set("category", category);
            if (sub) search.set("sub_category", sub);
            vi.stubGlobal("window", { location: { pathname: "/", search: `?${search}` } });
            const browser = render(category, sub);
            vi.unstubAllGlobals();
            expect(browser, `${category} ${sub}`).toBe(server);
        }
    });
});
