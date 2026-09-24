import { NextResponse, type NextRequest } from "next/server";

/**
 * Tracking test view: `?ct_debug=1` (opened from the dashboard's "Test in my browser",
 * and used by its "Check my store") makes the layout load fresh settings and show the
 * tracking test panel. The layout can't read query params, so pass it as a header.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.searchParams.get("ct_debug") !== "1") {
    return NextResponse.next();
  }
  const headers = new Headers(request.headers);
  headers.set("x-ct-debug", "1");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$).*)"],
};
