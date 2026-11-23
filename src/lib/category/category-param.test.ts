import { describe, expect, it } from "vitest";
import { categoryParam } from "./category-param";
import { idFromParam } from "@/lib/products-query";

// ?category= of a category chip (CategorySwiper). A category without a slug crashed the home page (2026-11-23).
describe("the category chip's ?category= value", () => {
    it("is <id>-<slug> when the category has a slug", () => {
        expect(categoryParam({ id: 7, slug: "pizza" })).toBe("7-pizza");
        expect(categoryParam({ id: "7", slug: " pizza " })).toBe("7-pizza");
    });

    it("is just the id when the slug is null, undefined or empty", () => {
        for (const slug of [null, undefined, "", "   "]) {
            expect(categoryParam({ id: 7, slug })).toBe("7");
        }
        expect(categoryParam({ id: 7 })).toBe("7");
    });

    it("is empty without an id, and never throws", () => {
        for (const category of [null, undefined, {}, { id: null, slug: "x" }, { id: "", slug: "x" }]) {
            expect(categoryParam(category)).toBe("");
        }
    });

    it("still opens the right category on the server side", () => {
        expect(idFromParam(categoryParam({ id: 7, slug: null }))).toBe("7");
        expect(idFromParam(categoryParam({ id: 7, slug: "pizza" }))).toBe("7");
    });
});
