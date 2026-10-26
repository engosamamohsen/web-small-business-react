import { describe, expect, it } from "vitest";
import {
  buildSalonBusinessJsonLd,
  isServiceShopType,
  salonHomeMeta,
  servicesFirstHome,
  storeHasProducts,
} from "./salon-home";
import type { BookingService } from "./types";

const service = (id: number, name: string, extra: Partial<BookingService> = {}): BookingService => ({
  id,
  category_id: null,
  name,
  price: 200,
  sale_price: null,
  duration_minutes: 30,
  branch_ids: [],
  ...extra,
});

describe("which stores open with services", () => {
  it("is beauty and service stores with booking on only", () => {
    expect(isServiceShopType("beauty")).toBe(true);
    expect(isServiceShopType("service")).toBe(true);
    expect(isServiceShopType("restaurant")).toBe(false);
    expect(isServiceShopType("fashion")).toBe(false);
    expect(isServiceShopType(null)).toBe(false);
    expect(isServiceShopType(undefined)).toBe(false);

    expect(servicesFirstHome("beauty", true)).toBe(true);
    expect(servicesFirstHome("service", true)).toBe(true);
    expect(servicesFirstHome("beauty", false)).toBe(false);
    expect(servicesFirstHome("beauty", undefined)).toBe(false);
    expect(servicesFirstHome("cafe", true)).toBe(false);
    expect(servicesFirstHome(null, true)).toBe(false);
  });
});

describe("storeHasProducts", () => {
  it("is true with a product or a category that has active products", () => {
    expect(storeHasProducts([], [{ id: 1 }])).toBe(true);
    expect(storeHasProducts([{ products_active: [{ id: 1 }] }], [])).toBe(true);
    // A search that found nothing still counts the store's categories.
    expect(storeHasProducts([{ products_active: [] }, { products_active: [{ id: 2 }] }], [])).toBe(true);
  });

  it("is false with no products anywhere", () => {
    expect(storeHasProducts([], [])).toBe(false);
    expect(storeHasProducts([{ products_active: [] }, { products_active: null }, null], null)).toBe(false);
    expect(storeHasProducts([], undefined)).toBe(false);
  });
});

describe("salonHomeMeta", () => {
  it("names the services in the title and the description", () => {
    const meta = salonHomeMeta("صالون ليلى", "أحسن صالون في المعادي", [
      service(1, "قص شعر"),
      service(2, "صبغة"),
      service(3, "قص شعر"),
      service(4, " مانيكير "),
    ]);
    expect(meta.title).toBe("صالون ليلى | قص شعر، صبغة، مانيكير");
    expect(meta.description).toBe("احجز موعد في صالون ليلى: قص شعر، صبغة، مانيكير. أحسن صالون في المعادي");
  });

  it("keeps the title and description short", () => {
    const many = Array.from({ length: 30 }, (_, i) => service(i + 1, `خدمة طويلة جداً رقم ${i + 1}`));
    const meta = salonHomeMeta("صالون", "x ".repeat(200), many);
    expect(meta.title.length).toBeLessThanOrEqual(70);
    expect(meta.title.startsWith("صالون | خدمة طويلة جداً رقم 1")).toBe(true);
    expect(meta.description.length).toBeLessThanOrEqual(160);
    expect(meta.description.endsWith("…")).toBe(true);
  });

  it("falls back to the book words without services", () => {
    const meta = salonHomeMeta(null, null, []);
    expect(meta.title).toBe("المتجر | احجز موعد");
    expect(meta.description).toBe("احجز موعد في المتجر. اختار الخدمة واحجز ميعادك في دقيقة.");
  });
});

describe("buildSalonBusinessJsonLd", () => {
  const origin = "https://salon.cashierthru.com";

  it("is a BeautySalon for beauty stores, with the services as offers", () => {
    const node = buildSalonBusinessJsonLd(
      { name: "صالون ليلى", shop_type: "beauty", about_us: "  أحسن\r\nصالون " } as never,
      origin,
      [service(91, "قص شعر", { slug: "91-قص-شعر", sale_price: 150 }), service(92, "صبغة")],
    );
    expect(node["@context"]).toBe("https://schema.org");
    expect(node["@type"]).toBe("BeautySalon");
    expect(node["@id"]).toBe(`${origin}/#business`);
    expect(node.description).toBe("أحسن صالون");
    const catalog = node.hasOfferCatalog as { itemListElement: Array<Record<string, any>> };
    expect(catalog.itemListElement).toHaveLength(2);
    expect(catalog.itemListElement[0]).toEqual({
      "@type": "Offer",
      price: 150,
      priceCurrency: "EGP",
      itemOffered: { "@type": "Service", name: "قص شعر", url: `${origin}/services/91-%D9%82%D8%B5-%D8%B4%D8%B9%D8%B1` },
    });
    expect(catalog.itemListElement[1].itemOffered).toEqual({ "@type": "Service", name: "صبغة" });
  });

  it("is a LocalBusiness for service stores and leaves out an empty catalog", () => {
    const node = buildSalonBusinessJsonLd({ name: "ورشة", shop_type: "service" } as never, origin, []);
    expect(node["@type"]).toBe("LocalBusiness");
    expect(node).not.toHaveProperty("hasOfferCatalog");
    expect(node).not.toHaveProperty("description");
  });
});
