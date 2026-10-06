// Storefront themes. The store picks one in its dashboard (Website settings); the
// setting-profile API returns it as `storefront_theme`. Keep the keys in sync with the
// backend registry: App\Support\Storefront\StorefrontThemes (which also decides which
// store types may use which theme — e.g. menu themes are for restaurants only).
//
// A theme is two things:
//   • tokens — colours, fonts, radius, header/footer — in src/styles/themes.css under
//     [data-theme="<key>"]; every page picks them up (Layout sets data-theme on <html>).
//   • layout — which variant of the hero, categories and product list the home page uses.
//   • motion — how the home page moves: the entrance preset its sections use as they scroll
//     into view (src/components/motion/presets.ts). Hover effects live in the theme's CSS.
//
// Adding a store type later (e.g. real estate): add its themes here and in the backend,
// plus any new layout variants its pages need. Existing themes are unaffected.

export const THEME_KEYS = ["classic", "studio", "souq", "fashion", "furniture", "bistro", "street"] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];

export const DEFAULT_THEME: ThemeKey = "classic";

export interface ThemeLayout {
  /** How banners are drawn: text over the photo, photo beside a text panel, or a loud poster. */
  hero: "overlay" | "split" | "poster";
  /** Category navigation: the original swiper, photo tiles, round photos, or a sticky chip bar. */
  categories: "swiper" | "tiles" | "rounds" | "chips";
  /** Products as a card grid or as menu rows. */
  products: "grid" | "menu";
  card: "classic" | "studio" | "souq" | "fashion" | "furniture" | "street" | "menu";
  /** Heading above the categories (null: the chip bar needs none). */
  categoriesTitle: string | null;
  productsTitle: string;
  /** When the store has no banners, open with the store's name and about text instead. */
  intro: boolean;
  introCta: string;
}

/**
 * Entrance animation of a theme's home page. "none" keeps the page still: Classic must look
 * and behave exactly like the original storefront.
 *   lift — short fade-up (calm catalogues)      rise — slower, longer glide (boutique, showroom)
 *   fade — opacity only (editorial, menus)      pop  — springy scale-in (loud posters)
 */
export type ThemeMotion = "none" | "lift" | "rise" | "fade" | "pop";

export interface ThemeDefinition {
  key: ThemeKey;
  /** Shown in the preview bar. */
  name: string;
  /** Google Fonts css2 `family=` params, or null to keep the page's Cairo. */
  fonts: string | null;
  layout: ThemeLayout;
  motion: ThemeMotion;
}

export const THEMES: Record<ThemeKey, ThemeDefinition> = {
  classic: {
    key: "classic",
    name: "الكلاسيكي",
    fonts: null,
    motion: "none",
    layout: {
      hero: "overlay",
      categories: "swiper",
      products: "grid",
      card: "classic",
      categoriesTitle: "اكتشف الفئات",
      productsTitle: "أحدث المنتجات",
      intro: false,
      introCta: "تسوّق الآن",
    },
  },
  studio: {
    key: "studio",
    name: "ستوديو",
    fonts: "family=IBM+Plex+Sans+Arabic:wght@400;500;600;700",
    motion: "lift",
    layout: {
      hero: "split",
      categories: "tiles",
      products: "grid",
      card: "studio",
      categoriesTitle: "تسوّق حسب القسم",
      productsTitle: "أحدث المنتجات",
      intro: true,
      introCta: "تسوّق الآن",
    },
  },
  souq: {
    key: "souq",
    name: "سوق",
    fonts: "family=Reem+Kufi:wght@500;600;700&family=Tajawal:wght@400;500;700",
    motion: "rise",
    layout: {
      hero: "split",
      categories: "rounds",
      products: "grid",
      card: "souq",
      categoriesTitle: "الأقسام",
      productsTitle: "مختارات المتجر",
      intro: true,
      introCta: "اكتشف التشكيلة",
    },
  },
  fashion: {
    key: "fashion",
    name: "أزياء",
    fonts: "family=Amiri:wght@400;700&family=Almarai:wght@400;700",
    motion: "fade",
    layout: {
      hero: "split",
      categories: "tiles",
      products: "grid",
      card: "fashion",
      categoriesTitle: "تسوّق حسب القسم",
      productsTitle: "وصل حديثاً",
      intro: true,
      introCta: "اكتشف المجموعة",
    },
  },
  furniture: {
    key: "furniture",
    name: "أثاث",
    fonts: "family=Readex+Pro:wght@400;500;600;700",
    motion: "rise",
    layout: {
      hero: "split",
      categories: "tiles",
      products: "grid",
      card: "furniture",
      categoriesTitle: "تسوّق حسب الغرفة",
      productsTitle: "قطع مختارة لبيتك",
      intro: true,
      introCta: "تصفح المعرض",
    },
  },
  bistro: {
    key: "bistro",
    name: "بيسترو",
    fonts: "family=El+Messiri:wght@500;600;700&family=Cairo:wght@400;600;700",
    motion: "fade",
    layout: {
      hero: "overlay",
      categories: "chips",
      products: "menu",
      card: "menu",
      categoriesTitle: null,
      productsTitle: "المنيو",
      intro: true,
      introCta: "شوف المنيو",
    },
  },
  street: {
    key: "street",
    name: "ستريت",
    fonts: "family=Lalezar&family=Cairo:wght@400;600;700",
    motion: "pop",
    layout: {
      hero: "poster",
      categories: "chips",
      products: "grid",
      card: "street",
      categoriesTitle: null,
      productsTitle: "المنيو",
      intro: true,
      introCta: "اطلب دلوقتي",
    },
  },
};

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}

/** The theme to draw; unknown or missing keys fall back to the default. */
export function resolveTheme(value: unknown): ThemeDefinition {
  return THEMES[isThemeKey(value) ? value : DEFAULT_THEME];
}

// Preview: the dashboard opens the store with ?theme_preview=<key>. The choice is kept
// in a session cookie so the owner can browse the store in that theme; customers never
// see it. ?theme_preview=off ends the preview.
export const THEME_PREVIEW_PARAM = "theme_preview";
export const THEME_PREVIEW_COOKIE = "ct_theme_preview";

export function fontsHref(theme: ThemeDefinition): string | null {
  return theme.fonts ? `https://fonts.googleapis.com/css2?${theme.fonts}&display=swap` : null;
}
