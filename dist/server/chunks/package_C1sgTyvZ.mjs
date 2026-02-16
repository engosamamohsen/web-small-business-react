import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { __assign } from 'tslib';
import axios from 'axios';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';
import { jsx, jsxs } from 'react/jsx-runtime';
import { User, LogOut, Search, ShoppingCart, Phone, Facebook, Instagram } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function Link({ href, prefetch = true, children, ...props }) {
  const prefetchAttr = prefetch === true ? "tap" : prefetch === false ? void 0 : prefetch;
  return /* @__PURE__ */ jsx(
    "a",
    {
      href,
      ...prefetchAttr && { "data-astro-prefetch": prefetchAttr },
      ...props,
      children
    }
  );
}

function Image({
  src,
  alt,
  width,
  height,
  priority = false,
  quality,
  fill,
  className,
  ...props
}) {
  const loading = priority ? "eager" : "lazy";
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      width,
      height,
      loading,
      decoding: "async",
      className,
      ...props
    }
  );
}

function useRouter() {
  return {
    push: (url, options) => {
      window.location.href = url;
    },
    replace: (url) => {
      window.location.replace(url);
    },
    back: () => {
      window.history.back();
    },
    forward: () => {
      window.history.forward();
    },
    refresh: () => {
      window.location.reload();
    }
  };
}
function usePathname() {
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPathname(window.location.pathname);
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  return pathname;
}
function useSearchParams() {
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener("popstate", handlePopState);
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setSearchParams(new URLSearchParams(window.location.search));
    };
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
    };
  }, []);
  return searchParams;
}

function useMountedState() {
    var mountedRef = useRef(false);
    var get = useCallback(function () { return mountedRef.current; }, []);
    useEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    }, []);
    return get;
}

function useAsyncFn(fn, deps, initialState) {
    if (deps === void 0) { deps = []; }
    if (initialState === void 0) { initialState = { loading: false }; }
    var lastCallId = useRef(0);
    var isMounted = useMountedState();
    var _a = useState(initialState), state = _a[0], set = _a[1];
    var callback = useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callId = ++lastCallId.current;
        if (!state.loading) {
            set(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
        }
        return fn.apply(void 0, args).then(function (value) {
            isMounted() && callId === lastCallId.current && set({ value: value, loading: false });
            return value;
        }, function (error) {
            isMounted() && callId === lastCallId.current && set({ error: error, loading: false });
            return error;
        });
    }, deps);
    return [state, callback];
}

function useAsync(fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = useAsyncFn(fn, deps, {
        loading: true,
    }), state = _a[0], callback = _a[1];
    useEffect(function () {
        callback();
    }, [callback]);
    return state;
}

const axiosInstance = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl
    // headers: {
    //   platform: 3,
    //   lang: "en",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //   "Content-Type": "multipart/form-data",
    //   "Access-Control-Allow-Headers":
    //     "Origin, Content-Type, X-Auth-Token ,X-Requested-With",
    // },
  });
  instance.interceptors.request.use((config) => {
    NProgress.start();
    const token = Cookies.get("app_token");
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
  });
  instance.interceptors.response.use(
    (response) => {
      NProgress.done();
      return response;
    },
    (error) => {
      NProgress.done();
      return Promise.reject(error);
    }
  );
  return instance;
};
const $api = axiosInstance("https://admin-emend.cashierthru.com/api/");

