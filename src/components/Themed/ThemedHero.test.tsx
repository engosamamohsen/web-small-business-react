import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import ThemedHero from "./ThemedHero";

vi.mock("./themed.css", () => ({}));

// The banner layout (photo beside or under the words) hangs on the `has-media` class.
describe("ThemedHero", () => {
  it("marks a banner with a photo as has-media", () => {
    const html = renderToString(
      <ThemedHero
        slides={[{ id: 1, title: "عرض", image: "https://example.test/a.jpg" }]}
        cta="تسوّق"
        motion="fade"
      />,
    );
    expect(html).toContain('class="ct-hero__frame has-media"');
  });

  it("makes the banner on screen the page's only h1", () => {
    const html = renderToString(
      <ThemedHero
        slides={[
          { id: 1, title: "عرض الخريف", image: "https://example.test/a.jpg" },
          { id: 2, title: "شحن مجاني", image: "https://example.test/b.jpg" },
        ]}
        cta="تسوّق"
        motion="fade"
      />,
    );
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*>عرض الخريف<\/h1>/);
  });

  it("draws the store intro without has-media", () => {
    const html = renderToString(
      <ThemedHero
        slides={[]}
        storeName="متجر"
        about="نبذة"
        cta="تسوّق"
        motion="none"
      />,
    );
    expect(html).toContain('class="ct-hero__frame"');
    expect(html).toContain("<h1");
  });
});
