// lib/get-origin.ts
import { headers } from "next/headers";
import { cache } from "react";

// Cache for storing the origin across multiple calls
let cachedOrigin: string | null = null;

// Helper function to build origin from proto and host
const buildOrigin = (proto: string, host: string): string => {
  return `${proto}://${host}`;
};

// Memoized per request in RSC/Server Actions.
export const getOrigin = cache(async () => {
  // Return cached origin if available
  if (cachedOrigin) {
    return cachedOrigin;
  }

  const h = await headers();
  // Prefer proxy headers when behind Vercel/NGINX/Cloudflare, etc.
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");

  if (!host) {
    // Fallback for local dev or unusual setups:
    // set NEXT_PUBLIC_BASE_URL (e.g. http://localhost:3000)
    const fallback = process.env.NEXT_PUBLIC_BASE_URL;
    if (!fallback)
      throw new Error("Host header missing and no NEXT_PUBLIC_BASE_URL set");
    
    cachedOrigin = fallback;
    return fallback;
  }

  const origin = buildOrigin(proto, host);
  cachedOrigin = origin;
  return origin;
});

// Function to get cached origin without async call (if already cached)
export const getCachedOrigin = (): string | null => {
  return cachedOrigin;
};

// Function to clear the cached origin (useful for testing or when needed)
export const clearOriginCache = (): void => {
  cachedOrigin = null;
};
