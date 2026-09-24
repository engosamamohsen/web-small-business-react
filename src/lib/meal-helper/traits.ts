import { normalizeArabic } from "./normalize";

// ─── What a dish is, guessed from its text ───────────────────────────────────
//
// Menus from the API carry no "protein" or "serves" fields, so the helper
// reads them from the words in a dish's name, category, tags, ingredients and
// variation choices. The keyword lists below are shared by every store.
//
// A trait the text doesn't mention stays unknown, and the engine never
// excludes a dish for an unknown trait.

export type Protein = "chicken" | "meat" | "seafood" | "veg";
export type MealType = "meal" | "sandwich" | "bulk" | "light" | "sweet" | "drink";

export interface DishTraits {
  proteins: Set<Protein>;
  /** Proteins the customer can pick through the dish's variation choices */
  choiceProteins: Set<Protein>;
  grill: boolean;
  mealTypes: Set<MealType>;
  /** How many people one unit feeds (1 unless the text says otherwise) */
  serves: number;
}

// "sure" words name the protein outright. "default" words only count when the
// name has no sure word: "برجر فراخ" is chicken, "برجر" alone is beef, and the
// "سلطة" in "3 قطع كفتة + أرز + سلطة" doesn't make a meat meal vegetarian.
const PROTEIN_WORDS: Record<Protein, { sure: string[]; default: string[] }> = {
  chicken: {
    sure: ["فراخ", "فرخ", "دجاج", "فروج", "زنجر", "بانيه", "ستربس", "ناجتس", "طاووق", "كرسبي", "صدور", "اجنحه", "وينجز", "كوردن بلو"],
    default: [],
  },
  meat: {
    sure: ["لحم", "لحوم", "بيف", "كفته", "كبده", "ممبار", "سجق", "ريش", "موزه", "كباب", "حواوشي", "بفتيك", "نعام", "ضاني", "كوارع", "بسطرمه"],
    default: ["برجر", "هوت دوج"],
  },
  seafood: {
    sure: ["سمك", "اسماك", "جمبري", "كاليماري", "سي فود", "بلطي", "بوري", "سبيط", "استاكوزا", "تونه"],
    default: ["فيليه"],
  },
  veg: {
    sure: ["نباتي"],
    default: ["محشي", "محاشي", "ورق عنب", "كرنب", "كوسه", "باذنجان", "فلفل", "خضار", "فول", "فلافل", "طعميه", "كشري", "بطاطس"],
  },
};

const GRILL_WORDS = ["مشوي", "مشويات", "جريل", "شيش", "كباب", "فحم", "شواء", "شوي"];

const MEAL_TYPE_WORDS: Record<MealType, string[]> = {
  meal: ["وجبه", "وجبات", "فته", "طبق", "اطباق", "كومبو", "بوكس", "ارز", "بالارز"],
  sandwich: ["سندوتش", "ساندوتش", "سندويتش", "ساندويتش", "سندوتشات", "رول", "تورتيلا", "ملفوف", "عيش", "حواوشي", "برجر"],
  bulk: ["كيلو", "كامله", "عائلي", "فاميلي", "صينيه"],
  light: ["سلطه", "سلطات", "شوربه", "مقبلات", "سناك", "بطاطس"],
  sweet: ["حلو", "حلويات", "كنافه", "بسبوسه", "كيك", "تورته", "ايس كريم", "وافل", "ام علي", "رز باللبن"],
  drink: ["عصير", "عصاير", "مشروب", "مشروبات", "بيبسي", "كوكاكولا", "كولا", "مياه", "شاي", "قهوه", "سموزي", "ميلك شيك"],
};

// Arabic attaches these to the front of a word: "بالفراخ", "والأرز", "للشواء".
const PREFIXES = ["وبال", "بال", "وال", "لل", "ال", "و", "ب", "ل"];

/** Normalized text split into words, each also without its attached prefix. */
function wordsOf(text: string): string[] {
  const words: string[] = [];
  for (const token of text.split(" ")) {
    if (!token) continue;
    words.push(token);
    for (const p of PREFIXES) {
      if (token.startsWith(p) && token.length - p.length >= 2) words.push(token.slice(p.length));
    }
  }
  return words;
}

