import { NextResponse } from "next/server";

/**
 * Security headers configuration object
 */
export const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data: blob: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://apis.google.com https://*.googleapis.com https://*.firebaseapp.com; frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://firebasestorage.googleapis.com; connect-src 'self' https: wss: https://*.firebase.com https://*.firebaseio.com https://*.firebaseapp.com https://auth.firebase.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com;",
};

/**
 * Applies security headers to the response
 * @param response The NextResponse object to add headers to
 * @returns The modified response with security headers
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
