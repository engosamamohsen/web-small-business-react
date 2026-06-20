import { describe, it, expect } from "vitest";
import { slugify, getDiscountedPrice } from "./utils";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Chicken Shawarma")).toBe("chicken-shawarma");
  });

  it("preserves Arabic (UTF-8) characters", () => {
    expect(slugify("فتة شاورما فراخ")).toBe("فتة-شاورما-فراخ");
  });

  it("removes unsupported / special characters", () => {
    expect(slugify("Chicken Shawarma!! (Spicy)")).toBe("chicken-shawarma-spicy");
  });

  it("keeps digits", () => {
    expect(slugify("iPhone 15 Pro")).toBe("iphone-15-pro");
  });

  it("collapses repeated hyphens and trims edges", () => {
    expect(slugify("  --Hello __ World--  ")).toBe("hello-world");
  });

  it("returns empty string for punctuation-only input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("getDiscountedPrice", () => {
  it("applies a percentage discount", () => {
    expect(getDiscountedPrice(100, 25)).toBe(75);
  });

  it("returns the base price when discount is 0", () => {
    expect(getDiscountedPrice(100, 0)).toBe(100);
  });
});
