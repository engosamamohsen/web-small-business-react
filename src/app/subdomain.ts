import { cache } from "react";

/**
 * Get the base API URL
 * Cached to prevent multiple calls per request
 */
export const getSubdomain = cache(async (): Promise<string> => {
  // In production, you can use dynamic host detection:
  // import { headers } from "next/headers";
  // const headersList = await headers();
  // const host = headersList.get("host") || "";
  // return `https://${host}`;

  // For now, return static URL
  return "https://emend.cashierthru.com";
});



export default getSubdomain;