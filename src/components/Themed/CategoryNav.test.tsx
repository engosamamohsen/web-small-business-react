import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import CategoryNav, { selectCategory } from "./CategoryNav";
import type { CategoryType } from "@/lib/types";

vi.mock("./themed.css", () => ({}));
vi.mock("@/components/Categories/SubCategories", () => ({
  default: () => null,
}));
vi.mock("@/components/Categories/CategorySwiper", () => ({
  scrollToProducts: () => {},
}));

const categories = [
  { id: 1, name: "ملابس", slug: "clothes" },
  { id: 2, name: "ساعات", slug: "watches" },
] as unknown as CategoryType[];

const pressed = (html: string) =>
  [
    ...html.matchAll(
      /aria-current="true"[^>]*>(?:<span[^>]*>.*?<\/span>)?<span[^>]*>([^<]*)<\/span>/g,
    ),
  ].map((m) => m[1]);

// A shared link (/?category=2-watches) must show that category selected in the server HTML,
// matching what the browser renders when it hydrates.
describe("CategoryNav", () => {
  it("marks the linked category, not All, on the server", () => {
    const html = renderToString(
      <CategoryNav
        categories={categories}
        variant="tiles"
        title="الأقسام"
        initialCategory="2-watches"
      />,
    );
    expect(pressed(html)).toEqual(["ساعات"]);
  });

  it("marks All when the page has no category", () => {
    const html = renderToString(
      <CategoryNav categories={categories} variant="tiles" title="الأقسام" />,
    );
    expect(pressed(html)).toEqual(["الكل"]);
  });
});

// Search engines must be able to follow every category (owner decision 2026-11-23): each one is a real
// link to its own page, in all three layouts; a plain click still filters in place.
describe("CategoryNav links", () => {
  const withNull = [
    { id: 1, name: "ملابس", slug: "clothes" },
    { id: 5, name: "بديل الخشب", slug: null },
  ] as unknown as CategoryType[];

  for (const variant of ["tiles", "rounds", "chips"] as const) {
    it(`gives every category a link to its page (${variant})`, () => {
      const html = renderToString(<CategoryNav categories={withNull} variant={variant} title={null} />);
      const hrefs = [...html.matchAll(/<a[^>]*href="([^"]+)"/g)].map((m) => decodeURIComponent(m[1]));
      expect(hrefs).toEqual(["/", "/?category=1-ملابس", "/?category=5-بديل-الخشب"]);
      expect(html).not.toContain("<button");
      expect(html).not.toContain("aria-pressed");
    });
  }

  it("filters in place writing <id> for a category without a slug (it wrote <id>-null)", () => {
    const pushState = vi.fn();
    vi.stubGlobal("window", { location: { pathname: "/", search: "" }, history: { pushState }, scrollTo: () => {} });
    vi.stubGlobal("document", { getElementById: () => null });
    try {
      selectCategory(withNull[1]);
      expect(pushState).toHaveBeenLastCalledWith({}, "", "/?page=1&category=5");
      // clicking it again (bare id or old "-null" link) deselects it
      window.location.search = "?category=5-null";
      selectCategory(withNull[1]);
      expect(pushState).toHaveBeenLastCalledWith({}, "", "/?page=1");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
