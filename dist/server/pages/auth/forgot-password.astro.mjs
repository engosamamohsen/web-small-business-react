import { g as createComponent, i as addAttribute, r as renderTemplate, k as renderHead, j as renderComponent } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { f as fetchPublicSettings } from '../../chunks/fetchSettings_COq2Kj7n.mjs';
/* empty css                                              */
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$ForgotPassword = createComponent(async ($$result, $$props, $$slots) => {
  const settingsResponse = await fetchPublicSettings();
  const settingsData = settingsResponse?.data ?? null;
  const siteName = settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631";
  const pageTitle = `\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 | ${siteName}`;
  const pageDescription = settingsData?.about_us || "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u062D\u0633\u0627\u0628\u0643";
  const pageKeywords = [
    ...settingsData?.keywords || [],
    "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
  ];
  return renderTemplate`<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><meta name="keywords"${addAttribute(pageKeywords.join(", "), "content")}><!-- Preload critical fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet"><!-- Open Graph --><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(pageDescription, "content")}><meta property="og:type" content="website">${settingsData?.logo && renderTemplate`<meta property="og:image"${addAttribute(settingsData.logo, "content")}>`}<!-- Favicon -->${settingsData?.logo && renderTemplate`<link rel="icon"${addAttribute(settingsData.logo, "href")}>`}<!-- CSS Imports --><link rel="stylesheet" href="/src/styles/globals.css"><link rel="stylesheet" href="/node_modules/nprogress/nprogress.css"><link rel="stylesheet" href="/node_modules/react-toastify/dist/ReactToastify.css"><link rel="stylesheet" href="/node_modules/primereact/resources/themes/lara-light-cyan/theme.css"><link rel="stylesheet" href="/node_modules/primeicons/primeicons.css">${renderHead()}</head> <body class="relative font-cairo bg-gray-50"> ${renderComponent($$result, "ForgotPasswordForm", null, { "initSettings": settingsData ?? {}, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/auth/ForgotPasswordForm", "client:component-export": "default" })} </body></html>`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/auth/forgot-password.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/auth/forgot-password.astro";
const $$url = "/auth/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ForgotPassword,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
