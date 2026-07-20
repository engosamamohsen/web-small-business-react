// ─── Shared SEO structured-data builders ─────────────────────────────────────
//
// The store's Organization JSON-LD is built from the tenant's settings API and
// reused on every page (homepage as a standalone node, product pages as the
// product's brand/seller, linked by @id). Keeping it here means the store name,
// logo, description, contact details and social profiles (sameAs ←
// facebook_link / instagram_link) stay consistent and dynamic across the site.

import type { SettingsData } from "@/hooks/fetchSettings";
import { resolveWhatsappNumber } from "@/lib/whatsapp-order";

/** Keep only real http(s) URLs (store social / profile links). */
function httpUrls(...values: Array<string | null | undefined>): string[] {
    return values.filter(
        (u): u is string => typeof u === "string" && /^https?:\/\//i.test(u.trim()),
    );
}

/** Stable @id for the store Organization on a given tenant origin. */
export function storeOrganizationId(origin: string): string {
    return `${origin}/#organization`;
}

/**
 * Build the store's Organization JSON-LD from the tenant settings. Every field
 * is conditional — only settings that are actually present get emitted, so a
 * store missing (say) an Instagram link simply omits it.
 */
export function buildStoreOrganization(
    settings: SettingsData | null | undefined,
    origin: string,
): Record<string, unknown> {
    const about = settings?.about_us?.replace(/\s+/g, " ").trim();
    const sameAs = httpUrls(settings?.facebook_link, settings?.instagram_link);
    // Same resolution as every wa.me link on the site: whatsapp_phone, else the
    // general phone, and null for a missing/placeholder number — publishing a
    // fake contact point in structured data would be as wrong as linking to it.
    const whatsapp = resolveWhatsappNumber(settings);

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": storeOrganizationId(origin),
        name: settings?.name || "المتجر",
        url: origin,
        ...(settings?.logo ? { logo: settings.logo } : {}),
        ...(about ? { description: about } : {}),
        ...(settings?.contact_email ? { email: settings.contact_email } : {}),
        ...(settings?.full_address
            ? {
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: settings.full_address,
                  },
              }
            : {}),
        ...(settings?.phone ? { telephone: settings.phone } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(whatsapp
            ? {
                  contactPoint: {
                      "@type": "ContactPoint",
                      telephone: whatsapp,
                      contactType: "customer service",
                  },
              }
            : {}),
    };
}

/**
 * Normalize the settings `keywords` field to a clean string[]. Usually already
 * an array, but tolerates a comma-separated string and an empty value (→ the
 * provided fallback).
 */
export function normalizeKeywords(
    raw: unknown,
    fallback: string[] = [],
): string[] {
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    if (typeof raw === "string" && raw.trim()) {
        return raw
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
    }
    return fallback;
}
