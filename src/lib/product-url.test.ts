import { describe, it, expect } from "vitest";
import { buildProductPath, parseProductParam, parseProductPath } from "./product-url";
import { slugify } from "@/utils/utils";

describe("buildProductPath", () => {
  // Canonical address since 2026-11-23: /product/{id}/{name}, no Latin transliteration
  it("is the id, then the slugified Arabic name", () => {
    expect(
      buildProductPath({ id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" }),
    ).toBe("/product/9/فتة-شاورما-فراخ");
  });

  it("is the id, then an English name", () => {
    expect(
      buildProductPath({ id: 9, slug: "chicken-shawarma-9", name: "Chicken Shawarma" }),
    ).toBe("/product/9/chicken-shawarma");
  });

  it("keeps numbers in the name apart from the id", () => {
    expect(buildProductPath({ id: 22, name: "2 قطعة بانيه + أرز" })).toBe("/product/22/2-قطعة-بانيه-أرز");
  });

  it("is the bare id when there is no name (the API slug is not used)", () => {
    expect(buildProductPath({ id: 8, slug: "ft-shaorma-frakh-8" })).toBe("/product/8");
    expect(buildProductPath({ id: 8 })).toBe("/product/8");
  });

  it("round-trips: the canonical address gives back its own id", () => {
    for (const product of [
      { id: 9, name: "فتة شاورما فراخ" },
      { id: 22, name: "2 قطعة بانيه" },
      { id: 7, name: "Pack of 2" },
      { id: 8 },
    ]) {
      const rest = buildProductPath(product).replace("/product/", "");
      expect(parseProductPath(rest)?.id).toBe(String(product.id));
    }
  });
});

describe("parseProductPath", () => {
  it("reads the id from the canonical /product/{id}/{name}", () => {
    expect(parseProductPath("9/فتة-شاورما-فراخ")?.id).toBe("9");
    expect(parseProductPath("7/pack-of-2")?.id).toBe("7");
  });

  it("still reads every older single-segment address (they then 301 to the canonical)", () => {
    expect(parseProductPath("ft-shaorma-frakh-9-فتة-شاورما-فراخ")?.id).toBe("9");
    expect(parseProductPath("akhtar-ogbtk-33-أختار-وجبتك")?.id).toBe("33");
    expect(parseProductPath("2-ktaa-banyh-arz-slt-22-2-قطعة-بانيه")?.id).toBe("22");
    expect(parseProductPath("ft-shaorma-frakh-8")?.id).toBe("8");
    expect(parseProductPath("8")?.id).toBe("8");
  });

  it("refuses an address it cannot read", () => {
    for (const path of [undefined, null, "", "/", "no-number", "pizza/9"]) {
      expect(parseProductPath(path)).toBeNull();
    }
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

describe("buildProductPath ↔ parseProductPath round-trip (and the pre-2026-11-23 addresses)", () => {
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
    const rest = path.replace("/product/", "");
    expect(parseProductPath(rest)?.id).toBe(String(product.id));
  });

  // The address used before 2026-11-23 ("{api-slug}-{name}") is still in search results and shared
  // links: it must keep opening the same product (the page then 301s to the new canonical).
  it.each(cases)("still reads the old address of %j", (product) => {
    const name = product.name ? slugify(product.name) : "";
    const slug = product.slug ?? "";
    const old = slug ? (name ? `${slug}-${name}` : slug) : name ? `${product.id}-${name}` : String(product.id);
    expect(parseProductPath(old)?.id).toBe(String(product.id));
  });
});
