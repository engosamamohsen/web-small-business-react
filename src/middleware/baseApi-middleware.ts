import { NextRequest, NextResponse } from "next/server";

/**
 * Handles baseApi cookie logic for middleware
 * @param request NextRequest object
 * @returns NextResponse or null if baseApi cookie already exists
 */
export function handleBaseApi(request: NextRequest): NextResponse | null {
  // if cookie exists, return null
  const existingBaseApi = request.cookies.get("baseApi")?.value;
  if (existingBaseApi) {
    return null; // Return null to indicate middleware should continue
  }

  // take origin from request
  const baseApi = request.nextUrl.origin;

  // redirect to the same page with baseApi cookie
  const res = NextResponse.redirect(request.nextUrl);

  // save cookie
  res.cookies.set("baseApi", baseApi, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

/**
 * Gets the baseApi value from cookies
 * @param request NextRequest object
 * @returns baseApi value or null
 */
export function getBaseApi(request: NextRequest): string | null {
  return request.cookies.get("baseApi")?.value || null;
}
