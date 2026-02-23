import { f as createComponent, h as addAttribute, r as renderTemplate, l as renderHead, k as renderComponent } from '../../chunks/astro/server_BA59mY36.mjs';
import 'piccolore';
import { f as fetchSettings } from '../../chunks/fetchSettings_DFAIddcx.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  const settingsResponse = await fetchSettings();
  const settingsData = settingsResponse?.data ?? null;
  const siteName = settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631";
  const pageTitle = `\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F | ${siteName}`;
  const pageDescription = settingsData?.about_us || "\u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u062C\u0645\u064A\u0639 \u0645\u064A\u0632\u0627\u062A \u0645\u0648\u0642\u0639\u0646\u0627";
  const pageKeywords = [
    ...settingsData?.keywords || [],
    "\u062A\u0633\u062C\u064A\u0644",
    "\u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F",
    "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628"
  ];
  return renderTemplate`<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><meta name="keywords"${addAttribute(pageKeywords.join(", "), "content")}><!-- Preload critical fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet"><!-- Open Graph --><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(pageDescription, "content")}><meta property="og:type" content="website">${settingsData?.logo && renderTemplate`<meta property="og:image"${addAttribute(settingsData.logo, "content")}>`}<!-- Favicon -->${settingsData?.logo && renderTemplate`<link rel="icon"${addAttribute(settingsData.logo, "href")}>`}<!-- CSS Imports --><link rel="stylesheet" href="/src/styles/globals.css"><link rel="stylesheet" href="/node_modules/nprogress/nprogress.css"><link rel="stylesheet" href="/node_modules/react-toastify/dist/ReactToastify.css"><link rel="stylesheet" href="/node_modules/primereact/resources/themes/lara-light-cyan/theme.css"><link rel="stylesheet" href="/node_modules/primeicons/primeicons.css">${renderHead()}</head> <body class="relative font-cairo bg-gray-50"> ${renderComponent($$result, "RegisterForm", null, { "initSettings": settingsData ?? {}, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/auth/RegisterForm", "client:component-export": "default" })} </body></html>`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/auth/register.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/auth/register.astro";
const $$url = "/auth/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Register,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
