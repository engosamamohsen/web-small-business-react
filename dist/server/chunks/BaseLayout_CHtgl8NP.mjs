import { f as createAstro, g as createComponent, m as maybeRenderHead, i as addAttribute, r as renderTemplate, l as renderHead, j as renderComponent, n as renderSlot } from './astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { a as fetchSettings } from './fetchSettings_PP77heLr.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { MoreVertical, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { atom, useAtom } from 'jotai';
import Cookies from 'js-cookie';
import 'clsx';
import { ToastContainer as ToastContainer$1 } from 'react-toastify';
/* empty css                                */
/* empty css                           */

const cartCountAtom = atom(0);
const cartItemsAtom = atom([]);
atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
});
const useCartStore = () => {
  const [cartCount, setCartCount] = useAtom(cartCountAtom);
  const incrementCartCount = () => {
    setCartCount((prev) => {
      if (!prev) {
        return 1;
      }
      return prev + 1;
    });
  };
  const decrementCartCount = () => {
    setCartCount((prev) => Math.max(0, prev - 1));
  };
  const resetCartCount = () => {
    setCartCount(0);
  };
  return {
    cartCount,
    setCartCount,
    incrementCartCount,
    decrementCartCount,
    resetCartCount
  };
};

function LoginButton({ token, setToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    Cookies.remove("app_token");
    Cookies.remove("app_data");
    setToken(void 0);
    setIsOpen(false);
    window.location.href = "/";
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isAuthPage = currentPath === "/login" || currentPath === "/register";
  if (token) {
    return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "text-sm font-medium text-[var(--main-color)]",
          "aria-label": "User Menu",
          children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-5 w-5" })
        }
      ),
      isOpen && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full z-50 mt-2 min-w-[150px] rounded-lg bg-white p-3 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/order",
            className: "text-sm text-[var(--font-color)] hover:text-[var(--main-color)]",
            onClick: () => setIsOpen(false),
            children: "الطلبات"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/profile",
            className: "text-sm text-[var(--font-color)] hover:text-[var(--main-color)]",
            onClick: () => setIsOpen(false),
            children: "الملف الشخصي"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            className: "text-sm text-[var(--font-color)] hover:text-[var(--main-color)]",
            children: "تسجيل الخروج"
          }
        )
      ] }) })
    ] });
  }
  if (isAuthPage) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: "/login",
      className: "text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline",
      "aria-label": "تسجيل الدخول",
      children: "تسجيل الدخول"
    }
  );
}

function Header({ settingsData }) {
  const [cartCount] = useAtom(cartCountAtom);
  const [token, setToken] = useState(void 0);
  useEffect(() => {
    const currentToken = Cookies.get("app_token");
    setToken(currentToken);
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = Cookies.get("app_token");
      setToken(currentToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "bg-[var(--main-background)]", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("a", { href: "/", "aria-label": "site home", children: settingsData?.logo ? /* @__PURE__ */ jsx(
      "img",
      {
        src: settingsData.logo,
        alt: "site logo",
        width: 100,
        height: 50,
        style: { maxHeight: "50px", objectFit: "contain" }
      }
    ) : /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: settingsData?.name || "Store" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      token && /* @__PURE__ */ jsxs("a", { href: "/cart", className: "relative", "aria-label": "site cart", children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "h-5 w-5 text-[var(--second-font-color)]" }),
        cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--main-color)] text-xs text-white", children: cartCount })
      ] }),
      /* @__PURE__ */ jsx(LoginButton, { token, setToken })
    ] })
  ] }) }) });
}

const $$Astro$1 = createAstro("https://example.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const { settingsData } = Astro2.props;
  const pathname = Astro2.url.pathname;
  const isProductPage = pathname.startsWith("/products");
  return renderTemplate`${maybeRenderHead()}<footer${addAttribute([
    "bg-black py-10 text-white",
    isProductPage && "max-md:pb-72"
  ], "class:list")}> <div class="container mx-auto px-4"> <div class="flex items-center justify-between gap-6 max-md:flex-col"> <p class="text-sm max-md:hidden">جميع الحقوق محفوظة 2020</p> <div class="flex items-center justify-center gap-2 text-center"> <h4 class="text-[15px] text-xl font-bold text-[var(--main-color)]"> ${settingsData?.name || ""} </h4> ${settingsData?.logo && renderTemplate`<img${addAttribute(settingsData.logo, "src")} alt="logo app" width="80" height="80" class="mr-[6px]" loading="lazy">`} </div> <div class="flex gap-2"> ${settingsData?.facebook_link && renderTemplate`<a${addAttribute(settingsData.facebook_link, "href")} target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" class="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> </a>`} ${settingsData?.instagram_link && renderTemplate`<a${addAttribute(settingsData.instagram_link, "href")} target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" class="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg> </a>`} </div> <p class="text-sm md:hidden">جميع الحقوق محفوظة 2020</p> </div> </div> </footer>`;
}, "F:/react js projects/web-small-business-react/src/components/Footer/Footer.astro", void 0);

const settingsDataAtom = atom(null);
const isLoginAtom = atom(false);