const defaultContext = {
  settings: null,
  isLogin: false,
  cartCount: 0,
  token: void 0,
  setCartCount: () => {
  },
  incrementCartCount: () => {
  },
  decrementCartCount: () => {
  },
  setIsLogin: () => {
  }
};
const SettingsContext = createContext(defaultContext);
function useSettings() {
  const context = useContext(SettingsContext);
  return context;
}
function useSettingsData() {
  const { settings } = useSettings();
  return settings;
}
function useCart() {
  const { cartCount, setCartCount, incrementCartCount, decrementCartCount } = useSettings();
  return { cartCount, setCartCount, incrementCartCount, decrementCartCount };
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function LoginButton({ isLoggedIn, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/auth/login",
        className: "flex h-9 items-center gap-2 rounded-full bg-[var(--main-color)] px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90",
        children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "تسجيل الدخول" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowDropdown(!showDropdown),
        className: "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--main-color)] text-white shadow-sm transition hover:opacity-90",
        "aria-label": "قائمة المستخدم",
        children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" })
      }
    ),
    showDropdown && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5", children: /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/user/profile",
          className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50",
          onClick: () => setShowDropdown(false),
          children: [
            /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
            "الملف الشخصي"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/order",
          className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50",
          onClick: () => setShowDropdown(false),
          children: [
            /* @__PURE__ */ jsx("span", { className: "i pi pi-shopping-bag h-4 w-4" }),
            "طلباتي"
          ]
        }
      ),
      /* @__PURE__ */ jsx("hr", { className: "my-1 border-gray-100" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setShowDropdown(false);
            onLogout();
          },
          className: "flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50",
          children: [
            /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
            "تسجيل الخروج"
          ]
        }
      )
    ] }) })
  ] });
}

async function fetchHookClient({
  url,
  method = "GET",
  body,
  token,
  init,
  baseUrl,
  timeout = 15e3
  // Default 15 second timeout
}) {
  const subdomain = "https://emend.cashierthru.com";
  const lastRoute = "/api/";
  const currentUrl = baseUrl ?? `${subdomain}${lastRoute}`;
  const fullUrl = url.startsWith("http") ? url : `${currentUrl}${url.startsWith("/") ? url : `/${url}`}`;
  const authToken = token ?? Cookies.get("app_token") ?? void 0;
  const headers = {
    "Content-Type": "application/json",
    ...init?.headers || {},
    ...authToken ? { Authorization: `Bearer ${authToken}` } : {}
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(fullUrl, {
      method,
      body: body ? JSON.stringify(body) : void 0,
      ...init,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const { status, ok } = res;
    const contentType = res.headers.get("content-type") ?? "";
    let bodyData = null;
    if (status !== 204) {
      if (contentType.includes("application/json")) {
        try {
          bodyData = await res.json();
        } catch {
          bodyData = null;
        }
      } else {
        try {
          bodyData = await res.text();
        } catch {
          bodyData = null;
        }
      }
    }
    if (!ok) {
      const message = typeof bodyData === "object" && bodyData && "message" in bodyData && bodyData.message || typeof bodyData === "object" && bodyData && "error" in bodyData && bodyData.error || typeof bodyData === "string" && bodyData || res.statusText || "Request failed";
      return { data: null, status, ok, error: String(message) };
    }
    return { data: bodyData ?? null, status, ok };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      return {
        data: null,
        status: 408,
        ok: false,
        error: "Request timeout"
      };
    }
    return {
      data: null,
      status: 0,
      ok: false,
      error: error instanceof Error ? error.message : "Network error"
    };
  }
}

const MIN_QUERY_LENGTH = 2;
const formatPrice = (value) => {
  if (!value && value !== 0) return "";
  return new Intl.NumberFormat("ar-EG").format(value);
};
function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef(null);
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        setIsOpen(true);
        const response = await fetchHookClient({
          url: `v1/product?q=${encodeURIComponent(trimmed)}`,
          init: {
            signal: controller.signal
          }
        });
        if (!response?.ok) {
          setResults([]);
          return;
        }
        const products = response?.data?.data && Array.isArray(response.data.data) ? response.data.data : [];
        setResults(products);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelectProduct = (product) => {
    const id = product.id ?? product.product_id;
    if (!id) return;
    setQuery("");
    setResults([]);
    setIsOpen(false);
    router.push(`/products/${id}`);
  };
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };
  const showDropdown = isOpen && (isLoading || results.length > 0 || query.trim().length >= MIN_QUERY_LENGTH);
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full max-w-xs", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-full bg-white/95 px-3 py-2 shadow-sm ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-[var(--main-color)]", children: [
      /* @__PURE__ */ jsx(Search, { className: "ml-2 h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "search",
          className: "w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400 text-right",
          placeholder: "ابحث عن منتج...",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          onFocus: () => {
            if (results.length > 0) setIsOpen(true);
          }
        }
      ),
      query && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          className: "mr-1 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600",
          "aria-label": "مسح البحث"
        }
      )
    ] }),
    showDropdown && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 z-40 mt-2 w-[min(24rem,100vw)] rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-3 py-2 text-[11px] text-gray-400", children: [
        /* @__PURE__ */ jsx("span", { className: "text-right", children: isLoading ? "جارٍ البحث عن المنتجات..." : results.length > 0 ? `تم العثور على ${results.length} منتج` : "لا توجد نتائج مطابقة" }),
        query && /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-gray-100 px-2 py-0.5", children: [
          "“",
          query,
          "”"
        ] })
      ] }),
      isLoading && /* @__PURE__ */ jsx("ul", { className: "max-h-72 overflow-auto py-2", children: Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ jsx("li", { className: "px-3 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 flex-shrink-0 rounded-xl bg-gray-200/80 animate-pulse" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "ml-auto h-3 w-40 rounded bg-gray-200/80 animate-pulse" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-3 w-24 rounded bg-gray-200/80 animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 w-16 rounded bg-gray-200/80 animate-pulse" })
          ] })
        ] })
      ] }) }, idx)) }),
      !isLoading && results.length > 0 && /* @__PURE__ */ jsx("ul", { className: "max-h-72 overflow-auto py-1", children: results.map((product) => {
        const id = product.id ?? product.product_id;
        const name = product.name ?? product.product_name ?? "";
        const categoryName = product.category?.name;
        const subCategoryName = product.sub_category?.name;
        const price = product.price;
        const discount = product.discount ?? 0;
        const image = product.main_image;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleSelectProduct(product),
            className: "flex w-full items-center gap-3 px-3 py-2 text-right text-sm transition hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsx("div", { className: "relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100", children: image ? /* @__PURE__ */ jsx(
                Image,
                {
                  src: image,
                  alt: name,
                  fill: true,
                  sizes: "48px",
                  className: "object-cover"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-gray-200" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsx("p", { className: "w-full text-xs font-medium text-gray-900 text-right line-clamp-2", children: name }),
                /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex-1 text-[11px] text-gray-400 truncate text-right", children: subCategoryName || categoryName || "منتج" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    discount > 0 && /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500", children: [
                      "خصم %",
                      discount
                    ] }),
                    price !== void 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-[var(--main-color)]", children: [
                      formatPrice(price),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: "جنيه" })
                    ] })
                  ] })
                ] })
              ] })
            ]
          }
        ) }, id);
      }) })
    ] })
  ] });
}

