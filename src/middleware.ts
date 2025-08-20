import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "baseApi";
const ONE_WEEK = 60 * 60 * 24 * 7;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⛔ تخطّي API/Static/Next internals وأي طلب مش HTML (زي fetch/json)
  const isApi = pathname.startsWith("/api");
  const isNextInternal = pathname.startsWith("/_next");
  const isStaticFile =
    /\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt|xml|webp|avif|woff2?|mp4|mp3)$/.test(
      pathname,
    );
  const isPrefetch = request.headers.has("x-middleware-prefetch");
  const isNextData = request.headers.has("x-nextjs-data");
  const accept = request.headers.get("accept") || "";
  const isHtmlDoc = accept.includes("text/html");

  if (
    isApi ||
    isNextInternal ||
    isStaticFile ||
    isPrefetch ||
    isNextData ||
    !isHtmlDoc
  ) {
    return NextResponse.next();
  }

  // ✅ مرّة واحدة فقط لكل متصفح: لو الكوكي موجود خلاص
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing) {
    return NextResponse.next();
  }

  // أول زيارة HTML: احسب القيمة واحقنها فورًا في الهيدر + ثبّت الكوكي للطلبات الجاية
  const baseApi = request.nextUrl.origin;

  // حقن الكوكي في هيدر الطلب الحالي (عشان الصفحات/الراوتس تشوفه فورًا)
  const reqHeaders = new Headers(request.headers);
  const cookieHeader = reqHeaders.get("cookie") || "";
  const sep = cookieHeader ? "; " : "";
  reqHeaders.set(
    "cookie",
    `${cookieHeader}${sep}${COOKIE_NAME}=${encodeURIComponent(baseApi)}`,
  );

  // مرّر الهيدرز المعدّلة downstream
  const res = NextResponse.next({ request: { headers: reqHeaders } });

  // ثبّت الكوكي للطلبات القادمة (بدون أي redirect)
  res.cookies.set(COOKIE_NAME, baseApi, {
    path: "/",
    sameSite: "lax",
    httpOnly: true, // خلّيها false لو محتاج تقراه بـ document.cookie على العميل
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
  });

  return res;
}

// matcher يستثني API/static/_next من الأساس لراحة وأداء أفضل
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt|xml|webp|avif|woff|woff2|mp4|mp3)$).*)",
  ],
};
