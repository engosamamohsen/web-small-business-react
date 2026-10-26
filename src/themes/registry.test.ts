import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, THEMES, THEME_KEYS, fontsHref, isThemeKey, resolveTheme } from "./registry";

describe("storefront themes", () => {
  it("matches the dashboard's theme keys", () => {
    // Keep in sync with App\Support\Storefront\StorefrontThemes in the Laravel repo.
    expect([...THEME_KEYS]).toEqual(["classic", "salon", "studio", "souq", "fashion", "furniture", "bistro", "street"]);
    for (const key of THEME_KEYS) expect(THEMES[key].key).toBe(key);
  });

  it("falls back to the default for missing or unknown themes", () => {
    expect(resolveTheme(undefined).key).toBe(DEFAULT_THEME);
    expect(resolveTheme(null).key).toBe(DEFAULT_THEME);
    expect(resolveTheme("realestate-soon").key).toBe(DEFAULT_THEME);
    expect(resolveTheme("bistro").key).toBe("bistro");
  });

  it("only accepts known keys (preview param and cookie are user input)", () => {
    expect(isThemeKey("souq")).toBe(true);
    expect(isThemeKey("souq<script>")).toBe(false);
    expect(isThemeKey(1)).toBe(false);
  });

  it("classic keeps the original page: no extra fonts, original components", () => {
    expect(fontsHref(THEMES.classic)).toBeNull();
    expect(THEMES.classic.layout).toMatchObject({ hero: "overlay", categories: "swiper", products: "grid", card: "classic", intro: false });
  });

  it("loads each theme's fonts from Google Fonts", () => {
    expect(fontsHref(THEMES.souq)).toBe(
      "https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;600;700&family=Tajawal:wght@400;500;700&display=swap",
    );
  });

  it("salon draws its own home page with an elegant serif and a sans body", () => {
    expect(THEMES.salon.layout).toMatchObject({ hero: "salon", products: "grid", card: "salon", intro: true });
    expect(fontsHref(THEMES.salon)).toBe(
      "https://fonts.googleapis.com/css2?family=Markazi+Text:wght@500;600;700&family=Alexandria:wght@300;400;500;600&display=swap",
    );
  });

  it("uses menu rows only in the menu layout", () => {
    for (const theme of Object.values(THEMES)) {
      expect(theme.layout.card === "menu").toBe(theme.layout.products === "menu");
    }
  });
});