function Header({ currentPath = "", initialIsLoggedIn = false, settingsData }) {
  const { settings: contextSettings, isLogin: contextIsLogin, cartCount } = useSettings();
  const settings = settingsData || contextSettings;
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn || contextIsLogin);
  const router = useRouter();
  useEffect(() => {
    const cookieToken = Cookies.get("app_token");
    setIsLoggedIn(Boolean(cookieToken));
  }, []);
  const handleLogout = useCallback(() => {
    Cookies.remove("app_token");
    setIsLoggedIn(false);
    router.push("/auth/login");
    router.refresh();
  }, [router]);
  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/auth/login");
    }
  };
  return /* @__PURE__ */ jsx(
    "header",
    {
      className: "\r\n        sticky top-0 z-40\r\n        border-b border-black/5\r\n        bg-[var(--main-background)]/90\r\n        backdrop-blur supports-[backdrop-filter]:backdrop-blur\r\n      ",
      children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/",
              "aria-label": "الذهاب للصفحة الرئيسية",
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm", children: settings?.logo ? /* @__PURE__ */ jsx(
                  Image,
                  {
                    src: settings.logo,
                    alt: settings?.name || "شعار المتجر",
                    fill: true,
                    sizes: "44px",
                    className: "object-contain",
                    priority: true
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: settings?.name?.charAt(0) || "S" }) }),
                settings?.name && /* @__PURE__ */ jsx("span", { className: "hidden text-lg font-semibold text-[var(--main-font-color)] sm:block", children: settings.name })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hidden flex-1 md:flex md:justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx(SearchBar, {}) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: isLoggedIn ? "/cart" : "/login",
                className: "relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md",
                "aria-label": "سلة المشتريات",
                onClick: handleCartClick,
                children: [
                  /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-[var(--second-font-color)]" }),
                  cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--main-color)] px-[3px] text-[10px] font-semibold text-white", children: cartCount > 99 ? "99+" : cartCount })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              LoginButton,
              {
                isLoggedIn,
                onLogout: handleLogout
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pb-3 pt-1 md:hidden", children: /* @__PURE__ */ jsx(SearchBar, {}) })
      ] })
    }
  );
}

