import { describe, it, expect } from "vitest";
import { knownItems, headHtml, bodyStartHtml, bodyEndHtml, debugItems, validId } from "./providers";

const meta = { ref: "a1", type: "meta_pixel", id: "123456789012" };
const gsc = { ref: "a2", type: "google_search_console", id: "abcDEF123_-abcDEF123_-xyz" };
const ga = { ref: "a3", type: "google_analytics", id: "G-ABC1234" };
const headCode = { ref: "c1", type: "custom", placement: "head" as const, code: "<meta name=\"x\" content=\"1\">" };
const footCode = { ref: "c2", type: "custom", placement: "body" as const, code: "<div id=\"chat\"></div>", name: "Chat" };

describe("validId", () => {
  it("rejects IDs that could break out of the inline script", () => {
    expect(validId("meta_pixel", "123456'); alert(1);//")).toBeNull();
    expect(validId("meta_pixel", " 123456789 ")).toBe("123456789");
    expect(validId("unknown_service", "123456789")).toBeNull();
  });
});

describe("knownItems", () => {
  it("skips unknown types, bad IDs and empty custom code", () => {
    const items = knownItems([
      meta,
      { ref: "x", type: "snapchat_pixel", id: "abc" },
      { ref: "y", type: "meta_pixel", id: "nope" },
      { ref: "z", type: "custom", code: "  " },
      footCode,
    ]);
    expect(items.map((i) => i.ref)).toEqual(["a1", "c2"]);
  });

  it("skips a GA property the site-wide PUBLIC_GA_ID tag already loads", () => {
    expect(knownItems([ga], "G-ABC1234")).toEqual([]);
    expect(knownItems([ga], "G-OTHER99")).toEqual([ga]);
  });
});

describe("page parts", () => {
  const items = knownItems([meta, gsc, ga, headCode, footCode]);

  it("puts verification tags and header code in <head>", () => {
    const head = headHtml(items);
    expect(head).toContain(`<meta name="google-site-verification" content="${gsc.id}" />`);
    expect(head).toContain('data-ct-ref="c1"');
    expect(head).toContain(headCode.code);
    expect(head).not.toContain(footCode.code);
    expect(head).not.toContain("<script");
  });

  it("puts noscript fallbacks at the start of <body>", () => {
    expect(bodyStartHtml(items)).toContain(`facebook.com/tr?id=${meta.id}`);
  });

  it("puts loaders, footer code and the manifest at the end of <body>", () => {
    const end = bodyEndHtml(items);
    expect(end).toContain(`fbq('init','${meta.id}')`);
    expect(end).toContain(`gtag/js?id=${ga.id}`);
    expect(end).toContain(footCode.code);
    expect(end).not.toContain(headCode.code);
    const manifest = end.match(/id="ct-tracking-manifest">(.*?)<\/script>/)![1];
    expect(JSON.parse(manifest).map((m: { ref: string }) => m.ref)).toEqual(["a1", "a2", "a3", "c1", "c2"]);
  });

  it("keeps a ref from closing the manifest script", () => {
    const end = bodyEndHtml([{ ...footCode, ref: "</script><b>" }]);
    expect(end.match(/<\/script>/g)).toHaveLength(1);
  });

  it("gives the test panel a label and probe per item", () => {
    const debug = debugItems(items);
    expect(debug.find((d) => d.ref === "c2")).toMatchObject({ label: "Chat", probe: { selector: '[data-ct-ref="c2"]' } });
    expect(debug.find((d) => d.ref === "a1")?.probe.send).toEqual(["facebook.com/tr"]);
  });
});
