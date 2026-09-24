import { getDiscountedPrice, getEffectiveDiscount } from "@/lib/pricing-utils";
import { traitsOf, type DishTraits, type MealType, type Protein } from "./traits";

// ─── Meal helper engine ──────────────────────────────────────────────────────
//
// Picks dishes from one store's menu for a few answers (who it's for, what kind
// of food, which protein, budget). Rule-based scoring, no AI: the same answers
// always give the same dishes, each with the reasons it was picked.

// ===== Menu =====

/** A dish as the helper page sends it to the browser (see src/lib/menu.ts). */
export interface MenuDish {
  id: number;
  slug?: string;
  name: string;
  category?: string;
  tags: string[];
  ingredients: string[];
  /** Enabled choices of the dish's enabled variations */
  choices: string[];
  /** Lowest price a customer can pay: after discount, plus the cheapest required choices */
  price: number;
  discount: number;
  image?: string;
}

/** Raw product from v1/product, only the fields the helper reads. */
export interface ApiProduct {
  id: number;
  slug?: string;
  name: string;
  category?: { name?: string } | null;
  tags?: { name?: string }[] | null;
  description_steps?: string[] | null;
  price: number | string;
  discount?: number | string | null;
  price_after?: number | null;
  product_image?: string | null;
  variations?: {
    is_required?: number | boolean;
    enable?: number | boolean;
    choices?: { name?: string; enable?: boolean | number; price?: number | string }[];
  }[] | null;
}

export function toMenuDish(p: ApiProduct): MenuDish {
  const base = Number(p.price) || 0;
  const discount = getEffectiveDiscount(base, p.discount, p.price_after);
  const variations = (p.variations ?? []).filter((v) => Number(v.enable ?? 1) === 1);
  const enabledChoices = (v: (typeof variations)[number]) => (v.choices ?? []).filter((c) => c.enable !== false && c.enable !== 0);

  // A required variation adds at least its cheapest choice to what the customer pays.
  const requiredExtra = variations
    .filter((v) => Number(v.is_required) === 1)
    .reduce((sum, v) => {
      const prices = enabledChoices(v).map((c) => Number(c.price) || 0);
      return sum + (prices.length ? Math.min(...prices) : 0);
    }, 0);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name,
    tags: (p.tags ?? []).map((t) => t?.name ?? "").filter(Boolean),
    ingredients: (p.description_steps ?? []).filter(Boolean),
    choices: variations.flatMap((v) => enabledChoices(v).map((c) => c.name ?? "")).filter(Boolean),
    price: parseFloat((getDiscountedPrice(base, discount) + requiredExtra).toFixed(2)),
    discount,
    image: p.product_image || undefined,
  };
}

// ===== Answers & questions =====

export type ProteinAnswer = Protein | "grill";
export type Budget = { max: number } | null;

export interface Answers {
  people?: number;
  mealType?: MealType | null;
  protein?: ProteinAnswer | null;
  budget?: Budget;
}

export interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

export interface Question<T = unknown> {
  key: keyof Answers;
  title: string;
  options: Option<T>[];
}

const PEOPLE: Option<number>[] = [
  { value: 1, label: "لنفسي" },
  { value: 2, label: "لشخصين" },
  { value: 4, label: "عيلة", hint: "٣–٥ أفراد" },
  { value: 6, label: "عزومة", hint: "٦ أو أكتر" },
];

const MEAL_TYPES: Option<MealType>[] = [
  { value: "meal", label: "وجبة كاملة" },
  { value: "sandwich", label: "سندوتشات" },
  { value: "bulk", label: "بالكيلو للبيت" },
  { value: "light", label: "حاجة خفيفة" },
  { value: "sweet", label: "حلو" },
  { value: "drink", label: "مشروب" },
];

const PROTEINS: Option<ProteinAnswer>[] = [
  { value: "chicken", label: "فراخ" },
  { value: "meat", label: "لحمة" },
  { value: "grill", label: "مشويات" },
  { value: "seafood", label: "سي فود" },
  { value: "veg", label: "خضار ومحاشي" },
];