function Footer({ settingsData, appVersion }) {
  const pathname = usePathname();
  const contextSettings = useSettingsData();
  const settings = contextSettings || settingsData;
  const siteName = settings?.name || "Business Platform";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const hasFacebook = Boolean(settings?.facebook_link);
  const hasInstagram = Boolean(settings?.instagram_link);
  return /* @__PURE__ */ jsx(
    "footer",
    {
      className: cn(
        "mt-10 border-t border-white/10 bg-black/95 text-white",
        "backdrop-blur",
        pathname.startsWith("/products") ? "max-md:pb-72" : ""
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 md:py-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            settings?.logo && /* @__PURE__ */ jsx("div", { className: "relative h-10 w-10 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10", children: /* @__PURE__ */ jsx(
              Image,
              {
                src: settings.logo,
                alt: siteName,
                fill: true,
                sizes: "40px",
                className: "object-contain p-1.5"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold tracking-wide text-[var(--main-color)]", children: siteName }),
              settings?.about_us && /* @__PURE__ */ jsx("p", { className: "max-w-md text-xs leading-relaxed text-gray-300", children: settings.about_us }),
              settings?.phone && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-gray-400", children: [
                /* @__PURE__ */ jsx(Phone, { size: 12, className: "mt-0.5" }),
                settings.phone.split(" ").map((p) => /* @__PURE__ */ jsx("a", { href: `tel:${p}`, className: "hover:text-white", children: p }, p))
              ] })
            ] })
          ] }),
          (hasFacebook || hasInstagram) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 max-md:hidden", children: "تابعنا على" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              hasFacebook && /* @__PURE__ */ jsx(
                "a",
                {
                  href: settings.facebook_link,
                  target: "_blank",
                  rel: "noreferrer",
                  "aria-label": "Visit our Facebook page",
                  className: "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition-all duration-200 hover:border-[var(--main-color)] hover:bg-[var(--main-color)]/15 hover:text-[var(--main-color)]",
                  children: /* @__PURE__ */ jsx(Facebook, { size: 18 })
                }
              ),
              hasInstagram && /* @__PURE__ */ jsx(
                "a",
                {
                  href: settings.instagram_link,
                  target: "_blank",
                  rel: "noreferrer",
                  "aria-label": "Visit our Instagram page",
                  className: "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition-all duration-200 hover:border-[var(--main-color)] hover:bg-[var(--main-color)]/15 hover:text-[var(--main-color)]",
                  children: /* @__PURE__ */ jsx(Instagram, { size: 18 })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 border-t border-white/10 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-3 text-xs text-gray-400 md:flex-row", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-center md:text-right", children: [
            "© ",
            year,
            " ",
            siteName,
            ". جميع الحقوق محفوظة."
          ] }),
          appVersion && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex h-2 w-2 rounded-full bg-[var(--main-color)]" }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-200", children: [
              "الإصدار ",
              appVersion
            ] })
          ] })
        ] }) })
      ] })
    }
  );
}

const version = "0.2.0";
const packageJson = {
	version: version};

export { $api as $, Footer as F, Header as H, Image as I, Link as L, useRouter as a, useAsync as b, cn as c, useSearchParams as d, fetchHookClient as f, packageJson as p, useCart as u };
