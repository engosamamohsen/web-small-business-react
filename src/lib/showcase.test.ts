import { describe, expect, it } from "vitest";
import { GALLERY_MAX, mapsLink, parseBranches, parseGallery, socialLinks } from "./showcase";

describe("parseGallery", () => {
  it("keeps photos with a usable address, in order, without repeats", () => {
    const photos = parseGallery({
      status: true,
      data: [
        { id: 2, image_url: "https://admin-salon.cashierthru.com/uploads/gallery/a.jpg" },
        { id: 3, image_url: "javascript:alert(1)" },
        { id: 4, image_url: "https://admin-salon.cashierthru.com/uploads/gallery/a.jpg" },
        { id: "x", image_url: "https://admin-salon.cashierthru.com/uploads/gallery/b.jpg" },
        { id: 5, image_url: " http://admin-salon.localhost:8000/uploads/gallery/c.png " },
        null,
      ],
    });
    expect(photos).toEqual([
      { id: 2, url: "https://admin-salon.cashierthru.com/uploads/gallery/a.jpg" },
      { id: 5, url: "http://admin-salon.localhost:8000/uploads/gallery/c.png" },
    ]);
  });

  it("returns nothing for a failed or odd answer", () => {
    expect(parseGallery(null)).toEqual([]);
    expect(parseGallery({ data: { id: 1 } })).toEqual([]);
    expect(parseGallery("oops")).toEqual([]);
  });

  it("shows at most the gallery limit", () => {
    const data = Array.from({ length: 40 }, (_, i) => ({ id: i, image_url: `https://x.test/${i}.jpg` }));
    expect(parseGallery({ data })).toHaveLength(GALLERY_MAX);
  });
});

describe("mapsLink", () => {
  it("uses the map point when there is one", () => {
    expect(mapsLink({ lat: "29.96", lng: 31.25, address: "المعادي" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=29.96,31.25",
    );
  });

  it("searches for the address when the point is missing, 0,0 or out of range", () => {
    const search = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("المعادي، شارع 9");
    expect(mapsLink({ lat: null, lng: null, address: " المعادي،  شارع 9 " })).toBe(search);
    expect(mapsLink({ lat: 0, lng: 0, address: "المعادي، شارع 9" })).toBe(search);
    expect(mapsLink({ lat: 120, lng: 31, address: "المعادي، شارع 9" })).toBe(search);
  });

  it("gives no link without a point or an address", () => {
    expect(mapsLink({ lat: "", lng: "", address: "  " })).toBeNull();
  });
});

describe("parseBranches", () => {
  it("builds map and WhatsApp links per branch", () => {
    const [branch, plain] = parseBranches({
      data: [
        { id: 1, address: "المعادي", whatsapp: "01093341796", lat: 29.96, lng: 31.25 },
        { id: 2, address: "مدينة نصر", whatsapp: "0123456789", lat: null, lng: null },
        { id: 3, address: "  ", whatsapp: "01093341796" },
      ],
    });
    expect(branch).toEqual({
      id: 1,
      address: "المعادي",
      whatsappUrl: "https://wa.me/201093341796",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=29.96,31.25",
    });
    expect(plain.whatsappUrl).toBeNull();
    expect(plain.mapUrl).toContain(encodeURIComponent("مدينة نصر"));
  });

  it("returns nothing for a failed answer", () => {
    expect(parseBranches(undefined)).toEqual([]);
  });
});

describe("socialLinks", () => {
  it("keeps only http(s) links", () => {
    expect(socialLinks({ instagram_link: "https://instagram.com/salon", facebook_link: "fb.com/salon" })).toEqual({
      instagram: "https://instagram.com/salon",
      facebook: null,
    });
    expect(socialLinks(null)).toEqual({ instagram: null, facebook: null });
  });
});
