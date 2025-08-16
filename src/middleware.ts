import { NextRequest, NextResponse } from "next/server";
import { handleBaseApi } from "./middleware/baseApi-middleware";

export function middleware(request: NextRequest) {
  // Handle baseApi cookie logic
  const baseApiResponse = handleBaseApi(request);
  if (baseApiResponse) {
    return baseApiResponse;
  }

  // Continue with other middleware logic if needed
  return NextResponse.next();
}

// exceptions: do not run on /api/* or static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|api/|.*\\.).*)",
  ],
};
