import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CategorySwiper from "./CategorySwiper";

// Style sheets are not needed to render the markup (the unit-test config has no PostCSS)
vi.mock("./style.module.css", () => ({ default: {} }));
vi.mock("swiper/css", () => ({}));
vi.mock("swiper/css/navigation", () => ({}));

// The home page crashed ("Cannot read properties of null (reading 'toString')") when a category had no slug
// (QA 2026-11-23). The strip must render every category, whatever its slug.
describe("the category strip", () => {
    const categories = (list: Array<{ id: number; name: string; slug?: string | null }>) => ({
        categoriesData: list.map((c) => ({ icon: "", ...c })),
    });

    it("renders categories with a null, missing or empty slug", () => {
        const html = renderToStaticMarkup(
            <CategorySwiper categories={categories([
                { id: 1, name: "Null slug", slug: null },
                { id: 2, name: "No slug" },
                { id: 3, name: "Empty slug", slug: "" },
                { id: 4, name: "With slug", slug: "pizza" },
            ])} />,
        );
        for (const name of ["Null slug", "No slug", "Empty slug", "With slug"]) {
            expect(html).toContain(name);
        }
    });
});