const NORMALIZED = new Map<string, string>();
const norm = (word: string) => {
  let n = NORMALIZED.get(word);
  if (n === undefined) NORMALIZED.set(word, (n = normalizeArabic(word)));
  return n;
};

/**
 * True when a keyword starts one of the text's words ("لحم" matches "لحمة",
 * never the middle of a word like "شراب" for "راب"). Multi-word keywords
 * ("ورق عنب") match as a phrase. `text` must already be normalized.
 */
export function hasKeyword(text: string, keywords: string[]): boolean {
  if (!text) return false;
  const words = wordsOf(text);
  return keywords.some((kw) => {
    const k = norm(kw);
    return k.includes(" ") ? text.includes(k) : words.some((w) => w.startsWith(k));
  });
}

function proteinsIn(text: string): Set<Protein> {
  const sure = new Set<Protein>();
  const fallback = new Set<Protein>();
  for (const [protein, words] of Object.entries(PROTEIN_WORDS) as [Protein, (typeof PROTEIN_WORDS)[Protein]][]) {
    if (hasKeyword(text, words.sure)) sure.add(protein);
    else if (hasKeyword(text, words.default)) fallback.add(protein);
  }
  return sure.size > 0 ? sure : fallback;
}

function mealTypesIn(text: string): Set<MealType> {
  const types = new Set<MealType>();
  for (const [type, words] of Object.entries(MEAL_TYPE_WORDS) as [MealType, string[]][]) {
    if (hasKeyword(text, words)) types.add(type);
  }
  // "ربع فرخة + أرز + سلطة": a "+" means a combo plate, which is a full meal,
  // and its side salad doesn't make it a light dish.
  if (text.includes("+")) types.add("meal");
  if (types.has("meal")) types.delete("light");
  return types;
}

/** People one unit feeds, from portion words in the name. */
export function servesFrom(name: string): number {
  const people = name.match(/(\d+)\s*(افراد|اشخاص|فرد)/);
  if (people) return Math.max(1, Number(people[1]));
  if (/(نصف|نص) كيلو/.test(name)) return 2;
  if (/ربع كيلو/.test(name)) return 1;
  if (hasKeyword(name, ["كيلو"])) {
    // "كيلو ممبار", "شيش بالكيلو", "2 كيلو": about 4 people per kilo
    const kilos = Number(name.match(/(\d+(\.\d+)?)\s*كيلو/)?.[1] ?? 1);
    return Math.max(1, Math.round(kilos * 4));
  }
  if (/فرخه كامله/.test(name) || hasKeyword(name, ["عائلي", "فاميلي"])) return 4;
  if (/(نصف|نص) فرخه/.test(name)) return 2;
  return 1;
}

export interface DishText {
  name: string;
  category?: string;
  tags?: string[];
  ingredients?: string[];
  /** Names of the enabled variation choices */
  choices?: string[];
}

export function traitsOf(dish: DishText): DishTraits {
  const name = normalizeArabic(dish.name);
  const category = normalizeArabic(dish.category);
  const extra = normalizeArabic([...(dish.tags ?? []), ...(dish.ingredients ?? [])].join(" "));
  const choices = normalizeArabic((dish.choices ?? []).join(" "));

  // The name is the most reliable; the category, then tags and ingredients,
  // only fill in when the name says nothing (tags are often wrong in real data).
  let proteins = proteinsIn(name);
  if (proteins.size === 0) proteins = proteinsIn(category);
  if (proteins.size === 0) proteins = proteinsIn(extra);

  const mealTypes = mealTypesIn(name);
  if (mealTypes.size === 0) mealTypesIn(category).forEach((t) => mealTypes.add(t));

  return {
    proteins,
    choiceProteins: proteinsIn(choices),
    grill: hasKeyword(name, GRILL_WORDS) || hasKeyword(category, GRILL_WORDS),
    mealTypes,
    serves: servesFrom(name),
  };
}
