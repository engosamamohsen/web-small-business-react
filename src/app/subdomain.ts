import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get the base API URL
 * Cached to prevent multiple calls per request
 */
export const getSubdomain = cache(async (): Promise<string> => {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  return `https://${host}`;

  // For now, return static URL
  // return "https://emend.cashierthru.com";
});



export default getSubdomain;