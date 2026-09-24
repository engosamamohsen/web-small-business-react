import { describe, it, expect } from "vitest";
import roka from "./fixtures/roka.json";
import asly from "./fixtures/asly.json";
import { toMenuDish, questionsFor, recommend, type ApiProduct } from "./engine";
import { traitsOf, servesFrom } from "./traits";
import { normalizeArabic } from "./normalize";

// Real menus from the v1/product API (roka: 31 dishes, asly: 8), captured Sep 2026.
const rokaMenu = (roka as ApiProduct[]).map(toMenuDish);
const aslyMenu = (asly as ApiProduct[]).map(toMenuDish);
const names = (r: ReturnType<typeof recommend>) => r.picks.map((p) => p.dish.name);

describe("normalizeArabic", () => {
  it("folds the spellings menus mix", () => {
    expect(normalizeArabic("فرخة")).toBe(normalizeArabic("فرخه"));
    expect(normalizeArabic("أرز")).toBe("ارز");
    expect(normalizeArabic("كُفْتَة")).toBe("كفته");
    expect(normalizeArabic("٣ قطع")).toBe("3 قطع");
  });
});

describe("traitsOf", () => {
  it("reads the protein from the name before the category", () => {
    // In the "المحاشي" category, but ممبار is stuffed intestine: meat.
    expect([...traitsOf({ name: "كيلو ممبار", category: "المحاشي" }).proteins]).toEqual(["meat"]);
    expect([...traitsOf({ name: "كيلو كرنب", category: "المحاشي" }).proteins]).toEqual(["veg"]);
  });

  it("falls back to the category when the name says nothing", () => {
    expect([...traitsOf({ name: "سندوتش اكسترا", category: "الفراخ" }).proteins]).toEqual(["chicken"]);
  });

  it("lets a named protein beat a generic dish word", () => {
    expect([...traitsOf({ name: "برجر فراخ" }).proteins]).toEqual(["chicken"]);
    expect([...traitsOf({ name: "نصف كيلو برجر" }).proteins]).toEqual(["meat"]);
    // The side salad doesn't make a kofta plate vegetarian or light.
    const plate = traitsOf({ name: "3 قطع كفتة + أرز + سلطة" });
    expect([...plate.proteins]).toEqual(["meat"]);
    expect([...plate.mealTypes]).toEqual(["meal"]);
  });

  it("matches words from their start only", () => {
    // "راب" (wrap) must not match inside "شراب".
    expect(traitsOf({ name: "شراب فراولة" }).mealTypes.has("sandwich")).toBe(false);
    expect(traitsOf({ name: "شيش بالكيلو جريل" }).grill).toBe(true);
  });

  it("estimates how many people a portion feeds", () => {
    expect(servesFrom(normalizeArabic("نصف كيلو كفتة"))).toBe(2);
    expect(servesFrom(normalizeArabic("كيلو ورق عنب"))).toBe(4);
    expect(servesFrom(normalizeArabic("شيش بالكيلو جريل"))).toBe(4);
    expect(servesFrom(normalizeArabic("فرخة كاملة متبلة"))).toBe(4);
    expect(servesFrom(normalizeArabic("ربع فرخة + أرز + سلطة"))).toBe(1);
  });
});

describe("toMenuDish", () => {
  it("adds the cheapest required choice and skips disabled variations", () => {
    const buildYourOwn = rokaMenu.find((d) => d.id === 33)!;
    expect(buildYourOwn.price).toBe(50); // 10 + cheapest base (أرز بسمتي, 40)
    expect(buildYourOwn.choices).not.toContain("كفتة"); // from the disabled "الاصناف" variation
  });
});

describe("questionsFor", () => {
  it("only offers options the store actually has", () => {
    const protein = questionsFor(rokaMenu).find((q) => q.key === "protein")!;
    expect(protein.options.map((o) => o.value)).toEqual(["chicken", "meat", "grill", "veg"]); // no seafood at roka

    const mealType = questionsFor(aslyMenu).find((q) => q.key === "mealType")!;
    expect(mealType.options.map((o) => o.value)).not.toContain("sweet");
  });

  it("narrows later questions to what fits the earlier answers", () => {
    const protein = questionsFor(rokaMenu, { mealType: "meal" }).find((q) => q.key === "protein")!;
    const chicken = protein.options.find((o) => o.value === "chicken")!;
    expect(chicken.hint).toBe("5 أصناف"); // 13 chicken dishes, 5 of them are meals
  });

  it("derives budget bands from the menu's own prices", () => {
    const budget = questionsFor(rokaMenu).find((q) => q.key === "budget")!;
    expect(budget.options.map((o) => o.label)).toEqual(["لحد 70 ج.م", "لحد 100 ج.م", "أكتر من 100 ج.م"]);
  });
});

describe("recommend", () => {
  it("finds a chicken meal within budget at roka", () => {
    const r = recommend(rokaMenu, { people: 1, mealType: "meal", protein: "chicken", budget: { max: 120 } });
    expect(r.relaxed).toBe(false);
    expect(names(r)).toEqual(["2 قطعة بانيه + أرز + سلطة", "3 قطع شيش طاووق + أرز + سلطة", "ربع فرخة + أرز + سلطة"]);
    expect(r.picks[0].reasons).toEqual(["فراخ", "وجبة كاملة", "في ميزانيتك"]);
  });

  it("scales the quantity for a family", () => {
    const r = recommend(rokaMenu, { people: 4, mealType: "bulk", protein: "meat" });
    const hawawshi = r.picks.find((p) => p.dish.name === "نصف كيلو حواوشي")!;
    expect(hawawshi.quantity).toBe(2);
    expect(hawawshi.total).toBe(270);
    expect(hawawshi.reasons).toContain("يكفي 4 أفراد");
  });

  it("never offers meat to someone who picked vegetables", () => {
    const r = recommend(rokaMenu, { people: 2, protein: "veg" });
    expect(r.picks.length).toBeGreaterThan(0);
    for (const p of r.picks) expect(traitsOf(p.dish).proteins.has("meat")).toBe(false);
  });

  it("uses the name when tags are wrong (asly's زنجر is tagged شاورما)", () => {
    const r = recommend(aslyMenu, { people: 1, mealType: "sandwich", protein: "chicken", budget: { max: 100 } });
    expect(names(r)[0]).toBe("سندوتش شاورما فراخ");
  });

  it("shows one of each dish even when the menu lists it twice", () => {
    const r = recommend(aslyMenu, { people: 1, protein: "chicken", mealType: "meal" });
    expect(names(r).filter((n) => n === "فتة شاورما فراخ")).toHaveLength(1);
  });

  it("loosens the answers instead of showing nothing", () => {
    const r = recommend(rokaMenu, { people: 1, mealType: "sandwich", protein: "chicken", budget: { max: 60 } });
    expect(r.relaxed).toBe(true);
    expect(r.picks.length).toBeGreaterThan(0);
  });

  it("still suggests something when every question was skipped", () => {
    const r = recommend(rokaMenu, { people: 1, mealType: null, protein: null, budget: null });
    expect(r.picks).toHaveLength(3);
    expect(r.relaxed).toBe(false);
  });
});
