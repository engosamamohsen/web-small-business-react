// Home page of a salon (QA finding 12, 2026-10-26): a service or beauty store whose booking is on
// opens with its services and a big "احجز موعد" button instead of the product list. The cart,
// product search and product sections stay only when the store also sells products. Every other
// store keeps the original home page. Used by src/pages/index.astro.

import type { SettingsData } from "@/hooks/fetchSettings";
import { buildServiceProvider, encodedServicePath } from "./seo";
import { t } from "./strings";
import { effectivePrice } from "./totals";
import type { BookingService } from "./types";

/** Store types whose home page can open with services (Tenant::SHOP_TYPE_BEAUTY / SERVICE). */
export const SERVICE_SHOP_TYPES = ["beauty", "service"] as const;

export function isServiceShopType(shopType: string | null | undefined): boolean {
  return (SERVICE_SHOP_TYPES as readonly string[]).includes(shopType ?? "");
}

/** Services first on the home page: a beauty / service store that takes bookings. */
export function servicesFirstHome(shopType: string | null | undefined, bookingEnabled: boolean | null | undefined): boolean {
  return bookingEnabled === true && isServiceShopType(shopType);
}

/**
 * Does the store sell products? Read from what the home page already loads: a category with
 * active products (v1/categories, never filtered) or a product on the first page of v1/product.
 */
export function storeHasProducts(
  categories: Array<{ products_active?: unknown[] | null } | null | undefined>,
  products: unknown[] | null | undefined,
): boolean {
  if (Array.isArray(products) && products.length > 0) return true;
  return categories.some((c) => Array.isArray(c?.products_active) && c.products_active.length > 0);
}

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 160;

function oneLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function cut(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Service names, without blanks or repeats, in the catalog's order. */
function serviceNames(services: Pick<BookingService, "name">[]): string[] {
  return [...new Set(services.map((s) => oneLine(s.name)).filter(Boolean))];
}

/**
 * <title> and meta description of a salon's home page; both name the services.
 *   title:       "صالون ليلى | قص شعر، صبغة، مانيكير" (as many names as fit in 70 characters)
 *   description: "احجز موعد في صالون ليلى: قص شعر، صبغة، مانيكير. <about>" (at most 160 characters)
 */
export function salonHomeMeta(
  storeName: string | null | undefined,
  about: string | null | undefined,
  services: Pick<BookingService, "name">[],
): { title: string; description: string } {
  const store = oneLine(storeName) || "المتجر";
  const names = serviceNames(services);

  let title = `${store} | ${t.navBook}`;
  for (let n = Math.min(names.length, 4); n > 0; n--) {
    const candidate = `${store} | ${names.slice(0, n).join("، ")}`;
    if (candidate.length <= TITLE_MAX) {
      title = candidate;
      break;
    }
  }

  const lead = names.length ? `${t.navBook} في ${store}: ${names.join("، ")}.` : `${t.navBook} في ${store}. ${t.servicesIntro}`;
  const description = cut([cut(lead, DESCRIPTION_MAX), oneLine(about)].filter(Boolean).join(" "), DESCRIPTION_MAX);
  return { title, description };
}

/**
 * The store as a BeautySalon (beauty) or LocalBusiness (service) with its bookable services as an
 * offer catalog. Same @id as the provider on /services/<slug>, so search engines link them.
 */
export function buildSalonBusinessJsonLd(
  settings: SettingsData | null | undefined,
  origin: string,
  services: BookingService[],
): Record<string, unknown> {
  const about = oneLine(settings?.about_us);
  const offers = services.slice(0, 50).map((s) => ({
    "@type": "Offer",
    price: effectivePrice(s),
    priceCurrency: "EGP",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      ...(s.slug ? { url: `${origin}${encodedServicePath(s.slug)}` } : {}),
    },
  }));
  return {
    "@context": "https://schema.org",
    ...buildServiceProvider(settings, origin),
    ...(about ? { description: about } : {}),
    ...(offers.length ? { hasOfferCatalog: { "@type": "OfferCatalog", name: t.servicesTitle, itemListElement: offers } } : {}),
  };
}
