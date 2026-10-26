import { describe, expect, it } from "vitest";
import {
  buildServiceJsonLd,
  canonicalServiceRedirect,
  encodedServicePath,
  providerType,
  serviceIdFromSlug,
  serviceMetaDescription,
  servicePath,
  serviceTitle,
} from "./seo";
import type { BookingServiceDetail } from "./types";

const service: BookingServiceDetail = {
  id: 91,
  slug: "91-قص-شعر",
  name: "قص شعر",
  description: null,
  category: "شعر",
  price: 200,
  sale_price: 180,
  duration_minutes: 45,
  branch_ids: [],
  staff: [{ id: 93, name: "Mona", bio: null }],
};

describe("paths and slugs", () => {
  it("builds and encodes service paths", () => {
    expect(servicePath("91-قص-شعر")).toBe("/services/91-قص-شعر");
    expect(encodedServicePath("91-قص-شعر")).toBe("/services/91-%D9%82%D8%B5-%D8%B4%D8%B9%D8%B1");
  });

  it("reads only the leading id", () => {
    expect(serviceIdFromSlug("91-قص-شعر")).toBe(91);
    expect(serviceIdFromSlug("91")).toBe(91);
    expect(serviceIdFromSlug("91abc")).toBeNull();
    expect(serviceIdFromSlug("قص-91")).toBeNull();
    expect(serviceIdFromSlug("0-x")).toBeNull();
    expect(serviceIdFromSlug(undefined)).toBeNull();
  });
});

describe("canonicalServiceRedirect", () => {
  it("stays on the current slug, encoded or not", () => {
    expect(canonicalServiceRedirect("/services/91-قص-شعر", service.slug)).toBeNull();
    expect(canonicalServiceRedirect(encodedServicePath(service.slug), service.slug)).toBeNull();
    expect(canonicalServiceRedirect(encodedServicePath(service.slug) + "/", service.slug)).toBeNull();
  });

  it("301s a renamed or id-only link to the encoded current slug, keeping the query", () => {
    expect(canonicalServiceRedirect("/services/91-old-name", service.slug, "?utm_source=fb")).toBe(
      "/services/91-%D9%82%D8%B5-%D8%B4%D8%B9%D8%B1?utm_source=fb",
    );
    expect(canonicalServiceRedirect("/services/91", service.slug)).toBe(encodedServicePath(service.slug));
  });

  it("survives a malformed encoding", () => {
    expect(canonicalServiceRedirect("/services/91-%E0%A4%A", service.slug)).toBe(encodedServicePath(service.slug));
  });
});

describe("meta", () => {
  it("titles the page '<service> | <store>'", () => {
    expect(serviceTitle("قص شعر", "ServiceLab")).toBe("قص شعر | ServiceLab");
    expect(serviceTitle("قص شعر", null)).toBe("قص شعر");
  });

  it("falls back to name – duration – price", () => {
    expect(serviceMetaDescription(service)).toBe("قص شعر – 45 دقيقة – 180 ج.م");
  });

  it("uses the description without HTML, at most 160 characters", () => {
    expect(serviceMetaDescription({ ...service, description: "<p>قص  وتسريح</p>" })).toBe("قص وتسريح");
    const long = serviceMetaDescription({ ...service, description: "ا".repeat(300) });
    expect(long.length).toBeLessThanOrEqual(160);
    expect(long.endsWith("…")).toBe(true);
  });

  it("calls beauty stores a BeautySalon", () => {
    expect(providerType("beauty")).toBe("BeautySalon");
    expect(providerType("service")).toBe("LocalBusiness");
    expect(providerType(null)).toBe("LocalBusiness");
  });
});

describe("buildServiceJsonLd", () => {
  const origin = "https://servicelab.cashierthru.com";

  it("describes the service, its provider, offer and breadcrumbs", () => {
    const [node, crumbs] = buildServiceJsonLd(
      service,
      { id: 1, name: "ServiceLab", shop_type: "beauty", full_address: "Nasr City, Cairo", whatsapp_phone: "01093341796" },
      origin,
    ) as any[];
    expect(node["@type"]).toBe("Service");
    expect(node.url).toBe(`${origin}/services/91-%D9%82%D8%B5-%D8%B4%D8%B9%D8%B1`);
    expect(node.provider["@type"]).toBe("BeautySalon");
    expect(node.provider.name).toBe("ServiceLab");
    expect(node.provider.address.streetAddress).toBe("Nasr City, Cairo");
    expect(node.areaServed).toBe("Nasr City, Cairo");
    expect(node.offers).toMatchObject({ price: 180, priceCurrency: "EGP" });
    expect(node.description).toBeUndefined();
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement.map((i: any) => i.item)).toEqual([`${origin}/`, `${origin}/services`, node.url]);
  });

  it("leaves out what the store didn't fill", () => {
    const [node] = buildServiceJsonLd(service, { id: 1, name: "X" }, origin) as any[];
    expect(node.areaServed).toBeUndefined();
    expect(node.provider.address).toBeUndefined();
    expect(node.provider["@type"]).toBe("LocalBusiness");
  });
});
