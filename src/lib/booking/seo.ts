// SEO of the service pages (/services, /services/<slug>): paths, canonical redirects, meta
// description and Schema.org JSON-LD (Service + provider + BreadcrumbList). Mirrors the product
// pages (src/pages/product/[slug].astro): Arabic slugs are percent-encoded in headers and hrefs.

import type { SettingsData } from "@/hooks/fetchSettings";
import { resolveWhatsappNumber } from "@/lib/whatsapp-order";
import { t } from "./strings";
import { effectivePrice } from "./totals";
import type { BookingServiceDetail } from "./types";

export const SERVICES_PATH = "/services";

/** "/services/91-قص-شعر" (not encoded: compare with a decoded pathname). */
export function servicePath(slug: string): string {
  return `${SERVICES_PATH}/${slug}`;
}

/** The same path, ASCII-safe for Location headers, canonical and sitemap. */
export function encodedServicePath(slug: string): string {
  return encodeURI(servicePath(slug));
}

/** The service id at the start of a slug ("91-قص-شعر" → 91), or null. Only the id counts. */
export function serviceIdFromSlug(slug: string | undefined | null): number | null {
  const match = /^(\d+)(?:-|$)/.exec(String(slug ?? ""));
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Where to 301 when the requested path isn't the service's current one (renamed service,
 * id-only link, encoded vs decoded), or null when it already is. Keeps the query string.
 */
export function canonicalServiceRedirect(requestPathname: string, apiSlug: string, search = ""): string | null {
  const current = safeDecode(requestPathname).replace(/\/+$/, "");
  if (current === servicePath(apiSlug)) return null;
  return encodedServicePath(apiSlug) + search;
}

function plainText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function money(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

/** The service's description, or "<service> – <duration> دقيقة – <price> ج.م"; at most 160 characters. */
export function serviceMetaDescription(service: Pick<BookingServiceDetail, "name" | "description" | "duration_minutes" | "price" | "sale_price">): string {
  const text =
    plainText(service.description) ||
    `${service.name} – ${Number(service.duration_minutes) || 0} دقيقة – ${money(effectivePrice(service))} ج.م`;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

/** "<service> | <store name>". */
export function serviceTitle(serviceName: string, storeName: string | null | undefined): string {
  return storeName ? `${serviceName} | ${storeName}` : serviceName;
}

/** Schema.org type of the store: a beauty salon for beauty stores, else a local business. */
export function providerType(shopType: string | null | undefined): "BeautySalon" | "LocalBusiness" {
  return shopType === "beauty" ? "BeautySalon" : "LocalBusiness";
}

/** The store as the service's provider. */
export function buildServiceProvider(settings: SettingsData | null | undefined, origin: string): Record<string, unknown> {
  const telephone = resolveWhatsappNumber(settings) ?? settings?.phone ?? null;
  const address = settings?.full_address?.trim();
  return {
    "@type": providerType(settings?.shop_type),
    "@id": `${origin}/#business`,
    name: settings?.name || "المتجر",
    url: origin,
    ...(settings?.logo && !/no_image|placeholder/i.test(settings.logo) ? { image: settings.logo } : {}),
    ...(telephone ? { telephone } : {}),
    ...(address ? { address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "EG" } } : {}),
  };
}

/** [Service, BreadcrumbList] for /services/<slug>. */
export function buildServiceJsonLd(
  service: BookingServiceDetail,
  settings: SettingsData | null | undefined,
  origin: string,
): Record<string, unknown>[] {
  const url = `${origin}${encodedServicePath(service.slug)}`;
  const address = settings?.full_address?.trim();
  const description = plainText(service.description);
  const serviceNode = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    url,
    ...(description ? { description } : {}),
    ...(service.category ? { category: service.category } : {}),
    serviceType: service.category || service.name,
    provider: buildServiceProvider(settings, origin),
    ...(address ? { areaServed: address } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: effectivePrice(service),
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
    },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: settings?.name || "الرئيسية", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: t.servicesTitle, item: `${origin}${SERVICES_PATH}` },
      { "@type": "ListItem", position: 3, name: service.name, item: url },
    ],
  };
  return [serviceNode, breadcrumbs];
}
