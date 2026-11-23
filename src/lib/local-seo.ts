// ─── Local SEO for food stores and category pages (owner decision 2026-11-23) ─────────────────────
//
// 1. A restaurant / café / bakery home page also describes the store as a local business
//    (schema.org Restaurant, CafeOrCoffeeShop or Bakery): address, opening hours, price range,
//    menu link. That is what Google uses for local results ("شاورما قريب مني") and Maps.
//    Everything comes from the store's own data; nothing is guessed (no cuisine, no made-up
//    location: the panel saves every branch at one fixed default point, so that point is skipped).
// 2. A category page (/?category=<id>-<name>) is its own page: own title, description and
//    canonical address, the same address the sitemap lists (src/pages/sitemap.xml.ts).

import type { SettingsData } from "@/hooks/fetchSettings";
import type { StoreHoursSetting } from "@/lib/store-hours";
import { resolveWhatsappNumber } from "@/lib/whatsapp-order";
import { storeOrganizationId } from "@/lib/seo";

/** schema.org type per food store type (src/lib/shop-type.ts FOOD_SHOP_TYPES); null = not a food store. */
export function foodBusinessType(shopType: string | null | undefined): string | null {
    switch (shopType) {
        case "restaurant":
            return "Restaurant";
        case "cafe":
            return "CafeOrCoffeeShop";
        case "bakery":
            return "Bakery";
        default:
            return null; // other store kinds, and stores with no type: not claimed as a restaurant
    }
}

/** The point the panel saves for every branch (AdminPanel\BranchesController): not a real location. */
const DEFAULT_BRANCH_POINT = { lat: 30.0444, lng: 31.2357 };

export interface BranchPlace {
    address: string;
    geo: { latitude: number; longitude: number } | null;
}

/** GET v1/store-branches → the branches with an address, and a location only when one was really set. */
export function branchPlaces(body: unknown): BranchPlace[] {
    const data = (body as { data?: unknown } | null)?.data;
    const items = Array.isArray(data) ? data : Array.isArray(body) ? body : [];
    const places: BranchPlace[] = [];
    for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const b = item as { address?: unknown; lat?: unknown; lng?: unknown };
        const address = typeof b.address === "string" ? b.address.replace(/\s+/g, " ").trim() : "";
        if (!address) continue;
        const lat = Number(b.lat);
        const lng = Number(b.lng);
        const real =
            Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
            !(lat === 0 && lng === 0) &&
            !(Math.abs(lat - DEFAULT_BRANCH_POINT.lat) < 1e-6 && Math.abs(lng - DEFAULT_BRANCH_POINT.lng) < 1e-6);
        places.push({ address, geo: real ? { latitude: lat, longitude: lng } : null });
    }
    return places;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * The weekly hours (setting-profile `hours`, weekday 0 = Sunday) as schema.org
 * OpeningHoursSpecification. Off or missing → none. 00:00–00:00 is open all day (00:00–23:59, as
 * Google asks); a range past midnight keeps its real closing time (18:00–02:00).
 */
export function openingHoursSpecification(hours: StoreHoursSetting | null | undefined): Record<string, unknown>[] {
    if (!hours?.enabled || !Array.isArray(hours.week)) return [];
    const specs: Record<string, unknown>[] = [];
    for (const day of hours.week) {
        const name = DAYS[day?.weekday];
        if (!name || !Array.isArray(day.ranges)) continue;
        for (const range of day.ranges) {
            const opens = /^\d{2}:\d{2}$/.test(range?.opens ?? "") ? range.opens : null;
            const closes = /^\d{2}:\d{2}$/.test(range?.closes ?? "") ? range.closes : null;
            if (!opens || !closes) continue;
            const allDay = opens === "00:00" && closes === "00:00";
            specs.push({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: `https://schema.org/${name}`,
                opens,
                closes: allDay ? "23:59" : closes,
            });
        }
    }
    return specs;
}