function ColorHandler({
  globalData,
  isLogin = false,
  cartCount = 0
}) {
  const effectRan = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCartCount] = useAtom(cartCountAtom);
  const [, setSettingsData] = useAtom(settingsDataAtom);
  const [, setIsLoginState] = useAtom(isLoginAtom);
  useLayoutEffect(() => {
    if (!globalData || !effectRan.current || typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    const root = window.document.documentElement;
    root.style.setProperty(
      "--main-color",
      globalData?.mainColor || "#FC7643"
    );
    root.style.setProperty(
      "--second-color",
      globalData?.main_font_color || "#FC7643"
    );
    Cookies.set("app_data", JSON.stringify(globalData), { expires: 1 });
    effectRan.current = true;
    setIsLoading(false);
  }, [globalData]);
  useEffect(() => {
    if (cartCount) {
      setCartCount(cartCount);
    }
    if (globalData) {
      setSettingsData(globalData);
    }
    setIsLoginState(isLogin);
  }, [globalData, isLogin, cartCount, setCartCount, setSettingsData, setIsLoginState]);
  if (isLoading) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: { zIndex: 9999 },
        className: "fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center gap-2 bg-slate-50",
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }),
          /* @__PURE__ */ jsx("bdi", { className: "flex text-3xl text-gray-700", children: "loading ..." })
        ]
      }
    );
  }
  return null;
}

function ToastContainer() {
  return /* @__PURE__ */ jsx(
    ToastContainer$1,
    {
      position: "bottom-right",
      rtl: true,
      autoClose: 3e3,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "light"
    }
  );
}

const $$Astro = createAstro("https://example.com");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description, image, canonical, noindex = false } = Astro2.props;
  const settingsResponse = await fetchSettings();
  const settings = settingsResponse?.data;
  const siteName = title || settings?.name || "Business Platform";
  const siteDescription = description || settings?.about_us || "Small business management platform";
  const siteImage = image || settings?.logo || "";
  settings?.website_url || Astro2.site?.toString() || "https://example.com";
  const canonicalUrl = canonical || Astro2.url.href;
  return renderTemplate`<html lang="ar" dir="rtl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Primary Meta Tags --><title>${siteName}</title><meta name="title"${addAttribute(siteName, "content")}><meta name="description"${addAttribute(siteDescription, "content")}>${settings?.keywords && renderTemplate`<meta name="keywords"${addAttribute(
    Array.isArray(settings.keywords) ? settings.keywords.join(", ") : settings.keywords,
    "content"
  )}>`}<!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalUrl, "href")}><!-- Favicon -->${settings?.logo && renderTemplate`<link rel="icon" type="image/x-icon"${addAttribute(settings.logo, "href")}>`}<!-- Robots -->${noindex ? renderTemplate`<meta name="robots" content="noindex, nofollow">` : renderTemplate`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`}<!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:title"${addAttribute(siteName, "content")}><meta property="og:description"${addAttribute(siteDescription, "content")}>${siteImage && renderTemplate`<meta property="og:image"${addAttribute(siteImage, "content")}>`}<meta property="og:locale" content="ar_SA"><meta property="og:site_name"${addAttribute(siteName, "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalUrl, "content")}><meta property="twitter:title"${addAttribute(siteName, "content")}><meta property="twitter:description"${addAttribute(siteDescription, "content")}>${siteImage && renderTemplate`<meta property="twitter:image"${addAttribute(siteImage, "content")}>`}<!-- Google Fonts - Cairo for Arabic --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet"><!-- Preload critical assets -->${settings?.logo && renderTemplate`<link rel="preload" as="image"${addAttribute(settings.logo, "href")}>`}<!-- View Transitions API for smooth navigation --><meta name="view-transition" content="same-origin">${renderHead()}</head> <body class="relative"> <!-- Color Handler - React Island for dynamic theming --> ${renderComponent($$result, "ColorHandler", ColorHandler, { "client:load": true, "globalData": settings ?? void 0, "isLogin": settingsResponse?.is_login ?? false, "cartCount": settingsResponse?.cart_count ?? 0, "client:component-hydration": "load", "client:component-path": "@/components/ColorHandler", "client:component-export": "default" })} <!-- Header - React Island for interactivity --> ${renderComponent($$result, "Header", Header, { "client:load": true, "settingsData": settings ?? void 0, "client:component-hydration": "load", "client:component-path": "@/components/Header/Header", "client:component-export": "default" })} <!-- Main Content --> ${renderSlot($$result, $$slots["default"])} <!-- Footer - Static Astro component --> ${renderComponent($$result, "Footer", $$Footer, { "settingsData": settings ?? void 0 })} <!-- Version Footer --> <div class="flex w-full items-center justify-center bg-gray-500 py-4 text-center text-white">
v.0.0.1
</div> <!-- Toast Container - React Island --> ${renderComponent($$result, "ToastContainer", ToastContainer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ToastContainer", "client:component-export": "default" })} </body></html>`;
}, "F:/react js projects/web-small-business-react/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, cartCountAtom as c, useCartStore as u };
