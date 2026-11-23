import { describe, expect, it } from "vitest";
import { categoryParam, isSelectedCategory } from "./category-param";
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

// Which chip is selected for a ?category= / ?sub_category= value: by the leading id, like the server.
describe("isSelectedCategory", () => {
    it("matches on the id, whatever the slug in the link", () => {
        for (const param of ["7-pizza", "7", "7-old-slug"]) {
            expect(isSelectedCategory(param, { id: 7, slug: "pizza" }), param).toBe(true);
            expect(isSelectedCategory(param, { id: 7, slug: null }), param).toBe(true);
        }
    });

    it("does not match another id, a longer id or no value", () => {
        expect(isSelectedCategory("8-pizza", { id: 7, slug: "pizza" })).toBe(false);
        expect(isSelectedCategory("77", { id: 7 })).toBe(false);
        for (const param of [null, undefined, "", "pizza"]) {
            expect(isSelectedCategory(param, { id: 7 })).toBe(false);
        }
        expect(isSelectedCategory("7", null)).toBe(false);
        expect(isSelectedCategory("7", { id: null })).toBe(false);
    });
});
