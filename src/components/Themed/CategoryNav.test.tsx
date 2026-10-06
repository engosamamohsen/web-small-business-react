import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import CategoryNav from "./CategoryNav";
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
      /aria-pressed="true"[^>]*>(?:<span[^>]*>.*?<\/span>)?<span[^>]*>([^<]*)<\/span>/g,
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