type Scored = { dish: MenuDish; traits: DishTraits };

const matchesProtein = (t: DishTraits, p: ProteinAnswer) =>
  p === "grill" ? t.grill : t.proteins.has(p) || t.choiceProteins.has(p);

const countLabel = (n: number) => (n === 1 ? "صنف واحد" : n === 2 ? "صنفين" : n <= 10 ? `${n} أصناف` : `${n} صنف`);

/** Rounds a price band edge to something a person would say (10s, then 50s). */
const roundPrice = (n: number) => (n < 200 ? Math.ceil(n / 10) * 10 : Math.ceil(n / 50) * 50);

/** Per-person budget bands from the menu's own prices: cheaper third, middle, top. */
export function budgetOptions(dishes: MenuDish[]): Option<Budget>[] {
  const perPerson = dishes
    .map((d) => d.price / traitsOf(dishText(d)).serves)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  if (perPerson.length < 3) return [];
  const low = roundPrice(perPerson[Math.floor(perPerson.length / 3)]);
  const mid = roundPrice(perPerson[Math.floor((perPerson.length * 2) / 3)]);
  if (mid <= low) return [{ value: { max: low }, label: `لحد ${low} ج.م للفرد` }];
  return [
    { value: { max: low }, label: `لحد ${low} ج.م`, hint: "للفرد" },
    { value: { max: mid }, label: `لحد ${mid} ج.م`, hint: "للفرد" },
    { value: null, label: `أكتر من ${mid} ج.م`, hint: "للفرد" },
  ];
}

const dishText = (d: MenuDish) => ({
  name: d.name,
  category: d.category,
  tags: d.tags,
  ingredients: d.ingredients,
  choices: d.choices,
});

/**
 * The questions worth asking for this menu, given the answers so far. An option
 * with no dishes behind it is left out (no seafood on the menu, no seafood
 * button), and the counts only include dishes that fit the earlier answers.
 * A question left with fewer than two options is skipped.
 */
export function questionsFor(dishes: MenuDish[], answers: Answers = {}): Question[] {
  const all: Scored[] = dishes.map((dish) => ({ dish, traits: traitsOf(dishText(dish)) }));
  const fitsMeal = (s: Scored) =>
    !answers.mealType || s.traits.mealTypes.size === 0 || s.traits.mealTypes.has(answers.mealType);
  const fitsProtein = (s: Scored) =>
    !answers.protein ||
    matchesProtein(s.traits, answers.protein) ||
    (answers.protein !== "grill" && s.traits.proteins.size === 0);
  const afterMeal = all.filter(fitsMeal);
  const afterProtein = afterMeal.filter(fitsProtein);

  const withCounts = <T,>(options: Option<T>[], pool: Scored[], has: (s: Scored, v: T) => boolean) =>
    options
      .map((o) => ({ o, n: pool.filter((s) => has(s, o.value)).length }))
      .filter(({ n }) => n > 0)
      .map(({ o, n }) => ({ ...o, hint: o.hint ?? countLabel(n) }));

  const questions: Question[] = [
    { key: "people", title: "هتطلب لمين؟", options: PEOPLE },
    { key: "mealType", title: "نفسك في إيه؟", options: withCounts(MEAL_TYPES, all, (s, v) => s.traits.mealTypes.has(v)) },
    { key: "protein", title: "بتحب تاكل إيه؟", options: withCounts(PROTEINS, afterMeal, (s, v) => matchesProtein(s.traits, v)) },
    { key: "budget", title: "ميزانيتك قد إيه؟", options: budgetOptions(afterProtein.map((s) => s.dish)) },
  ];
  return questions.filter((q) => q.options.length >= 2) as Question[];
}

// ===== Scoring =====

export interface Recommendation {
  dish: MenuDish;
  score: number;
  /** Units to order so everyone eats: 2 × half-kilo for a family of 4 */
  quantity: number;
  total: number;
  reasons: string[];
}

