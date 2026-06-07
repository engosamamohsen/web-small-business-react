
import { getBaseUrl } from "./config";

/**
 * Returns the current tenant's origin URL.
 * Delegates to getBaseUrl() in config.ts which reads window.location.origin
 * at runtime (client) or falls back to PUBLIC_BASE_URL at build time (SSR).
 */
export default async function getSubdomain(): Promise<string> {
  return getBaseUrl();
}
