import { f as createComponent, h as addAttribute, r as renderTemplate, l as renderHead, k as renderComponent } from '../../chunks/astro/server_BA59mY36.mjs';
import 'piccolore';
import { f as fetchSettings } from '../../chunks/fetchSettings_DFAIddcx.mjs';
/* empty css                                             */
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$ResetPassword = createComponent(async ($$result, $$props, $$slots) => {
  const settingsResponse = await fetchSettings();
  const settingsData = settingsResponse?.data ?? null;
  const siteName = settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631";
  const pageTitle = `\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 | ${siteName}`;
  const pageDescription = "\u0623\u062F\u062E\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u062D\u0633\u0627\u0628\u0643";
  return renderTemplate`<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><!-- Preload critical fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet"><!-- Favicon -->${settingsData?.logo && renderTemplate`<link rel="icon"${addAttribute(settingsData.logo, "href")}>`}<!-- CSS Imports --><link rel="stylesheet" href="/src/styles/globals.css"><link rel="stylesheet" href="/node_modules/nprogress/nprogress.css"><link rel="stylesheet" href="/node_modules/react-toastify/dist/ReactToastify.css"><link rel="stylesheet" href="/node_modules/primereact/resources/themes/lara-light-cyan/theme.css"><link rel="stylesheet" href="/node_modules/primeicons/primeicons.css">${renderHead()}</head> <body class="relative font-cairo bg-gray-50"> <div class="flex min-h-screen items-center justify-center px-4"> ${renderComponent($$result, "ResetPasswordForm", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/auth/ResetPasswordForm", "client:component-export": "default" })} </div> </body></html>`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/auth/reset-password.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/auth/reset-password.astro";
const $$url = "/auth/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ResetPassword,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