/** "EGP 10 - 370" from the products API price range; null when unknown. */
export function priceRangeText(range: { min?: number | null; max?: number | null } | null | undefined): string | null {
    const min = Number(range?.min);
    const max = Number(range?.max);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max <= 0) return null;
    return min === max ? `EGP ${max}` : `EGP ${Math.min(min, max)} - ${Math.max(min, max)}`;
}

/**
 * The food store as a local business, or null for any other kind of store. Linked to the store
 * Organization (#organization, src/lib/seo.ts) as the same brand.
 */
export function buildFoodBusinessJsonLd(
    settings: SettingsData | null | undefined,
    origin: string,
    extra: { hours?: StoreHoursSetting | null; branchesBody?: unknown; priceRange?: { min?: number | null; max?: number | null } | null },
): Record<string, unknown> | null {
    const type = foodBusinessType(settings?.shop_type);
    if (!type) return null;

    const name = settings?.name || "المتجر";
    const places = branchPlaces(extra.branchesBody);
    const storeAddress = settings?.full_address?.replace(/\s+/g, " ").trim();
    const main = storeAddress ? { address: storeAddress, geo: places[0]?.geo ?? null } : places[0] ?? null;
    const postal = (address: string) => ({ "@type": "PostalAddress", streetAddress: address, addressCountry: "EG" });
    const telephone = settings?.phone || resolveWhatsappNumber(settings);
    const about = settings?.about_us?.replace(/\s+/g, " ").trim();
    const image = settings?.logo && !/no_image|placeholder/i.test(settings.logo) ? settings.logo : null;
    const hours = openingHoursSpecification(extra.hours);
    const priceRange = priceRangeText(extra.priceRange);
    // Several branches: each one is a location of the business
    const departments =
        places.length > 1
            ? places.map((p) => ({
                  "@type": type,
                  name: `${name} - ${p.address}`,
                  address: postal(p.address),
                  ...(p.geo ? { geo: { "@type": "GeoCoordinates", ...p.geo } } : {}),
                  ...(telephone ? { telephone } : {}),
              }))
            : [];

    return {
        "@context": "https://schema.org",
        "@type": type,
        "@id": `${origin}/#business`,
        name,
        url: origin,
        ...(image ? { image, logo: image } : {}),
        ...(about ? { description: about } : {}),
        ...(telephone ? { telephone } : {}),
        ...(main ? { address: postal(main.address) } : {}),
        ...(main?.geo ? { geo: { "@type": "GeoCoordinates", ...main.geo } } : {}),
        ...(hours.length ? { openingHoursSpecification: hours } : {}),
        ...(priceRange ? { priceRange } : {}),
        currenciesAccepted: "EGP",
        hasMenu: `${origin}/`,
        ...(departments.length ? { department: departments } : {}),
        parentOrganization: { "@id": storeOrganizationId(origin) },
    };
}

/** Title, description and canonical address of a category page, plus its breadcrumb. */
export function categoryPageSeo(input: {
    category: { id: number | string; name?: string | null };
    pagePath: string; // categoryPagePath(category), "/?category=<id>-<name>"
    storeName: string;
    origin: string;
    productNames: string[];
    food: boolean;
}): { title: string; description: string; canonical: string; breadcrumb: Record<string, unknown> } {
    const categoryName = (input.category.name ?? "").replace(/\s+/g, " ").trim() || input.storeName;
    const canonical = encodeURI(`${input.origin}${input.pagePath}`);
    const lead = input.food
        ? `اطلب ${categoryName} من ${input.storeName} أونلاين`
        : `تسوّق ${categoryName} من ${input.storeName} أونلاين`;
    const names = input.productNames.map((n) => n.replace(/\s+/g, " ").trim()).filter(Boolean);
    let description = lead;
    for (const n of names) {
        const next = description === lead ? `${lead}: ${n}` : `${description}، ${n}`;
        if (next.length > 155) break;
        description = next;
    }
    if (description !== lead) description += ".";
    return {
        title: `${categoryName} | ${input.storeName}`,
        description,
        canonical,
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: input.storeName, item: `${input.origin}/` },
                { "@type": "ListItem", position: 2, name: categoryName, item: canonical },
            ],
        },
    };
}