export interface Result {
  picks: Recommendation[];
  /** True when nothing matched every answer and some were loosened */
  relaxed: boolean;
}

const OVER_BUDGET_SLACK = 1.2;

function score(s: Scored, a: Answers): Recommendation | null {
  const { dish, traits } = s;
  const people = a.people ?? 1;
  const quantity = Math.max(1, Math.ceil(people / traits.serves));
  const total = parseFloat((dish.price * quantity).toFixed(2));
  const reasons: string[] = [];
  let points = 0;

  // A dish known to be something else is left out; relaxing the answers
  // (see recommend) brings it back. A dish whose text says nothing stays in.
  if (a.protein) {
    const label = PROTEINS.find((p) => p.value === a.protein)!.label;
    if (a.protein === "grill" ? traits.grill : traits.proteins.has(a.protein)) {
      points += 30;
      reasons.push(label);
    } else if (a.protein !== "grill" && traits.choiceProteins.has(a.protein)) {
      points += 15;
      reasons.push(`تقدر تختار ${label}`);
    } else if (a.protein !== "grill" && traits.proteins.size > 0) {
      return null;
    }
  }

  if (a.mealType) {
    if (traits.mealTypes.has(a.mealType)) {
      points += 25;
      reasons.push(MEAL_TYPES.find((m) => m.value === a.mealType)!.label);
    } else if (traits.mealTypes.size > 0) {
      return null;
    }
  }

  if (a.budget) {
    const perPerson = total / people;
    if (perPerson <= a.budget.max) {
      points += 20;
      reasons.push("في ميزانيتك");
    } else if (perPerson <= a.budget.max * OVER_BUDGET_SLACK) {
      points += 5;
      reasons.push("قريب من ميزانيتك");
    } else {
      return null;
    }
  }

  if (people >= 3 && traits.serves >= 2) {
    points += 15;
    reasons.push(`يكفي ${traits.serves * quantity} أفراد`);
  } else if (people === 1 && traits.serves >= 4) {
    points -= 10; // a kilo for one person
  }

  if (dish.discount > 0) {
    points += 5;
    reasons.push(`خصم ${Math.round(dish.discount)}%`);
  }

  return { dish, score: points, quantity, total, reasons };
}

const byScore = (x: Recommendation, y: Recommendation) => y.score - x.score || x.total - y.total || x.dish.id - y.dish.id;

/** Best `limit` dishes, one per name (menus often list the same dish twice). */
function top(recs: Recommendation[], limit: number): Recommendation[] {
  const seen = new Set<string>();
  const picks: Recommendation[] = [];
  for (const r of [...recs].sort(byScore)) {
    const key = r.dish.name.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    picks.push(r);
    if (picks.length === limit) break;
  }
  return picks;
}

/**
 * Up to `limit` dishes for the answers. When nothing scores as a real match,
 * answers are dropped one at a time (budget, then protein, then meal type)
 * so the customer always gets something to look at.
 */
export function recommend(dishes: MenuDish[], answers: Answers, limit = 3): Result {
  const scored: Scored[] = dishes.map((dish) => ({ dish, traits: traitsOf(dishText(dish)) }));
  const run = (a: Answers) =>
    scored.map((s) => score(s, a)).filter((r): r is Recommendation => r !== null && r.score > 0);

  const attempts: Answers[] = [
    answers,
    { ...answers, budget: null },
    { ...answers, budget: null, protein: null },
    { people: answers.people },
  ];
  for (const [i, a] of attempts.entries()) {
    const picks = top(run(a), limit);
    if (picks.length > 0) return { picks, relaxed: i > 0 };
  }
  // Nothing scored above zero (e.g. no answers at all): cheapest dishes first.
  const fallback = scored.map((s) => score(s, { people: answers.people })!).filter(Boolean);
  return { picks: top(fallback, limit), relaxed: Boolean(answers.budget || answers.protein || answers.mealType) };
}
