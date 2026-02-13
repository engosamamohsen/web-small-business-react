import { f as createAstro, g as createComponent, i as addAttribute, r as renderTemplate, l as renderHead, n as renderSlot } from './astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import 'clsx';
import { a as fetchSettings } from './fetchSettings_BSzKgKzb.mjs';
/* empty css                           */
/* empty css                           */

const $$Astro = createAstro("https://example.com");
const $$AuthLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AuthLayout;
  const { title, description } = Astro2.props;
  const settingsResponse = await fetchSettings();
  const settings = settingsResponse?.data;
  const siteName = settings?.name || "Business Platform";
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const siteDescription = description || settings?.about_us || "Small business management platform";
  settings?.website_url || Astro2.site?.toString() || "https://example.com";
  return renderTemplate`<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Primary Meta Tags --><title>${pageTitle}</title><meta name="title"${addAttribute(pageTitle, "content")}><meta name="description"${addAttribute(siteDescription, "content")}><!-- Canonical URL --><link rel="canonical"${addAttribute(Astro2.url.href, "href")}><!-- Favicon -->${settings?.logo && renderTemplate`<link rel="icon" type="image/x-icon"${addAttribute(settings.logo, "href")}>`}<!-- Robots - No index for auth pages --><meta name="robots" content="noindex, nofollow"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url.href, "content")}><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(siteDescription, "content")}>${settings?.logo && renderTemplate`<meta property="og:image"${addAttribute(settings.logo, "content")}>`}<meta property="og:locale" content="ar_SA"><!-- Google Fonts - Cairo for Arabic --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">${renderHead()}</head> <body class="relative min-h-screen bg-[var(--second-background)]"> <!-- Simplified Header for Auth --> <header class="bg-[var(--main-background)] py-4"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-center"> <a href="/" aria-label="site home"> ${settings?.logo ? renderTemplate`<img${addAttribute(settings.logo, "src")} alt="site logo" width="100" height="50" style="max-height: 50px; object-fit: contain;">` : renderTemplate`<span class="text-lg font-bold"> ${settings?.name || "Store"} </span>`} </a> </div> </div> </header> <!-- Main Content --> <main class="flex min-h-[calc(100vh-200px)] items-center justify-center py-10"> ${renderSlot($$result, $$slots["default"])} </main> <!-- Minimal Footer --> <footer class="bg-black py-6 text-center text-white"> <p class="text-sm">جميع الحقوق محفوظة 2020</p> </footer> </body></html>`;
}, "F:/react js projects/web-small-business-react/src/layouts/AuthLayout.astro", void 0);

export { $$AuthLayout as $ };
