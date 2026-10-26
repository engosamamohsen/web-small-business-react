// What a store's website shows about the place itself: its photo gallery and its branches
// (Laravel API\V1\StorefrontShowcaseController: GET v1/gallery, GET v1/store-branches).
// Drawn by the Salon theme's home page (src/components/Themed/Salon/SalonThemeHome.astro).
// Everything here is pure, so the parsing and the links are unit-tested.

import { buildWhatsAppLink } from "@/lib/whatsapp-order";

/** The most photos the home page shows (same as StoreGalleryImage::MAX). */
export const GALLERY_MAX = 24;

export interface GalleryPhoto {
  id: number;
  url: string;
}

export interface StoreBranch {
  id: number;
  address: string;
  /** wa.me link of the branch, or null when its number is missing or unusable. */
  whatsappUrl: string | null;
  /** Google Maps link: the map point when there is one, else a search for the address. */
  mapUrl: string | null;
}

function list(body: unknown): unknown[] {
  const data = body && typeof body === "object" ? (body as { data?: unknown }).data : undefined;
  return Array.isArray(data) ? data : [];
}

function httpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(url) ? url : null;
}

/** GET v1/gallery → photos with a usable http(s) address, without repeats, at most GALLERY_MAX. */
export function parseGallery(body: unknown): GalleryPhoto[] {
  const seen = new Set<string>();
  const photos: GalleryPhoto[] = [];
  for (const item of list(body)) {
    if (!item || typeof item !== "object") continue;
    const { id, image_url } = item as { id?: unknown; image_url?: unknown };
    const url = httpUrl(image_url);
    if (!url || seen.has(url) || !Number.isFinite(Number(id))) continue;
    seen.add(url);
    photos.push({ id: Number(id), url });
    if (photos.length === GALLERY_MAX) break;
  }
  return photos;
}

function coordinate(value: unknown, limit: number): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

/**
 * Google Maps link for a place: "https://www.google.com/maps/search/?api=1&query=29.96,31.25"
 * from a map point (0,0 is no point), else a search for the address; null when there is neither.
 */
export function mapsLink(place: { lat?: unknown; lng?: unknown; address?: string | null }): string | null {
  const lat = coordinate(place.lat, 90);
  const lng = coordinate(place.lng, 180);
  const base = "https://www.google.com/maps/search/?api=1&query=";
  if (lat !== null && lng !== null && !(lat === 0 && lng === 0)) return `${base}${lat},${lng}`;
  const address = (place.address ?? "").replace(/\s+/g, " ").trim();
  return address ? `${base}${encodeURIComponent(address)}` : null;
}

/** GET v1/store-branches → branches with an address, each with its map and WhatsApp links. */
export function parseBranches(body: unknown): StoreBranch[] {
  const branches: StoreBranch[] = [];
  for (const item of list(body)) {
    if (!item || typeof item !== "object") continue;
    const b = item as { id?: unknown; address?: unknown; whatsapp?: unknown; lat?: unknown; lng?: unknown };
    const address = typeof b.address === "string" ? b.address.replace(/\s+/g, " ").trim() : "";
    if (!address || !Number.isFinite(Number(b.id))) continue;
    branches.push({
      id: Number(b.id),
      address,
      whatsappUrl: buildWhatsAppLink(typeof b.whatsapp === "string" ? b.whatsapp : null),
      mapUrl: mapsLink({ lat: b.lat, lng: b.lng, address }),
    });
  }
  return branches;
}

/** Instagram / Facebook links from the settings, only real http(s) addresses. */
export function socialLinks(settings: { instagram_link?: string | null; facebook_link?: string | null } | null | undefined) {
  return {
    instagram: httpUrl(settings?.instagram_link),
    facebook: httpUrl(settings?.facebook_link),
  };
}
