import { e as createAstro, f as createComponent, h as addAttribute, r as renderTemplate, n as renderScript, o as renderSlot, l as renderHead, k as renderComponent } from './astro/server_BA59mY36.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */
/* empty css                         */

const $$Astro$1 = createAstro("https://*.cashierthru.com");
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEO;
  const {
    title,
    description,
    keywords = [],
    image = "/default-og-image.jpg",
    imageWidth = 1200,
    imageHeight = 630,
    canonical,
    type = "website"
  } = Astro2.props;
  const canonicalURL = canonical || new URL(Astro2.url.pathname, Astro2.site);
  const fullImageURL = image.startsWith("http") ? image : new URL(image, Astro2.site).toString();
  return renderTemplate`<!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}>${keywords.length > 0 && renderTemplate`<meta name="keywords"${addAttribute(keywords.join(", "), "content")}>`}<link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Open Graph / Facebook --><meta property="og:type"${addAttribute(type, "content")}><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(fullImageURL, "content")}><meta property="og:image:width"${addAttribute(imageWidth.toString(), "content")}><meta property="og:image:height"${addAttribute(imageHeight.toString(), "content")}><meta property="og:locale" content="ar_SA"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(fullImageURL, "content")}>`;
}, "F:/react js projects/kamal/web-small-business-react/src/components/SEO.astro", void 0);

const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  const GA_MEASUREMENT_ID = "";
  return renderTemplate`${GA_MEASUREMENT_ID}`;
}, "F:/react js projects/kamal/web-small-business-react/src/components/Analytics.astro", void 0);

const $$WebVitals = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "F:/react js projects/kamal/web-small-business-react/src/components/WebVitals.astro?astro&type=script&index=0&lang.ts")}`;
}, "F:/react js projects/kamal/web-small-business-react/src/components/WebVitals.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://*.cashierthru.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "\u0645\u0646\u0635\u0629 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0635\u063A\u064A\u0631\u0629",
    keywords = [],
    image,
    imageWidth,
    imageHeight,
    favicon,
    canonical
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Preload critical fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet"><!-- Favicon --><link rel="icon" type="image/png"', '><link rel="shortcut icon"', '><link rel="apple-touch-icon"', "><!-- SEO Component -->", "<!-- Analytics -->", "<!-- Web Vitals -->", '<!-- Global error handler --><script>\n            window.addEventListener("error", (event) => {\n                console.error("Global error:", event.error);\n            });\n\n            window.addEventListener("unhandledrejection", (event) => {\n                console.error("Unhandled rejection:", event.reason);\n            });\n        <\/script>', '</head> <body class="relative font-cairo"> ', " </body></html>"])), addAttribute(favicon || "/favicon.ico", "href"), addAttribute(favicon || "/favicon.ico", "href"), addAttribute(favicon || "/favicon.ico", "href"), renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "keywords": keywords, "image": image, "imageWidth": imageWidth, "imageHeight": imageHeight, "canonical": canonical }), renderComponent($$result, "Analytics", $$Analytics, {}), renderComponent($$result, "WebVitals", $$WebVitals, {}), renderHead(), renderSlot($$result, $$slots["default"]));
}, "F:/react js projects/kamal/web-small-business-react/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
