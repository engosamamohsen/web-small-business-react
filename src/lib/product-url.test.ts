import { describe, it, expect } from "vitest";
import { buildProductPath, parseProductParam } from "./product-url";

describe("buildProductPath", () => {
  it("appends the slugified Arabic name to the API slug", () => {
    expect(
      buildProductPath({ id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" }),
    ).toBe("/product/ft-shaorma-frakh-9-فتة-شاورما-فراخ");
  });

  it("appends an English name", () => {
    expect(
      buildProductPath({ id: 9, slug: "chicken-shawarma-9", name: "Chicken Shawarma" }),
    ).toBe("/product/chicken-shawarma-9-chicken-shawarma");
  });

  it("uses just the slug when there is no name", () => {
    expect(buildProductPath({ id: 8, slug: "ft-shaorma-frakh-8" })).toBe(
      "/product/ft-shaorma-frakh-8",
    );
  });

  it("falls back to id + name when there is no API slug", () => {
    expect(buildProductPath({ id: 8, name: "Some Product" })).toBe(
      "/product/8-some-product",
    );
  });

  it("falls back to the bare id when there is neither slug nor name", () => {
    expect(buildProductPath({ id: 8 })).toBe("/product/8");
  });

  it("is idempotent — does not append the name twice", () => {
    const once = buildProductPath({ id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" });
    const twice = buildProductPath({
      id: 9,
      slug: once.replace("/product/", ""),
      name: "فتة شاورما فراخ",
    });
    expect(twice).toBe(once);
  });
});

describe("parseProductParam", () => {
  it("extracts the id from a new SEO URL (Arabic name appended)", () => {
    expect(parseProductParam("ft-shaorma-frakh-9-فتة-شاورما-فراخ")?.id).toBe("9");
  });

  it("extracts the id from an old name-less slug", () => {
    expect(parseProductParam("ft-shaorma-frakh-8")?.id).toBe("8");
  });

  it("extracts a bare numeric id", () => {
    expect(parseProductParam("8")?.id).toBe("8");
  });

  it("returns null when there is no numeric token", () => {
    expect(parseProductParam("no-number")).toBeNull();
  });

  it("returns null for empty / nullish input", () => {
    expect(parseProductParam("")).toBeNull();
    expect(parseProductParam(null)).toBeNull();
    expect(parseProductParam(undefined)).toBeNull();
  });
});

describe("buildProductPath ↔ parseProductParam round-trip", () => {
  const cases = [
    { id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" },
    { id: 9, slug: "chicken-shawarma-9", name: "Chicken Shawarma" },
    { id: 8, slug: "ft-shaorma-frakh-8" },
    { id: 8, name: "Some Product" },
    { id: 8 },
    // Names with numbers (real roka dishes): the name's "2"/"3" must not win.
    { id: 22, slug: "2-ktaa-banyh-arz-slt-22", name: "2 قطعة بانيه + أرز + سلطة" },
    { id: 19, slug: "3-ktaa-kfth-arz-slt-19", name: "3 قطع كفتة + أرز + سلطة" },
    { id: 11, slug: "nsf-kylo-hoaoshy-fy-aysh-4-arghf-11", name: "نصف كيلو حواوشي في عيش (4 أرغفة)" },
    { id: 22, name: "2 قطعة بانيه" },
    { id: 5, slug: "pepsi-2-liter-5", name: "Pepsi 2 Liter" },
    // A number at the END of an Arabic name sits just before the id: product 7, not 2.
    { id: 7, slug: "haml-labtob-alomnyom-tgrb-2-7", name: "حامل لابتوب ألومنيوم - تجربة 2" },
    { id: 31, slug: "kabl-3-30-31", name: "كابل 3 30" },
    // emand (2026-11-19): "… كود 952" is product 637, not 952 — every product in the category opened a 404.
    { id: 637, slug: "bdyl-alshybord-122280-sm-kod-952-637", name: "بديل الشيبورد  122×280 سم كود 952" },
    { id: 636, slug: "bdyl-alshybord-122280-sm-kod-920-636", name: "بديل الشيبورد 122×280 سم كود 920" },
  ];

  it.each(cases)("recovers id %j", (product) => {
    const path = buildProductPath(product);
    const param = path.replace("/product/", "");
    expect(parseProductParam(param)?.id).toBe(String(product.id));
  });
});
