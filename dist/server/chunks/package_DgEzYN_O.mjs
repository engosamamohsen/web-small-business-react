import * as React from 'react';
import React__default, { useState, useEffect, useRef, useCallback, createContext, useContext, Children, cloneElement } from 'react';
import { __assign } from 'tslib';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { User, LogOut, Search, ShoppingCart, Phone, Facebook, Instagram } from 'lucide-react';
import Cookies from 'js-cookie';
import { CSSTransition as CSSTransition$1 } from 'react-transition-group';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import axios from 'axios';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';
import { z } from 'zod';
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
    window.history.pushState = function (...args) {
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
const $api = axiosInstance("https://admin-osama.cashierthru.com/api/");

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

function LoginButton({ isLoggedIn, onLogout, onOpenAuthDialog }) {
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
      "button",
      {
        onClick: () => onOpenAuthDialog?.(),
        className: "flex h-9 items-center gap-2 rounded-full bg-[var(--main-color)] px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90",
        children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "تسجيل الدخول" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowDropdown(!showDropdown),
        className: "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--main-color)] text-white shadow-sm transition hover:opacity-90",
        "aria-label": "قائمة المستخدم",
        children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" })
      }
    ),
      showDropdown && /* @__PURE__ */ jsx("div", {
        className: "absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5", children: /* @__PURE__ */ jsxs("div", {
          className: "py-1", children: [
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
          ]
        })
      })
    ]
  });
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
  const subdomain = "https://admin-osama.cashierthru.com";
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
  return /* @__PURE__ */ jsxs("div", {
    ref: wrapperRef, className: "relative w-full max-w-xs", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center rounded-full bg-white/95 px-3 py-2 shadow-sm ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-[var(--main-color)]", children: [
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
      ]
    }),
      showDropdown && /* @__PURE__ */ jsxs("div", {
        className: "absolute right-0 z-40 mt-2 w-[min(24rem,100vw)] rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between border-b border-gray-100 px-3 py-2 text-[11px] text-gray-400", children: [
        /* @__PURE__ */ jsx("span", { className: "text-right", children: isLoading ? "جارٍ البحث عن المنتجات..." : results.length > 0 ? `تم العثور على ${results.length} منتج` : "لا توجد نتائج مطابقة" }),
            query && /* @__PURE__ */ jsxs("span", {
              className: "rounded-full bg-gray-100 px-2 py-0.5", children: [
                "“",
                query,
                "”"
              ]
            })
          ]
        }),
          isLoading && /* @__PURE__ */ jsx("ul", {
            className: "max-h-72 overflow-auto py-2", children: Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ jsx("li", {
              className: "px-3 py-2", children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 flex-shrink-0 rounded-xl bg-gray-200/80 animate-pulse" }),
        /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-1 flex-col gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "ml-auto h-3 w-40 rounded bg-gray-200/80 animate-pulse" }),
          /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-3 w-24 rounded bg-gray-200/80 animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 w-16 rounded bg-gray-200/80 animate-pulse" })
                    ]
                  })
                  ]
                })
                ]
              })
            }, idx))
          }),
          !isLoading && results.length > 0 && /* @__PURE__ */ jsx("ul", {
            className: "max-h-72 overflow-auto py-1", children: results.map((product) => {
              const id = product.id ?? product.product_id;
              const name = product.name ?? product.product_name ?? "";
              const categoryName = product.category?.name;
              const subCategoryName = product.sub_category?.name;
              const price = product.price;
              const discount = product.discount ?? 0;
              const image = product.main_image;
              return /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSelectProduct(product),
                    className: "flex w-full items-center gap-3 px-3 py-2 text-right text-sm transition hover:bg-gray-50",
                    children: [
              /* @__PURE__ */ jsx("div", {
                      className: "relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100", children: image ? /* @__PURE__ */ jsx(
                        Image,
                        {
                          src: image,
                          alt: name,
                          fill: true,
                          sizes: "48px",
                          className: "object-cover"
                        }
                      ) : /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-gray-200" })
                    }),
              /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-1 flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsx("p", { className: "w-full text-xs font-medium text-gray-900 text-right line-clamp-2", children: name }),
                /* @__PURE__ */ jsxs("div", {
                        className: "flex w-full items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex-1 text-[11px] text-gray-400 truncate text-right", children: subCategoryName || categoryName || "منتج" }),
                  /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-1", children: [
                            discount > 0 && /* @__PURE__ */ jsxs("span", {
                              className: "rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500", children: [
                                "خصم %",
                                discount
                              ]
                            }),
                            price !== void 0 && /* @__PURE__ */ jsxs("span", {
                              className: "text-xs font-bold text-[var(--main-color)]", children: [
                                formatPrice(price),
                                " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: "جنيه" })
                              ]
                            })
                          ]
                        })
                        ]
                      })
                      ]
                    })
                    ]
                  }
                )
              }, id);
            })
          })
        ]
      })
    ]
  });
}

function _arrayWithHoles$6(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$6(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$2$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$2$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$2$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2$1(o, minLen);
}

function _nonIterableRest$6() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$6(arr, i) {
  return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$2$1(arr, i) || _nonIterableRest$6();
}

function _typeof$9(o) {
  "@babel/helpers - typeof";

  return _typeof$9 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$9(o);
}

function classNames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (args) {
    var classes = [];
    for (var i = 0; i < args.length; i++) {
      var className = args[i];
      if (!className) {
        continue;
      }
      var type = _typeof$9(className);
      if (type === 'string' || type === 'number') {
        classes.push(className);
      } else if (type === 'object') {
        var _classes = Array.isArray(className) ? className : Object.entries(className).map(function (_ref) {
          var _ref2 = _slicedToArray$6(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          return value ? key : null;
        });
        classes = _classes.length ? classes.concat(_classes.filter(function (c) {
          return !!c;
        })) : classes;
      }
    }
    return classes.join(' ').trim();
  }
  return undefined;
}

function _arrayWithoutHoles$5(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$2$1(arr);
}

function _iterableToArray$5(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread$5() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray$5(arr) {
  return _arrayWithoutHoles$5(arr) || _iterableToArray$5(arr) || _unsupportedIterableToArray$2$1(arr) || _nonIterableSpread$5();
}

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toPrimitive$9(input, hint) {
  if (_typeof$9(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$9(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String)(input);
}

function _toPropertyKey$9(arg) {
  var key = _toPrimitive$9(arg, "string");
  return _typeof$9(key) === "symbol" ? key : String(key);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey$9(descriptor.key), descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty$9(obj, key, value) {
  key = _toPropertyKey$9(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1$2(o)) || allowArrayLike) { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1$2(o, minLen); }
function _arrayLikeToArray$1$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DomHandler = /*#__PURE__*/function () {
  function DomHandler() {
    _classCallCheck$1(this, DomHandler);
  }
  return _createClass$1(DomHandler, null, [{
    key: "innerWidth",
    value: function innerWidth(el) {
      if (el) {
        var width = el.offsetWidth;
        var style = getComputedStyle(el);
        width = width + (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
        return width;
      }
      return 0;
    }
  }, {
    key: "width",
    value: function width(el) {
      if (el) {
        var _width = el.offsetWidth;
        var style = getComputedStyle(el);
        _width = _width - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
        return _width;
      }
      return 0;
    }
  }, {
    key: "getBrowserLanguage",
    value: function getBrowserLanguage() {
      return navigator.userLanguage || navigator.languages && navigator.languages.length && navigator.languages[0] || navigator.language || navigator.browserLanguage || navigator.systemLanguage || 'en';
    }
  }, {
    key: "getWindowScrollTop",
    value: function getWindowScrollTop() {
      var doc = document.documentElement;
      return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
  }, {
    key: "getWindowScrollLeft",
    value: function getWindowScrollLeft() {
      var doc = document.documentElement;
      return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }
  }, {
    key: "getOuterWidth",
    value: function getOuterWidth(el, margin) {
      if (el) {
        var width = el.getBoundingClientRect().width || el.offsetWidth;
        if (margin) {
          var style = getComputedStyle(el);
          width = width + (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
        }
        return width;
      }
      return 0;
    }
  }, {
    key: "getOuterHeight",
    value: function getOuterHeight(el, margin) {
      if (el) {
        var height = el.getBoundingClientRect().height || el.offsetHeight;
        if (margin) {
          var style = getComputedStyle(el);
          height = height + (parseFloat(style.marginTop) + parseFloat(style.marginBottom));
        }
        return height;
      }
      return 0;
    }
  }, {
    key: "getClientHeight",
    value: function getClientHeight(el, margin) {
      if (el) {
        var height = el.clientHeight;
        if (margin) {
          var style = getComputedStyle(el);
          height = height + (parseFloat(style.marginTop) + parseFloat(style.marginBottom));
        }
        return height;
      }
      return 0;
    }
  }, {
    key: "getClientWidth",
    value: function getClientWidth(el, margin) {
      if (el) {
        var width = el.clientWidth;
        if (margin) {
          var style = getComputedStyle(el);
          width = width + (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
        }
        return width;
      }
      return 0;
    }
  }, {
    key: "getViewport",
    value: function getViewport() {
      var win = window;
      var d = document;
      var e = d.documentElement;
      var g = d.getElementsByTagName('body')[0];
      var w = win.innerWidth || e.clientWidth || g.clientWidth;
      var h = win.innerHeight || e.clientHeight || g.clientHeight;
      return {
        width: w,
        height: h
      };
    }
  }, {
    key: "getOffset",
    value: function getOffset(el) {
      if (el) {
        var rect = el.getBoundingClientRect();
        return {
          top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
          left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
        };
      }
      return {
        top: 'auto',
        left: 'auto'
      };
    }
  }, {
    key: "index",
    value: function index(element) {
      if (element) {
        var children = element.parentNode.childNodes;
        var num = 0;
        for (var i = 0; i < children.length; i++) {
          if (children[i] === element) {
            return num;
          }
          if (children[i].nodeType === 1) {
            num++;
          }
        }
      }
      return -1;
    }
  }, {
    key: "addMultipleClasses",
    value: function addMultipleClasses(element, className) {
      if (element && className) {
        if (element.classList) {
          var styles = className.split(' ');
          for (var i = 0; i < styles.length; i++) {
            element.classList.add(styles[i]);
          }
        } else {
          var _styles = className.split(' ');
          for (var _i = 0; _i < _styles.length; _i++) {
            element.className = element.className + (' ' + _styles[_i]);
          }
        }
      }
    }
  }, {
    key: "removeMultipleClasses",
    value: function removeMultipleClasses(element, className) {
      if (element && className) {
        if (element.classList) {
          var styles = className.split(' ');
          for (var i = 0; i < styles.length; i++) {
            element.classList.remove(styles[i]);
          }
        } else {
          var _styles2 = className.split(' ');
          for (var _i2 = 0; _i2 < _styles2.length; _i2++) {
            element.className = element.className.replace(new RegExp('(^|\\b)' + _styles2[_i2].split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          }
        }
      }
    }
  }, {
    key: "addClass",
    value: function addClass(element, className) {
      if (element && className) {
        if (element.classList) {
          element.classList.add(className);
        } else {
          element.className = element.className + (' ' + className);
        }
      }
    }
  }, {
    key: "removeClass",
    value: function removeClass(element, className) {
      if (element && className) {
        if (element.classList) {
          element.classList.remove(className);
        } else {
          element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      }
    }
  }, {
    key: "hasClass",
    value: function hasClass(element, className) {
      if (element) {
        if (element.classList) {
          return element.classList.contains(className);
        }
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
      }
      return false;
    }
  }, {
    key: "addStyles",
    value: function addStyles(element) {
      var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (element) {
        Object.entries(styles).forEach(function (_ref) {
          var _ref2 = _slicedToArray$6(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          return element.style[key] = value;
        });
      }
    }
  }, {
    key: "find",
    value: function find(element, selector) {
      return element ? Array.from(element.querySelectorAll(selector)) : [];
    }
  }, {
    key: "findSingle",
    value: function findSingle(element, selector) {
      if (element) {
        return element.querySelector(selector);
      }
      return null;
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(element) {
      var _this = this;
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (element) {
        var _computedStyles = function computedStyles(rule, value) {
          var _element$$attrs, _element$$attrs2;
          var styles = element !== null && element !== void 0 && (_element$$attrs = element.$attrs) !== null && _element$$attrs !== void 0 && _element$$attrs[rule] ? [element === null || element === void 0 || (_element$$attrs2 = element.$attrs) === null || _element$$attrs2 === void 0 ? void 0 : _element$$attrs2[rule]] : [];
          return [value].flat().reduce(function (cv, v) {
            if (v !== null && v !== undefined) {
              var type = _typeof$9(v);
              if (type === 'string' || type === 'number') {
                cv.push(v);
              } else if (type === 'object') {
                var _cv = Array.isArray(v) ? _computedStyles(rule, v) : Object.entries(v).map(function (_ref3) {
                  var _ref4 = _slicedToArray$6(_ref3, 2),
                    _k = _ref4[0],
                    _v = _ref4[1];
                  return rule === 'style' && (!!_v || _v === 0) ? "".concat(_k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), ":").concat(_v) : _v ? _k : undefined;
                });
                cv = _cv.length ? cv.concat(_cv.filter(function (c) {
                  return !!c;
                })) : cv;
              }
            }
            return cv;
          }, styles);
        };
        Object.entries(attributes).forEach(function (_ref5) {
          var _ref6 = _slicedToArray$6(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];
          if (value !== undefined && value !== null) {
            var matchedEvent = key.match(/^on(.+)/);
            if (matchedEvent) {
              element.addEventListener(matchedEvent[1].toLowerCase(), value);
            } else if (key === 'p-bind') {
              _this.setAttributes(element, value);
            } else {
              value = key === 'class' ? _toConsumableArray$5(new Set(_computedStyles('class', value))).join(' ').trim() : key === 'style' ? _computedStyles('style', value).join(';').trim() : value;
              (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
              element.setAttribute(key, value);
            }
          }
        });
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(element, name) {
      if (element) {
        var value = element.getAttribute(name);
        if (!isNaN(value)) {
          return +value;
        }
        if (value === 'true' || value === 'false') {
          return value === 'true';
        }
        return value;
      }
      return undefined;
    }
  }, {
    key: "isAttributeEquals",
    value: function isAttributeEquals(element, name, value) {
      return element ? this.getAttribute(element, name) === value : false;
    }
  }, {
    key: "isAttributeNotEquals",
    value: function isAttributeNotEquals(element, name, value) {
      return !this.isAttributeEquals(element, name, value);
    }
  }, {
    key: "getHeight",
    value: function getHeight(el) {
      if (el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);
        height = height - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth));
        return height;
      }
      return 0;
    }
  }, {
    key: "getWidth",
    value: function getWidth(el) {
      if (el) {
        var width = el.offsetWidth;
        var style = getComputedStyle(el);
        width = width - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth));
        return width;
      }
      return 0;
    }
  }, {
    key: "alignOverlay",
    value: function alignOverlay(overlay, target, appendTo) {
      var calculateMinWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      if (overlay && target) {
        if (appendTo === 'self') {
          this.relativePosition(overlay, target);
        } else {
          calculateMinWidth && (overlay.style.minWidth = DomHandler.getOuterWidth(target) + 'px');
          this.absolutePosition(overlay, target);
        }
      }
    }
  }, {
    key: "absolutePosition",
    value: function absolutePosition(element, target) {
      var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
      if (element && target) {
        var elementDimensions = element.offsetParent ? {
          width: element.offsetWidth,
          height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var elementOuterHeight = elementDimensions.height;
        var elementOuterWidth = elementDimensions.width;
        var targetOuterHeight = target.offsetHeight;
        var targetOuterWidth = target.offsetWidth;
        var targetOffset = target.getBoundingClientRect();
        var windowScrollTop = this.getWindowScrollTop();
        var windowScrollLeft = this.getWindowScrollLeft();
        var viewport = this.getViewport();
        var top;
        var left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
          top = targetOffset.top + windowScrollTop - elementOuterHeight;
          if (top < 0) {
            top = windowScrollTop;
          }
          element.style.transformOrigin = 'bottom';
        } else {
          top = targetOuterHeight + targetOffset.top + windowScrollTop;
          element.style.transformOrigin = 'top';
        }
        var targetOffsetPx = targetOffset.left;
        var alignOffset = align === 'left' ? 0 : elementOuterWidth - targetOuterWidth;
        if (targetOffsetPx + targetOuterWidth + elementOuterWidth > viewport.width) {
          left = Math.max(0, targetOffsetPx + windowScrollLeft + targetOuterWidth - elementOuterWidth);
        } else {
          left = targetOffsetPx - alignOffset + windowScrollLeft;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
      }
    }
  }, {
    key: "relativePosition",
    value: function relativePosition(element, target) {
      if (element && target) {
        var elementDimensions = element.offsetParent ? {
          width: element.offsetWidth,
          height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var targetHeight = target.offsetHeight;
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var top;
        var left;
        if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
          top = -1 * elementDimensions.height;
          if (targetOffset.top + top < 0) {
            top = -1 * targetOffset.top;
          }
          element.style.transformOrigin = 'bottom';
        } else {
          top = targetHeight;
          element.style.transformOrigin = 'top';
        }
        if (elementDimensions.width > viewport.width) {
          // element wider then viewport and cannot fit on screen (align at left side of viewport)
          left = targetOffset.left * -1;
        } else if (targetOffset.left + elementDimensions.width > viewport.width) {
          // element wider then viewport but can be fit on screen (align at right side of viewport)
          left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
        } else {
          // element fits on screen (align with target)
          left = 0;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
      }
    }
  }, {
    key: "flipfitCollision",
    value: function flipfitCollision(element, target) {
      var _this2 = this;
      var my = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left top';
      var at = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'left bottom';
      var callback = arguments.length > 4 ? arguments[4] : undefined;
      if (element && target) {
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var myArr = my.split(' ');
        var atArr = at.split(' ');
        var getPositionValue = function getPositionValue(arr, isOffset) {
          return isOffset ? +arr.substring(arr.search(/(\+|-)/g)) || 0 : arr.substring(0, arr.search(/(\+|-)/g)) || arr;
        };
        var position = {
          my: {
            x: getPositionValue(myArr[0]),
            y: getPositionValue(myArr[1] || myArr[0]),
            offsetX: getPositionValue(myArr[0], true),
            offsetY: getPositionValue(myArr[1] || myArr[0], true)
          },
          at: {
            x: getPositionValue(atArr[0]),
            y: getPositionValue(atArr[1] || atArr[0]),
            offsetX: getPositionValue(atArr[0], true),
            offsetY: getPositionValue(atArr[1] || atArr[0], true)
          }
        };
        var myOffset = {
          left: function left() {
            var totalOffset = position.my.offsetX + position.at.offsetX;
            return totalOffset + targetOffset.left + (position.my.x === 'left' ? 0 : -1 * (position.my.x === 'center' ? _this2.getOuterWidth(element) / 2 : _this2.getOuterWidth(element)));
          },
          top: function top() {
            var totalOffset = position.my.offsetY + position.at.offsetY;
            return totalOffset + targetOffset.top + (position.my.y === 'top' ? 0 : -1 * (position.my.y === 'center' ? _this2.getOuterHeight(element) / 2 : _this2.getOuterHeight(element)));
          }
        };
        var alignWithAt = {
          count: {
            x: 0,
            y: 0
          },
          left: function left() {
            var left = myOffset.left();
            var scrollLeft = DomHandler.getWindowScrollLeft();
            element.style.left = left + scrollLeft + 'px';
            if (this.count.x === 2) {
              element.style.left = scrollLeft + 'px';
              this.count.x = 0;
            } else if (left < 0) {
              this.count.x++;
              position.my.x = 'left';
              position.at.x = 'right';
              position.my.offsetX *= -1;
              position.at.offsetX *= -1;
              this.right();
            }
          },
          right: function right() {
            var left = myOffset.left() + DomHandler.getOuterWidth(target);
            var scrollLeft = DomHandler.getWindowScrollLeft();
            element.style.left = left + scrollLeft + 'px';
            if (this.count.x === 2) {
              element.style.left = viewport.width - DomHandler.getOuterWidth(element) + scrollLeft + 'px';
              this.count.x = 0;
            } else if (left + DomHandler.getOuterWidth(element) > viewport.width) {
              this.count.x++;
              position.my.x = 'right';
              position.at.x = 'left';
              position.my.offsetX *= -1;
              position.at.offsetX *= -1;
              this.left();
            }
          },
          top: function top() {
            var top = myOffset.top();
            var scrollTop = DomHandler.getWindowScrollTop();
            element.style.top = top + scrollTop + 'px';
            if (this.count.y === 2) {
              element.style.left = scrollTop + 'px';
              this.count.y = 0;
            } else if (top < 0) {
              this.count.y++;
              position.my.y = 'top';
              position.at.y = 'bottom';
              position.my.offsetY *= -1;
              position.at.offsetY *= -1;
              this.bottom();
            }
          },
          bottom: function bottom() {
            var top = myOffset.top() + DomHandler.getOuterHeight(target);
            var scrollTop = DomHandler.getWindowScrollTop();
            element.style.top = top + scrollTop + 'px';
            if (this.count.y === 2) {
              element.style.left = viewport.height - DomHandler.getOuterHeight(element) + scrollTop + 'px';
              this.count.y = 0;
            } else if (top + DomHandler.getOuterHeight(target) > viewport.height) {
              this.count.y++;
              position.my.y = 'bottom';
              position.at.y = 'top';
              position.my.offsetY *= -1;
              position.at.offsetY *= -1;
              this.top();
            }
          },
          center: function center(axis) {
            if (axis === 'y') {
              var top = myOffset.top() + DomHandler.getOuterHeight(target) / 2;
              element.style.top = top + DomHandler.getWindowScrollTop() + 'px';
              if (top < 0) {
                this.bottom();
              } else if (top + DomHandler.getOuterHeight(target) > viewport.height) {
                this.top();
              }
            } else {
              var left = myOffset.left() + DomHandler.getOuterWidth(target) / 2;
              element.style.left = left + DomHandler.getWindowScrollLeft() + 'px';
              if (left < 0) {
                this.left();
              } else if (left + DomHandler.getOuterWidth(element) > viewport.width) {
                this.right();
              }
            }
          }
        };
        alignWithAt[position.at.x]('x');
        alignWithAt[position.at.y]('y');
        if (this.isFunction(callback)) {
          callback(position);
        }
      }
    }
  }, {
    key: "findCollisionPosition",
    value: function findCollisionPosition(position) {
      if (position) {
        var isAxisY = position === 'top' || position === 'bottom';
        var myXPosition = position === 'left' ? 'right' : 'left';
        var myYPosition = position === 'top' ? 'bottom' : 'top';
        if (isAxisY) {
          return {
            axis: 'y',
            my: "center ".concat(myYPosition),
            at: "center ".concat(position)
          };
        }
        return {
          axis: 'x',
          my: "".concat(myXPosition, " center"),
          at: "".concat(position, " center")
        };
      }
    }
  }, {
    key: "getParents",
    value: function getParents(element) {
      var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return element.parentNode === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
    }

    /**
     * Gets all scrollable parent elements of a given element
     * @param {HTMLElement} element - The element to find scrollable parents for
     * @param {boolean} hideOverlaysOnDocumentScrolling - Whether to include window/document level scrolling
     * @returns {Array} Array of scrollable parent elements
     */
  }, {
    key: "getScrollableParents",
    value: function getScrollableParents(element) {
      var hideOverlaysOnDocumentScrolling = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var scrollableParents = [];
      if (element) {
        // Get all parent elements
        var parents = this.getParents(element);
        // Regex to match auto or scroll overflow values
        var overflowRegex = /(auto|scroll)/;

        /**
         * Checks if an element has overflow scroll/auto in any direction
         * @param {HTMLElement} node - Element to check
         * @returns {boolean} True if element has overflow scroll/auto
         */
        var overflowCheck = function overflowCheck(node) {
          var styleDeclaration = node ? getComputedStyle(node) : null;
          return styleDeclaration && (overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflow-x')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflow-y')));
        };

        /**
         * Adds a scrollable parent element to the collection
         * @param {HTMLElement} node - Element to add
         */
        var addScrollableParent = function addScrollableParent(node) {
          if (hideOverlaysOnDocumentScrolling) {
            // For document/body/html elements, add window instead
            scrollableParents.push(node.nodeName === 'BODY' || node.nodeName === 'HTML' || node.nodeType === 9 ? window : node);
          }
        };

        // Iterate through all parent elements
        var _iterator = _createForOfIteratorHelper$1(parents),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _parent$dataset;
            var parent = _step.value;
            // Check for custom scroll selectors in data attribute
            var scrollSelectors = parent.nodeType === 1 && ((_parent$dataset = parent.dataset) === null || _parent$dataset === void 0 ? void 0 : _parent$dataset.scrollselectors);
            if (scrollSelectors) {
              var selectors = scrollSelectors.split(',');

              // Check each selector
              var _iterator2 = _createForOfIteratorHelper$1(selectors),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var selector = _step2.value;
                  var el = this.findSingle(parent, selector);
                  if (el && overflowCheck(el)) {
                    addScrollableParent(el);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }

            // Check if the parent itself is scrollable
            if (parent.nodeType === 1 && overflowCheck(parent)) {
              addScrollableParent(parent);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      // Ensure window/body is always included as fallback
      if (!scrollableParents.some(function (node) {
        return node === document.body || node === window;
      })) {
        scrollableParents.push(hideOverlaysOnDocumentScrolling ? window : document.body);
      }
      return scrollableParents;
    }
  }, {
    key: "getHiddenElementOuterHeight",
    value: function getHiddenElementOuterHeight(element) {
      if (element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        var elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementHeight;
      }
      return 0;
    }
  }, {
    key: "getHiddenElementOuterWidth",
    value: function getHiddenElementOuterWidth(element) {
      if (element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        var elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementWidth;
      }
      return 0;
    }
  }, {
    key: "getHiddenElementDimensions",
    value: function getHiddenElementDimensions(element) {
      var dimensions = {};
      if (element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
      }
      return dimensions;
    }
  }, {
    key: "fadeIn",
    value: function fadeIn(element, duration) {
      if (element) {
        element.style.opacity = 0;
        var last = +new Date();
        var opacity = 0;
        var _tick = function tick() {
          opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
          element.style.opacity = opacity;
          last = +new Date();
          if (+opacity < 1) {
            window.requestAnimationFrame && requestAnimationFrame(_tick) || setTimeout(_tick, 16);
          }
        };
        _tick();
      }
    }
  }, {
    key: "fadeOut",
    value: function fadeOut(element, duration) {
      if (element) {
        var opacity = 1;
        var interval = 50;
        var gap = interval / duration;
        var fading = setInterval(function () {
          opacity = opacity - gap;
          if (opacity <= 0) {
            opacity = 0;
            clearInterval(fading);
          }
          element.style.opacity = opacity;
        }, interval);
      }
    }
  }, {
    key: "getUserAgent",
    value: function getUserAgent() {
      return navigator.userAgent;
    }
  }, {
    key: "isIOS",
    value: function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
  }, {
    key: "isAndroid",
    value: function isAndroid() {
      return /(android)/i.test(navigator.userAgent);
    }
  }, {
    key: "isChrome",
    value: function isChrome() {
      return /(chrome)/i.test(navigator.userAgent);
    }
  }, {
    key: "isClient",
    value: function isClient() {
      return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    }
  }, {
    key: "isTouchDevice",
    value: function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
  }, {
    key: "isFunction",
    value: function isFunction(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }
  }, {
    key: "appendChild",
    value: function appendChild(element, target) {
      if (this.isElement(target)) {
        target.appendChild(element);
      } else if (target.el && target.el.nativeElement) {
        target.el.nativeElement.appendChild(element);
      } else {
        throw new Error('Cannot append ' + target + ' to ' + element);
      }
    }
  }, {
    key: "removeChild",
    value: function removeChild(element, target) {
      if (this.isElement(target)) {
        target.removeChild(element);
      } else if (target.el && target.el.nativeElement) {
        target.el.nativeElement.removeChild(element);
      } else {
        throw new Error('Cannot remove ' + element + ' from ' + target);
      }
    }
  }, {
    key: "isElement",
    value: function isElement(obj) {
      return (typeof HTMLElement === "undefined" ? "undefined" : _typeof$9(HTMLElement)) === 'object' ? obj instanceof HTMLElement : obj && _typeof$9(obj) === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
  }, {
    key: "scrollInView",
    value: function scrollInView(container, item) {
      var borderTopValue = getComputedStyle(container).getPropertyValue('border-top-width');
      var borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
      var paddingTopValue = getComputedStyle(container).getPropertyValue('padding-top');
      var paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
      var containerRect = container.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();
      var offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
      var scroll = container.scrollTop;
      var elementHeight = container.clientHeight;
      var itemHeight = this.getOuterHeight(item);
      if (offset < 0) {
        container.scrollTop = scroll + offset;
      } else if (offset + itemHeight > elementHeight) {
        container.scrollTop = scroll + offset - elementHeight + itemHeight;
      }
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection && document.selection.empty) {
        try {
          document.selection.empty();
        } catch (error) {
          //ignore IE bug
        }
      }
    }
  }, {
    key: "calculateScrollbarWidth",
    value: function calculateScrollbarWidth(el) {
      if (el) {
        var style = getComputedStyle(el);
        return el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
      }
      if (this.calculatedScrollbarWidth != null) {
        return this.calculatedScrollbarWidth;
      }
      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'p-scrollbar-measure';
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      this.calculatedScrollbarWidth = scrollbarWidth;
      return scrollbarWidth;
    }
  }, {
    key: "calculateBodyScrollbarWidth",
    value: function calculateBodyScrollbarWidth() {
      return window.innerWidth - document.documentElement.offsetWidth;
    }
  }, {
    key: "getBrowser",
    value: function getBrowser() {
      if (!this.browser) {
        var matched = this.resolveUserAgent();
        this.browser = {};
        if (matched.browser) {
          this.browser[matched.browser] = true;
          this.browser.version = matched.version;
        }
        if (this.browser.chrome) {
          this.browser.webkit = true;
        } else if (this.browser.webkit) {
          this.browser.safari = true;
        }
      }
      return this.browser;
    }
  }, {
    key: "resolveUserAgent",
    value: function resolveUserAgent() {
      var ua = navigator.userAgent.toLowerCase();
      var match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || '',
        version: match[2] || '0'
      };
    }
  }, {
    key: "blockBodyScroll",
    value: function blockBodyScroll() {
      var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'p-overflow-hidden';
      /* PR Ref: https://github.com/primefaces/primereact/pull/4976
       * @todo This method is called several times after this PR. Refactors will be made to prevent this in future releases.
       */
      var hasScrollbarWidth = !!document.body.style.getPropertyValue('--scrollbar-width');
      !hasScrollbarWidth && document.body.style.setProperty('--scrollbar-width', this.calculateBodyScrollbarWidth() + 'px');
      this.addClass(document.body, className);
    }
  }, {
    key: "unblockBodyScroll",
    value: function unblockBodyScroll() {
      var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'p-overflow-hidden';
      document.body.style.removeProperty('--scrollbar-width');
      this.removeClass(document.body, className);
    }
  }, {
    key: "isVisible",
    value: function isVisible(element) {
      // https://stackoverflow.com/a/59096915/502366 (in future use IntersectionObserver)
      return element && (element.clientHeight !== 0 || element.getClientRects().length !== 0 || getComputedStyle(element).display !== 'none');
    }
  }, {
    key: "isExist",
    value: function isExist(element) {
      return !!(element !== null && typeof element !== 'undefined' && element.nodeName && element.parentNode);
    }
  }, {
    key: "getFocusableElements",
    value: function getFocusableElements(element) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var focusableElements = DomHandler.find(element, "button:not([tabindex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])".concat(selector, ",\n                [href][clientHeight][clientWidth]:not([tabindex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector, ",\n                input:not([tabindex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector, ",\n                select:not([tabindex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector, ",\n                textarea:not([tabindex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector, ",\n                [tabIndex]:not([tabIndex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector, ",\n                [contenteditable]:not([tabIndex = \"-1\"]):not([disabled]):not([style*=\"display:none\"]):not([hidden])").concat(selector));
      var visibleFocusableElements = [];
      var _iterator3 = _createForOfIteratorHelper$1(focusableElements),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var focusableElement = _step3.value;
          if (getComputedStyle(focusableElement).display !== 'none' && getComputedStyle(focusableElement).visibility !== 'hidden') {
            visibleFocusableElements.push(focusableElement);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return visibleFocusableElements;
    }
  }, {
    key: "getFirstFocusableElement",
    value: function getFirstFocusableElement(element, selector) {
      var focusableElements = DomHandler.getFocusableElements(element, selector);
      return focusableElements.length > 0 ? focusableElements[0] : null;
    }
  }, {
    key: "getLastFocusableElement",
    value: function getLastFocusableElement(element, selector) {
      var focusableElements = DomHandler.getFocusableElements(element, selector);
      return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
    }

    /**
     * Focus an input element if it does not already have focus.
     *
     * @param {HTMLElement} el a HTML element
     * @param {boolean} scrollTo flag to control whether to scroll to the element, false by default
     */
  }, {
    key: "focus",
    value: function focus(el, scrollTo) {
      var preventScroll = scrollTo === undefined ? true : !scrollTo;
      el && document.activeElement !== el && el.focus({
        preventScroll: preventScroll
      });
    }

    /**
     * Focus the first focusable element if it does not already have focus.
     *
     * @param {HTMLElement} el a HTML element
     * @param {boolean} scrollTo flag to control whether to scroll to the element, false by default
     * @return {HTMLElement | undefined} the first focusable HTML element found
     */
  }, {
    key: "focusFirstElement",
    value: function focusFirstElement(el, scrollTo) {
      if (!el) {
        return;
      }
      var firstFocusableElement = DomHandler.getFirstFocusableElement(el);
      firstFocusableElement && DomHandler.focus(firstFocusableElement, scrollTo);
      return firstFocusableElement;
    }
  }, {
    key: "getCursorOffset",
    value: function getCursorOffset(el, prevText, nextText, currentText) {
      if (el) {
        var style = getComputedStyle(el);
        var ghostDiv = document.createElement('div');
        ghostDiv.style.position = 'absolute';
        ghostDiv.style.top = '0px';
        ghostDiv.style.left = '0px';
        ghostDiv.style.visibility = 'hidden';
        ghostDiv.style.pointerEvents = 'none';
        ghostDiv.style.overflow = style.overflow;
        ghostDiv.style.width = style.width;
        ghostDiv.style.height = style.height;
        ghostDiv.style.padding = style.padding;
        ghostDiv.style.border = style.border;
        ghostDiv.style.overflowWrap = style.overflowWrap;
        ghostDiv.style.whiteSpace = style.whiteSpace;
        ghostDiv.style.lineHeight = style.lineHeight;
        ghostDiv.innerHTML = prevText.replace(/\r\n|\r|\n/g, '<br />');
        var ghostSpan = document.createElement('span');
        ghostSpan.textContent = currentText;
        ghostDiv.appendChild(ghostSpan);
        var text = document.createTextNode(nextText);
        ghostDiv.appendChild(text);
        document.body.appendChild(ghostDiv);
        var offsetLeft = ghostSpan.offsetLeft,
          offsetTop = ghostSpan.offsetTop,
          clientHeight = ghostSpan.clientHeight;
        document.body.removeChild(ghostDiv);
        return {
          left: Math.abs(offsetLeft - el.scrollLeft),
          top: Math.abs(offsetTop - el.scrollTop) + clientHeight
        };
      }
      return {
        top: 'auto',
        left: 'auto'
      };
    }
  }, {
    key: "invokeElementMethod",
    value: function invokeElementMethod(element, methodName, args) {
      element[methodName].apply(element, args);
    }
  }, {
    key: "isClickable",
    value: function isClickable(element) {
      var targetNode = element.nodeName;
      var parentNode = element.parentElement && element.parentElement.nodeName;
      return targetNode === 'INPUT' || targetNode === 'TEXTAREA' || targetNode === 'BUTTON' || targetNode === 'A' || parentNode === 'INPUT' || parentNode === 'TEXTAREA' || parentNode === 'BUTTON' || parentNode === 'A' || this.hasClass(element, 'p-button') || this.hasClass(element.parentElement, 'p-button') || this.hasClass(element.parentElement, 'p-checkbox') || this.hasClass(element.parentElement, 'p-radiobutton');
    }
  }, {
    key: "applyStyle",
    value: function applyStyle(element, style) {
      if (typeof style === 'string') {
        element.style.cssText = style;
      } else {
        for (var prop in style) {
          element.style[prop] = style[prop];
        }
      }
    }
  }, {
    key: "exportCSV",
    value: function exportCSV(csv, filename) {
      var blob = new Blob([csv], {
        type: 'application/csv;charset=utf-8;'
      });
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename + '.csv');
      } else {
        var isDownloaded = DomHandler.saveAs({
          name: filename + '.csv',
          src: URL.createObjectURL(blob)
        });
        if (!isDownloaded) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
          window.open(encodeURI(csv));
        }
      }
    }
  }, {
    key: "saveAs",
    value: function saveAs(file) {
      if (file) {
        var link = document.createElement('a');
        if (link.download !== undefined) {
          var name = file.name,
            src = file.src;
          link.setAttribute('href', src);
          link.setAttribute('download', name);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return true;
        }
      }
      return false;
    }
  }, {
    key: "createInlineStyle",
    value: function createInlineStyle(nonce, styleContainer) {
      var styleElement = document.createElement('style');
      DomHandler.addNonce(styleElement, nonce);
      if (!styleContainer) {
        styleContainer = document.head;
      }
      styleContainer.appendChild(styleElement);
      return styleElement;
    }
  }, {
    key: "removeInlineStyle",
    value: function removeInlineStyle(styleElement) {
      if (this.isExist(styleElement)) {
        try {
          styleElement.parentNode.removeChild(styleElement);
        } catch (error) {
          // style element may have already been removed in a fast refresh
        }
        styleElement = null;
      }
      return styleElement;
    }
  }, {
    key: "addNonce",
    value: function addNonce(styleElement, nonce) {
      try {
        if (!nonce) {
          nonce = process.env.REACT_APP_CSS_NONCE;
        }
      } catch (error) {
        // NOOP
      }
      nonce && styleElement.setAttribute('nonce', nonce);
    }
  }, {
    key: "getTargetElement",
    value: function getTargetElement(target) {
      if (!target) {
        return null;
      }
      if (target === 'document') {
        return document;
      } else if (target === 'window') {
        return window;
      } else if (_typeof$9(target) === 'object' && target.hasOwnProperty('current')) {
        return this.isExist(target.current) ? target.current : null;
      }
      var isFunction = function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
      };
      var element = isFunction(target) ? target() : target;
      return element && element.nodeType === 9 || this.isExist(element) ? element : null;
    }

    /**
     * Get the attribute names for an element and sorts them alpha for comparison
     */
  }, {
    key: "getAttributeNames",
    value: function getAttributeNames(node) {
      var index;
      var rv;
      var attrs;
      rv = [];
      attrs = node.attributes;
      for (index = 0; index < attrs.length; ++index) {
        rv.push(attrs[index].nodeName);
      }
      rv.sort();
      return rv;
    }

    /**
     * Compare two elements for equality.  Even will compare if the style element
     * is out of order for example:
     *
     * elem1 = style="color: red; font-size: 28px"
     * elem2 = style="font-size: 28px; color: red"
     */
  }, {
    key: "isEqualElement",
    value: function isEqualElement(elm1, elm2) {
      var attrs1;
      var attrs2;
      var name;
      var node1;
      var node2;

      // Compare attributes without order sensitivity
      attrs1 = DomHandler.getAttributeNames(elm1);
      attrs2 = DomHandler.getAttributeNames(elm2);
      if (attrs1.join(',') !== attrs2.join(',')) {
        // console.log("Found nodes with different sets of attributes; not equiv");
        return false;
      }

      // ...and values
      // unless you want to compare DOM0 event handlers
      // (onclick="...")
      for (var index = 0; index < attrs1.length; ++index) {
        name = attrs1[index];
        if (name === 'style') {
          var astyle = elm1.style;
          var bstyle = elm2.style;
          var rexDigitsOnly = /^\d+$/;
          for (var _i3 = 0, _Object$keys = Object.keys(astyle); _i3 < _Object$keys.length; _i3++) {
            var key = _Object$keys[_i3];
            if (!rexDigitsOnly.test(key) && astyle[key] !== bstyle[key]) {
              // Not equivalent, stop
              //console.log("Found nodes with mis-matched values for attribute '" + name + "'; not equiv");
              return false;
            }
          }
        } else if (elm1.getAttribute(name) !== elm2.getAttribute(name)) {
          // console.log("Found nodes with mis-matched values for attribute '" + name + "'; not equiv");
          return false;
        }
      }

      // Walk the children
      for (node1 = elm1.firstChild, node2 = elm2.firstChild; node1 && node2; node1 = node1.nextSibling, node2 = node2.nextSibling) {
        if (node1.nodeType !== node2.nodeType) {
          // display("Found nodes of different types; not equiv");
          return false;
        }
        if (node1.nodeType === 1) {
          // Element
          if (!DomHandler.isEqualElement(node1, node2)) {
            return false;
          }
        } else if (node1.nodeValue !== node2.nodeValue) {
          // console.log("Found nodes with mis-matched nodeValues; not equiv");
          return false;
        }
      }
      if (node1 || node2) {
        // One of the elements had more nodes than the other
        // console.log("Found more children of one element than the other; not equivalent");
        return false;
      }

      // Seem the same
      return true;
    }
  }, {
    key: "hasCSSAnimation",
    value: function hasCSSAnimation(element) {
      if (element) {
        var style = getComputedStyle(element);
        var animationDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
        return animationDuration > 0;
      }
      return false;
    }
  }, {
    key: "hasCSSTransition",
    value: function hasCSSTransition(element) {
      if (element) {
        var style = getComputedStyle(element);
        var transitionDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
        return transitionDuration > 0;
      }
      return false;
    }
  }]);
}();
/**
 * All data- properties like data-test-id
 */
_defineProperty$9(DomHandler, "DATA_PROPS", ['data-']);
/**
 * All ARIA properties like aria-label and focus-target for https://www.npmjs.com/package/@q42/floating-focus-a11y
 */
_defineProperty$9(DomHandler, "ARIA_PROPS", ['aria', 'focus-target']);

function EventBus() {
  var allHandlers = new Map();
  return {
    on: function on(type, handler) {
      var handlers = allHandlers.get(type);
      if (!handlers) {
        handlers = [handler];
      } else {
        handlers.push(handler);
      }
      allHandlers.set(type, handlers);
    },
    off: function off(type, handler) {
      var handlers = allHandlers.get(type);
      handlers && handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    },
    emit: function emit(type, evt) {
      var handlers = allHandlers.get(type);
      handlers && handlers.slice().forEach(function (handler) {
        return handler(evt);
      });
    }
  };
}

function _extends$c() {
  _extends$c = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$c.apply(this, arguments);
}

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$8(o)) || allowArrayLike) { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$8(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$8(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen); }
function _arrayLikeToArray$8(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ObjectUtils = /*#__PURE__*/function () {
  function ObjectUtils() {
    _classCallCheck$1(this, ObjectUtils);
  }
  return _createClass$1(ObjectUtils, null, [{
    key: "equals",
    value: function equals(obj1, obj2, field) {
      if (field && obj1 && _typeof$9(obj1) === 'object' && obj2 && _typeof$9(obj2) === 'object') {
        return this.deepEquals(this.resolveFieldData(obj1, field), this.resolveFieldData(obj2, field));
      }
      return this.deepEquals(obj1, obj2);
    }

    /**
     * Compares two JSON objects for deep equality recursively comparing both objects.
     * @param {*} a the first JSON object
     * @param {*} b the second JSON object
     * @returns true if equals, false it not
     */
  }, {
    key: "deepEquals",
    value: function deepEquals(a, b) {
      if (a === b) {
        return true;
      }
      if (a && b && _typeof$9(a) === 'object' && _typeof$9(b) === 'object') {
        var arrA = Array.isArray(a);
        var arrB = Array.isArray(b);
        var i;
        var length;
        var key;
        if (arrA && arrB) {
          length = a.length;
          if (length !== b.length) {
            return false;
          }
          for (i = length; i-- !== 0;) {
            if (!this.deepEquals(a[i], b[i])) {
              return false;
            }
          }
          return true;
        }
        if (arrA !== arrB) {
          return false;
        }
        var dateA = a instanceof Date;
        var dateB = b instanceof Date;
        if (dateA !== dateB) {
          return false;
        }
        if (dateA && dateB) {
          return a.getTime() === b.getTime();
        }
        var regexpA = a instanceof RegExp;
        var regexpB = b instanceof RegExp;
        if (regexpA !== regexpB) {
          return false;
        }
        if (regexpA && regexpB) {
          return a.toString() === b.toString();
        }
        var keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) {
          return false;
        }
        for (i = length; i-- !== 0;) {
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
            return false;
          }
        }
        for (i = length; i-- !== 0;) {
          key = keys[i];
          if (!this.deepEquals(a[key], b[key])) {
            return false;
          }
        }
        return true;
      }

      /*eslint no-self-compare: "off"*/
      return a !== a && b !== b;
    }
  }, {
    key: "resolveFieldData",
    value: function resolveFieldData(data, field) {
      if (!data || !field) {
        // short circuit if there is nothing to resolve
        return null;
      }
      try {
        var value = data[field];
        if (this.isNotEmpty(value)) {
          return value;
        }
      } catch (_unused) {
        // Performance optimization: https://github.com/primefaces/primereact/issues/4797
        // do nothing and continue to other methods to resolve field data
      }
      if (Object.keys(data).length) {
        if (this.isFunction(field)) {
          return field(data);
        } else if (this.isNotEmpty(data[field])) {
          return data[field];
        } else if (field.indexOf('.') === -1) {
          return data[field];
        }
        var fields = field.split('.');
        var _value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (_value == null) {
            return null;
          }
          _value = _value[fields[i]];
        }
        return _value;
      }
      return null;
    }
  }, {
    key: "findDiffKeys",
    value: function findDiffKeys(obj1, obj2) {
      if (!obj1 || !obj2) {
        return {};
      }
      return Object.keys(obj1).filter(function (key) {
        return !obj2.hasOwnProperty(key);
      }).reduce(function (result, current) {
        result[current] = obj1[current];
        return result;
      }, {});
    }

    /**
     * Removes keys from a JSON object that start with a string such as "data" to get all "data-id" type properties.
     *
     * @param {any} obj the JSON object to reduce
     * @param {string[]} startsWiths the string(s) to check if the property starts with this key
     * @returns the JSON object containing only the key/values that match the startsWith string
     */
  }, {
    key: "reduceKeys",
    value: function reduceKeys(obj, startsWiths) {
      var result = {};
      if (!obj || !startsWiths || startsWiths.length === 0) {
        return result;
      }
      Object.keys(obj).filter(function (key) {
        return startsWiths.some(function (value) {
          return key.startsWith(value);
        });
      }).forEach(function (key) {
        result[key] = obj[key];
        delete obj[key];
      });
      return result;
    }
  }, {
    key: "reorderArray",
    value: function reorderArray(value, from, to) {
      if (value && from !== to) {
        if (to >= value.length) {
          to = to % value.length;
          from = from % value.length;
        }
        value.splice(to, 0, value.splice(from, 1)[0]);
      }
    }
  }, {
    key: "findIndexInList",
    value: function findIndexInList(value, list, dataKey) {
      var _this = this;
      if (list) {
        return dataKey ? list.findIndex(function (item) {
          return _this.equals(item, value, dataKey);
        }) : list.findIndex(function (item) {
          return item === value;
        });
      }
      return -1;
    }
  }, {
    key: "getJSXElement",
    value: function getJSXElement(obj) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
    }
  }, {
    key: "getItemValue",
    value: function getItemValue(obj) {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
    }
  }, {
    key: "getProp",
    value: function getProp(props) {
      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var value = props ? props[prop] : undefined;
      return value === undefined ? defaultProps[prop] : value;
    }
  }, {
    key: "getPropCaseInsensitive",
    value: function getPropCaseInsensitive(props, prop) {
      var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fkey = this.toFlatCase(prop);
      for (var key in props) {
        if (props.hasOwnProperty(key) && this.toFlatCase(key) === fkey) {
          return props[key];
        }
      }
      for (var _key3 in defaultProps) {
        if (defaultProps.hasOwnProperty(_key3) && this.toFlatCase(_key3) === fkey) {
          return defaultProps[_key3];
        }
      }
      return undefined; // Property not found
    }
  }, {
    key: "getMergedProps",
    value: function getMergedProps(props, defaultProps) {
      return Object.assign({}, defaultProps, props);
    }
  }, {
    key: "getDiffProps",
    value: function getDiffProps(props, defaultProps) {
      return this.findDiffKeys(props, defaultProps);
    }
  }, {
    key: "getPropValue",
    value: function getPropValue(obj) {
      for (var _len3 = arguments.length, params = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
        params[_key4 - 1] = arguments[_key4];
      }
      return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
    }
  }, {
    key: "getComponentProp",
    value: function getComponentProp(component) {
      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.isNotEmpty(component) ? this.getProp(component.props, prop, defaultProps) : undefined;
    }
  }, {
    key: "getComponentProps",
    value: function getComponentProps(component, defaultProps) {
      return this.isNotEmpty(component) ? this.getMergedProps(component.props, defaultProps) : undefined;
    }
  }, {
    key: "getComponentDiffProps",
    value: function getComponentDiffProps(component, defaultProps) {
      return this.isNotEmpty(component) ? this.getDiffProps(component.props, defaultProps) : undefined;
    }
  }, {
    key: "isValidChild",
    value: function isValidChild(child, type, validTypes) {
      /* eslint-disable */
      if (child) {
        var _child$type;
        var childType = this.getComponentProp(child, '__TYPE') || (child.type ? child.type.displayName : undefined);

        // for App Router in Next.js ^14,
        if (!childType && child !== null && child !== void 0 && (_child$type = child.type) !== null && _child$type !== void 0 && (_child$type = _child$type._payload) !== null && _child$type !== void 0 && _child$type.value) {
          childType = child.type._payload.value.find(function (v) {
            return v === type;
          });
        }
        var isValid = childType === type;
        try {
          var messageTypes; if ("production" !== 'production' && !isValid);
        } catch (error) {
          // NOOP
        }
        return isValid;
      }
      return false;
      /* eslint-enable */
    }
  }, {
    key: "getRefElement",
    value: function getRefElement(ref) {
      if (ref) {
        return _typeof$9(ref) === 'object' && ref.hasOwnProperty('current') ? ref.current : ref;
      }
      return null;
    }
  }, {
    key: "combinedRefs",
    value: function combinedRefs(innerRef, forwardRef) {
      if (innerRef && forwardRef) {
        if (typeof forwardRef === 'function') {
          forwardRef(innerRef.current);
        } else {
          forwardRef.current = innerRef.current;
        }
      }
    }
  }, {
    key: "removeAccents",
    value: function removeAccents(str) {
      if (str && str.search(/[\xC0-\xFF]/g) > -1) {
        str = str.replace(/[\xC0-\xC5]/g, 'A').replace(/[\xC6]/g, 'AE').replace(/[\xC7]/g, 'C').replace(/[\xC8-\xCB]/g, 'E').replace(/[\xCC-\xCF]/g, 'I').replace(/[\xD0]/g, 'D').replace(/[\xD1]/g, 'N').replace(/[\xD2-\xD6\xD8]/g, 'O').replace(/[\xD9-\xDC]/g, 'U').replace(/[\xDD]/g, 'Y').replace(/[\xDE]/g, 'P').replace(/[\xE0-\xE5]/g, 'a').replace(/[\xE6]/g, 'ae').replace(/[\xE7]/g, 'c').replace(/[\xE8-\xEB]/g, 'e').replace(/[\xEC-\xEF]/g, 'i').replace(/[\xF1]/g, 'n').replace(/[\xF2-\xF6\xF8]/g, 'o').replace(/[\xF9-\xFC]/g, 'u').replace(/[\xFE]/g, 'p').replace(/[\xFD\xFF]/g, 'y');
      }
      return str;
    }
  }, {
    key: "toFlatCase",
    value: function toFlatCase(str) {
      // convert snake, kebab, camel and pascal cases to flat case
      return this.isNotEmpty(str) && this.isString(str) ? str.replace(/(-|_)/g, '').toLowerCase() : str;
    }
  }, {
    key: "toCapitalCase",
    value: function toCapitalCase(str) {
      return this.isNotEmpty(str) && this.isString(str) ? str[0].toUpperCase() + str.slice(1) : str;
    }
  }, {
    key: "trim",
    value: function trim(value) {
      // trim only if the value is actually a string
      return this.isNotEmpty(value) && this.isString(value) ? value.trim() : value;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(value) {
      return value === null || value === undefined || value === '' || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && _typeof$9(value) === 'object' && Object.keys(value).length === 0;
    }
  }, {
    key: "isNotEmpty",
    value: function isNotEmpty(value) {
      return !this.isEmpty(value);
    }
  }, {
    key: "isFunction",
    value: function isFunction(value) {
      return !!(value && value.constructor && value.call && value.apply);
    }
  }, {
    key: "isObject",
    value: function isObject(value) {
      return value !== null && value instanceof Object && value.constructor === Object;
    }
  }, {
    key: "isDate",
    value: function isDate(value) {
      return value !== null && value instanceof Date && value.constructor === Date;
    }
  }, {
    key: "isArray",
    value: function isArray(value) {
      return value !== null && Array.isArray(value);
    }
  }, {
    key: "isString",
    value: function isString(value) {
      return value !== null && typeof value === 'string';
    }
  }, {
    key: "isPrintableCharacter",
    value: function isPrintableCharacter() {
      var _char = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return this.isNotEmpty(_char) && _char.length === 1 && _char.match(/\S| /);
    }
  }, {
    key: "isLetter",
    value: function isLetter(_char2) {
      return /^[a-zA-Z\u00C0-\u017F]$/.test(_char2);
    }
  }, {
    key: "isScalar",
    value: function isScalar(value) {
      return value != null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean');
    }

    /**
     * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlast
     */
  }, {
    key: "findLast",
    value: function findLast(arr, callback) {
      var item;
      if (this.isNotEmpty(arr)) {
        try {
          item = arr.findLast(callback);
        } catch (_unused2) {
          item = _toConsumableArray$5(arr).reverse().find(callback);
        }
      }
      return item;
    }

    /**
     * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
     */
  }, {
    key: "findLastIndex",
    value: function findLastIndex(arr, callback) {
      var index = -1;
      if (this.isNotEmpty(arr)) {
        try {
          index = arr.findLastIndex(callback);
        } catch (_unused3) {
          index = arr.lastIndexOf(_toConsumableArray$5(arr).reverse().find(callback));
        }
      }
      return index;
    }
  }, {
    key: "sort",
    value: function sort(value1, value2) {
      var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var comparator = arguments.length > 3 ? arguments[3] : undefined;
      var nullSortOrder = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var result = this.compare(value1, value2, comparator, order);
      var finalSortOrder = order;

      // nullSortOrder == 1 means Excel like sort nulls at bottom
      if (this.isEmpty(value1) || this.isEmpty(value2)) {
        finalSortOrder = nullSortOrder === 1 ? order : nullSortOrder;
      }
      return finalSortOrder * result;
    }
  }, {
    key: "compare",
    value: function compare(value1, value2, comparator) {
      var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var result = -1;
      var emptyValue1 = this.isEmpty(value1);
      var emptyValue2 = this.isEmpty(value2);
      if (emptyValue1 && emptyValue2) {
        result = 0;
      } else if (emptyValue1) {
        result = order;
      } else if (emptyValue2) {
        result = -order;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = comparator(value1, value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }
      return result;
    }
  }, {
    key: "localeComparator",
    value: function localeComparator(locale) {
      //performance gain using Int.Collator. It is not recommended to use localeCompare against large arrays.
      return new Intl.Collator(locale, {
        numeric: true
      }).compare;
    }
  }, {
    key: "findChildrenByKey",
    value: function findChildrenByKey(data, key) {
      var _iterator = _createForOfIteratorHelper$2(data),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.key === key) {
            return item.children || [];
          } else if (item.children) {
            var result = this.findChildrenByKey(item.children, key);
            if (result.length > 0) {
              return result;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return [];
    }

    /**
     * This function takes mutates and object with a new value given
     * a specific field. This will handle deeply nested fields that
     * need to be modified or created.
     *
     * e.g:
     * data = {
     *  nested: {
     *      foo: "bar"
     *  }
     * }
     *
     * field = "nested.foo"
     * value = "baz"
     *
     * The function will mutate data to be
     * e.g:
     * data = {
     *  nested: {
     *      foo: "baz"
     *  }
     * }
     *
     * @param {object} data the object to be modified
     * @param {string} field the field in the object to replace
     * @param {any} value the value to have replaced in the field
     */
  }, {
    key: "mutateFieldData",
    value: function mutateFieldData(data, field, value) {
      if (_typeof$9(data) !== 'object' || typeof field !== 'string') {
        // short circuit if there is nothing to resolve
        return;
      }
      var fields = field.split('.');
      var obj = data;
      for (var i = 0, len = fields.length; i < len; ++i) {
        // Check if we are on the last field
        if (i + 1 - len === 0) {
          obj[fields[i]] = value;
          break;
        }
        if (!obj[fields[i]]) {
          obj[fields[i]] = {};
        }
        obj = obj[fields[i]];
      }
    }
  }]);
}();

var lastId = 0;
function UniqueComponentId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'pr_id_';
  lastId++;
  return "".concat(prefix).concat(lastId);
}

function ownKeys$2$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2$2(Object(t), true).forEach(function (r) { _defineProperty$9(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var IconUtils = /*#__PURE__*/function () {
  function IconUtils() {
    _classCallCheck$1(this, IconUtils);
  }
  return _createClass$1(IconUtils, null, [{
    key: "getJSXIcon",
    value: function getJSXIcon(icon) {
      var iconProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var content = null;
      if (icon !== null) {
        var iconType = _typeof$9(icon);
        var className = classNames(iconProps.className, iconType === 'string' && icon);
        content = /*#__PURE__*/React.createElement("span", _extends$c({}, iconProps, {
          className: className,
          key: UniqueComponentId('icon')
        }));
        if (iconType !== 'string') {
          var defaultContentOptions = _objectSpread$2$2({
            iconProps: iconProps,
            element: content
          }, options);
          return ObjectUtils.getJSXElement(icon, defaultContentOptions);
        }
      }
      return content;
    }
  }]);
}();

function ownKeys$a(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$a(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$a(Object(t), true).forEach(function (r) { _defineProperty$9(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$a(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Merges properties together taking an Array of props and merging into one single set of
 * properties. The options can contain a "classNameMergeFunction" which can be something
 * like Tailwind Merge for properly merging Tailwind classes.
 *
 * @param {object[]} props the array of object properties to merge
 * @param {*} options either empty or could contain a custom merge function like TailwindMerge
 * @returns the single properties value after merging
 */
function mergeProps(props) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!props) {
    return undefined;
  }
  var isFunction = function isFunction(obj) {
    return typeof obj === 'function';
  };
  var classNameMergeFunction = options.classNameMergeFunction;
  var hasMergeFunction = isFunction(classNameMergeFunction);
  return props.reduce(function (merged, ps) {
    if (!ps) {
      return merged;
    }
    var _loop = function _loop() {
      var value = ps[key];
      if (key === 'style') {
        merged.style = _objectSpread$a(_objectSpread$a({}, merged.style), ps.style);
      } else if (key === 'className') {
        var newClassName = '';
        if (hasMergeFunction) {
          newClassName = classNameMergeFunction(merged.className, ps.className);
        } else {
          newClassName = [merged.className, ps.className].join(' ').trim();
        }
        merged.className = newClassName || undefined;
      } else if (isFunction(value)) {
        var existingFn = merged[key];
        merged[key] = existingFn ? function () {
          existingFn.apply(void 0, arguments);
          value.apply(void 0, arguments);
        } : value;
      } else {
        merged[key] = value;
      }
    };
    for (var key in ps) {
      _loop();
    }
    return merged;
  }, {});
}

function handler() {
  var zIndexes = [];
  var generateZIndex = function generateZIndex(key, autoZIndex) {
    var baseZIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 999;
    var lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
    var newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
    zIndexes.push({
      key: key,
      value: newZIndex
    });
    return newZIndex;
  };
  var revertZIndex = function revertZIndex(zIndex) {
    zIndexes = zIndexes.filter(function (obj) {
      return obj.value !== zIndex;
    });
  };
  var getCurrentZIndex = function getCurrentZIndex(key, autoZIndex) {
    return getLastZIndex(key, autoZIndex).value;
  };
  var getLastZIndex = function getLastZIndex(key, autoZIndex) {
    var baseZIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _toConsumableArray$5(zIndexes).reverse().find(function (obj) {
      return autoZIndex ? true : obj.key === key;
    }) || {
      key: key,
      value: baseZIndex
    };
  };
  var getZIndex = function getZIndex(el) {
    return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
  };
  return {
    get: getZIndex,
    set: function set(key, el, autoZIndex, baseZIndex) {
      if (el) {
        el.style.zIndex = String(generateZIndex(key, autoZIndex, baseZIndex));
      }
    },
    clear: function clear(el) {
      if (el) {
        revertZIndex(ZIndexUtils.get(el));
        el.style.zIndex = '';
      }
    },
    getCurrent: function getCurrent(key, autoZIndex) {
      return getCurrentZIndex(key, autoZIndex);
    }
  };
}
var ZIndexUtils = handler();

var FilterMatchMode = Object.freeze({
  STARTS_WITH: 'startsWith',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  ENDS_WITH: 'endsWith',
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  IN: 'in',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  BETWEEN: 'between',
  DATE_IS: 'dateIs',
  DATE_IS_NOT: 'dateIsNot',
  DATE_BEFORE: 'dateBefore',
  DATE_AFTER: 'dateAfter',
  CUSTOM: 'custom'
});

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1$1(o)) || allowArrayLike) { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1$1(o, minLen); }
function _arrayLikeToArray$1$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var FilterService = {
  filter: function filter(value, fields, filterValue, filterMatchMode, filterLocale) {
    var filteredItems = [];
    if (!value) {
      return filteredItems;
    }
    var _iterator = _createForOfIteratorHelper(value),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (typeof item === 'string') {
          if (this.filters[filterMatchMode](item, filterValue, filterLocale)) {
            filteredItems.push(item);
            continue;
          }
        } else {
          var _iterator2 = _createForOfIteratorHelper(fields),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var field = _step2.value;
              var fieldValue = ObjectUtils.resolveFieldData(item, field);
              if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
                filteredItems.push(item);
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return filteredItems;
  },
  filters: {
    startsWith: function startsWith(value, filter, filterLocale) {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains: function contains(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains: function notContains(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith: function endsWith(value, filter, filterLocale) {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals: function equals(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() === filter.getTime();
      }
      return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) === ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    notEquals: function notEquals(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return true;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() !== filter.getTime();
      }
      return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) !== ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    "in": function _in(value, filter) {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      for (var i = 0; i < filter.length; i++) {
        if (ObjectUtils.equals(value, filter[i])) {
          return true;
        }
      }
      return false;
    },
    notIn: function notIn(value, filter) {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      for (var i = 0; i < filter.length; i++) {
        if (ObjectUtils.equals(value, filter[i])) {
          return false;
        }
      }
      return true;
    },
    between: function between(value, filter) {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime) {
        return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();
      }
      return filter[0] <= value && value <= filter[1];
    },
    lt: function lt(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() < filter.getTime();
      }
      return value < filter;
    },
    lte: function lte(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() <= filter.getTime();
      }
      return value <= filter;
    },
    gt: function gt(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() > filter.getTime();
      }
      return value > filter;
    },
    gte: function gte(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime) {
        return value.getTime() >= filter.getTime();
      }
      return value >= filter;
    },
    dateIs: function dateIs(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.toDateString() === filter.toDateString();
    },
    dateIsNot: function dateIsNot(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.toDateString() !== filter.toDateString();
    },
    dateBefore: function dateBefore(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.getTime() < filter.getTime();
    },
    dateAfter: function dateAfter(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.getTime() > filter.getTime();
    }
  },
  register: function register(rule, fn) {
    this.filters[rule] = fn;
  }
};

function _typeof$8(o) {
  "@babel/helpers - typeof";

  return _typeof$8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$8(o);
}

function _toPrimitive$8(input, hint) {
  if (_typeof$8(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$8(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$8(arg) {
  var key = _toPrimitive$8(arg, "string");
  return _typeof$8(key) === "symbol" ? key : String(key);
}

function _defineProperty$8(obj, key, value) {
  key = _toPropertyKey$8(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _createClass(Constructor, protoProps, staticProps) {
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * @deprecated please use PrimeReactContext
 */
var PrimeReact$1 = /*#__PURE__*/_createClass(function PrimeReact() {
  _classCallCheck(this, PrimeReact);
});
_defineProperty$8(PrimeReact$1, "ripple", false);
_defineProperty$8(PrimeReact$1, "inputStyle", 'outlined');
_defineProperty$8(PrimeReact$1, "locale", 'en');
_defineProperty$8(PrimeReact$1, "appendTo", null);
_defineProperty$8(PrimeReact$1, "cssTransition", true);
_defineProperty$8(PrimeReact$1, "autoZIndex", true);
_defineProperty$8(PrimeReact$1, "hideOverlaysOnDocumentScrolling", false);
_defineProperty$8(PrimeReact$1, "nonce", null);
_defineProperty$8(PrimeReact$1, "nullSortOrder", 1);
_defineProperty$8(PrimeReact$1, "zIndex", {
  modal: 1100,
  overlay: 1000,
  menu: 1000,
  tooltip: 1100,
  toast: 1200
});
_defineProperty$8(PrimeReact$1, "pt", undefined);
_defineProperty$8(PrimeReact$1, "filterMatchModeOptions", {
  text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
  numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
  date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
});
_defineProperty$8(PrimeReact$1, "changeTheme", function (currentTheme, newTheme, linkElementId, callback) {
  var _linkElement$parentNo;
  var linkElement = document.getElementById(linkElementId);
  if (!linkElement) {
    throw Error("Element with id ".concat(linkElementId, " not found."));
  }
  var newThemeUrl = linkElement.getAttribute('href').replace(currentTheme, newTheme);
  var newLinkElement = document.createElement('link');
  newLinkElement.setAttribute('rel', 'stylesheet');
  newLinkElement.setAttribute('id', linkElementId);
  newLinkElement.setAttribute('href', newThemeUrl);
  newLinkElement.addEventListener('load', function () {
    if (callback) {
      callback();
    }
  });
  (_linkElement$parentNo = linkElement.parentNode) === null || _linkElement$parentNo === void 0 || _linkElement$parentNo.replaceChild(newLinkElement, linkElement);
});
var locales = {
  en: {
    accept: 'Yes',
    addRule: 'Add Rule',
    am: 'AM',
    apply: 'Apply',
    cancel: 'Cancel',
    choose: 'Choose',
    chooseDate: 'Choose Date',
    chooseMonth: 'Choose Month',
    chooseYear: 'Choose Year',
    clear: 'Clear',
    completed: 'Completed',
    contains: 'Contains',
    custom: 'Custom',
    dateAfter: 'Date is after',
    dateBefore: 'Date is before',
    dateFormat: 'mm/dd/yy',
    dateIs: 'Date is',
    dateIsNot: 'Date is not',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    emptyFilterMessage: 'No results found',
    emptyMessage: 'No available options',
    emptySearchMessage: 'No results found',
    emptySelectionMessage: 'No selected item',
    endsWith: 'Ends with',
    equals: 'Equals',
    fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    filter: 'Filter',
    firstDayOfWeek: 0,
    gt: 'Greater than',
    gte: 'Greater than or equal to',
    lt: 'Less than',
    lte: 'Less than or equal to',
    matchAll: 'Match All',
    matchAny: 'Match Any',
    medium: 'Medium',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextDecade: 'Next Decade',
    nextHour: 'Next Hour',
    nextMinute: 'Next Minute',
    nextMonth: 'Next Month',
    nextSecond: 'Next Second',
    nextYear: 'Next Year',
    noFilter: 'No Filter',
    notContains: 'Not contains',
    notEquals: 'Not equals',
    now: 'Now',
    passwordPrompt: 'Enter a password',
    pending: 'Pending',
    pm: 'PM',
    prevDecade: 'Previous Decade',
    prevHour: 'Previous Hour',
    prevMinute: 'Previous Minute',
    prevMonth: 'Previous Month',
    prevSecond: 'Previous Second',
    prevYear: 'Previous Year',
    reject: 'No',
    removeRule: 'Remove Rule',
    searchMessage: '{0} results are available',
    selectionMessage: '{0} items selected',
    showMonthAfterYear: false,
    startsWith: 'Starts with',
    strong: 'Strong',
    today: 'Today',
    upload: 'Upload',
    weak: 'Weak',
    weekHeader: 'Wk',
    aria: {
      cancelEdit: 'Cancel Edit',
      close: 'Close',
      collapseRow: 'Row Collapsed',
      editRow: 'Edit Row',
      expandRow: 'Row Expanded',
      falseLabel: 'False',
      filterConstraint: 'Filter Constraint',
      filterOperator: 'Filter Operator',
      firstPageLabel: 'First Page',
      gridView: 'Grid View',
      hideFilterMenu: 'Hide Filter Menu',
      jumpToPageDropdownLabel: 'Jump to Page Dropdown',
      jumpToPageInputLabel: 'Jump to Page Input',
      lastPageLabel: 'Last Page',
      listView: 'List View',
      moveAllToSource: 'Move All to Source',
      moveAllToTarget: 'Move All to Target',
      moveBottom: 'Move Bottom',
      moveDown: 'Move Down',
      moveToSource: 'Move to Source',
      moveToTarget: 'Move to Target',
      moveTop: 'Move Top',
      moveUp: 'Move Up',
      navigation: 'Navigation',
      next: 'Next',
      nextPageLabel: 'Next Page',
      nullLabel: 'Not Selected',
      pageLabel: 'Page {page}',
      otpLabel: 'Please enter one time password character {0}',
      passwordHide: 'Hide Password',
      passwordShow: 'Show Password',
      previous: 'Previous',
      previousPageLabel: 'Previous Page',
      rotateLeft: 'Rotate Left',
      rotateRight: 'Rotate Right',
      rowsPerPageLabel: 'Rows per page',
      saveEdit: 'Save Edit',
      scrollTop: 'Scroll Top',
      selectAll: 'All items selected',
      selectRow: 'Row Selected',
      showFilterMenu: 'Show Filter Menu',
      slide: 'Slide',
      slideNumber: '{slideNumber}',
      star: '1 star',
      stars: '{star} stars',
      trueLabel: 'True',
      unselectAll: 'All items unselected',
      unselectRow: 'Row Unselected',
      zoomImage: 'Zoom Image',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out'
    }
  }
};
function localeOption(key, locale) {
  if (key.includes('__proto__') || key.includes('prototype')) {
    throw new Error('Unsafe key detected');
  }
  var _locale = PrimeReact$1.locale;
  try {
    return localeOptions(_locale)[key];
  } catch (error) {
    throw new Error("The ".concat(key, " option is not found in the current locale('").concat(_locale, "')."));
  }
}

/**
 * Find an ARIA label in the locale by key.  If options are passed it will replace all options:
 * ```ts
 * const ariaValue = "Page {page}, User {user}, Role {role}";
 * const options = { page: 2, user: "John", role: "Admin" };
 * const result = ariaLabel('yourLabel', { page: 2, user: "John", role: "Admin" })
 * console.log(result); // Output: Page 2, User John, Role Admin
 * ```
 * @param {string} ariaKey key of the ARIA label to look up in locale.
 * @param {any} options JSON options like { page: 2, user: "John", role: "Admin" }
 * @returns the ARIA label with replaced values
 */
function ariaLabel(ariaKey, options) {
  if (ariaKey.includes('__proto__') || ariaKey.includes('prototype')) {
    throw new Error('Unsafe ariaKey detected');
  }
  var _locale = PrimeReact$1.locale;
  try {
    var _ariaLabel = localeOptions(_locale).aria[ariaKey];
    if (_ariaLabel) {
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          _ariaLabel = _ariaLabel.replace("{".concat(key, "}"), options[key]);
        }
      }
    }
    return _ariaLabel;
  } catch (error) {
    throw new Error("The ".concat(ariaKey, " option is not found in the current locale('").concat(_locale, "')."));
  }
}
function localeOptions(locale) {
  var _locale = locale || PrimeReact$1.locale;
  if (_locale.includes('__proto__') || _locale.includes('prototype')) {
    throw new Error('Unsafe locale detected');
  }
  return locales[_locale];
}

var PrimeReactContext = /*#__PURE__*/React__default.createContext();

var PrimeReact = PrimeReact$1;

function _arrayWithHoles$5(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$5(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$7(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$7(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$7(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen);
}

function _nonIterableRest$5() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$5(arr, i) {
  return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$5();
}

var usePrevious = function usePrevious(newValue) {
  var ref = React.useRef(null);
  React.useEffect(function () {
    ref.current = newValue;
    return function () {
      ref.current = null;
    };
  }, [newValue]);
  return ref.current;
};

/* eslint-disable */
var useUnmountEffect = function useUnmountEffect(fn) {
  return React.useEffect(function () {
    return fn;
  }, []);
};
/* eslint-enable */

var useEventListener = function useEventListener(_ref) {
  var _ref$target = _ref.target,
    target = _ref$target === void 0 ? 'document' : _ref$target,
    type = _ref.type,
    listener = _ref.listener,
    options = _ref.options,
    _ref$when = _ref.when,
    when = _ref$when === void 0 ? true : _ref$when;
  var targetRef = React.useRef(null);
  var listenerRef = React.useRef(null);
  var prevListener = usePrevious(listener);
  var prevOptions = usePrevious(options);
  var bind = function bind() {
    var bindOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var bindTarget = bindOptions.target;
    if (ObjectUtils.isNotEmpty(bindTarget)) {
      unbind();
      (bindOptions.when || when) && (targetRef.current = DomHandler.getTargetElement(bindTarget));
    }
    if (!listenerRef.current && targetRef.current) {
      listenerRef.current = function (event) {
        return listener && listener(event);
      };
      targetRef.current.addEventListener(type, listenerRef.current, options);
    }
  };
  var unbind = function unbind() {
    if (listenerRef.current) {
      targetRef.current.removeEventListener(type, listenerRef.current, options);
      listenerRef.current = null;
    }
  };
  var dispose = function dispose() {
    unbind();
    // Prevent memory leak by releasing
    prevListener = null;
    prevOptions = null;
  };
  var updateTarget = React.useCallback(function () {
    if (when) {
      targetRef.current = DomHandler.getTargetElement(target);
    } else {
      unbind();
      targetRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, when]);
  React.useEffect(function () {
    updateTarget();
  }, [updateTarget]);
  React.useEffect(function () {
    var listenerChanged = "".concat(prevListener) !== "".concat(listener);
    var optionsChanged = prevOptions !== options;
    var listenerExists = listenerRef.current;
    if (listenerExists && (listenerChanged || optionsChanged)) {
      unbind();
      when && bind();
    } else if (!listenerExists) {
      dispose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, options, when]);
  useUnmountEffect(function () {
    dispose();
  });
  return [bind, unbind];
};

var useDebounce = function useDebounce(initialValue, delay) {
  var _React$useState = React.useState(initialValue),
    _React$useState2 = _slicedToArray$5(_React$useState, 2),
    inputValue = _React$useState2[0],
    setInputValue = _React$useState2[1];
  var _React$useState3 = React.useState(initialValue),
    _React$useState4 = _slicedToArray$5(_React$useState3, 2),
    debouncedValue = _React$useState4[0],
    setDebouncedValue = _React$useState4[1];
  var mountedRef = React.useRef(false);
  var timeoutRef = React.useRef(null);
  var cancelTimer = function cancelTimer() {
    return window.clearTimeout(timeoutRef.current);
  };
  useMountEffect(function () {
    mountedRef.current = true;
  });
  useUnmountEffect(function () {
    cancelTimer();
  });
  React.useEffect(function () {
    if (!mountedRef.current) {
      return;
    }
    cancelTimer();
    timeoutRef.current = window.setTimeout(function () {
      setDebouncedValue(inputValue);
    }, delay);
  }, [inputValue, delay]);
  return [inputValue, debouncedValue, setInputValue];
};

var groupToDisplayedElements = {};
var useDisplayOrder = function useDisplayOrder(group) {
  var isVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var _React$useState = React.useState(function () {
    return UniqueComponentId();
  }),
    _React$useState2 = _slicedToArray$5(_React$useState, 1),
    uid = _React$useState2[0];
  var _React$useState3 = React.useState(0),
    _React$useState4 = _slicedToArray$5(_React$useState3, 2),
    displayOrder = _React$useState4[0],
    setDisplayOrder = _React$useState4[1];
  React.useEffect(function () {
    if (isVisible) {
      if (!groupToDisplayedElements[group]) {
        groupToDisplayedElements[group] = [];
      }
      var newDisplayOrder = groupToDisplayedElements[group].push(uid);
      setDisplayOrder(newDisplayOrder);
      return function () {
        delete groupToDisplayedElements[group][newDisplayOrder - 1];

        // Reduce array length, by removing undefined elements at the end of array:
        var lastIndex = groupToDisplayedElements[group].length - 1;
        var lastOrder = ObjectUtils.findLastIndex(groupToDisplayedElements[group], function (el) {
          return el !== undefined;
        });
        if (lastOrder !== lastIndex) {
          groupToDisplayedElements[group].splice(lastOrder + 1);
        }
        setDisplayOrder(undefined);
      };
    }
  }, [group, uid, isVisible]);
  return displayOrder;
};

function _arrayWithoutHoles$4(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$7(arr);
}

function _iterableToArray$4(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread$4() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray$4(arr) {
  return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _unsupportedIterableToArray$7(arr) || _nonIterableSpread$4();
}

/**
 * Priorities of different components (bigger number handled first)
 */
var ESC_KEY_HANDLING_PRIORITIES = {
  DIALOG: 300,
  PASSWORD: 700,
  TOOLTIP: 1200
};

/**
 * Object, that manages global escape key handling logic
 */
var globalEscKeyHandlingLogic = {
  /**
   * Mapping from ESC_KEY_HANDLING_PRIORITY to array of related listeners, grouped by priority
   * @example
   * Map<{
   *     [ESC_KEY_HANDLING_PRIORITIES.SIDEBAR]: Map<{
   *         1: () => {...},
   *         2: () => {...}
   *     }>,
   *     [ESC_KEY_HANDLING_PRIORITIES.DIALOG]: Map<{
   *         1: () => {...},
   *         2: () => {...}
   *     }>
   * }>;
   */
  escKeyListeners: new Map(),
  /**
   * Keydown handler (attached to any keydown)
   */
  onGlobalKeyDown: function onGlobalKeyDown(event) {
    // Do nothing if not an "esc" key is pressed:
    if (event.code !== 'Escape') {
      return;
    }
    var escKeyListeners = globalEscKeyHandlingLogic.escKeyListeners;
    var maxPrimaryPriority = Math.max.apply(Math, _toConsumableArray$4(escKeyListeners.keys()));
    var theMostImportantEscHandlersSet = escKeyListeners.get(maxPrimaryPriority);
    var maxSecondaryPriority = Math.max.apply(Math, _toConsumableArray$4(theMostImportantEscHandlersSet.keys()));
    var theMostImportantEscHandler = theMostImportantEscHandlersSet.get(maxSecondaryPriority);
    theMostImportantEscHandler(event);
  },
  /**
   * Attach global keydown listener if there are any "esc" key handlers assigned,
   * otherwise detach.
   */
  refreshGlobalKeyDownListener: function refreshGlobalKeyDownListener() {
    var document = DomHandler.getTargetElement('document');
    if (this.escKeyListeners.size > 0) {
      document.addEventListener('keydown', this.onGlobalKeyDown);
    } else {
      document.removeEventListener('keydown', this.onGlobalKeyDown);
    }
  },
  /**
   * Add "Esc" key handler
   */
  addListener: function addListener(callback, _ref) {
    var _this = this;
    var _ref2 = _slicedToArray$5(_ref, 2),
      primaryPriority = _ref2[0],
      secondaryPriority = _ref2[1];
    var escKeyListeners = this.escKeyListeners;
    if (!escKeyListeners.has(primaryPriority)) {
      escKeyListeners.set(primaryPriority, new Map());
    }
    var primaryPriorityListeners = escKeyListeners.get(primaryPriority);

    // To prevent unexpected override of callback:
    if (primaryPriorityListeners.has(secondaryPriority)) {
      throw new Error("Unexpected: global esc key listener with priority [".concat(primaryPriority, ", ").concat(secondaryPriority, "] already exists."));
    }
    primaryPriorityListeners.set(secondaryPriority, callback);
    this.refreshGlobalKeyDownListener();
    return function () {
      primaryPriorityListeners["delete"](secondaryPriority);
      if (primaryPriorityListeners.size === 0) {
        escKeyListeners["delete"](primaryPriority);
      }
      _this.refreshGlobalKeyDownListener();
    };
  }
};
var useGlobalOnEscapeKey = function useGlobalOnEscapeKey(_ref3) {
  var callback = _ref3.callback,
    when = _ref3.when,
    priority = _ref3.priority;
  useEffect(function () {
    if (!when) {
      return;
    }
    return globalEscKeyHandlingLogic.addListener(callback, priority);
  }, [callback, when, priority]);
};
/* eslint-enable */

/**
 * Hook to merge properties including custom merge function for things like Tailwind merge.
 */
var useMergeProps = function useMergeProps() {
  var context = useContext(PrimeReactContext);
  return function () {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }
    return mergeProps(props, context === null || context === void 0 ? void 0 : context.ptOptions);
  };
};

/* eslint-disable */

/**
 * Custom hook to run a mount effect only once.
 * @param {*} fn the callback function
 * @returns the hook
 */
var useMountEffect = function useMountEffect(fn) {
  var mounted = React.useRef(false);
  return React.useEffect(function () {
    if (!mounted.current) {
      mounted.current = true;
      return fn && fn();
    }
  }, []);
};

var useOverlayScrollListener = function useOverlayScrollListener(_ref) {
  var target = _ref.target,
    listener = _ref.listener,
    options = _ref.options,
    _ref$when = _ref.when,
    when = _ref$when === void 0 ? true : _ref$when;
  var context = React.useContext(PrimeReactContext);
  var targetRef = React.useRef(null);
  var listenerRef = React.useRef(null);
  var scrollableParentsRef = React.useRef([]);
  var prevListener = usePrevious(listener);
  var prevOptions = usePrevious(options);
  var bind = function bind() {
    var bindOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (ObjectUtils.isNotEmpty(bindOptions.target)) {
      unbind();
      (bindOptions.when || when) && (targetRef.current = DomHandler.getTargetElement(bindOptions.target));
    }
    if (!listenerRef.current && targetRef.current) {
      var hideOnScroll = context ? context.hideOverlaysOnDocumentScrolling : PrimeReact.hideOverlaysOnDocumentScrolling;
      var nodes = scrollableParentsRef.current = DomHandler.getScrollableParents(targetRef.current, hideOnScroll);
      listenerRef.current = function (event) {
        return listener && listener(event);
      };
      nodes.forEach(function (node) {
        return node.addEventListener('scroll', listenerRef.current, options);
      });
    }
  };
  var unbind = function unbind() {
    if (listenerRef.current) {
      var nodes = scrollableParentsRef.current;
      nodes.forEach(function (node) {
        return node.removeEventListener('scroll', listenerRef.current, options);
      });
      listenerRef.current = null;
    }
  };
  var dispose = function dispose() {
    unbind();
    // #5927 prevent memory leak by releasing
    scrollableParentsRef.current = null;
    prevListener = null;
    prevOptions = null;
  };
  var updateTarget = React.useCallback(function () {
    if (when) {
      targetRef.current = DomHandler.getTargetElement(target);
    } else {
      unbind();
      targetRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, when]);
  React.useEffect(function () {
    updateTarget();
  }, [updateTarget]);
  React.useEffect(function () {
    var listenerChanged = "".concat(prevListener) !== "".concat(listener);
    var optionsChanged = prevOptions !== options;
    var listenerExists = listenerRef.current;
    if (listenerExists && (listenerChanged || optionsChanged)) {
      unbind();
      when && bind();
    } else if (!listenerExists) {
      dispose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, options, when]);
  useUnmountEffect(function () {
    dispose();
  });
  return [bind, unbind];
};

var useResizeListener = function useResizeListener(_ref) {
  var listener = _ref.listener,
    _ref$when = _ref.when,
    when = _ref$when === void 0 ? true : _ref$when;
  return useEventListener({
    target: 'window',
    type: 'resize',
    listener: listener,
    when: when
  });
};

var useOverlayListener = function useOverlayListener(_ref) {
  var target = _ref.target,
    overlay = _ref.overlay,
    _listener = _ref.listener,
    _ref$when = _ref.when,
    when = _ref$when === void 0 ? true : _ref$when,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'click' : _ref$type;
  var targetRef = React.useRef(null);
  var overlayRef = React.useRef(null);

  /**
   * The parameters of the 'listener' method in the following event handlers;
   * @param {Event} event A click event of the document.
   * @param {string} options.type The custom type to detect event.
   * @param {boolean} options.valid It is controlled by PrimeReact. It is determined whether it is valid or not according to some custom validation.
   */
  var _useEventListener = useEventListener({
    target: 'window',
    type: type,
    listener: function listener(event) {
      _listener && _listener(event, {
        type: 'outside',
        valid: event.which !== 3 && isOutsideClicked(event)
      });
    }
  }),
    _useEventListener2 = _slicedToArray$5(_useEventListener, 2),
    bindDocumentClickListener = _useEventListener2[0],
    unbindDocumentClickListener = _useEventListener2[1];
  var _useResizeListener = useResizeListener({
    listener: function listener(event) {
      _listener && _listener(event, {
        type: 'resize',
        valid: !DomHandler.isTouchDevice()
      });
    }
  }),
    _useResizeListener2 = _slicedToArray$5(_useResizeListener, 2),
    bindWindowResizeListener = _useResizeListener2[0],
    unbindWindowResizeListener = _useResizeListener2[1];
  var _useEventListener3 = useEventListener({
    target: 'window',
    type: 'orientationchange',
    listener: function listener(event) {
      _listener && _listener(event, {
        type: 'orientationchange',
        valid: true
      });
    }
  }),
    _useEventListener4 = _slicedToArray$5(_useEventListener3, 2),
    bindWindowOrientationChangeListener = _useEventListener4[0],
    unbindWindowOrientationChangeListener = _useEventListener4[1];
  var _useOverlayScrollList = useOverlayScrollListener({
    target: target,
    listener: function listener(event) {
      _listener && _listener(event, {
        type: 'scroll',
        valid: true
      });
    }
  }),
    _useOverlayScrollList2 = _slicedToArray$5(_useOverlayScrollList, 2),
    bindOverlayScrollListener = _useOverlayScrollList2[0],
    unbindOverlayScrollListener = _useOverlayScrollList2[1];
  var isOutsideClicked = function isOutsideClicked(event) {
    return targetRef.current && !(targetRef.current.isSameNode(event.target) || targetRef.current.contains(event.target) || overlayRef.current && overlayRef.current.contains(event.target));
  };
  var bind = function bind() {
    bindDocumentClickListener();
    bindWindowResizeListener();
    bindWindowOrientationChangeListener();
    bindOverlayScrollListener();
  };
  var unbind = function unbind() {
    unbindDocumentClickListener();
    unbindWindowResizeListener();
    unbindWindowOrientationChangeListener();
    unbindOverlayScrollListener();
  };
  React.useEffect(function () {
    if (when) {
      targetRef.current = DomHandler.getTargetElement(target);
      overlayRef.current = DomHandler.getTargetElement(overlay);
    } else {
      unbind();
      targetRef.current = overlayRef.current = null;
    }
  }, [target, overlay, when]);
  useUnmountEffect(function () {
    unbind();
  });
  return [bind, unbind];
};
/* eslint-enable */

var _id = 0;
var useStyle = function useStyle(css) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _useState = useState(false),
    _useState2 = _slicedToArray$5(_useState, 2),
    isLoaded = _useState2[0],
    setIsLoaded = _useState2[1];
  var styleRef = useRef(null);
  var context = useContext(PrimeReactContext);
  var defaultDocument = DomHandler.isClient() ? window.document : undefined;
  var _options$document = options.document,
    document = _options$document === void 0 ? defaultDocument : _options$document,
    _options$manual = options.manual,
    manual = _options$manual === void 0 ? false : _options$manual,
    _options$name = options.name,
    name = _options$name === void 0 ? "style_".concat(++_id) : _options$name,
    _options$id = options.id,
    id = _options$id === void 0 ? undefined : _options$id,
    _options$media = options.media,
    media = _options$media === void 0 ? undefined : _options$media;
  var getCurrentStyleRef = function getCurrentStyleRef(styleContainer) {
    var existingStyle = styleContainer.querySelector("style[data-primereact-style-id=\"".concat(name, "\"]"));
    if (existingStyle) {
      return existingStyle;
    }
    if (id !== undefined) {
      var existingElement = document.getElementById(id);
      if (existingElement) {
        return existingElement;
      }
    }

    // finally if not found create the new style
    return document.createElement('style');
  };
  var update = function update(newCSS) {
    isLoaded && css !== newCSS && (styleRef.current.textContent = newCSS);
  };
  var load = function load() {
    if (!document || isLoaded) {
      return;
    }
    var styleContainer = (context === null || context === void 0 ? void 0 : context.styleContainer) || document.head;
    styleRef.current = getCurrentStyleRef(styleContainer);
    if (!styleRef.current.isConnected) {
      styleRef.current.type = 'text/css';
      if (id) {
        styleRef.current.id = id;
      }
      if (media) {
        styleRef.current.media = media;
      }
      DomHandler.addNonce(styleRef.current, context && context.nonce || PrimeReact.nonce);
      styleContainer.appendChild(styleRef.current);
      if (name) {
        styleRef.current.setAttribute('data-primereact-style-id', name);
      }
    }
    styleRef.current.textContent = css;
    setIsLoaded(true);
  };
  var unload = function unload() {
    if (!document || !styleRef.current) {
      return;
    }
    DomHandler.removeInlineStyle(styleRef.current);
    setIsLoaded(false);
  };
  useEffect(function () {
    if (!manual) {
      load();
    }

    // return () => {if (!manual) unload()}; /* @todo */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual]);
  return {
    id: id,
    name: name,
    update: update,
    unload: unload,
    load: load,
    isLoaded: isLoaded
  };
};
/* eslint-enable */

/* eslint-disable */
var useUpdateEffect = function useUpdateEffect(fn, deps) {
  var mounted = React.useRef(false);
  return React.useEffect(function () {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    return fn && fn();
  }, deps);
};

function _arrayLikeToArray$6(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles$3(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$6(arr);
}

function _iterableToArray$3(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$6(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$6(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen);
}

function _nonIterableSpread$3() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray$3(arr) {
  return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$6(arr) || _nonIterableSpread$3();
}

function _typeof$7(o) {
  "@babel/helpers - typeof";

  return _typeof$7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$7(o);
}

function _toPrimitive$7(input, hint) {
  if (_typeof$7(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$7(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$7(arg) {
  var key = _toPrimitive$7(arg, "string");
  return _typeof$7(key) === "symbol" ? key : String(key);
}

function _defineProperty$7(obj, key, value) {
  key = _toPropertyKey$7(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys$9(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$9(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$9(Object(t), true).forEach(function (r) { _defineProperty$7(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$9(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var baseStyle = "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    opacity: 0;\n    overflow: hidden;\n    padding: 0;\n    pointer-events: none;\n    position: absolute;\n    white-space: nowrap;\n    width: 1px;\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n    padding-right: var(--scrollbar-width);\n}\n";
var buttonStyles = "\n.p-button {\n    margin: 0;\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    align-items: center;\n    vertical-align: bottom;\n    text-align: center;\n    overflow: hidden;\n    position: relative;\n}\n\n.p-button-label {\n    flex: 1 1 auto;\n}\n\n.p-button-icon-right {\n    order: 1;\n}\n\n.p-button:disabled {\n    cursor: default;\n}\n\n.p-button-icon-only {\n    justify-content: center;\n}\n\n.p-button-icon-only .p-button-label {\n    visibility: hidden;\n    width: 0;\n    flex: 0 0 auto;\n}\n\n.p-button-vertical {\n    flex-direction: column;\n}\n\n.p-button-icon-bottom {\n    order: 2;\n}\n\n.p-button-group .p-button {\n    margin: 0;\n}\n\n.p-button-group .p-button:not(:last-child) {\n    border-right: 0 none;\n}\n\n.p-button-group .p-button:not(:first-of-type):not(:last-of-type) {\n    border-radius: 0;\n}\n\n.p-button-group .p-button:first-of-type {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.p-button-group .p-button:last-of-type {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n.p-button-group .p-button:focus {\n    position: relative;\n    z-index: 1;\n}\n";
var inputTextStyles = "\n.p-inputtext {\n    margin: 0;\n}\n\n.p-fluid .p-inputtext {\n    width: 100%;\n}\n\n/* InputGroup */\n.p-inputgroup {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup-addon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-inputgroup .p-float-label {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup .p-inputtext,\n.p-fluid .p-inputgroup .p-inputtext,\n.p-inputgroup .p-inputwrapper,\n.p-fluid .p-inputgroup .p-input {\n    flex: 1 1 auto;\n    width: 1%;\n}\n\n/* Floating Label */\n.p-float-label {\n    display: block;\n    position: relative;\n}\n\n.p-float-label label {\n    position: absolute;\n    pointer-events: none;\n    top: 50%;\n    margin-top: -0.5rem;\n    transition-property: all;\n    transition-timing-function: ease;\n    line-height: 1;\n}\n\n.p-float-label textarea ~ label,\n.p-float-label .p-mention ~ label {\n    top: 1rem;\n}\n\n.p-float-label input:focus ~ label,\n.p-float-label input:-webkit-autofill ~ label,\n.p-float-label input.p-filled ~ label,\n.p-float-label textarea:focus ~ label,\n.p-float-label textarea.p-filled ~ label,\n.p-float-label .p-inputwrapper-focus ~ label,\n.p-float-label .p-inputwrapper-filled ~ label,\n.p-float-label .p-tooltip-target-wrapper ~ label {\n    top: -0.75rem;\n    font-size: 12px;\n}\n\n.p-float-label .p-placeholder,\n.p-float-label input::placeholder,\n.p-float-label .p-inputtext::placeholder {\n    opacity: 0;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-float-label .p-focus .p-placeholder,\n.p-float-label input:focus::placeholder,\n.p-float-label .p-inputtext:focus::placeholder {\n    opacity: 1;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-input-icon-left,\n.p-input-icon-right {\n    position: relative;\n    display: inline-block;\n}\n\n.p-input-icon-left > i,\n.p-input-icon-right > i,\n.p-input-icon-left > svg,\n.p-input-icon-right > svg,\n.p-input-icon-left > .p-input-prefix,\n.p-input-icon-right > .p-input-suffix {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n\n.p-fluid .p-input-icon-left,\n.p-fluid .p-input-icon-right {\n    display: block;\n    width: 100%;\n}\n";
var iconStyles = "\n.p-icon {\n    display: inline-block;\n}\n\n.p-icon-spin {\n    -webkit-animation: p-icon-spin 2s infinite linear;\n    animation: p-icon-spin 2s infinite linear;\n}\n\nsvg.p-icon {\n    pointer-events: auto;\n}\n\nsvg.p-icon g,\n.p-disabled svg.p-icon {\n    pointer-events: none;\n}\n\n@-webkit-keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n\n@keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n";
var commonStyle = "\n@layer primereact {\n    .p-component, .p-component * {\n        box-sizing: border-box;\n    }\n\n    .p-hidden {\n        display: none;\n    }\n\n    .p-hidden-space {\n        visibility: hidden;\n    }\n\n    .p-reset {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        outline: 0;\n        text-decoration: none;\n        font-size: 100%;\n        list-style: none;\n    }\n\n    .p-disabled, .p-disabled * {\n        cursor: default;\n        pointer-events: none;\n        user-select: none;\n    }\n\n    .p-component-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n\n    .p-unselectable-text {\n        user-select: none;\n    }\n\n    .p-scrollbar-measure {\n        width: 100px;\n        height: 100px;\n        overflow: scroll;\n        position: absolute;\n        top: -9999px;\n    }\n\n    @-webkit-keyframes p-fadein {\n      0%   { opacity: 0; }\n      100% { opacity: 1; }\n    }\n    @keyframes p-fadein {\n      0%   { opacity: 0; }\n      100% { opacity: 1; }\n    }\n\n    .p-link {\n        text-align: left;\n        background-color: transparent;\n        margin: 0;\n        padding: 0;\n        border: none;\n        cursor: pointer;\n        user-select: none;\n    }\n\n    .p-link:disabled {\n        cursor: default;\n    }\n\n    /* Non react overlay animations */\n    .p-connected-overlay {\n        opacity: 0;\n        transform: scaleY(0.8);\n        transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n    }\n\n    .p-connected-overlay-visible {\n        opacity: 1;\n        transform: scaleY(1);\n    }\n\n    .p-connected-overlay-hidden {\n        opacity: 0;\n        transform: scaleY(1);\n        transition: opacity .1s linear;\n    }\n\n    /* React based overlay animations */\n    .p-connected-overlay-enter {\n        opacity: 0;\n        transform: scaleY(0.8);\n    }\n\n    .p-connected-overlay-enter-active {\n        opacity: 1;\n        transform: scaleY(1);\n        transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n    }\n\n    .p-connected-overlay-enter-done {\n        transform: none;\n    }\n\n    .p-connected-overlay-exit {\n        opacity: 1;\n    }\n\n    .p-connected-overlay-exit-active {\n        opacity: 0;\n        transition: opacity .1s linear;\n    }\n\n    /* Toggleable Content */\n    .p-toggleable-content-enter {\n        max-height: 0;\n    }\n\n    .p-toggleable-content-enter-active {\n        overflow: hidden;\n        max-height: 1000px;\n        transition: max-height 1s ease-in-out;\n    }\n\n    .p-toggleable-content-enter-done {\n        transform: none;\n    }\n\n    .p-toggleable-content-exit {\n        max-height: 1000px;\n    }\n\n    .p-toggleable-content-exit-active {\n        overflow: hidden;\n        max-height: 0;\n        transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);\n    }\n\n    /* @todo Refactor */\n    .p-menu .p-menuitem-link {\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        text-decoration: none;\n        overflow: hidden;\n        position: relative;\n    }\n\n    ".concat(buttonStyles, "\n    ").concat(inputTextStyles, "\n    ").concat(iconStyles, "\n}\n");
var ComponentBase = {
  cProps: undefined,
  cParams: undefined,
  cName: undefined,
  defaultProps: {
    pt: undefined,
    ptOptions: undefined,
    unstyled: false
  },
  context: {},
  globalCSS: undefined,
  classes: {},
  styles: '',
  extend: function extend() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var css = props.css;
    var defaultProps = _objectSpread$9(_objectSpread$9({}, props.defaultProps), ComponentBase.defaultProps);
    var inlineStyles = {};
    var getProps = function getProps(props) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ComponentBase.context = context;
      ComponentBase.cProps = props;
      return ObjectUtils.getMergedProps(props, defaultProps);
    };
    var getOtherProps = function getOtherProps(props) {
      return ObjectUtils.getDiffProps(props, defaultProps);
    };
    var getPTValue = function getPTValue() {
      var _ComponentBase$contex;
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var searchInDefaultPT = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      // obj either is the passthrough options or has a .pt property.
      if (obj.hasOwnProperty('pt') && obj.pt !== undefined) {
        obj = obj.pt;
      }
      var originalkey = key;
      var isNestedParam = /./g.test(originalkey) && !!params[originalkey.split('.')[0]];
      var fkey = isNestedParam ? ObjectUtils.toFlatCase(originalkey.split('.')[1]) : ObjectUtils.toFlatCase(originalkey);
      var hostName = params.hostName && ObjectUtils.toFlatCase(params.hostName);
      var componentName = hostName || params.props && params.props.__TYPE && ObjectUtils.toFlatCase(params.props.__TYPE) || '';
      var isTransition = fkey === 'transition';
      var datasetPrefix = 'data-pc-';
      var _getHostInstance = function getHostInstance(params) {
        return params !== null && params !== void 0 && params.props ? params.hostName ? params.props.__TYPE === params.hostName ? params.props : _getHostInstance(params.parent) : params.parent : undefined;
      };
      var getPropValue = function getPropValue(name) {
        var _params$props, _getHostInstance2;
        return ((_params$props = params.props) === null || _params$props === void 0 ? void 0 : _params$props[name]) || ((_getHostInstance2 = _getHostInstance(params)) === null || _getHostInstance2 === void 0 ? void 0 : _getHostInstance2[name]);
      };
      ComponentBase.cParams = params;
      ComponentBase.cName = componentName;
      var _ref = getPropValue('ptOptions') || ComponentBase.context.ptOptions || {},
        _ref$mergeSections = _ref.mergeSections,
        mergeSections = _ref$mergeSections === void 0 ? true : _ref$mergeSections,
        _ref$mergeProps = _ref.mergeProps,
        useMergeProps = _ref$mergeProps === void 0 ? false : _ref$mergeProps;
      var getPTClassValue = function getPTClassValue() {
        var value = _getOptionValue.apply(void 0, arguments);
        if (Array.isArray(value)) {
          return {
            className: classNames.apply(void 0, _toConsumableArray$3(value))
          };
        }
        if (ObjectUtils.isString(value)) {
          return {
            className: value
          };
        }
        if (value !== null && value !== void 0 && value.hasOwnProperty('className') && Array.isArray(value.className)) {
          return {
            className: classNames.apply(void 0, _toConsumableArray$3(value.className))
          };
        }
        return value;
      };
      var globalPT = searchInDefaultPT ? isNestedParam ? _useGlobalPT(getPTClassValue, originalkey, params) : _useDefaultPT(getPTClassValue, originalkey, params) : undefined;
      var self = isNestedParam ? undefined : _usePT(_getPT(obj, componentName), getPTClassValue, originalkey, params);
      var datasetProps = !isTransition && _objectSpread$9(_objectSpread$9({}, fkey === 'root' && _defineProperty$7({}, "".concat(datasetPrefix, "name"), params.props && params.props.__parentMetadata ? ObjectUtils.toFlatCase(params.props.__TYPE) : componentName)), {}, _defineProperty$7({}, "".concat(datasetPrefix, "section"), fkey));
      return mergeSections || !mergeSections && self ? useMergeProps ? mergeProps([globalPT, self, Object.keys(datasetProps).length ? datasetProps : {}], {
        classNameMergeFunction: (_ComponentBase$contex = ComponentBase.context.ptOptions) === null || _ComponentBase$contex === void 0 ? void 0 : _ComponentBase$contex.classNameMergeFunction
      }) : _objectSpread$9(_objectSpread$9(_objectSpread$9({}, globalPT), self), Object.keys(datasetProps).length ? datasetProps : {}) : _objectSpread$9(_objectSpread$9({}, self), Object.keys(datasetProps).length ? datasetProps : {});
    };
    var setMetaData = function setMetaData() {
      var metadata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var props = metadata.props,
        state = metadata.state;
      var ptm = function ptm() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return getPTValue((props || {}).pt, key, _objectSpread$9(_objectSpread$9({}, metadata), params));
      };
      var ptmo = function ptmo() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return getPTValue(obj, key, params, false);
      };
      var isUnstyled = function isUnstyled() {
        return ComponentBase.context.unstyled || PrimeReact.unstyled || props.unstyled;
      };
      var cx = function cx() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return !isUnstyled() ? _getOptionValue(css && css.classes, key, _objectSpread$9({
          props: props,
          state: state
        }, params)) : undefined;
      };
      var sx = function sx() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var when = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        if (when) {
          var _ComponentBase$contex2;
          var self = _getOptionValue(css && css.inlineStyles, key, _objectSpread$9({
            props: props,
            state: state
          }, params));
          var base = _getOptionValue(inlineStyles, key, _objectSpread$9({
            props: props,
            state: state
          }, params));
          return mergeProps([base, self], {
            classNameMergeFunction: (_ComponentBase$contex2 = ComponentBase.context.ptOptions) === null || _ComponentBase$contex2 === void 0 ? void 0 : _ComponentBase$contex2.classNameMergeFunction
          });
        }
        return undefined;
      };
      return {
        ptm: ptm,
        ptmo: ptmo,
        sx: sx,
        cx: cx,
        isUnstyled: isUnstyled
      };
    };
    return _objectSpread$9(_objectSpread$9({
      getProps: getProps,
      getOtherProps: getOtherProps,
      setMetaData: setMetaData
    }, props), {}, {
      defaultProps: defaultProps
    });
  }
};
var _getOptionValue = function getOptionValue(obj) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var fKeys = String(ObjectUtils.toFlatCase(key)).split('.');
  var fKey = fKeys.shift();
  var matchedPTOption = ObjectUtils.isNotEmpty(obj) ? Object.keys(obj).find(function (k) {
    return ObjectUtils.toFlatCase(k) === fKey;
  }) : '';
  return fKey ? ObjectUtils.isObject(obj) ? _getOptionValue(ObjectUtils.getItemValue(obj[matchedPTOption], params), fKeys.join('.'), params) : undefined : ObjectUtils.getItemValue(obj, params);
};
var _getPT = function _getPT(pt) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  var _usept = pt === null || pt === void 0 ? void 0 : pt._usept;
  var getValue = function getValue(value) {
    var _ref3;
    var checkSameKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var _value = callback ? callback(value) : value;
    var _key = ObjectUtils.toFlatCase(key);
    return (_ref3 = checkSameKey ? _key !== ComponentBase.cName ? _value === null || _value === void 0 ? void 0 : _value[_key] : undefined : _value === null || _value === void 0 ? void 0 : _value[_key]) !== null && _ref3 !== void 0 ? _ref3 : _value;
  };
  return ObjectUtils.isNotEmpty(_usept) ? {
    _usept: _usept,
    originalValue: getValue(pt.originalValue),
    value: getValue(pt.value)
  } : getValue(pt, true);
};
var _usePT = function _usePT(pt, callback, key, params) {
  var fn = function fn(value) {
    return callback(value, key, params);
  };
  if (pt !== null && pt !== void 0 && pt.hasOwnProperty('_usept')) {
    var _ref4 = pt._usept || ComponentBase.context.ptOptions || {},
      _ref4$mergeSections = _ref4.mergeSections,
      mergeSections = _ref4$mergeSections === void 0 ? true : _ref4$mergeSections,
      _ref4$mergeProps = _ref4.mergeProps,
      useMergeProps = _ref4$mergeProps === void 0 ? false : _ref4$mergeProps,
      classNameMergeFunction = _ref4.classNameMergeFunction;
    var originalValue = fn(pt.originalValue);
    var value = fn(pt.value);
    if (originalValue === undefined && value === undefined) {
      return undefined;
    } else if (ObjectUtils.isString(value)) {
      return value;
    } else if (ObjectUtils.isString(originalValue)) {
      return originalValue;
    }
    return mergeSections || !mergeSections && value ? useMergeProps ? mergeProps([originalValue, value], {
      classNameMergeFunction: classNameMergeFunction
    }) : _objectSpread$9(_objectSpread$9({}, originalValue), value) : value;
  }
  return fn(pt);
};
var getGlobalPT = function getGlobalPT() {
  return _getPT(ComponentBase.context.pt || PrimeReact.pt, undefined, function (value) {
    return ObjectUtils.getItemValue(value, ComponentBase.cParams);
  });
};
var getDefaultPT = function getDefaultPT() {
  return _getPT(ComponentBase.context.pt || PrimeReact.pt, undefined, function (value) {
    return _getOptionValue(value, ComponentBase.cName, ComponentBase.cParams) || ObjectUtils.getItemValue(value, ComponentBase.cParams);
  });
};
var _useGlobalPT = function _useGlobalPT(callback, key, params) {
  return _usePT(getGlobalPT(), callback, key, params);
};
var _useDefaultPT = function _useDefaultPT(callback, key, params) {
  return _usePT(getDefaultPT(), callback, key, params);
};
var useHandleStyle = function useHandleStyle(styles) {
  var config = arguments.length > 2 ? arguments[2] : undefined;
  var name = config.name,
    _config$styled = config.styled,
    styled = _config$styled === void 0 ? false : _config$styled,
    _config$hostName = config.hostName,
    hostName = _config$hostName === void 0 ? '' : _config$hostName;
  var globalCSS = _useGlobalPT(_getOptionValue, 'global.css', ComponentBase.cParams);
  var componentName = ObjectUtils.toFlatCase(name);
  var _useStyle = useStyle(baseStyle, {
    name: 'base',
    manual: true
  }),
    loadBaseStyle = _useStyle.load;
  var _useStyle2 = useStyle(commonStyle, {
    name: 'common',
    manual: true
  }),
    loadCommonStyle = _useStyle2.load;
  var _useStyle3 = useStyle(globalCSS, {
    name: 'global',
    manual: true
  }),
    loadGlobalStyle = _useStyle3.load;
  var _useStyle4 = useStyle(styles, {
    name: name,
    manual: true
  }),
    load = _useStyle4.load;
  var hook = function hook(hookName) {
    if (!hostName) {
      var selfHook = _usePT(_getPT((ComponentBase.cProps || {}).pt, componentName), _getOptionValue, "hooks.".concat(hookName));
      var defaultHook = _useDefaultPT(_getOptionValue, "hooks.".concat(hookName));
      selfHook === null || selfHook === void 0 || selfHook();
      defaultHook === null || defaultHook === void 0 || defaultHook();
    }
  };
  hook('useMountEffect');
  useMountEffect(function () {
    loadBaseStyle();
    loadGlobalStyle();
    loadCommonStyle();
    if (!styled) {
      load();
    }
  });
  useUpdateEffect(function () {
    hook('useUpdateEffect');
  });
  useUnmountEffect(function () {
    hook('useUnmountEffect');
  });
};

function _typeof$6(o) {
  "@babel/helpers - typeof";

  return _typeof$6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$6(o);
}

function _toPrimitive$6(input, hint) {
  if (_typeof$6(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$6(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$6(arg) {
  var key = _toPrimitive$6(arg, "string");
  return _typeof$6(key) === "symbol" ? key : String(key);
}

function _defineProperty$6(obj, key, value) {
  key = _toPropertyKey$6(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var CSSTransitionBase = {
  defaultProps: {
    __TYPE: 'CSSTransition',
    children: undefined
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, CSSTransitionBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, CSSTransitionBase.defaultProps);
  }
};

function ownKeys$8(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$8(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$8(Object(t), true).forEach(function (r) { _defineProperty$6(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var CSSTransition = /*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var props = CSSTransitionBase.getProps(inProps);
  var context = React.useContext(PrimeReactContext);
  var disabled = props.disabled || props.options && props.options.disabled || context && !context.cssTransition || !PrimeReact.cssTransition;
  var onEnter = function onEnter(node, isAppearing) {
    props.onEnter && props.onEnter(node, isAppearing); // component
    props.options && props.options.onEnter && props.options.onEnter(node, isAppearing); // user option
  };
  var onEntering = function onEntering(node, isAppearing) {
    props.onEntering && props.onEntering(node, isAppearing); // component
    props.options && props.options.onEntering && props.options.onEntering(node, isAppearing); // user option
  };
  var onEntered = function onEntered(node, isAppearing) {
    props.onEntered && props.onEntered(node, isAppearing); // component
    props.options && props.options.onEntered && props.options.onEntered(node, isAppearing); // user option
  };
  var onExit = function onExit(node) {
    props.onExit && props.onExit(node); // component
    props.options && props.options.onExit && props.options.onExit(node); // user option
  };
  var onExiting = function onExiting(node) {
    props.onExiting && props.onExiting(node); // component
    props.options && props.options.onExiting && props.options.onExiting(node); // user option
  };
  var onExited = function onExited(node) {
    props.onExited && props.onExited(node); // component
    props.options && props.options.onExited && props.options.onExited(node); // user option
  };
  useUpdateEffect(function () {
    if (disabled) {
      // no animation
      var node = ObjectUtils.getRefElement(props.nodeRef);
      if (props["in"]) {
        onEnter(node, true);
        onEntering(node, true);
        onEntered(node, true);
      } else {
        onExit(node);
        onExiting(node);
        onExited(node);
      }
    }
  }, [props["in"]]);
  if (disabled) {
    return props["in"] ? props.children : null;
  }
  var immutableProps = {
    nodeRef: props.nodeRef,
    "in": props["in"],
    appear: props.appear,
    onEnter: onEnter,
    onEntering: onEntering,
    onEntered: onEntered,
    onExit: onExit,
    onExiting: onExiting,
    onExited: onExited
  };
  var mutableProps = {
    classNames: props.classNames,
    timeout: props.timeout,
    unmountOnExit: props.unmountOnExit
  };
  var mergedProps = _objectSpread$8(_objectSpread$8(_objectSpread$8({}, mutableProps), props.options || {}), immutableProps);
  return /*#__PURE__*/React.createElement(CSSTransition$1, mergedProps, props.children);
});
CSSTransition.displayName = 'CSSTransition';

var IconBase = {
  defaultProps: {
    __TYPE: 'IconBase',
    className: null,
    label: null,
    spin: false
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, IconBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, IconBase.defaultProps);
  },
  getPTI: function getPTI(props) {
    var isLabelEmpty = ObjectUtils.isEmpty(props.label);
    var otherProps = IconBase.getOtherProps(props);
    var ptiProps = {
      className: classNames('p-icon', {
        'p-icon-spin': props.spin
      }, props.className),
      role: !isLabelEmpty ? 'img' : undefined,
      'aria-label': !isLabelEmpty ? props.label : undefined,
      'aria-hidden': props.label ? isLabelEmpty : undefined
    };
    return ObjectUtils.getMergedProps(otherProps, ptiProps);
  }
};

function _extends$b() {
  _extends$b = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$b.apply(this, arguments);
}

var TimesIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$b({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }));
}));
TimesIcon.displayName = 'TimesIcon';

function _extends$a() {
  _extends$a = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$a.apply(this, arguments);
}

var WindowMaximizeIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$a({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z",
    fill: "currentColor"
  }));
}));
WindowMaximizeIcon.displayName = 'WindowMaximizeIcon';

function _extends$9() {
  _extends$9 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$9.apply(this, arguments);
}

var WindowMinimizeIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$9({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z",
    fill: "currentColor"
  }));
}));
WindowMinimizeIcon.displayName = 'WindowMinimizeIcon';

function _arrayWithHoles$4(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$4(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$5(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$5(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen);
}

function _nonIterableRest$4() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$4(arr, i) {
  return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$4();
}

var PortalBase = {
  defaultProps: {
    __TYPE: 'Portal',
    element: null,
    appendTo: null,
    visible: false,
    onMounted: null,
    onUnmounted: null,
    children: undefined
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, PortalBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, PortalBase.defaultProps);
  }
};

var Portal = /*#__PURE__*/React.memo(function (inProps) {
  var props = PortalBase.getProps(inProps);
  var context = React.useContext(PrimeReactContext);
  var _React$useState = React.useState(props.visible && DomHandler.isClient()),
    _React$useState2 = _slicedToArray$4(_React$useState, 2),
    mountedState = _React$useState2[0],
    setMountedState = _React$useState2[1];
  useMountEffect(function () {
    if (DomHandler.isClient() && !mountedState) {
      setMountedState(true);
      props.onMounted && props.onMounted();
    }
  });
  useUpdateEffect(function () {
    props.onMounted && props.onMounted();
  }, [mountedState]);
  useUnmountEffect(function () {
    props.onUnmounted && props.onUnmounted();
  });
  var element = props.element || props.children;
  if (element && mountedState) {
    var appendTo = props.appendTo || context && context.appendTo || PrimeReact.appendTo;
    if (ObjectUtils.isFunction(appendTo)) {
      appendTo = appendTo();
    }
    if (!appendTo) {
      appendTo = document.body;
    }
    return appendTo === 'self' ? element : /*#__PURE__*/ReactDOM.createPortal(element, appendTo);
  }
  return null;
});
Portal.displayName = 'Portal';

function _extends$8() {
  _extends$8 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$8.apply(this, arguments);
}

function _typeof$5(o) {
  "@babel/helpers - typeof";

  return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$5(o);
}

function _toPrimitive$5(input, hint) {
  if (_typeof$5(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$5(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$5(arg) {
  var key = _toPrimitive$5(arg, "string");
  return _typeof$5(key) === "symbol" ? key : String(key);
}

function _defineProperty$5(obj, key, value) {
  key = _toPropertyKey$5(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles$3(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$3(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$4(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$4(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen);
}

function _nonIterableRest$3() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$3(arr, i) {
  return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$3();
}

var styles$4 = "\n@layer primereact {\n    .p-ripple {\n        overflow: hidden;\n        position: relative;\n    }\n    \n    .p-ink {\n        display: block;\n        position: absolute;\n        background: rgba(255, 255, 255, 0.5);\n        border-radius: 100%;\n        transform: scale(0);\n    }\n    \n    .p-ink-active {\n        animation: ripple 0.4s linear;\n    }\n    \n    .p-ripple-disabled .p-ink {\n        display: none;\n    }\n}\n\n@keyframes ripple {\n    100% {\n        opacity: 0;\n        transform: scale(2.5);\n    }\n}\n\n";
var classes$7 = {
  root: 'p-ink'
};
var RippleBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Ripple',
    children: undefined
  },
  css: {
    styles: styles$4,
    classes: classes$7
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, RippleBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, RippleBase.defaultProps);
  }
});

function ownKeys$7(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$7(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$7(Object(t), true).forEach(function (r) { _defineProperty$5(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Ripple = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray$3(_React$useState, 2),
    isMounted = _React$useState2[0],
    setMounted = _React$useState2[1];
  var inkRef = React.useRef(null);
  var targetRef = React.useRef(null);
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = RippleBase.getProps(inProps, context);
  var isRippleActive = context && context.ripple || PrimeReact.ripple;
  var metaData = {
    props: props
  };
  useStyle(RippleBase.css.styles, {
    name: 'ripple',
    manual: !isRippleActive
  });
  var _RippleBase$setMetaDa = RippleBase.setMetaData(_objectSpread$7({}, metaData)),
    ptm = _RippleBase$setMetaDa.ptm,
    cx = _RippleBase$setMetaDa.cx;
  var getTarget = function getTarget() {
    return inkRef.current && inkRef.current.parentElement;
  };
  var bindEvents = function bindEvents() {
    if (targetRef.current) {
      targetRef.current.addEventListener('pointerdown', onPointerDown);
    }
  };
  var unbindEvents = function unbindEvents() {
    if (targetRef.current) {
      targetRef.current.removeEventListener('pointerdown', onPointerDown);
    }
  };
  var onPointerDown = function onPointerDown(event) {
    var offset = DomHandler.getOffset(targetRef.current);
    var offsetX = event.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(inkRef.current) / 2;
    var offsetY = event.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(inkRef.current) / 2;
    activateRipple(offsetX, offsetY);
  };
  var activateRipple = function activateRipple(offsetX, offsetY) {
    if (!inkRef.current || getComputedStyle(inkRef.current, null).display === 'none') {
      return;
    }
    DomHandler.removeClass(inkRef.current, 'p-ink-active');
    setDimensions();
    inkRef.current.style.top = offsetY + 'px';
    inkRef.current.style.left = offsetX + 'px';
    DomHandler.addClass(inkRef.current, 'p-ink-active');
  };
  var onAnimationEnd = function onAnimationEnd(event) {
    DomHandler.removeClass(event.currentTarget, 'p-ink-active');
  };
  var setDimensions = function setDimensions() {
    if (inkRef.current && !DomHandler.getHeight(inkRef.current) && !DomHandler.getWidth(inkRef.current)) {
      var d = Math.max(DomHandler.getOuterWidth(targetRef.current), DomHandler.getOuterHeight(targetRef.current));
      inkRef.current.style.height = d + 'px';
      inkRef.current.style.width = d + 'px';
    }
  };
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      getInk: function getInk() {
        return inkRef.current;
      },
      getTarget: function getTarget() {
        return targetRef.current;
      }
    };
  });
  useMountEffect(function () {
    // for App Router in Next.js ^14
    setMounted(true);
  });
  useUpdateEffect(function () {
    if (isMounted && inkRef.current) {
      targetRef.current = getTarget();
      setDimensions();
      bindEvents();
    }
  }, [isMounted]);
  useUpdateEffect(function () {
    if (inkRef.current && !targetRef.current) {
      targetRef.current = getTarget();
      setDimensions();
      bindEvents();
    }
  });
  useUnmountEffect(function () {
    if (inkRef.current) {
      targetRef.current = null;
      unbindEvents();
    }
  });
  if (!isRippleActive) {
    return null;
  }
  var rootProps = mergeProps({
    'aria-hidden': true,
    className: classNames(cx('root'))
  }, RippleBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement("span", _extends$8({
    role: "presentation",
    ref: inkRef
  }, rootProps, {
    onAnimationEnd: onAnimationEnd
  }));
}));
Ripple.displayName = 'Ripple';

function _extends$7() {
  _extends$7 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$7.apply(this, arguments);
}

function _typeof$4(o) {
  "@babel/helpers - typeof";

  return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$4(o);
}

function _arrayLikeToArray$3(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles$2(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$3(arr);
}

function _iterableToArray$2(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$3(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen);
}

function _nonIterableSpread$2() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray$2(arr) {
  return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$3(arr) || _nonIterableSpread$2();
}

function _toPrimitive$4(input, hint) {
  if (_typeof$4(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$4(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$4(arg) {
  var key = _toPrimitive$4(arg, "string");
  return _typeof$4(key) === "symbol" ? key : String(key);
}

function _defineProperty$4(obj, key, value) {
  key = _toPropertyKey$4(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles$2(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$2(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _nonIterableRest$2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$2(arr, i) {
  return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$2();
}

var styles$1$1 = '';
var FocusTrapBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'FocusTrap',
    children: undefined
  },
  css: {
    styles: styles$1$1
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, FocusTrapBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, FocusTrapBase.defaultProps);
  }
});

function ownKeys$2$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2$1(Object(t), true).forEach(function (r) { _defineProperty$4(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var FocusTrap = /*#__PURE__*/React__default.memo(/*#__PURE__*/React__default.forwardRef(function (inProps, ref) {
  var targetRef = React__default.useRef(null);
  var firstFocusableElementRef = React__default.useRef(null);
  var lastFocusableElementRef = React__default.useRef(null);
  var context = React__default.useContext(PrimeReactContext);
  var props = FocusTrapBase.getProps(inProps, context);
  var metaData = {
    props: props
  };
  useStyle(FocusTrapBase.css.styles, {
    name: 'focustrap'
  });
  var _FocusTrapBase$setMet = FocusTrapBase.setMetaData(_objectSpread$2$1({}, metaData));
  _FocusTrapBase$setMet.ptm;
  React__default.useImperativeHandle(ref, function () {
    return {
      props: props,
      getInk: function getInk() {
        return firstFocusableElementRef.current;
      },
      getTarget: function getTarget() {
        return targetRef.current;
      }
    };
  });
  useMountEffect(function () {
    if (!props.disabled) {
      targetRef.current = getTarget();
      setAutoFocus(targetRef.current);
    }
  });
  var getTarget = function getTarget() {
    return firstFocusableElementRef.current && firstFocusableElementRef.current.parentElement;
  };

  /**
   * This method sets the auto focus on the first focusable element within the target element.
   * It first tries to find a focusable element using the autoFocusSelector. If no such element is found,
   * it then tries to find a focusable element using the firstFocusableSelector.
   * If the autoFocus prop is set to true and a focusable element is found, it sets the focus on that element.
   *
   * @param {HTMLElement} target - The target element within which to find a focusable element.
   */
  var setAutoFocus = function setAutoFocus(target) {
    var _ref = props || {},
      _ref$autoFocusSelecto = _ref.autoFocusSelector,
      autoFocusSelector = _ref$autoFocusSelecto === void 0 ? '' : _ref$autoFocusSelecto,
      _ref$firstFocusableSe = _ref.firstFocusableSelector,
      firstFocusableSelector = _ref$firstFocusableSe === void 0 ? '' : _ref$firstFocusableSe,
      _ref$autoFocus = _ref.autoFocus,
      autoFocus = _ref$autoFocus === void 0 ? false : _ref$autoFocus;
    var defaultAutoFocusSelector = "".concat(getComputedSelector(autoFocusSelector));
    var computedAutoFocusSelector = "[autofocus]".concat(defaultAutoFocusSelector, ", [data-pc-autofocus='true']").concat(defaultAutoFocusSelector);
    var focusableElement = DomHandler.getFirstFocusableElement(target, computedAutoFocusSelector);
    autoFocus && !focusableElement && (focusableElement = DomHandler.getFirstFocusableElement(target, getComputedSelector(firstFocusableSelector)));
    DomHandler.focus(focusableElement);
  };
  var getComputedSelector = function getComputedSelector(selector) {
    return ":not(.p-hidden-focusable):not([data-p-hidden-focusable=\"true\"])".concat(selector !== null && selector !== void 0 ? selector : '');
  };
  var onFirstHiddenElementFocus = function onFirstHiddenElementFocus(event) {
    var _targetRef$current;
    var currentTarget = event.currentTarget,
      relatedTarget = event.relatedTarget;
    var focusableElement = relatedTarget === currentTarget.$_pfocustrap_lasthiddenfocusableelement || !((_targetRef$current = targetRef.current) !== null && _targetRef$current !== void 0 && _targetRef$current.contains(relatedTarget)) ? DomHandler.getFirstFocusableElement(currentTarget.parentElement, getComputedSelector(currentTarget.$_pfocustrap_focusableselector)) : currentTarget.$_pfocustrap_lasthiddenfocusableelement;
    DomHandler.focus(focusableElement);
  };
  var onLastHiddenElementFocus = function onLastHiddenElementFocus(event) {
    var _targetRef$current2;
    var currentTarget = event.currentTarget,
      relatedTarget = event.relatedTarget;
    var focusableElement = relatedTarget === currentTarget.$_pfocustrap_firsthiddenfocusableelement || !((_targetRef$current2 = targetRef.current) !== null && _targetRef$current2 !== void 0 && _targetRef$current2.contains(relatedTarget)) ? DomHandler.getLastFocusableElement(currentTarget.parentElement, getComputedSelector(currentTarget.$_pfocustrap_focusableselector)) : currentTarget.$_pfocustrap_firsthiddenfocusableelement;
    DomHandler.focus(focusableElement);
  };
  var createHiddenFocusableElements = function createHiddenFocusableElements() {
    var _ref2 = props || {},
      _ref2$tabIndex = _ref2.tabIndex,
      tabIndex = _ref2$tabIndex === void 0 ? 0 : _ref2$tabIndex;
    var createFocusableElement = function createFocusableElement(inRef, onFocus, section) {
      return /*#__PURE__*/React__default.createElement("span", {
        ref: inRef,
        className: 'p-hidden-accessible p-hidden-focusable',
        tabIndex: tabIndex,
        role: 'presentation',
        "aria-hidden": true,
        "data-p-hidden-accessible": true,
        "data-p-hidden-focusable": true,
        onFocus: onFocus,
        "data-pc-section": section
      });
    };
    var firstFocusableElement = createFocusableElement(firstFocusableElementRef, onFirstHiddenElementFocus, 'firstfocusableelement');
    var lastFocusableElement = createFocusableElement(lastFocusableElementRef, onLastHiddenElementFocus, 'lastfocusableelement');
    if (firstFocusableElementRef.current && lastFocusableElementRef.current) {
      firstFocusableElementRef.current.$_pfocustrap_lasthiddenfocusableelement = lastFocusableElementRef.current;
      lastFocusableElementRef.current.$_pfocustrap_firsthiddenfocusableelement = firstFocusableElementRef.current;
    }
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, firstFocusableElement, props.children, lastFocusableElement);
  };
  return createHiddenFocusableElements();
}));
var FocusTrap$1 = FocusTrap;

function ownKeys$1$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1$2(Object(t), true).forEach(function (r) { _defineProperty$4(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var classes$6 = {
  closeButtonIcon: 'p-dialog-header-close-icon',
  closeButton: 'p-dialog-header-icon p-dialog-header-close p-link',
  maximizableIcon: 'p-dialog-header-maximize-icon',
  maximizableButton: 'p-dialog-header-icon p-dialog-header-maximize p-link',
  header: function header(_ref) {
    var props = _ref.props;
    return classNames('p-dialog-header', props.headerClassName);
  },
  headerTitle: 'p-dialog-title',
  headerIcons: 'p-dialog-header-icons',
  content: function content(_ref2) {
    var props = _ref2.props;
    return classNames('p-dialog-content', props.contentClassName);
  },
  footer: function footer(_ref3) {
    var props = _ref3.props;
    return classNames('p-dialog-footer', props.footerClassName);
  },
  mask: function mask(_ref4) {
    var props = _ref4.props,
      maskVisibleState = _ref4.maskVisibleState;
    var positions = ['center', 'left', 'right', 'top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'];
    var pos = positions.find(function (item) {
      return item === props.position || item.replace('-', '') === props.position;
    });
    return classNames('p-dialog-mask', pos ? "p-dialog-".concat(pos) : '', {
      'p-component-overlay p-component-overlay-enter': props.modal,
      'p-dialog-visible': maskVisibleState,
      'p-dialog-draggable': props.draggable,
      'p-dialog-resizable': props.resizable
    }, props.maskClassName);
  },
  root: function root(_ref5) {
    var props = _ref5.props,
      maximized = _ref5.maximized,
      context = _ref5.context;
    return classNames('p-dialog p-component', {
      'p-dialog-rtl': props.rtl,
      'p-dialog-maximized': maximized,
      'p-dialog-default': !maximized,
      'p-input-filled': context && context.inputStyle === 'filled' || PrimeReact.inputStyle === 'filled',
      'p-ripple-disabled': context && context.ripple === false || PrimeReact.ripple === false
    });
  },
  transition: 'p-dialog'
};
var styles$3 = "\n@layer primereact {\n    .p-dialog-mask {\n        background-color: transparent;\n        transition-property: background-color;\n    }\n\n    .p-dialog-visible {\n        display: flex;\n    }\n\n    .p-dialog-mask.p-component-overlay {\n        pointer-events: auto;\n    }\n\n    .p-dialog {\n        display: flex;\n        flex-direction: column;\n        pointer-events: auto;\n        max-height: 90%;\n        transform: scale(1);\n        position: relative;\n    }\n\n    .p-dialog-content {\n        overflow-y: auto;\n        flex-grow: 1;\n    }\n\n    .p-dialog-header {\n        display: flex;\n        align-items: center;\n        flex-shrink: 0;\n    }\n\n    .p-dialog-footer {\n        flex-shrink: 0;\n    }\n\n    .p-dialog .p-dialog-header-icons {\n        display: flex;\n        align-items: center;\n        align-self: flex-start;\n        flex-shrink: 0;\n    }\n\n    .p-dialog .p-dialog-header-icon {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-dialog .p-dialog-title {\n        flex-grow: 1;\n    }\n\n    /* Fluid */\n    .p-fluid .p-dialog-footer .p-button {\n        width: auto;\n    }\n\n    /* Animation */\n    /* Center */\n    .p-dialog-enter {\n        opacity: 0;\n        transform: scale(0.7);\n    }\n\n    .p-dialog-enter-active {\n        opacity: 1;\n        transform: scale(1);\n        transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n    }\n\n    .p-dialog-enter-done {\n        transform: none;\n    }\n\n    .p-dialog-exit-active {\n        opacity: 0;\n        transform: scale(0.7);\n        transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    }\n\n    /* Top, Bottom, Left, Right, Top* and Bottom* */\n    .p-dialog-top .p-dialog,\n    .p-dialog-bottom .p-dialog,\n    .p-dialog-left .p-dialog,\n    .p-dialog-right .p-dialog,\n    .p-dialog-top-left .p-dialog,\n    .p-dialog-top-right .p-dialog,\n    .p-dialog-bottom-left .p-dialog,\n    .p-dialog-bottom-right .p-dialog {\n        margin: 0.75em;\n    }\n\n    .p-dialog-top .p-dialog-enter,\n    .p-dialog-top .p-dialog-exit-active {\n        transform: translate3d(0px, -100%, 0px);\n    }\n\n    .p-dialog-bottom .p-dialog-enter,\n    .p-dialog-bottom .p-dialog-exit-active {\n        transform: translate3d(0px, 100%, 0px);\n    }\n\n    .p-dialog-left .p-dialog-enter,\n    .p-dialog-left .p-dialog-exit-active,\n    .p-dialog-top-left .p-dialog-enter,\n    .p-dialog-top-left .p-dialog-exit-active,\n    .p-dialog-bottom-left .p-dialog-enter,\n    .p-dialog-bottom-left .p-dialog-exit-active {\n        transform: translate3d(-100%, 0px, 0px);\n    }\n\n    .p-dialog-right .p-dialog-enter,\n    .p-dialog-right .p-dialog-exit-active,\n    .p-dialog-top-right .p-dialog-enter,\n    .p-dialog-top-right .p-dialog-exit-active,\n    .p-dialog-bottom-right .p-dialog-enter,\n    .p-dialog-bottom-right .p-dialog-exit-active {\n        transform: translate3d(100%, 0px, 0px);\n    }\n\n    .p-dialog-top .p-dialog-enter-active,\n    .p-dialog-bottom .p-dialog-enter-active,\n    .p-dialog-left .p-dialog-enter-active,\n    .p-dialog-top-left .p-dialog-enter-active,\n    .p-dialog-bottom-left .p-dialog-enter-active,\n    .p-dialog-right .p-dialog-enter-active,\n    .p-dialog-top-right .p-dialog-enter-active,\n    .p-dialog-bottom-right .p-dialog-enter-active {\n        transform: translate3d(0px, 0px, 0px);\n        transition: all 0.3s ease-out;\n    }\n\n    .p-dialog-top .p-dialog-exit-active,\n    .p-dialog-bottom .p-dialog-exit-active,\n    .p-dialog-left .p-dialog-exit-active,\n    .p-dialog-top-left .p-dialog-exit-active,\n    .p-dialog-bottom-left .p-dialog-exit-active,\n    .p-dialog-right .p-dialog-exit-active,\n    .p-dialog-top-right .p-dialog-exit-active,\n    .p-dialog-bottom-right .p-dialog-exit-active {\n        transition: all 0.3s ease-out;\n    }\n\n    /* Maximize */\n    .p-dialog-maximized {\n        transition: none;\n        transform: none;\n        margin: 0;\n        width: 100vw !important;\n        height: 100vh !important;\n        max-height: 100%;\n        top: 0px !important;\n        left: 0px !important;\n    }\n\n    .p-dialog-maximized .p-dialog-content {\n        flex-grow: 1;\n    }\n\n    .p-confirm-dialog .p-dialog-content {\n        display: flex;\n        align-items: center;\n    }\n\n    /* Resizable */\n    .p-dialog .p-resizable-handle {\n        position: absolute;\n        font-size: 0.1px;\n        display: block;\n        cursor: se-resize;\n        width: 12px;\n        height: 12px;\n        right: 1px;\n        bottom: 1px;\n    }\n\n    .p-dialog-draggable .p-dialog-header {\n        cursor: move;\n    }\n}\n";
var inlineStyles$1 = {
  mask: function mask(_ref6) {
    var props = _ref6.props;
    return _objectSpread$1$2({
      position: 'fixed',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
      display: 'flex',
      justifyContent: props.position === 'left' || props.position === 'top-left' || props.position === 'bottom-left' ? 'flex-start' : props.position === 'right' || props.position === 'top-right' || props.position === 'bottom-right' ? 'flex-end' : 'center',
      alignItems: props.position === 'top' || props.position === 'top-left' || props.position === 'top-right' ? 'flex-start' : props.position === 'bottom' || props.position === 'bottom-left' || props.position === 'bottom-right' ? 'flex-end' : 'center',
      pointerEvents: !props.modal && 'none'
    }, props.maskStyle);
  }
};
var DialogBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Dialog',
    __parentMetadata: null,
    appendTo: null,
    ariaCloseIconLabel: null,
    baseZIndex: 0,
    blockScroll: false,
    breakpoints: null,
    className: null,
    closable: true,
    closeIcon: null,
    closeOnEscape: true,
    content: null,
    contentClassName: null,
    contentStyle: null,
    dismissableMask: false,
    draggable: true,
    focusOnShow: true,
    footer: null,
    footerClassName: null,
    header: null,
    headerClassName: null,
    headerStyle: null,
    icons: null,
    id: null,
    keepInViewport: true,
    maskClassName: null,
    maskStyle: null,
    maximizable: false,
    maximizeIcon: null,
    maximized: false,
    minX: 0,
    minY: 0,
    minimizeIcon: null,
    modal: true,
    onClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragStart: null,
    onHide: null,
    onMaskClick: null,
    onMaximize: null,
    onResize: null,
    onResizeEnd: null,
    onResizeStart: null,
    onShow: null,
    position: 'center',
    resizable: true,
    rtl: false,
    showHeader: true,
    style: null,
    transitionOptions: null,
    visible: false,
    children: undefined
  },
  css: {
    classes: classes$6,
    styles: styles$3,
    inlineStyles: inlineStyles$1
  }
});

function ownKeys$6(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$6(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$6(Object(t), true).forEach(function (r) { _defineProperty$4(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Dialog = /*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = DialogBase.getProps(inProps, context);
  var uniqueId = props.id ? props.id : UniqueComponentId();
  var _React$useState = React.useState(uniqueId),
    _React$useState2 = _slicedToArray$2(_React$useState, 2),
    idState = _React$useState2[0];
  _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray$2(_React$useState3, 2),
    maskVisibleState = _React$useState4[0],
    setMaskVisibleState = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray$2(_React$useState5, 2),
    visibleState = _React$useState6[0],
    setVisibleState = _React$useState6[1];
  var _React$useState7 = React.useState(props.maximized),
    _React$useState8 = _slicedToArray$2(_React$useState7, 2),
    maximizedState = _React$useState8[0],
    setMaximizedState = _React$useState8[1];
  var dialogRef = React.useRef(null);
  var maskRef = React.useRef(null);
  var pointerRef = React.useRef(null);
  var contentRef = React.useRef(null);
  var headerRef = React.useRef(null);
  var footerRef = React.useRef(null);
  var closeRef = React.useRef(null);
  var dragging = React.useRef(false);
  var resizing = React.useRef(false);
  var lastPageX = React.useRef(null);
  var lastPageY = React.useRef(null);
  var styleElement = React.useRef(null);
  var attributeSelector = React.useRef(uniqueId);
  var focusElementOnHide = React.useRef(null);
  var maximized = props.onMaximize ? props.maximized : maximizedState;
  var shouldBlockScroll = visibleState && (props.blockScroll || props.maximizable && maximized);
  var isCloseOnEscape = props.closable && props.closeOnEscape && visibleState;
  var displayOrder = useDisplayOrder('dialog', isCloseOnEscape);
  var _DialogBase$setMetaDa = DialogBase.setMetaData(_objectSpread$6(_objectSpread$6({
    props: props
  }, props.__parentMetadata), {}, {
    state: {
      id: idState,
      maximized: maximized,
      containerVisible: maskVisibleState
    }
  })),
    ptm = _DialogBase$setMetaDa.ptm,
    cx = _DialogBase$setMetaDa.cx,
    sx = _DialogBase$setMetaDa.sx,
    isUnstyled = _DialogBase$setMetaDa.isUnstyled;
  useHandleStyle(DialogBase.css.styles, isUnstyled, {
    name: 'dialog'
  });
  useGlobalOnEscapeKey({
    callback: function callback(event) {
      onClose(event);
    },
    when: isCloseOnEscape && displayOrder,
    priority: [ESC_KEY_HANDLING_PRIORITIES.DIALOG, displayOrder]
  });
  var _useEventListener = useEventListener({
    type: 'mousemove',
    target: function target() {
      return window.document;
    },
    listener: function listener(event) {
      return onResize(event);
    }
  }),
    _useEventListener2 = _slicedToArray$2(_useEventListener, 2),
    bindDocumentResizeListener = _useEventListener2[0],
    unbindDocumentResizeListener = _useEventListener2[1];
  var _useEventListener3 = useEventListener({
    type: 'mouseup',
    target: function target() {
      return window.document;
    },
    listener: function listener(event) {
      return onResizeEnd(event);
    }
  }),
    _useEventListener4 = _slicedToArray$2(_useEventListener3, 2),
    bindDocumentResizeEndListener = _useEventListener4[0],
    unbindDocumentResizEndListener = _useEventListener4[1];
  var _useEventListener5 = useEventListener({
    type: 'mousemove',
    target: function target() {
      return window.document;
    },
    listener: function listener(event) {
      return onDrag(event);
    }
  }),
    _useEventListener6 = _slicedToArray$2(_useEventListener5, 2),
    bindDocumentDragListener = _useEventListener6[0],
    unbindDocumentDragListener = _useEventListener6[1];
  var _useEventListener7 = useEventListener({
    type: 'mouseup',
    target: function target() {
      return window.document;
    },
    listener: function listener(event) {
      return onDragEnd(event);
    }
  }),
    _useEventListener8 = _slicedToArray$2(_useEventListener7, 2),
    bindDocumentDragEndListener = _useEventListener8[0],
    unbindDocumentDragEndListener = _useEventListener8[1];
  var onClose = function onClose(event) {
    props.onHide(event);
    event.preventDefault();
  };
  var focus = function focus() {
    var activeElement = document.activeElement;
    var isActiveElementInDialog = activeElement && dialogRef.current && dialogRef.current.contains(activeElement);
    if (!isActiveElementInDialog && props.closable && props.showHeader && closeRef.current) {
      closeRef.current.focus();
    }
  };
  var onDialogPointerDown = function onDialogPointerDown(event) {
    pointerRef.current = event.target;
    props.onPointerDown && props.onPointerDown(event);
  };
  var onMaskPointerUp = function onMaskPointerUp(event) {
    if (props.dismissableMask && props.modal && maskRef.current === event.target && !pointerRef.current) {
      onClose(event);
    }
    props.onMaskClick && props.onMaskClick(event);
    pointerRef.current = null;
  };
  var toggleMaximize = function toggleMaximize(event) {
    if (props.onMaximize) {
      props.onMaximize({
        originalEvent: event,
        maximized: !maximized
      });
    } else {
      setMaximizedState(function (prevMaximized) {
        return !prevMaximized;
      });
    }
    event.preventDefault();
  };
  var onDragStart = function onDragStart(event) {
    if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
      return;
    }
    if (props.draggable) {
      dragging.current = true;
      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;
      dialogRef.current.style.margin = '0';
      DomHandler.addClass(document.body, 'p-unselectable-text');
      props.onDragStart && props.onDragStart(event);
    }
  };
  var onDrag = function onDrag(event) {
    if (dragging.current) {
      var width = DomHandler.getOuterWidth(dialogRef.current);
      var height = DomHandler.getOuterHeight(dialogRef.current);
      var deltaX = event.pageX - lastPageX.current;
      var deltaY = event.pageY - lastPageY.current;
      var offset = dialogRef.current.getBoundingClientRect();
      var leftPos = offset.left + deltaX;
      var topPos = offset.top + deltaY;
      var viewport = DomHandler.getViewport();
      var computedStyle = getComputedStyle(dialogRef.current);
      var leftMargin = parseFloat(computedStyle.marginLeft);
      var topMargin = parseFloat(computedStyle.marginTop);
      dialogRef.current.style.position = 'fixed';
      if (props.keepInViewport) {
        if (leftPos >= props.minX && leftPos + width < viewport.width) {
          lastPageX.current = event.pageX;
          dialogRef.current.style.left = leftPos - leftMargin + 'px';
        }
        if (topPos >= props.minY && topPos + height < viewport.height) {
          lastPageY.current = event.pageY;
          dialogRef.current.style.top = topPos - topMargin + 'px';
        }
      } else {
        lastPageX.current = event.pageX;
        dialogRef.current.style.left = leftPos - leftMargin + 'px';
        lastPageY.current = event.pageY;
        dialogRef.current.style.top = topPos - topMargin + 'px';
      }
      props.onDrag && props.onDrag(event);
    }
  };
  var onDragEnd = function onDragEnd(event) {
    if (dragging.current) {
      dragging.current = false;
      DomHandler.removeClass(document.body, 'p-unselectable-text');
      props.onDragEnd && props.onDragEnd(event);
    }
  };
  var onResizeStart = function onResizeStart(event) {
    if (props.resizable) {
      resizing.current = true;
      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;
      DomHandler.addClass(document.body, 'p-unselectable-text');
      props.onResizeStart && props.onResizeStart(event);
    }
  };
  var convertToPx = function convertToPx(value, property, viewport) {
    !viewport && (viewport = DomHandler.getViewport());
    var val = parseInt(value);
    if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(value)) {
      return val * (viewport[property] / 100);
    }
    return val;
  };
  var onResize = function onResize(event) {
    if (resizing.current) {
      var deltaX = event.pageX - lastPageX.current;
      var deltaY = event.pageY - lastPageY.current;
      var width = DomHandler.getOuterWidth(dialogRef.current);
      var height = DomHandler.getOuterHeight(dialogRef.current);
      var offset = dialogRef.current.getBoundingClientRect();
      var viewport = DomHandler.getViewport();
      var hasBeenDragged = !parseInt(dialogRef.current.style.top) || !parseInt(dialogRef.current.style.left);
      var minWidth = convertToPx(dialogRef.current.style.minWidth, 'width', viewport);
      var minHeight = convertToPx(dialogRef.current.style.minHeight, 'height', viewport);
      var newWidth = width + deltaX;
      var newHeight = height + deltaY;
      if (hasBeenDragged) {
        newWidth = newWidth + deltaX;
        newHeight = newHeight + deltaY;
      }
      if ((!minWidth || newWidth > minWidth) && offset.left + newWidth < viewport.width) {
        dialogRef.current.style.width = newWidth + 'px';
      }
      if ((!minHeight || newHeight > minHeight) && offset.top + newHeight < viewport.height) {
        dialogRef.current.style.height = newHeight + 'px';
      }
      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;
      props.onResize && props.onResize(event);
    }
  };
  var onResizeEnd = function onResizeEnd(event) {
    if (resizing.current) {
      resizing.current = false;
      DomHandler.removeClass(document.body, 'p-unselectable-text');
      props.onResizeEnd && props.onResizeEnd(event);
    }
  };
  var resetPosition = function resetPosition() {
    dialogRef.current.style.position = '';
    dialogRef.current.style.left = '';
    dialogRef.current.style.top = '';
    dialogRef.current.style.margin = '';
  };
  var onEnter = function onEnter() {
    dialogRef.current.setAttribute(attributeSelector.current, '');
  };
  var onEntered = function onEntered() {
    props.onShow && props.onShow();
    if (props.focusOnShow) {
      focus();
    }
    enableDocumentSettings();
  };
  var onExiting = function onExiting() {
    if (props.modal) {
      !isUnstyled() && DomHandler.addClass(maskRef.current, 'p-component-overlay-leave');
    }
  };
  var onExited = function onExited() {
    dragging.current = false;
    ZIndexUtils.clear(maskRef.current);
    setMaskVisibleState(false);
    disableDocumentSettings();

    // return focus to element before dialog was open
    DomHandler.focus(focusElementOnHide.current);
    focusElementOnHide.current = null;
  };
  var enableDocumentSettings = function enableDocumentSettings() {
    bindGlobalListeners();
  };
  var disableDocumentSettings = function disableDocumentSettings() {
    unbindGlobalListeners();
  };
  var updateScrollBlocker = function updateScrollBlocker() {
    // Scroll should be unblocked if there is at least one dialog that blocks scrolling:
    var isThereAnyDialogThatBlocksScrolling = document.primeDialogParams && document.primeDialogParams.some(function (i) {
      return i.hasBlockScroll;
    });
    if (isThereAnyDialogThatBlocksScrolling) {
      DomHandler.blockBodyScroll();
    } else {
      DomHandler.unblockBodyScroll();
    }
  };
  var updateGlobalDialogsRegistry = function updateGlobalDialogsRegistry(isMounted) {
    // Update current dialog info in global registry if it is mounted and visible:
    if (isMounted && visibleState) {
      var newParam = {
        id: idState,
        hasBlockScroll: shouldBlockScroll
      };

      // Create registry if not yet created:
      if (!document.primeDialogParams) {
        document.primeDialogParams = [];
      }
      var currentDialogIndexInRegistry = document.primeDialogParams.findIndex(function (dialogInRegistry) {
        return dialogInRegistry.id === idState;
      });
      if (currentDialogIndexInRegistry === -1) {
        document.primeDialogParams = [].concat(_toConsumableArray$2(document.primeDialogParams), [newParam]);
      } else {
        document.primeDialogParams = document.primeDialogParams.toSpliced(currentDialogIndexInRegistry, 1, newParam);
      }
    }
    // Or remove it from global registry if unmounted or invisible:
    else {
      document.primeDialogParams = document.primeDialogParams && document.primeDialogParams.filter(function (param) {
        return param.id !== idState;
      });
    }

    // Always update scroll blocker after dialog registry - this way we ensure that
    // p-overflow-hidden class is properly added/removed:
    updateScrollBlocker();
  };
  var bindGlobalListeners = function bindGlobalListeners() {
    if (props.draggable) {
      bindDocumentDragListener();
      bindDocumentDragEndListener();
    }
    if (props.resizable) {
      bindDocumentResizeListener();
      bindDocumentResizeEndListener();
    }
  };
  var unbindGlobalListeners = function unbindGlobalListeners() {
    unbindDocumentDragListener();
    unbindDocumentDragEndListener();
    unbindDocumentResizeListener();
    unbindDocumentResizEndListener();
  };
  var createStyle = function createStyle() {
    styleElement.current = DomHandler.createInlineStyle(context && context.nonce || PrimeReact.nonce, context && context.styleContainer);
    var innerHTML = '';
    for (var breakpoint in props.breakpoints) {
      innerHTML = innerHTML + "\n                @media screen and (max-width: ".concat(breakpoint, ") {\n                     [data-pc-name=\"dialog\"][").concat(attributeSelector.current, "] {\n                        width: ").concat(props.breakpoints[breakpoint], " !important;\n                    }\n                }\n            ");
    }
    styleElement.current.innerHTML = innerHTML;
  };
  var destroyStyle = function destroyStyle() {
    styleElement.current = DomHandler.removeInlineStyle(styleElement.current);
  };
  useMountEffect(function () {
    updateGlobalDialogsRegistry(true);
    if (props.visible) {
      setMaskVisibleState(true);
    }
  });
  React.useEffect(function () {
    if (props.breakpoints) {
      createStyle();
    }
    return function () {
      destroyStyle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.breakpoints]);
  useUpdateEffect(function () {
    if (props.visible && !maskVisibleState) {
      setMaskVisibleState(true);
    }
    if (props.visible !== visibleState && maskVisibleState) {
      setVisibleState(props.visible);
    }
    if (props.visible) {
      // Remember the focused element before we opened the dialog
      // so we can return focus to it once we close the dialog.
      focusElementOnHide.current = document.activeElement;
    }
  }, [props.visible, maskVisibleState]);
  useUpdateEffect(function () {
    if (maskVisibleState) {
      ZIndexUtils.set('modal', maskRef.current, context && context.autoZIndex || PrimeReact.autoZIndex, props.baseZIndex || context && context.zIndex.modal || PrimeReact.zIndex.modal);
      setVisibleState(true);
    }
  }, [maskVisibleState]);
  useUpdateEffect(function () {
    updateGlobalDialogsRegistry(true);
  }, [shouldBlockScroll, visibleState]);
  useUnmountEffect(function () {
    disableDocumentSettings();
    updateGlobalDialogsRegistry(false);
    DomHandler.removeInlineStyle(styleElement.current);
    ZIndexUtils.clear(maskRef.current);
  });
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      resetPosition: resetPosition,
      getElement: function getElement() {
        return dialogRef.current;
      },
      getMask: function getMask() {
        return maskRef.current;
      },
      getContent: function getContent() {
        return contentRef.current;
      },
      getHeader: function getHeader() {
        return headerRef.current;
      },
      getFooter: function getFooter() {
        return footerRef.current;
      },
      getCloseButton: function getCloseButton() {
        return closeRef.current;
      }
    };
  });
  var createCloseIcon = function createCloseIcon() {
    if (props.closable) {
      var labelAria = props.ariaCloseIconLabel || ariaLabel('close');
      var closeButtonIconProps = mergeProps({
        className: cx('closeButtonIcon'),
        'aria-hidden': true
      }, ptm('closeButtonIcon'));
      var icon = props.closeIcon || /*#__PURE__*/React.createElement(TimesIcon, closeButtonIconProps);
      var headerCloseIcon = IconUtils.getJSXIcon(icon, _objectSpread$6({}, closeButtonIconProps), {
        props: props
      });
      var closeButtonProps = mergeProps({
        ref: closeRef,
        type: 'button',
        className: cx('closeButton'),
        'aria-label': labelAria,
        onClick: onClose,
        onKeyDown: function onKeyDown(ev) {
          if (ev.key !== 'Escape') {
            ev.stopPropagation();
          }
        }
      }, ptm('closeButton'));
      return /*#__PURE__*/React.createElement("button", closeButtonProps, headerCloseIcon, /*#__PURE__*/React.createElement(Ripple, null));
    }
    return null;
  };
  var createMaximizeIcon = function createMaximizeIcon() {
    var icon;
    var maximizableIconProps = mergeProps({
      className: cx('maximizableIcon')
    }, ptm('maximizableIcon'));
    if (!maximized) {
      icon = props.maximizeIcon || /*#__PURE__*/React.createElement(WindowMaximizeIcon, maximizableIconProps);
    } else {
      icon = props.minimizeIcon || /*#__PURE__*/React.createElement(WindowMinimizeIcon, maximizableIconProps);
    }
    var toggleIcon = IconUtils.getJSXIcon(icon, maximizableIconProps, {
      props: props
    });
    if (props.maximizable) {
      var maximizableButtonProps = mergeProps({
        type: 'button',
        className: cx('maximizableButton'),
        onClick: toggleMaximize
      }, ptm('maximizableButton'));
      return /*#__PURE__*/React.createElement("button", maximizableButtonProps, toggleIcon, /*#__PURE__*/React.createElement(Ripple, null));
    }
    return null;
  };
  var createHeader = function createHeader() {
    if (props.showHeader) {
      var closeIcon = createCloseIcon();
      var maximizeIcon = createMaximizeIcon();
      var icons = ObjectUtils.getJSXElement(props.icons, props);
      var header = ObjectUtils.getJSXElement(props.header, props);
      var headerId = idState + '_header';
      var headerProps = mergeProps({
        ref: headerRef,
        style: props.headerStyle,
        className: cx('header'),
        onMouseDown: onDragStart
      }, ptm('header'));
      var headerTitleProps = mergeProps({
        id: headerId,
        className: cx('headerTitle')
      }, ptm('headerTitle'));
      var headerIconsProps = mergeProps({
        className: cx('headerIcons')
      }, ptm('headerIcons'));
      return /*#__PURE__*/React.createElement("div", headerProps, /*#__PURE__*/React.createElement("div", headerTitleProps, header), /*#__PURE__*/React.createElement("div", headerIconsProps, icons, maximizeIcon, closeIcon));
    }
    return null;
  };
  var createContent = function createContent() {
    var contentId = idState + '_content';
    var contentProps = mergeProps({
      id: contentId,
      ref: contentRef,
      style: props.contentStyle,
      className: cx('content')
    }, ptm('content'));
    return /*#__PURE__*/React.createElement("div", contentProps, props.children);
  };
  var createFooter = function createFooter() {
    var footer = ObjectUtils.getJSXElement(props.footer, props);
    var footerProps = mergeProps({
      ref: footerRef,
      className: cx('footer')
    }, ptm('footer'));
    return footer && /*#__PURE__*/React.createElement("div", footerProps, footer);
  };
  var createResizer = function createResizer() {
    if (props.resizable) {
      return /*#__PURE__*/React.createElement("span", {
        className: "p-resizable-handle",
        style: {
          zIndex: 90
        },
        onMouseDown: onResizeStart
      });
    }
    return null;
  };
  var createTemplateElement = function createTemplateElement() {
    var _props$children;
    var messageProps = {
      header: props.header,
      content: props.message,
      message: props === null || props === void 0 || (_props$children = props.children) === null || _props$children === void 0 || (_props$children = _props$children[1]) === null || _props$children === void 0 || (_props$children = _props$children.props) === null || _props$children === void 0 ? void 0 : _props$children.children
    };
    var templateElementProps = {
      headerRef: headerRef,
      contentRef: contentRef,
      footerRef: footerRef,
      closeRef: closeRef,
      hide: onClose,
      message: messageProps
    };
    return ObjectUtils.getJSXElement(inProps.content, templateElementProps);
  };
  var createElement = function createElement() {
    var header = createHeader();
    var content = createContent();
    var footer = createFooter();
    var resizer = createResizer();
    return /*#__PURE__*/React.createElement(React.Fragment, null, header, content, footer, resizer);
  };
  var createDialog = function createDialog() {
    var headerId = idState + '_header';
    var contentId = idState + '_content';
    var transitionTimeout = {
      enter: props.position === 'center' ? 150 : 300,
      exit: props.position === 'center' ? 150 : 300
    };
    var maskProps = mergeProps({
      ref: maskRef,
      style: sx('mask'),
      className: cx('mask'),
      onPointerUp: onMaskPointerUp
    }, ptm('mask'));
    var rootProps = mergeProps({
      ref: dialogRef,
      id: idState,
      className: classNames(props.className, cx('root', {
        props: props,
        maximized: maximized,
        context: context
      })),
      style: props.style,
      onClick: props.onClick,
      role: 'dialog',
      'aria-labelledby': headerId,
      'aria-describedby': contentId,
      'aria-modal': props.modal,
      onPointerDown: onDialogPointerDown
    }, DialogBase.getOtherProps(props), ptm('root'));
    var transitionProps = mergeProps({
      classNames: cx('transition'),
      timeout: transitionTimeout,
      "in": visibleState,
      options: props.transitionOptions,
      unmountOnExit: true,
      onEnter: onEnter,
      onEntered: onEntered,
      onExiting: onExiting,
      onExited: onExited
    }, ptm('transition'));
    var contentElement = null;
    if (inProps !== null && inProps !== void 0 && inProps.content) {
      contentElement = createTemplateElement();
    } else {
      contentElement = createElement();
    }
    var rootElement = /*#__PURE__*/React.createElement("div", maskProps, /*#__PURE__*/React.createElement(CSSTransition, _extends$7({
      nodeRef: dialogRef
    }, transitionProps), /*#__PURE__*/React.createElement("div", rootProps, /*#__PURE__*/React.createElement(FocusTrap$1, {
      autoFocus: props.focusOnShow
    }, contentElement))));
    return /*#__PURE__*/React.createElement(Portal, {
      element: rootElement,
      appendTo: props.appendTo,
      visible: true
    });
  };
  return maskVisibleState && createDialog();
});
Dialog.displayName = 'Dialog';

function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$2(arr);
}

function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$2(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}

function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$1();
}

var KeyFilter = {
  /* eslint-disable */
  DEFAULT_MASKS: {
    pint: /[\d]/,
    "int": /[\d\-]/,
    pnum: /[\d\.]/,
    money: /[\d\.\s,]/,
    num: /[\d\-\.]/,
    hex: /[0-9a-f]/i,
    email: /[a-z0-9_\.\-@]/i,
    alpha: /[a-z_]/i,
    alphanum: /[a-z0-9_]/i
  },
  /* eslint-enable */getRegex: function getRegex(keyfilter) {
    return KeyFilter.DEFAULT_MASKS[keyfilter] ? KeyFilter.DEFAULT_MASKS[keyfilter] : keyfilter;
  },
  onBeforeInput: function onBeforeInput(e, keyfilter, validateOnly) {
    // android devices must use beforeinput https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229
    if (validateOnly || !DomHandler.isAndroid()) {
      return;
    }
    this.validateKey(e, e.data, keyfilter);
  },
  onKeyPress: function onKeyPress(e, keyfilter, validateOnly) {
    // non android devices use keydown
    if (validateOnly || DomHandler.isAndroid()) {
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }
    this.validateKey(e, e.key, keyfilter);
  },
  onPaste: function onPaste(e, keyfilter, validateOnly) {
    if (validateOnly) {
      return;
    }
    var regex = this.getRegex(keyfilter);
    var clipboard = e.clipboardData.getData('text');

    // loop over each letter pasted and if any fail prevent the paste
    _toConsumableArray$1(clipboard).forEach(function (c) {
      if (!regex.test(c)) {
        e.preventDefault();
        return false;
      }
    });
  },
  validateKey: function validateKey(e, key, keyfilter) {
    if (key === null || key === undefined) {
      return;
    }

    // some AZERTY keys come in with 2 chars like ´ç if Dead key is pressed first
    var isPrintableKey = key.length <= 2;
    if (!isPrintableKey) {
      return;
    }
    var regex = this.getRegex(keyfilter);
    if (!regex.test(key)) {
      e.preventDefault();
    }
  },
  validate: function validate(e, keyfilter) {
    var value = e.target.value;
    var validatePattern = true;
    var regex = this.getRegex(keyfilter);
    if (value && !regex.test(value)) {
      validatePattern = false;
    }
    return validatePattern;
  }
};

function _extends$6() {
  _extends$6 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$6.apply(this, arguments);
}

function _typeof$3(o) {
  "@babel/helpers - typeof";

  return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$3(o);
}

function _toPrimitive$3(input, hint) {
  if (_typeof$3(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$3(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$3(arg) {
  var key = _toPrimitive$3(arg, "string");
  return _typeof$3(key) === "symbol" ? key : String(key);
}

function _defineProperty$3(obj, key, value) {
  key = _toPropertyKey$3(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
}

function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$1(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
}

var classes$5 = {
  root: function root(_ref) {
    var positionState = _ref.positionState,
      classNameState = _ref.classNameState;
    return classNames('p-tooltip p-component', _defineProperty$3({}, "p-tooltip-".concat(positionState), true), classNameState);
  },
  arrow: 'p-tooltip-arrow',
  text: 'p-tooltip-text'
};
var inlineStyles = {
  arrow: function arrow(_ref2) {
    var context = _ref2.context;
    return {
      top: context.bottom ? '0' : context.right || context.left || !context.right && !context.left && !context.top && !context.bottom ? '50%' : null,
      bottom: context.top ? '0' : null,
      left: context.right || !context.right && !context.left && !context.top && !context.bottom ? '0' : context.top || context.bottom ? '50%' : null,
      right: context.left ? '0' : null
    };
  }
};
var styles$2 = "\n@layer primereact {\n    .p-tooltip {\n        position: absolute;\n        padding: .25em .5rem;\n        /* #3687: Tooltip prevent scrollbar flickering */\n        top: -9999px;\n        left: -9999px;\n    }\n    \n    .p-tooltip.p-tooltip-right,\n    .p-tooltip.p-tooltip-left {\n        padding: 0 .25rem;\n    }\n    \n    .p-tooltip.p-tooltip-top,\n    .p-tooltip.p-tooltip-bottom {\n        padding:.25em 0;\n    }\n    \n    .p-tooltip .p-tooltip-text {\n       white-space: pre-line;\n       word-break: break-word;\n    }\n    \n    .p-tooltip-arrow {\n        position: absolute;\n        width: 0;\n        height: 0;\n        border-color: transparent;\n        border-style: solid;\n    }\n    \n    .p-tooltip-right .p-tooltip-arrow {\n        top: 50%;\n        left: 0;\n        margin-top: -.25rem;\n        border-width: .25em .25em .25em 0;\n    }\n    \n    .p-tooltip-left .p-tooltip-arrow {\n        top: 50%;\n        right: 0;\n        margin-top: -.25rem;\n        border-width: .25em 0 .25em .25rem;\n    }\n    \n    .p-tooltip.p-tooltip-top {\n        padding: .25em 0;\n    }\n    \n    .p-tooltip-top .p-tooltip-arrow {\n        bottom: 0;\n        left: 50%;\n        margin-left: -.25rem;\n        border-width: .25em .25em 0;\n    }\n    \n    .p-tooltip-bottom .p-tooltip-arrow {\n        top: 0;\n        left: 50%;\n        margin-left: -.25rem;\n        border-width: 0 .25em .25rem;\n    }\n\n    .p-tooltip-target-wrapper {\n        display: inline-flex;\n    }\n}\n";
var TooltipBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Tooltip',
    appendTo: null,
    at: null,
    autoHide: true,
    autoZIndex: true,
    baseZIndex: 0,
    className: null,
    closeOnEscape: false,
    content: null,
    disabled: false,
    event: null,
    hideDelay: 0,
    hideEvent: 'mouseleave',
    id: null,
    mouseTrack: false,
    mouseTrackLeft: 5,
    mouseTrackTop: 5,
    my: null,
    onBeforeHide: null,
    onBeforeShow: null,
    onHide: null,
    onShow: null,
    position: 'right',
    showDelay: 0,
    showEvent: 'mouseenter',
    showOnDisabled: false,
    style: null,
    target: null,
    updateDelay: 0,
    children: undefined
  },
  css: {
    classes: classes$5,
    styles: styles$2,
    inlineStyles: inlineStyles
  }
});

function ownKeys$5(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$5(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$5(Object(t), true).forEach(function (r) { _defineProperty$3(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Tooltip = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = TooltipBase.getProps(inProps, context);
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray$1(_React$useState, 2),
    visibleState = _React$useState2[0],
    setVisibleState = _React$useState2[1];
  var _React$useState3 = React.useState(props.position || 'right'),
    _React$useState4 = _slicedToArray$1(_React$useState3, 2),
    positionState = _React$useState4[0],
    setPositionState = _React$useState4[1];
  var _React$useState5 = React.useState(''),
    _React$useState6 = _slicedToArray$1(_React$useState5, 2),
    classNameState = _React$useState6[0],
    setClassNameState = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray$1(_React$useState7, 2),
    multipleFocusEvents = _React$useState8[0],
    setMultipleFocusEvents = _React$useState8[1];
  var isCloseOnEscape = visibleState && props.closeOnEscape;
  var overlayDisplayOrder = useDisplayOrder('tooltip', isCloseOnEscape);
  var metaData = {
    props: props,
    state: {
      visible: visibleState,
      position: positionState,
      className: classNameState
    },
    context: {
      right: positionState === 'right',
      left: positionState === 'left',
      top: positionState === 'top',
      bottom: positionState === 'bottom'
    }
  };
  var _TooltipBase$setMetaD = TooltipBase.setMetaData(metaData),
    ptm = _TooltipBase$setMetaD.ptm,
    cx = _TooltipBase$setMetaD.cx,
    sx = _TooltipBase$setMetaD.sx,
    isUnstyled = _TooltipBase$setMetaD.isUnstyled;
  useHandleStyle(TooltipBase.css.styles, isUnstyled, {
    name: 'tooltip'
  });
  useGlobalOnEscapeKey({
    callback: function callback() {
      hide();
    },
    when: isCloseOnEscape,
    priority: [ESC_KEY_HANDLING_PRIORITIES.TOOLTIP, overlayDisplayOrder]
  });
  var elementRef = React.useRef(null);
  var textRef = React.useRef(null);
  var currentTargetRef = React.useRef(null);
  var containerSize = React.useRef(null);
  var allowHide = React.useRef(true);
  var timeouts = React.useRef({});
  var currentMouseEvent = React.useRef(null);
  var _useResizeListener = useResizeListener({
    listener: function listener(event) {
      !DomHandler.isTouchDevice() && hide(event);
    }
  }),
    _useResizeListener2 = _slicedToArray$1(_useResizeListener, 2),
    bindWindowResizeListener = _useResizeListener2[0],
    unbindWindowResizeListener = _useResizeListener2[1];
  var _useOverlayScrollList = useOverlayScrollListener({
    target: currentTargetRef.current,
    listener: function listener(event) {
      hide(event);
    },
    when: visibleState
  }),
    _useOverlayScrollList2 = _slicedToArray$1(_useOverlayScrollList, 2),
    bindOverlayScrollListener = _useOverlayScrollList2[0],
    unbindOverlayScrollListener = _useOverlayScrollList2[1];
  var isTargetContentEmpty = function isTargetContentEmpty(target) {
    return !(props.content || getTargetOption(target, 'tooltip'));
  };
  var isContentEmpty = function isContentEmpty(target) {
    return !(props.content || getTargetOption(target, 'tooltip') || props.children);
  };
  var isMouseTrack = function isMouseTrack(target) {
    return getTargetOption(target, 'mousetrack') || props.mouseTrack;
  };
  var isDisabled = function isDisabled(target) {
    return getTargetOption(target, 'disabled') === 'true' || hasTargetOption(target, 'disabled') || props.disabled;
  };
  var isShowOnDisabled = function isShowOnDisabled(target) {
    return getTargetOption(target, 'showondisabled') || props.showOnDisabled;
  };
  var isAutoHide = function isAutoHide() {
    return getTargetOption(currentTargetRef.current, 'autohide') || props.autoHide;
  };
  var getTargetOption = function getTargetOption(target, option) {
    return hasTargetOption(target, "data-pr-".concat(option)) ? target.getAttribute("data-pr-".concat(option)) : null;
  };
  var hasTargetOption = function hasTargetOption(target, option) {
    return target && target.hasAttribute(option);
  };
  var getEvents = function getEvents(target) {
    var showEvents = [getTargetOption(target, 'showevent') || props.showEvent];
    var hideEvents = [getTargetOption(target, 'hideevent') || props.hideEvent];
    if (isMouseTrack(target)) {
      showEvents = ['mousemove'];
      hideEvents = ['mouseleave'];
    } else {
      var event = getTargetOption(target, 'event') || props.event;
      if (event === 'focus') {
        showEvents = ['focus'];
        hideEvents = ['blur'];
      }
      if (event === 'both') {
        showEvents = ['focus', 'mouseenter'];
        hideEvents = multipleFocusEvents ? ['blur'] : ['mouseleave', 'blur'];
      }
    }
    return {
      showEvents: showEvents,
      hideEvents: hideEvents
    };
  };
  var getPosition = function getPosition(target) {
    return getTargetOption(target, 'position') || positionState;
  };
  var getMouseTrackPosition = function getMouseTrackPosition(target) {
    var top = getTargetOption(target, 'mousetracktop') || props.mouseTrackTop;
    var left = getTargetOption(target, 'mousetrackleft') || props.mouseTrackLeft;
    return {
      top: top,
      left: left
    };
  };
  var updateText = function updateText(target, callback) {
    if (textRef.current) {
      var content = getTargetOption(target, 'tooltip') || props.content;
      if (content) {
        textRef.current.innerHTML = ''; // remove children
        textRef.current.appendChild(document.createTextNode(content));
        callback();
      } else if (props.children) {
        callback();
      }
    }
  };
  var updateTooltipState = function updateTooltipState(position) {
    updateText(currentTargetRef.current, function () {
      var _currentMouseEvent$cu = currentMouseEvent.current,
        x = _currentMouseEvent$cu.pageX,
        y = _currentMouseEvent$cu.pageY;
      if (props.autoZIndex && !ZIndexUtils.get(elementRef.current)) {
        ZIndexUtils.set('tooltip', elementRef.current, context && context.autoZIndex || PrimeReact.autoZIndex, props.baseZIndex || context && context.zIndex.tooltip || PrimeReact.zIndex.tooltip);
      }
      elementRef.current.style.left = '';
      elementRef.current.style.top = '';

      // GitHub #2695 disable pointer events when autohiding
      if (isAutoHide()) {
        elementRef.current.style.pointerEvents = 'none';
      }
      var mouseTrackCheck = isMouseTrack(currentTargetRef.current) || position === 'mouse';
      if (mouseTrackCheck && !containerSize.current || mouseTrackCheck) {
        containerSize.current = {
          width: DomHandler.getOuterWidth(elementRef.current),
          height: DomHandler.getOuterHeight(elementRef.current)
        };
      }
      align(currentTargetRef.current, {
        x: x,
        y: y
      }, position);
    });
  };
  var show = function show(e) {
    if (e.type && e.type === 'focus') setMultipleFocusEvents(true);
    currentTargetRef.current = e.currentTarget;
    var disabled = isDisabled(currentTargetRef.current);
    var empty = isContentEmpty(isShowOnDisabled(currentTargetRef.current) && disabled ? currentTargetRef.current.firstChild : currentTargetRef.current);
    if (empty || disabled) {
      return;
    }
    currentMouseEvent.current = e;
    if (visibleState) {
      applyDelay('updateDelay', updateTooltipState);
    } else {
      // #2653 give the callback a chance to return false and not continue with display
      var success = sendCallback(props.onBeforeShow, {
        originalEvent: e,
        target: currentTargetRef.current
      });
      if (success) {
        applyDelay('showDelay', function () {
          setVisibleState(true);
          sendCallback(props.onShow, {
            originalEvent: e,
            target: currentTargetRef.current
          });
        });
      }
    }
  };
  var hide = function hide(e) {
    if (e && e.type === 'blur') setMultipleFocusEvents(false);
    clearTimeouts();
    var success = true;
    if (visibleState) {
      success = sendCallback(props.onBeforeHide, {
        originalEvent: e,
        target: currentTargetRef.current
      });
      if (success) {
        applyDelay('hideDelay', function () {
          if (!isAutoHide() && allowHide.current === false) {
            return;
          }
          ZIndexUtils.clear(elementRef.current);
          DomHandler.removeClass(elementRef.current, 'p-tooltip-active');
          sendCallback(props.onHide, {
            originalEvent: e,
            target: currentTargetRef.current
          });
        });
      }
    }

    // handles the case when visibleState change from mouseenter was queued and mouseleave handler was called earlier than queued re-render
    if (success) {
      setVisibleState(false);
    }
  };
  var align = function align(target, coordinate, position) {
    var left = 0;
    var top = 0;
    var currentPosition = position || positionState;
    if ((isMouseTrack(target) || currentPosition == 'mouse') && coordinate) {
      var _containerSize = {
        width: DomHandler.getOuterWidth(elementRef.current),
        height: DomHandler.getOuterHeight(elementRef.current)
      };
      left = coordinate.x;
      top = coordinate.y;
      var _getMouseTrackPositio = getMouseTrackPosition(target),
        mouseTrackTop = _getMouseTrackPositio.top,
        mouseTrackLeft = _getMouseTrackPositio.left;
      switch (currentPosition) {
        case 'left':
          left = left - (_containerSize.width + mouseTrackLeft);
          top = top - (_containerSize.height / 2 - mouseTrackTop);
          break;
        case 'right':
        case 'mouse':
          left = left + mouseTrackLeft;
          top = top - (_containerSize.height / 2 - mouseTrackTop);
          break;
        case 'top':
          left = left - (_containerSize.width / 2 - mouseTrackLeft);
          top = top - (_containerSize.height + mouseTrackTop);
          break;
        case 'bottom':
          left = left - (_containerSize.width / 2 - mouseTrackLeft);
          top = top + mouseTrackTop;
          break;
      }
      if (left <= 0 || containerSize.current.width > _containerSize.width) {
        elementRef.current.style.left = '0px';
        elementRef.current.style.right = window.innerWidth - _containerSize.width - left + 'px';
      } else {
        elementRef.current.style.right = '';
        elementRef.current.style.left = left + 'px';
      }
      elementRef.current.style.top = top + 'px';
      DomHandler.addClass(elementRef.current, 'p-tooltip-active');
    } else {
      var pos = DomHandler.findCollisionPosition(currentPosition);
      var my = getTargetOption(target, 'my') || props.my || pos.my;
      var at = getTargetOption(target, 'at') || props.at || pos.at;
      elementRef.current.style.padding = '0px';
      DomHandler.flipfitCollision(elementRef.current, target, my, at, function (calculatedPosition) {
        var _calculatedPosition$a = calculatedPosition.at,
          atX = _calculatedPosition$a.x,
          atY = _calculatedPosition$a.y;
        var myX = calculatedPosition.my.x;
        var newPosition = props.at ? atX !== 'center' && atX !== myX ? atX : atY : calculatedPosition.at["".concat(pos.axis)];
        elementRef.current.style.padding = '';
        setPositionState(newPosition);
        updateContainerPosition(newPosition);
        DomHandler.addClass(elementRef.current, 'p-tooltip-active');
      });
    }
  };
  var updateContainerPosition = function updateContainerPosition(position) {
    if (elementRef.current) {
      var style = getComputedStyle(elementRef.current);
      if (position === 'left') {
        elementRef.current.style.left = parseFloat(style.left) - parseFloat(style.paddingLeft) * 2 + 'px';
      } else if (position === 'top') {
        elementRef.current.style.top = parseFloat(style.top) - parseFloat(style.paddingTop) * 2 + 'px';
      }
    }
  };
  var _onMouseEnter = function onMouseEnter() {
    if (!isAutoHide()) {
      allowHide.current = false;
    }
  };
  var _onMouseLeave = function onMouseLeave(e) {
    if (!isAutoHide()) {
      allowHide.current = true;
      hide(e);
    }
  };
  var bindTargetEvent = function bindTargetEvent(target) {
    if (target) {
      var _getEvents = getEvents(target),
        showEvents = _getEvents.showEvents,
        hideEvents = _getEvents.hideEvents;
      var currentTarget = getTarget(target);
      showEvents.forEach(function (event) {
        return currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.addEventListener(event, show);
      });
      hideEvents.forEach(function (event) {
        return currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.addEventListener(event, hide);
      });
    }
  };
  var unbindTargetEvent = function unbindTargetEvent(target) {
    if (target) {
      var _getEvents2 = getEvents(target),
        showEvents = _getEvents2.showEvents,
        hideEvents = _getEvents2.hideEvents;
      var currentTarget = getTarget(target);
      showEvents.forEach(function (event) {
        return currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.removeEventListener(event, show);
      });
      hideEvents.forEach(function (event) {
        return currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.removeEventListener(event, hide);
      });
    }
  };
  var applyDelay = function applyDelay(delayProp, callback) {
    clearTimeouts();
    var delay = getTargetOption(currentTargetRef.current, delayProp.toLowerCase()) || props[delayProp];
    delay ? timeouts.current["".concat(delayProp)] = setTimeout(function () {
      return callback();
    }, delay) : callback();
  };
  var sendCallback = function sendCallback(callback) {
    if (callback) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      var result = callback.apply(void 0, params);
      if (result === undefined) {
        result = true;
      }
      return result;
    }
    return true;
  };
  var clearTimeouts = function clearTimeouts() {
    Object.values(timeouts.current).forEach(function (t) {
      return clearTimeout(t);
    });
  };
  var getTarget = function getTarget(target) {
    if (target) {
      if (isShowOnDisabled(target)) {
        if (!target.hasWrapper) {
          var wrapper = document.createElement('div');
          var isInputElement = target.nodeName === 'INPUT';
          if (isInputElement) {
            DomHandler.addMultipleClasses(wrapper, 'p-tooltip-target-wrapper p-inputwrapper');
          } else {
            DomHandler.addClass(wrapper, 'p-tooltip-target-wrapper');
          }
          target.parentNode.insertBefore(wrapper, target);
          wrapper.appendChild(target);
          target.hasWrapper = true;
          return wrapper;
        }
        return target.parentElement;
      } else if (target.hasWrapper) {
        var _target$parentElement;
        (_target$parentElement = target.parentElement).replaceWith.apply(_target$parentElement, _toConsumableArray(target.parentElement.childNodes));
        delete target.hasWrapper;
      }
      return target;
    }
    return null;
  };
  var updateTargetEvents = function updateTargetEvents(target) {
    unloadTargetEvents(target);
    loadTargetEvents(target);
  };
  var loadTargetEvents = function loadTargetEvents(target) {
    setTargetEventOperations(target || props.target, bindTargetEvent);
  };
  var unloadTargetEvents = function unloadTargetEvents(target) {
    setTargetEventOperations(target || props.target, unbindTargetEvent);
  };
  var setTargetEventOperations = function setTargetEventOperations(target, operation) {
    target = ObjectUtils.getRefElement(target);
    if (target) {
      if (DomHandler.isElement(target)) {
        operation(target);
      } else {
        var setEvent = function setEvent(target) {
          var element = DomHandler.find(document, target);
          element.forEach(function (el) {
            operation(el);
          });
        };
        if (target instanceof Array) {
          target.forEach(function (t) {
            setEvent(t);
          });
        } else {
          setEvent(target);
        }
      }
    }
  };
  useMountEffect(function () {
    if (visibleState && currentTargetRef.current && isDisabled(currentTargetRef.current)) {
      hide();
    }
  });
  useUpdateEffect(function () {
    loadTargetEvents();
    return function () {
      unloadTargetEvents();
    };
  }, [show, hide, props.target]);
  useUpdateEffect(function () {
    if (visibleState) {
      var position = getPosition(currentTargetRef.current);
      var classname = getTargetOption(currentTargetRef.current, 'classname');
      setPositionState(position);
      setClassNameState(classname);
      updateTooltipState(position);
      bindWindowResizeListener();
      bindOverlayScrollListener();
    } else {
      setPositionState(props.position || 'right');
      setClassNameState('');
      currentTargetRef.current = null;
      containerSize.current = null;
      allowHide.current = true;
    }
    return function () {
      unbindWindowResizeListener();
      unbindOverlayScrollListener();
    };
  }, [visibleState]);
  useUpdateEffect(function () {
    var position = getPosition(currentTargetRef.current);
    if (visibleState && position !== 'mouse') {
      applyDelay('updateDelay', function () {
        updateText(currentTargetRef.current, function () {
          align(currentTargetRef.current);
        });
      });
    }
  }, [props.content]);
  useUnmountEffect(function () {
    hide();
    ZIndexUtils.clear(elementRef.current);
  });
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      updateTargetEvents: updateTargetEvents,
      loadTargetEvents: loadTargetEvents,
      unloadTargetEvents: unloadTargetEvents,
      show: show,
      hide: hide,
      getElement: function getElement() {
        return elementRef.current;
      },
      getTarget: function getTarget() {
        return currentTargetRef.current;
      }
    };
  });
  var createElement = function createElement() {
    var empty = isTargetContentEmpty(currentTargetRef.current);
    var rootProps = mergeProps({
      id: props.id,
      className: classNames(props.className, cx('root', {
        positionState: positionState,
        classNameState: classNameState
      })),
      style: props.style,
      role: 'tooltip',
      'aria-hidden': visibleState,
      onMouseEnter: function onMouseEnter(e) {
        return _onMouseEnter();
      },
      onMouseLeave: function onMouseLeave(e) {
        return _onMouseLeave(e);
      }
    }, TooltipBase.getOtherProps(props), ptm('root'));
    var arrowProps = mergeProps({
      className: cx('arrow'),
      style: sx('arrow', _objectSpread$5({}, metaData))
    }, ptm('arrow'));
    var textProps = mergeProps({
      className: cx('text')
    }, ptm('text'));
    return /*#__PURE__*/React.createElement("div", _extends$6({
      ref: elementRef
    }, rootProps), /*#__PURE__*/React.createElement("div", arrowProps), /*#__PURE__*/React.createElement("div", _extends$6({
      ref: textRef
    }, textProps), empty && props.children));
  };
  if (visibleState) {
    var element = createElement();
    return /*#__PURE__*/React.createElement(Portal, {
      element: element,
      appendTo: props.appendTo,
      visible: true
    });
  }
  return null;
}));
Tooltip.displayName = 'Tooltip';

function _extends$5() {
  _extends$5 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$5.apply(this, arguments);
}

function _typeof$2(o) {
  "@babel/helpers - typeof";

  return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$2(o);
}

function _toPrimitive$2(input, hint) {
  if (_typeof$2(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$2(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$2(arg) {
  var key = _toPrimitive$2(arg, "string");
  return _typeof$2(key) === "symbol" ? key : String(key);
}

function _defineProperty$2(obj, key, value) {
  key = _toPropertyKey$2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var classes$4 = {
  root: function root(_ref) {
    var props = _ref.props,
      isFilled = _ref.isFilled,
      context = _ref.context;
    return classNames('p-inputtext p-component', {
      'p-disabled': props.disabled,
      'p-filled': isFilled,
      'p-invalid': props.invalid,
      'p-variant-filled': props.variant ? props.variant === 'filled' : context && context.inputStyle === 'filled'
    });
  }
};
var InputTextBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'InputText',
    __parentMetadata: null,
    children: undefined,
    className: null,
    invalid: false,
    variant: null,
    keyfilter: null,
    onBeforeInput: null,
    onInput: null,
    onKeyDown: null,
    onPaste: null,
    tooltip: null,
    tooltipOptions: null,
    validateOnly: false,
    iconPosition: null
  },
  css: {
    classes: classes$4
  }
});

function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), true).forEach(function (r) { _defineProperty$2(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var InputText = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = InputTextBase.getProps(inProps, context);
  var _InputTextBase$setMet = InputTextBase.setMetaData(_objectSpread$4(_objectSpread$4({
    props: props
  }, props.__parentMetadata), {}, {
    context: {
      disabled: props.disabled,
      iconPosition: props.iconPosition
    }
  })),
    ptm = _InputTextBase$setMet.ptm,
    cx = _InputTextBase$setMet.cx,
    isUnstyled = _InputTextBase$setMet.isUnstyled;
  useHandleStyle(InputTextBase.css.styles, isUnstyled, {
    name: 'inputtext',
    styled: true
  });
  var elementRef = React.useRef(ref);
  var onKeyDown = function onKeyDown(event) {
    props.onKeyDown && props.onKeyDown(event);
    if (props.keyfilter) {
      KeyFilter.onKeyPress(event, props.keyfilter, props.validateOnly);
    }
  };
  var onBeforeInput = function onBeforeInput(event) {
    props.onBeforeInput && props.onBeforeInput(event);
    if (props.keyfilter) {
      KeyFilter.onBeforeInput(event, props.keyfilter, props.validateOnly);
    }
  };
  var onInput = function onInput(event) {
    var target = event.target;
    var validatePattern = true;
    if (props.keyfilter && props.validateOnly) {
      validatePattern = KeyFilter.validate(event, props.keyfilter);
    }
    props.onInput && props.onInput(event, validatePattern);

    // for uncontrolled changes
    ObjectUtils.isNotEmpty(target.value) ? DomHandler.addClass(target, 'p-filled') : DomHandler.removeClass(target, 'p-filled');
  };
  var onPaste = function onPaste(event) {
    props.onPaste && props.onPaste(event);
    if (props.keyfilter) {
      KeyFilter.onPaste(event, props.keyfilter, props.validateOnly);
    }
  };
  React.useEffect(function () {
    ObjectUtils.combinedRefs(elementRef, ref);
  }, [elementRef, ref]);
  var isFilled = React.useMemo(function () {
    return ObjectUtils.isNotEmpty(props.value) || ObjectUtils.isNotEmpty(props.defaultValue);
  }, [props.value, props.defaultValue]);
  var hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
  React.useEffect(function () {
    if (isFilled) {
      DomHandler.addClass(elementRef.current, 'p-filled');
    } else {
      DomHandler.removeClass(elementRef.current, 'p-filled');
    }
  }, [props.disabled, isFilled]);
  var rootProps = mergeProps({
    className: classNames(props.className, cx('root', {
      context: context,
      isFilled: isFilled
    })),
    onBeforeInput: onBeforeInput,
    onInput: onInput,
    onKeyDown: onKeyDown,
    onPaste: onPaste
  }, InputTextBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", _extends$5({
    ref: elementRef
  }, rootProps)), hasTooltip && /*#__PURE__*/React.createElement(Tooltip, _extends$5({
    target: elementRef,
    content: props.tooltip,
    pt: ptm('tooltip')
  }, props.tooltipOptions)));
}));
InputText.displayName = 'InputText';

function _extends$4() {
  _extends$4 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$4.apply(this, arguments);
}

var EyeIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z",
    fill: "currentColor"
  }));
}));
EyeIcon.displayName = 'EyeIcon';

function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}

var EyeSlashIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z",
    fill: "currentColor"
  }));
}));
EyeSlashIcon.displayName = 'EyeSlashIcon';

var OverlayService = EventBus();

function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}

function _typeof$1(o) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$1(o);
}

function _toPrimitive$1(input, hint) {
  if (_typeof$1(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$1(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$1(arg) {
  var key = _toPrimitive$1(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}

function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l); else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var classes$2 = {
  root: function root(_ref) {
    var props = _ref.props;
    return classNames('p-icon-field', {
      'p-icon-field-right': props.iconPosition === 'right',
      'p-icon-field-left': props.iconPosition === 'left'
    });
  }
};
var IconFieldBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'IconField',
    __parentMetadata: null,
    children: undefined,
    className: null,
    iconPosition: 'right'
  },
  css: {
    classes: classes$2
  }
});

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var IconField = /*#__PURE__*/React__default.memo(/*#__PURE__*/React__default.forwardRef(function (inProps, ref) {
  var elementRef = useRef(ref);
  var mergeProps = useMergeProps();
  var context = useContext(PrimeReactContext);
  var props = IconFieldBase.getProps(inProps, context);
  var _IconFieldBase$setMet = IconFieldBase.setMetaData(_objectSpread$2(_objectSpread$2({
    props: props
  }, props.__parentMetadata), {}, {
    context: {
      iconPosition: props.iconPosition
    }
  })),
    ptm = _IconFieldBase$setMet.ptm,
    cx = _IconFieldBase$setMet.cx;
  var rootProps = mergeProps({
    className: classNames(props.className, cx('root', {
      iconPosition: props.iconPosition
    }))
  }, IconFieldBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React__default.createElement("div", _extends$2({}, rootProps, {
    ref: elementRef
  }), Children.map(props.children, function (child, index) {
    return /*#__PURE__*/cloneElement(child, {
      iconPosition: props.iconPosition
    });
  }));
}));
IconField.displayName = 'IconField';

var classes$1$1 = {
  root: 'p-input-icon'
};
var InputIconBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'InputIcon',
    __parentMetadata: null,
    className: null,
    iconPosition: null
  },
  css: {
    classes: classes$1$1
  }
});

function ownKeys$1$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1$1(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var InputIcon = /*#__PURE__*/React__default.memo(/*#__PURE__*/React__default.forwardRef(function (inProps, ref) {
  var elementRef = useRef(ref);
  var mergeProps = useMergeProps();
  var context = useContext(PrimeReactContext);
  var props = InputIconBase.getProps(inProps, context);
  var _InputIconBase$setMet = InputIconBase.setMetaData(_objectSpread$1$1(_objectSpread$1$1({
    props: props
  }, props.__parentMetadata), {}, {
    context: {
      iconPosition: props.iconPosition
    }
  })),
    ptm = _InputIconBase$setMet.ptm,
    cx = _InputIconBase$setMet.cx;
  var rootProps = mergeProps({
    className: classNames(props.className, cx('root'))
  }, InputIconBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("span", _extends$2({}, rootProps, {
    ref: elementRef
  }), props.children));
}));
InputIcon.displayName = 'InputIcon';

var classes$3 = {
  root: function root(_ref) {
    var props = _ref.props,
      isFilled = _ref.isFilled,
      focusedState = _ref.focusedState;
    return classNames('p-password p-component p-inputwrapper', {
      'p-inputwrapper-filled': isFilled,
      'p-inputwrapper-focus': focusedState,
      'p-input-icon-right': props.toggleMask
    });
  },
  input: function input(_ref2) {
    var props = _ref2.props;
    return classNames('p-password-input', props.inputClassName);
  },
  panel: function panel(_ref3) {
    var props = _ref3.props,
      context = _ref3.context;
    return classNames('p-password-panel p-component', props.panelClassName, {
      'p-input-filled': context && context.inputStyle === 'filled' || PrimeReact.inputStyle === 'filled',
      'p-ripple-disabled': context && context.ripple === false || PrimeReact.ripple === false
    });
  },
  meter: 'p-password-meter',
  meterLabel: function meterLabel(_ref4) {
    var strength = _ref4.strength;
    return classNames('p-password-strength', strength);
  },
  info: function info(_ref5) {
    var strength = _ref5.strength;
    return classNames('p-password-info', strength);
  },
  showIcon: 'p-password-show-icon',
  hideIcon: 'p-password-hide-icon',
  transition: 'p-connected-overlay'
};
var styles$1 = "\n@layer primereact {\n    .p-password {\n        position: relative;\n        display: inline-flex;\n    }\n    \n    .p-password-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-password .p-password-panel {\n        min-width: 100%;\n    }\n    \n    .p-password-meter {\n        height: 10px;\n    }\n    \n    .p-password-strength {\n        height: 100%;\n        width: 0%;\n        transition: width 1s ease-in-out;\n    }\n    \n    .p-fluid .p-password {\n        display: flex;\n    }\n    \n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password .p-password-show-icon,\n    .p-password .p-password-hide-icon {\n        line-height: 1.5;\n        cursor: pointer;\n    }\n}\n";
var PasswordBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Password',
    id: null,
    inputId: null,
    inputRef: null,
    promptLabel: null,
    weakLabel: null,
    mediumLabel: null,
    strongLabel: null,
    mediumRegex: '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
    strongRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
    feedback: true,
    toggleMask: false,
    appendTo: null,
    header: null,
    content: null,
    footer: null,
    showIcon: null,
    hideIcon: null,
    icon: null,
    tooltip: null,
    tooltipOptions: null,
    style: null,
    className: null,
    inputStyle: null,
    inputClassName: null,
    invalid: false,
    variant: null,
    panelStyle: null,
    panelClassName: null,
    transitionOptions: null,
    tabIndex: null,
    value: undefined,
    onInput: null,
    onShow: null,
    onHide: null,
    children: undefined
  },
  css: {
    classes: classes$3,
    styles: styles$1
  }
});

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Password = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = PasswordBase.getProps(inProps, context);
  var promptLabel = props.promptLabel || localeOption('passwordPrompt');
  var weakLabel = props.weakLabel || localeOption('weak');
  var mediumLabel = props.mediumLabel || localeOption('medium');
  var strongLabel = props.strongLabel || localeOption('strong');
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    overlayVisibleState = _React$useState2[0],
    setOverlayVisibleState = _React$useState2[1];
  var _React$useState3 = React.useState(null),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    meterState = _React$useState4[0],
    setMeterState = _React$useState4[1];
  var _React$useState5 = React.useState(promptLabel),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    infoTextState = _React$useState6[0],
    setInfoTextState = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    focusedState = _React$useState8[0],
    setFocusedState = _React$useState8[1];
  var _React$useState9 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    unmaskedState = _React$useState10[0],
    setUnmaskedState = _React$useState10[1];
  var elementRef = React.useRef(null);
  var overlayRef = React.useRef(null);
  var inputRef = React.useRef(props.inputRef);
  var mediumCheckRegExp = React.useRef(new RegExp(props.mediumRegex));
  var strongCheckRegExp = React.useRef(new RegExp(props.strongRegex));
  var type = unmaskedState ? 'text' : 'password';
  var metaData = {
    props: props,
    state: {
      overlayVisible: overlayVisibleState,
      meter: meterState,
      infoText: infoTextState,
      focused: focusedState,
      unmasked: unmaskedState
    }
  };
  var _PasswordBase$setMeta = PasswordBase.setMetaData(metaData),
    ptm = _PasswordBase$setMeta.ptm,
    cx = _PasswordBase$setMeta.cx,
    isUnstyled = _PasswordBase$setMeta.isUnstyled;
  useHandleStyle(PasswordBase.css.styles, isUnstyled, {
    name: 'password'
  });
  var passwordDisplayOrder = useDisplayOrder('password', overlayVisibleState);
  useGlobalOnEscapeKey({
    callback: function callback() {
      hide();
    },
    when: overlayVisibleState && props.feedback && passwordDisplayOrder,
    priority: [ESC_KEY_HANDLING_PRIORITIES.PASSWORD, passwordDisplayOrder]
  });
  var _useOverlayListener = useOverlayListener({
    target: elementRef,
    overlay: overlayRef,
    listener: function listener(event, _ref) {
      var valid = _ref.valid;
      valid && hide();
    },
    when: overlayVisibleState
  }),
    _useOverlayListener2 = _slicedToArray(_useOverlayListener, 2),
    bindOverlayListener = _useOverlayListener2[0],
    unbindOverlayListener = _useOverlayListener2[1];
  var currentValue = inputRef.current && inputRef.current.value;
  var isFilled = React.useMemo(function () {
    return ObjectUtils.isNotEmpty(props.value) || ObjectUtils.isNotEmpty(props.defaultValue) || ObjectUtils.isNotEmpty(currentValue);
  }, [props.value, props.defaultValue, currentValue]);
  var updateLabels = function updateLabels() {
    if (meterState) {
      var label = null;
      switch (meterState.strength) {
        case 'weak':
          label = weakLabel;
          break;
        case 'medium':
          label = mediumLabel;
          break;
        case 'strong':
          label = strongLabel;
          break;
      }
      if (label && infoTextState !== label) {
        setInfoTextState(label);
      }
    } else if (infoTextState !== promptLabel) {
      setInfoTextState(promptLabel);
    }
  };
  var updateFeedback = function updateFeedback(value) {
    if (!props.feedback) {
      return false;
    }
    var label = null;
    var meter = null;
    switch (testStrength(value)) {
      case 1:
        label = weakLabel;
        meter = {
          strength: 'weak',
          width: '33.33%'
        };
        break;
      case 2:
        label = mediumLabel;
        meter = {
          strength: 'medium',
          width: '66.66%'
        };
        break;
      case 3:
        label = strongLabel;
        meter = {
          strength: 'strong',
          width: '100%'
        };
        break;
      default:
        label = promptLabel;
        meter = null;
        break;
    }
    setMeterState(meter);
    setInfoTextState(label);
    return true;
  };
  var onPanelClick = function onPanelClick(event) {
    if (props.feedback) {
      OverlayService.emit('overlay-click', {
        originalEvent: event,
        target: elementRef.current
      });
    }
  };
  var toggleMask = function toggleMask() {
    setUnmaskedState(function (prevUnmasked) {
      return !prevUnmasked;
    });
  };
  var show = function show() {
    updateLabels();
    setOverlayVisibleState(true);
  };
  var hide = function hide() {
    setOverlayVisibleState(false);
  };
  var alignOverlay = function alignOverlay() {
    if (inputRef.current) {
      DomHandler.alignOverlay(overlayRef.current, inputRef.current.parentElement, props.appendTo || context && context.appendTo || PrimeReact.appendTo);
    }
  };
  var onOverlayEnter = function onOverlayEnter() {
    ZIndexUtils.set('overlay', overlayRef.current, context && context.autoZIndex || PrimeReact.autoZIndex, context && context.zIndex.overlay || PrimeReact.zIndex.overlay);
    DomHandler.addStyles(overlayRef.current, {
      position: 'absolute',
      top: '0',
      left: '0'
    });
    alignOverlay();
  };
  var onOverlayEntered = function onOverlayEntered() {
    bindOverlayListener();
    props.onShow && props.onShow();
  };
  var onOverlayExit = function onOverlayExit() {
    unbindOverlayListener();
  };
  var onOverlayExited = function onOverlayExited() {
    ZIndexUtils.clear(overlayRef.current);
    props.onHide && props.onHide();
  };
  var onFocus = function onFocus(event) {
    setFocusedState(true);
    if (props.feedback) {
      show();
    }
    props.onFocus && props.onFocus(event);
  };
  var onBlur = function onBlur(event) {
    setFocusedState(false);
    if (props.feedback) {
      hide();
    }
    props.onBlur && props.onBlur(event);
  };
  var onKeyup = function onKeyup(e) {
    var keyCode = e.code;
    if (props.feedback) {
      if (!!keyCode && keyCode !== 'Escape' && !overlayVisibleState) {
        show();
      }
    }
    props.onKeyUp && props.onKeyUp(e);
  };
  var onInput = function onInput(event, validatePattern) {
    if (props.onInput) {
      props.onInput(event, validatePattern);
    }
    if (!props.onChange) {
      ObjectUtils.isNotEmpty(event.target.value) ? DomHandler.addClass(elementRef.current, 'p-inputwrapper-filled') : DomHandler.removeClass(elementRef.current, 'p-inputwrapper-filled');
    }
  };
  var testStrength = function testStrength(str) {
    if (!str || str.length === 0) {
      return 0;
    }
    if (strongCheckRegExp.current.test(str)) {
      return 3;
    } else if (mediumCheckRegExp.current.test(str)) {
      return 2;
    } else if (str.length > 0) {
      return 1;
    }
    return 0;
  };
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      toggleMask: toggleMask,
      focus: function focus() {
        return DomHandler.focus(inputRef.current);
      },
      getElement: function getElement() {
        return elementRef.current;
      },
      getOverlay: function getOverlay() {
        return overlayRef.current;
      },
      getInput: function getInput() {
        return inputRef.current;
      }
    };
  });
  React.useEffect(function () {
    ObjectUtils.combinedRefs(inputRef, props.inputRef);
  }, [inputRef, props.inputRef]);
  React.useEffect(function () {
    mediumCheckRegExp.current = new RegExp(props.mediumRegex);
  }, [props.mediumRegex]);
  React.useEffect(function () {
    strongCheckRegExp.current = new RegExp(props.strongRegex);
  }, [props.strongRegex]);
  React.useEffect(function () {
    if (!isFilled && DomHandler.hasClass(elementRef.current, 'p-inputwrapper-filled')) {
      DomHandler.removeClass(elementRef.current, 'p-inputwrapper-filled');
    }
  }, [isFilled]);
  useUpdateEffect(function () {
    updateFeedback(props.value);
  }, [props.value]);
  useMountEffect(function () {
    alignOverlay();
  });
  useUnmountEffect(function () {
    ZIndexUtils.clear(overlayRef.current);
  });
  var onToggleMaskKeyDown = function onToggleMaskKeyDown(event) {
    if (event.key === 'Enter' || event.code === 'Space') {
      toggleMask();
      event.preventDefault();
    }
  };
  var createIcon = function createIcon() {
    if (!props.toggleMask) {
      return null;
    }
    var icon;
    var hideIconProps = mergeProps({
      role: 'switch',
      tabIndex: props.tabIndex || '0',
      className: cx('hideIcon'),
      onClick: toggleMask,
      onKeyDown: onToggleMaskKeyDown,
      'aria-label': ariaLabel('passwordHide') || 'Hide Password',
      'aria-checked': 'false'
    }, ptm('hideIcon'));
    var showIconProps = mergeProps({
      role: 'switch',
      tabIndex: props.tabIndex || '0',
      className: cx('showIcon'),
      onClick: toggleMask,
      onKeyDown: onToggleMaskKeyDown,
      'aria-label': ariaLabel('passwordShow') || 'Show Password',
      'aria-checked': 'true'
    }, ptm('showIcon'));
    if (unmaskedState) {
      icon = props.hideIcon || /*#__PURE__*/React.createElement(EyeSlashIcon, hideIconProps);
    } else {
      icon = props.showIcon || /*#__PURE__*/React.createElement(EyeIcon, showIconProps);
    }
    var eyeIcon = IconUtils.getJSXIcon(icon, unmaskedState ? _objectSpread$3({}, hideIconProps) : _objectSpread$3({}, showIconProps), {
      props: props
    });
    var content = eyeIcon;
    if (props.icon) {
      var defaultIconOptions = {
        onClick: toggleMask,
        className: className,
        element: content,
        props: props
      };
      content = ObjectUtils.getJSXElement(props.icon, defaultIconOptions);
    }
    return content;
  };
  var createPanel = function createPanel() {
    var _ref2 = meterState || {
      strength: '',
      width: '0%'
    },
      strength = _ref2.strength,
      width = _ref2.width;
    var header = ObjectUtils.getJSXElement(props.header, props);
    var footer = ObjectUtils.getJSXElement(props.footer, props);
    var panelProps = mergeProps({
      className: cx('panel', {
        context: context
      }),
      style: props.panelStyle,
      onClick: onPanelClick
    }, ptm('panel'));
    var meterProps = mergeProps({
      className: cx('meter')
    }, ptm('meter'));
    var meterLabelProps = mergeProps({
      className: cx('meterLabel', {
        strength: strength
      }),
      style: {
        width: width
      }
    }, ptm('meterLabel'));
    var infoProps = mergeProps({
      className: cx('info', {
        strength: strength
      })
    }, ptm('info'));
    var content = props.content ? ObjectUtils.getJSXElement(props.content, props) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", meterProps, /*#__PURE__*/React.createElement("div", meterLabelProps)), /*#__PURE__*/React.createElement("div", infoProps, infoTextState));
    var transitionProps = mergeProps({
      classNames: cx('transition'),
      "in": overlayVisibleState,
      timeout: {
        enter: 120,
        exit: 100
      },
      options: props.transitionOptions,
      unmountOnExit: true,
      onEnter: onOverlayEnter,
      onEntered: onOverlayEntered,
      onExit: onOverlayExit,
      onExited: onOverlayExited
    }, ptm('transition'));
    var panel = /*#__PURE__*/React.createElement(CSSTransition, _extends$2({
      nodeRef: overlayRef
    }, transitionProps), /*#__PURE__*/React.createElement("div", _extends$2({
      ref: overlayRef
    }, panelProps), header, content, footer));
    return /*#__PURE__*/React.createElement(Portal, {
      element: panel,
      appendTo: props.appendTo
    });
  };
  var className = classNames('p-password p-component p-inputwrapper', {
    'p-inputwrapper-filled': isFilled,
    'p-inputwrapper-focus': focusedState,
    'p-input-icon-right': props.toggleMask
  }, props.className);
  var inputProps = PasswordBase.getOtherProps(props);
  var icon = createIcon();
  var panel = createPanel();
  var rootProps = mergeProps({
    ref: elementRef,
    id: props.id,
    className: classNames(props.className, cx('root', {
      isFilled: isFilled,
      focusedState: focusedState
    })),
    style: props.style
  }, ptm('root'));
  var inputTextProps = mergeProps(_objectSpread$3(_objectSpread$3({
    ref: inputRef,
    id: props.inputId
  }, inputProps), {}, {
    className: classNames(props.inputClassName, cx('input')),
    onBlur: onBlur,
    onFocus: onFocus,
    onInput: onInput,
    onKeyUp: onKeyup,
    invalid: props.invalid,
    variant: props.variant,
    style: props.inputStyle,
    unstyled: props.unstyled,
    tabIndex: props.tabIndex || '0',
    tooltip: props.tooltip,
    tooltipOptions: props.tooltipOptions,
    type: type,
    value: props.value,
    __parentMetadata: {
      parent: metaData
    }
  }), ptm('input'));
  var input = /*#__PURE__*/React.createElement(InputText, inputTextProps);
  if (icon) {
    input = /*#__PURE__*/React.createElement(IconField, {
      className: cx('iconField'),
      pt: ptm('iconField'),
      __parentMetadata: {
        parent: metaData
      }
    }, input, /*#__PURE__*/React.createElement(InputIcon, {
      className: cx('inputIcon'),
      pt: ptm('inputIcon'),
      __parentMetadata: {
        parent: metaData
      }
    }, icon));
  }
  return /*#__PURE__*/React.createElement("div", rootProps, input, panel);
}));
Password.displayName = 'Password';

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}

var SpinnerIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }));
}));
SpinnerIcon.displayName = 'SpinnerIcon';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var classes$1 = {
  root: function root(_ref) {
    var props = _ref.props;
    return classNames('p-badge p-component', _defineProperty({
      'p-badge-no-gutter': ObjectUtils.isNotEmpty(props.value) && String(props.value).length === 1,
      'p-badge-dot': ObjectUtils.isEmpty(props.value),
      'p-badge-lg': props.size === 'large',
      'p-badge-xl': props.size === 'xlarge'
    }, "p-badge-".concat(props.severity), props.severity !== null));
  }
};
var styles = "\n@layer primereact {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n    \n    .p-overlay-badge {\n        position: relative;\n    }\n    \n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n    \n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n    \n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n";
var BadgeBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Badge',
    __parentMetadata: null,
    value: null,
    severity: null,
    size: null,
    style: null,
    className: null,
    children: undefined
  },
  css: {
    classes: classes$1,
    styles: styles
  }
});

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Badge = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = BadgeBase.getProps(inProps, context);
  var _BadgeBase$setMetaDat = BadgeBase.setMetaData(_objectSpread$1({
    props: props
  }, props.__parentMetadata)),
    ptm = _BadgeBase$setMetaDat.ptm,
    cx = _BadgeBase$setMetaDat.cx,
    isUnstyled = _BadgeBase$setMetaDat.isUnstyled;
  useHandleStyle(BadgeBase.css.styles, isUnstyled, {
    name: 'badge'
  });
  var elementRef = React.useRef(null);
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      getElement: function getElement() {
        return elementRef.current;
      }
    };
  });
  var rootProps = mergeProps({
    ref: elementRef,
    style: props.style,
    className: classNames(props.className, cx('root'))
  }, BadgeBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement("span", rootProps, props.value);
}));
Badge.displayName = 'Badge';

var classes = {
  icon: function icon(_ref) {
    var props = _ref.props;
    return classNames('p-button-icon p-c', _defineProperty({}, "p-button-icon-".concat(props.iconPos), props.label));
  },
  loadingIcon: function loadingIcon(_ref2) {
    var props = _ref2.props,
      className = _ref2.className;
    return classNames(className, {
      'p-button-loading-icon': props.loading
    });
  },
  label: 'p-button-label p-c',
  root: function root(_ref3) {
    var props = _ref3.props,
      size = _ref3.size,
      disabled = _ref3.disabled;
    return classNames('p-button p-component', _defineProperty(_defineProperty(_defineProperty(_defineProperty({
      'p-button-icon-only': (props.icon || props.loading) && !props.label && !props.children,
      'p-button-vertical': (props.iconPos === 'top' || props.iconPos === 'bottom') && props.label,
      'p-disabled': disabled,
      'p-button-loading': props.loading,
      'p-button-outlined': props.outlined,
      'p-button-raised': props.raised,
      'p-button-link': props.link,
      'p-button-text': props.text,
      'p-button-rounded': props.rounded,
      'p-button-loading-label-only': props.loading && !props.icon && props.label
    }, "p-button-loading-".concat(props.iconPos), props.loading && props.label), "p-button-".concat(size), size), "p-button-".concat(props.severity), props.severity), 'p-button-plain', props.plain));
  }
};
var ButtonBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Button',
    __parentMetadata: null,
    badge: null,
    badgeClassName: null,
    className: null,
    children: undefined,
    disabled: false,
    icon: null,
    iconPos: 'left',
    label: null,
    link: false,
    loading: false,
    loadingIcon: null,
    outlined: false,
    plain: false,
    raised: false,
    rounded: false,
    severity: null,
    size: null,
    text: false,
    tooltip: null,
    tooltipOptions: null,
    visible: true
  },
  css: {
    classes: classes
  }
});

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Button = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = ButtonBase.getProps(inProps, context);
  var disabled = props.disabled || props.loading;
  var metaData = _objectSpread(_objectSpread({
    props: props
  }, props.__parentMetadata), {}, {
    context: {
      disabled: disabled
    }
  });
  var _ButtonBase$setMetaDa = ButtonBase.setMetaData(metaData),
    ptm = _ButtonBase$setMetaDa.ptm,
    cx = _ButtonBase$setMetaDa.cx,
    isUnstyled = _ButtonBase$setMetaDa.isUnstyled;
  useHandleStyle(ButtonBase.css.styles, isUnstyled, {
    name: 'button',
    styled: true
  });
  var elementRef = React.useRef(ref);
  React.useEffect(function () {
    ObjectUtils.combinedRefs(elementRef, ref);
  }, [elementRef, ref]);
  if (props.visible === false) {
    return null;
  }
  var createIcon = function createIcon() {
    var className = classNames('p-button-icon p-c', _defineProperty({}, "p-button-icon-".concat(props.iconPos), props.label));
    var iconsProps = mergeProps({
      className: cx('icon')
    }, ptm('icon'));
    className = classNames(className, {
      'p-button-loading-icon': props.loading
    });
    var loadingIconProps = mergeProps({
      className: cx('loadingIcon', {
        className: className
      })
    }, ptm('loadingIcon'));
    var icon = props.loading ? props.loadingIcon || /*#__PURE__*/React.createElement(SpinnerIcon, _extends({}, loadingIconProps, {
      spin: true
    })) : props.icon;
    return IconUtils.getJSXIcon(icon, _objectSpread({}, iconsProps), {
      props: props
    });
  };
  var createLabel = function createLabel() {
    var labelProps = mergeProps({
      className: cx('label')
    }, ptm('label'));
    if (props.label) {
      return /*#__PURE__*/React.createElement("span", labelProps, props.label);
    }
    return !props.children && !props.label && /*#__PURE__*/React.createElement("span", _extends({}, labelProps, {
      dangerouslySetInnerHTML: {
        __html: '&nbsp;'
      }
    }));
  };
  var createBadge = function createBadge() {
    if (props.badge) {
      var badgeProps = mergeProps({
        className: classNames(props.badgeClassName),
        value: props.badge,
        unstyled: props.unstyled,
        __parentMetadata: {
          parent: metaData
        }
      }, ptm('badge'));
      return /*#__PURE__*/React.createElement(Badge, badgeProps, props.badge);
    }
    return null;
  };
  var showTooltip = !disabled || props.tooltipOptions && props.tooltipOptions.showOnDisabled;
  var hasTooltip = ObjectUtils.isNotEmpty(props.tooltip) && showTooltip;
  var sizeMapping = {
    large: 'lg',
    small: 'sm'
  };
  var size = sizeMapping[props.size];
  var icon = createIcon();
  var label = createLabel();
  var badge = createBadge();
  var defaultAriaLabel = props.label ? props.label + (props.badge ? ' ' + props.badge : '') : props['aria-label'];
  var rootProps = mergeProps({
    ref: elementRef,
    'aria-label': defaultAriaLabel,
    'data-pc-autofocus': props.autoFocus,
    className: classNames(props.className, cx('root', {
      size: size,
      disabled: disabled
    })),
    disabled: disabled
  }, ButtonBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", rootProps, icon, label, props.children, badge, /*#__PURE__*/React.createElement(Ripple, null)), hasTooltip && /*#__PURE__*/React.createElement(Tooltip, _extends({
    target: elementRef,
    content: props.tooltip,
    pt: ptm('tooltip')
  }, props.tooltipOptions)));
}));
Button.displayName = 'Button';

const firebaseConfig = {
  apiKey: "AIzaSyBgikvsur0oHXH3al8oa8sQwKQ58FHPwMY",
  authDomain: "cashier-thru.firebaseapp.com",
  databaseURL: "https://cashier-thru-default-rtdb.firebaseio.com",
  projectId: "cashier-thru",
  storageBucket: "cashier-thru.firebasestorage.app",
  messagingSenderId: "675561190760",
  appId: "1:675561190760:web:1d0cc394c3bc113aa452dd",
  measurementId: "G-C5EM0V4EH6",
};

const app = initializeApp(firebaseConfig);
getFirestore(app);
getStorage(app);
const auth = getAuth(app);

const addUserToDatabase = async (data, action) => {
  try {
    const { data: response } = await $api.post(
      "register-social",
      transformUserData(data)
    );
    if (response?.data?.status !== 200) {
      toast.error(` فشل تسجيل الدخول : ${response?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      throw new Error(response?.message);
    } else {
      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });
      toast.success("تم تسجيل الدخول بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true
      });
      if (action) {
        action();
      }
    }
  } catch (err) {
    console.log(err.response?.data?.message);
    toast.error(` فشل تسجيل الدخول : ${err?.response?.data?.message}`, {
      position: "top-right",
      autoClose: 2e3,
      rtl: true
    });
  }
};
function transformUserData(data) {
  const formData = new FormData();
  formData.append("register_type", "2");
  formData.append("social_id", data?.uid);
  if (data?.displayName) {
    formData.append("name", data?.displayName);
  }
  if (data?.email) {
    formData.append("email", data?.email);
  }
  if (data?.photoURL) {
    formData.append("image", data?.photoURL);
  }
  return formData;
}
const useLoginHook = () => {
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const login = async (inputs) => {
    try {
      setLoading(true);
      const { data: response } = await $api.post(
        `login-user`,
        transformInput(inputs)
      );
      toast.success("تم تسجيل الدخول بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true
      });
      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });
      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        routes.replace("/");
        routes.refresh();
      }
    } catch (error) {
      toast.error(` فشل تسجيل الدخول : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const register = async (inputs) => {
    try {
      setLoading(true);
      const { data: response } = await $api.post(
        `register-user`,
        transformRegisterInput(inputs)
      );
      routes.push(`/verify/${response?.data?.email}`);
    } catch (error) {
      toast.error(` فشل التسجيل : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    login,
    register
  };
};
const transformInput = (inputs) => {
  const formData = new FormData();
  formData.append("type", "1");
  formData.append("email", inputs?.email);
  formData.append("password", inputs?.password);
  return formData;
};
const transformRegisterInput = (inputs) => {
  const formData = new FormData();
  formData.append("name", inputs?.name);
  formData.append("email", inputs?.email);
  formData.append("password", inputs?.password);
  formData.append("password_confirmation", inputs?.confirmPassword);
  formData.append("register_type", "1");
  formData.append("phone", inputs?.phone);
  return formData;
};

const loginWithGoogle = async ({
  action = () => {
  }
}) => {
  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    console.log("logged in with google", user);
    await addUserToDatabase(user, action);
  } catch (error) {
    console.log("failed to login with google", error);
  }
};

const formSchema$1 = z.object({
  email: z.string().email("يجب أن يكون عنوان البريد الإلكتروني صالحًا"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل")
});
const formSchemaDefaultValues$1 = {
  email: "",
  password: ""
};

function CircleLogo({
  src,
  alt = "logo",
  size = 80,
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: { width: size, height: size },
      className: `rounded-full overflow-hidden ${className}`,
      children: /* @__PURE__ */ jsx(
        Image,
        {
          src,
          alt,
          width: size,
          height: size,
          className: "w-full h-full object-cover"
        }
      )
    }
  );
}

function LoginForm({
  initSettings,
  onSwitchToRegister,
  onSwitchToForgotPassword
}) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: formSchemaDefaultValues$1,
    resolver: zodResolver(formSchema$1)
  });
  const { loading, login } = useLoginHook();
  const onSubmit = async (inputs) => {
    await login(inputs);
  };
  useEffect(() => {
    if (Cookies.get("app_token")) {
      router.push("/");
    }
  }, [router]);
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit(onSubmit),
      className: "my-8 w-[350px] max-w-full space-y-6",
      dir: "rtl",
      children: [
        /* @__PURE__ */ jsxs("div", {
        className: "flex w-full flex-col items-center justify-center gap-2 text-center", children: [
          initSettings?.logo && /* @__PURE__ */ jsx(CircleLogo, { src: initSettings?.logo, className: "mr-2" }),
          /* @__PURE__ */ jsxs("div", {
            className: "mb-4 mt-8 flex w-full flex-col items-center justify-center gap-3 text-black", children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex w-full items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { children: " مرحبًا بك في " }),
              /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold text-[var(--main-color)]", children: initSettings?.name ? initSettings?.name : "" })
              ]
            }),
              "يرجى تسجيل الدخول لإجراء الطلب"
            ]
          })
        ]
      }),
        /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-stretch justify-center gap-4", children: [
          /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            loading,
            onClick: () => loginWithGoogle({ action: () => router.push("/") }),
            className: "mx-auto flex h-12 w-full flex-row-reverse items-center justify-center gap-2 rounded-full bg-orange-700 text-center text-white !shadow-none !outline-none",
            icon: /* @__PURE__ */ jsx(
              Image,
              {
                src: "/icons8-google.svg",
                alt: "Google Icon",
                width: 28,
                height: 28,
                className: "mr-[6px]"
              }
            ),
            children: "Sign In with Google"
          }
        ),
          /* @__PURE__ */ jsx("h6", { className: "text-center text-[18px] font-semibold text-black", children: "أو" })
        ]
      }),
        /* @__PURE__ */ jsxs("div", {
        className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "email",
              className: "mb-3 block text-sm font-medium text-black",
              children: "البريد الإلكتروني"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              InputText,
              {
                id: "email",
                type: "email",
                ...register("email"),
                className: "w-full rounded-md border border-gray-500 px-2 py-3"
              }
            ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
            ]
          })
          ]
        }),
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "password",
              className: "mb-3 block text-sm font-medium text-black",
              children: "كلمة المرور"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              Password,
              {
                id: "password",
                ...register("password"),
                name: "password",
                onChange: (e) => setValue("password", e.target.value && e.target.value),
                inputRef: register("password").ref,
                ptOptions: { mergeSections: true, mergeProps: true },
                toggleMask: true,
                feedback: false,
                className: "password flex w-full items-center justify-stretch rounded-md border border-gray-500",
                inputClassName: "w-full px-2 py-3 min-w-full"
              }
            ),
              errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })
            ]
          })
          ]
        })
        ]
      }),
        /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            label: "تسجيل الدخول",
            className: "w-full bg-[var(--main-color)] px-3 py-4 text-white",
            loading
          }
        )
      }),
        /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("div", {
          className: "flex gap-1 text-sm text-black", children: onSwitchToRegister ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onSwitchToRegister,
              className: "text-[var(--main-color)] hover:underline",
              children: "أنشاء حساب جديد"
            }
          ) : /* @__PURE__ */ jsx(Link, { href: "/auth/register", className: "text-[var(--main-color)]", children: "أنشاء حساب جديد" })
        }),
          /* @__PURE__ */ jsx("div", {
          className: "text-sm text-black", children: onSwitchToForgotPassword ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onSwitchToForgotPassword,
              className: "text-[var(--second-color)] hover:underline",
              children: "نسيت كلمة المرور ؟"
            }
          ) : /* @__PURE__ */ jsx(Link, { href: "/auth/forgot-password", className: "text-[var(--second-color)]", children: "نسيت كلمة المرور ؟" })
        })
        ]
      })
      ]
    }
  );
}

const registerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم مكونًا من حرفين على الأقل"),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  phone: z.string().min(11, "يجب أن يكون رقم الهاتف مكونًا من 11 رقمًا"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل")
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
});
function RegisterForm({
  initSettings,
  onSwitchToLogin
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    // watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const { loading, register: registerUser } = useLoginHook();
  const onSubmit = async (inputs) => {
    await registerUser(inputs);
  };
  const token = Cookies.get("app_token");
  if (token) {
    router.push("/");
  }
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit(onSubmit),
      className: "my-8 w-[350px] max-w-full space-y-6",
      dir: "rtl",
      children: [
        /* @__PURE__ */ jsxs("div", {
        className: "flex w-full flex-col items-center justify-center gap-2 text-center", children: [
          initSettings?.logo && /* @__PURE__ */ jsx(CircleLogo, { src: initSettings?.logo, className: "mr-2" }),
          /* @__PURE__ */ jsxs("div", {
            className: "mb-4 mt-8 flex w-full flex-col items-center justify-center gap-3 text-black", children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex w-full items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { children: " مرحبًا بك في " }),
              /* @__PURE__ */ jsx("h4", { className: "text-[15px] font-semibold text-[var(--main-color)]", children: initSettings?.name ? initSettings?.name : "" })
              ]
            }),
              "يرجى تسجيل الدخول لإجراء الطلب"
            ]
          })
        ]
      }),
        /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-stretch justify-center gap-4", children: [
          /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            loading,
            onClick: () => loginWithGoogle({ action: () => router.push("/") }),
            className: "mx-auto flex h-12 w-full flex-row-reverse items-center justify-center gap-2 rounded-full bg-orange-700 text-center text-white !shadow-none !outline-none",
            icon: /* @__PURE__ */ jsx(
              Image,
              {
                src: "/icons8-google.svg",
                alt: "Google Icon",
                width: 28,
                height: 28,
                className: "mr-[6px]"
              }
            ),
            children: "Sign In with Google"
          }
        ),
          /* @__PURE__ */ jsx("h6", { className: "text-center text-[18px] font-semibold text-black", children: "أو" })
        ]
      }),
        /* @__PURE__ */ jsxs("div", {
        className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "name",
              className: "mb-3 block text-sm font-medium text-black",
              children: "الاسم الكامل"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              InputText,
              {
                id: "name",
                ...register("name"),
                className: "w-full rounded-md border border-gray-400 px-2 py-3"
              }
            ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
            ]
          })
          ]
        }),
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "email",
              className: "mb-3 block text-sm font-medium text-black",
              children: "البريد الإلكتروني"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              InputText,
              {
                id: "email",
                type: "email",
                ...register("email"),
                className: "w-full rounded-md border border-gray-400 px-2 py-3"
              }
            ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
            ]
          })
          ]
        }),
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "phone",
              className: "mb-3 block text-sm font-medium text-black",
              children: "رقم الهاتف"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              InputText,
              {
                id: "phone",
                type: "text",
                ...register("phone"),
                className: "w-full rounded-md border border-gray-400 px-2 py-3"
              }
            ),
              errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phone.message })
            ]
          })
          ]
        }),
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "password",
              className: "mb-3 block text-sm font-medium text-black",
              children: "كلمة المرور"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              Password,
              {
                id: "password",
                ...register("password"),
                name: "password",
                onChange: (e) => setValue("password", e.target.value && e.target.value),
                inputRef: register("password").ref,
                ptOptions: { mergeSections: true, mergeProps: true },
                toggleMask: true,
                feedback: false,
                className: "password flex w-full items-center justify-stretch",
                inputClassName: "w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
              }
            ),
              errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })
            ]
          })
          ]
        }),
          /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "confirmPassword",
              className: "mb-3 block text-sm font-medium text-black",
              children: "تأكيد كلمة المرور"
            }
          ),
            /* @__PURE__ */ jsxs("div", {
            className: "mt-1", children: [
              /* @__PURE__ */ jsx(
              Password,
              {
                id: "confirmPassword",
                ...register("confirmPassword"),
                name: "confirmPassword",
                inputRef: register("confirmPassword").ref,
                toggleMask: true,
                onChange: (e) => setValue("confirmPassword", e.target.value),
                feedback: false,
                className: "password w-full",
                inputClassName: "w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
              }
            ),
              errors.confirmPassword && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message })
            ]
          })
          ]
        })
        ]
      }),
        /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            label: "إنشاء حساب",
            className: "w-full bg-[var(--main-color)] py-4 text-white"
          }
        )
      }),
        /* @__PURE__ */ jsx("div", {
        className: "text-center", children: /* @__PURE__ */ jsxs("div", {
          className: "flex w-full justify-center gap-1 text-sm text-black", children: [
          /* @__PURE__ */ jsx("span", { children: " هل لديك حساب بالفعل ؟" }),
            onSwitchToLogin ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onSwitchToLogin,
                className: "text-[var(--main-color)] hover:underline",
                children: "تسجيل الدخول"
              }
            ) : /* @__PURE__ */ jsx(Link, { href: "/auth/login", className: "text-[var(--main-color)]", children: "تسجيل الدخول" })
          ]
        })
      })
      ]
    }
  );
}

z.object({
  new_password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  new_password_confirmation: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "كلمات المرور غير متطابقة",
  path: ["new_password_confirmation"]
});
const ForgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح")
});
const formSchema = ForgotPasswordSchema;
const formSchemaDefaultValues = { email: "" };

const useForgotPasswordHook = () => {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();
  const sendOtp = async (data) => {
    setLoading(true);
    try {
      const { data: response } = await $api.post("/send-otp", data);
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      console.log(response);
      setCurrentEmail(data.email);
      setShowResetForm(true);
      return true;
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال رمز التحقق"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const { data: response } = await $api.post("/send-otp", {
        email: email || currentEmail
      });
      toast.success("تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني");
      console.log(response);
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "حدث خطأ أثناء إعادة إرسال رمز التحقق");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (data) => {
    setResetLoading(true);
    try {
      const { data: response } = await $api.post("/reset-password", {
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
        token: Cookies.get("verify_token")
      });
      if (response.status === 200) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        Cookies.remove("verify_token");
        router.push("/auth/login");
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
      return false;
    } finally {
      setResetLoading(false);
    }
  };
  const verifyEmail = async (email, code) => {
    try {
      setLoading(true);
      const { data: response } = await $api.post(
        `verify-otp?email=${email}&otp=${code}`
      );
      console.log(response);
      Cookies.set("verify_token", response?.token, {
        expires: 1,
        path: "/"
      });
      toast.success("تم التحقق من البريد الإلكتروني بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true
      });
      return response;
    } catch (error) {
      toast.error(
        `فشل التحقق: ${error?.response?.data?.message || "حدث خطأ ما"}`,
        {
          position: "top-right",
          autoClose: 2e3,
          rtl: true
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    resetLoading,
    sendOtp,
    resendOtp,
    resetPassword,
    currentEmail,
    showResetForm,
    setShowResetForm,
    verifyEmail
  };
};

function ForgotPasswordForm({
  initSettings,
  onSwitchToLogin
}) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema)
  });
  const { loading, sendOtp } = useForgotPasswordHook();
  const onSubmit = async (inputs) => {
    const success = await sendOtp(inputs);
    if (success) {
      router.push(`/forgot-password/${inputs.email}`);
    }
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit(onSubmit),
      className: "my-8 w-[350px] max-w-full space-y-6",
      dir: "rtl",
      children: [
        /* @__PURE__ */ jsxs("div", {
        className: "flex w-full flex-col items-center justify-center gap-2 text-center", children: [
          initSettings?.logo && /* @__PURE__ */ jsx(CircleLogo, { src: initSettings?.logo, className: "mr-2" }),
          /* @__PURE__ */ jsxs("div", {
            className: "mb-4 mt-8 flex w-full flex-col items-center justify-center gap-3 text-black", children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex w-full items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { children: " استعادة كلمة المرور " }),
              /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold text-[var(--main-color)]", children: initSettings?.name ? initSettings?.name : "" })
              ]
            }),
              "أدخل بريدك الإلكتروني لاستلام رمز التحقق"
            ]
          })
        ]
      }),
        /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx("div", {
          className: "space-y-4", children: /* @__PURE__ */ jsxs("div", {
            children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "email",
                className: "mb-3 block text-sm font-medium text-black",
                children: "البريد الإلكتروني"
              }
            ),
            /* @__PURE__ */ jsxs("div", {
              className: "mt-1", children: [
              /* @__PURE__ */ jsx(
                InputText,
                {
                  id: "email",
                  type: "email",
                  ...register("email"),
                  className: "w-full rounded-md border border-gray-500 px-2 py-3"
                }
              ),
                errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
              ]
            })
            ]
          })
        }),
          /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              label: "إرسال رمز التحقق",
              className: "w-full bg-[var(--main-color)] px-3 py-4 text-white",
              loading
            }
          )
        })
        ]
      }),
        /* @__PURE__ */ jsx("div", {
        className: "flex items-center justify-center gap-2", children: /* @__PURE__ */ jsxs("div", {
          className: "flex gap-1 text-sm text-black", children: [
          /* @__PURE__ */ jsx("span", { children: "لديك حساب بالفعل؟" }),
            onSwitchToLogin ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onSwitchToLogin,
                className: "text-[var(--main-color)] hover:underline",
                children: "تسجيل الدخول"
              }
            ) : /* @__PURE__ */ jsx(Link, { href: "/auth/login", className: "text-[var(--main-color)]", children: "تسجيل الدخول" })
          ]
        })
      })
      ]
    }
  );
}

function AuthDialog({
  visible,
  onHide,
  initSettings
}) {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleSwitchToRegister = () => {
    setShowForgotPassword(false);
    setShowRegister(true);
  };
  const handleSwitchToLogin = () => {
    setShowForgotPassword(false);
    setShowRegister(false);
  };
  const handleSwitchToForgotPassword = () => {
    setShowForgotPassword(true);
  };
  const handleHide = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    onHide();
  };
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      visible,
      onHide: handleHide,
      modal: true,
      header: null,
      footer: null,
      dismissableMask: true,
      closable: true,
      className: "w-[90%] max-w-[400px] !rounded-2xl overflow-hidden",
      contentClassName: "!rounded-2xl",
      showHeader: false,
      maskClassName: "!bg-black/50",
      children: /* @__PURE__ */ jsx("div", {
        className: "bg-white rounded-2xl overflow-hidden", children: showForgotPassword ? /* @__PURE__ */ jsx(
          ForgotPasswordForm,
          {
            initSettings,
            onSwitchToLogin: handleSwitchToLogin
          }
        ) : showRegister ? /* @__PURE__ */ jsx(
          RegisterForm,
          {
            initSettings,
            onSwitchToLogin: handleSwitchToLogin
          }
        ) : /* @__PURE__ */ jsx(
          LoginForm,
          {
            initSettings,
            onSwitchToRegister: handleSwitchToRegister,
            onSwitchToForgotPassword: handleSwitchToForgotPassword
          }
        )
      })
    }
  );
}

function Header({ currentPath = "", initialIsLoggedIn = false, settingsData }) {
  const { settings: contextSettings, isLogin: contextIsLogin, cartCount } = useSettings();
  const settings = settingsData || contextSettings;
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn || contextIsLogin);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
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
      setShowAuthDialog(true);
    }
  };
  const openAuthDialog = () => {
    setShowAuthDialog(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        className: "\r\n          sticky top-0 z-40\r\n          border-b border-black/5\r\n          bg-[var(--main-background)]/90\r\n          backdrop-blur supports-[backdrop-filter]:backdrop-blur\r\n        ",
        children: /* @__PURE__ */ jsxs("div", {
          className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex h-16 items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/",
                "aria-label": "الذهاب للصفحة الرئيسية",
                className: "flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsx("div", {
                  className: "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm", children: settings?.logo ? /* @__PURE__ */ jsx(
                    Image,
                    {
                      src: settings.logo,
                      alt: settings?.name || "شعار المتجر",
                      fill: true,
                      sizes: "44px",
                      className: "object-contain",
                      priority: true
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: settings?.name?.charAt(0) || "S" })
                }),
                  settings?.name && /* @__PURE__ */ jsx("span", { className: "hidden text-lg font-semibold text-[var(--main-font-color)] sm:block", children: settings.name })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "hidden flex-1 md:flex md:justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx(SearchBar, {}) }) }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: isLoggedIn ? "/cart" : "#",
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
                  onLogout: handleLogout,
                  onOpenAuthDialog: openAuthDialog
                }
              )
              ]
            })
            ]
          }),
          /* @__PURE__ */ jsx("div", { className: "pb-3 pt-1 md:hidden", children: /* @__PURE__ */ jsx(SearchBar, {}) })
          ]
        })
      }
    ),
    /* @__PURE__ */ jsx(
      AuthDialog,
      {
        visible: showAuthDialog,
        onHide: () => setShowAuthDialog(false),
        initSettings: settings || {}
      }
    )
    ]
  });
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
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto px-4 py-8 md:py-10", children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-6 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3", children: [
              settings?.logo && /* @__PURE__ */ jsx("div", {
                className: "relative h-10 w-10 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10", children: /* @__PURE__ */ jsx(
                  Image,
                  {
                    src: settings.logo,
                    alt: siteName,
                    fill: true,
                    sizes: "40px",
                    className: "object-contain p-1.5"
                  }
                )
              }),
            /* @__PURE__ */ jsxs("div", {
                className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold tracking-wide text-[var(--main-color)]", children: siteName }),
                  settings?.about_us && /* @__PURE__ */ jsx("p", { className: "max-w-md text-xs leading-relaxed text-gray-300", children: settings.about_us }),
                  settings?.phone && /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-wrap gap-2 text-xs text-gray-400", children: [
                /* @__PURE__ */ jsx(Phone, { size: 12, className: "mt-0.5" }),
                      settings.phone.split(" ").map((p) => /* @__PURE__ */ jsx("a", { href: `tel:${p}`, className: "hover:text-white", children: p }, p))
                    ]
                  })
                ]
              })
            ]
          }),
            (hasFacebook || hasInstagram) && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 max-md:hidden", children: "تابعنا على" }),
            /* @__PURE__ */ jsxs("div", {
                className: "flex gap-2", children: [
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
                ]
              })
              ]
            })
          ]
        }),
        /* @__PURE__ */ jsx("div", {
          className: "mt-6 border-t border-white/10 pt-4", children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center justify-between gap-3 text-xs text-gray-400 md:flex-row", children: [
          /* @__PURE__ */ jsxs("p", {
              className: "text-center md:text-right", children: [
                "© ",
                year,
                " ",
                siteName,
                ". جميع الحقوق محفوظة."
              ]
            }),
              appVersion && /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex h-2 w-2 rounded-full bg-[var(--main-color)]" }),
            /* @__PURE__ */ jsxs("span", {
                  className: "rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-200", children: [
                    "الإصدار ",
                    appVersion
                  ]
                })
                ]
              })
            ]
          })
        })
        ]
      })
    }
  );
}

const version = "0.2.0";
const packageJson = {
  version: version
};

export { $api as $, Dialog as A, Button as B, ComponentBase as C, DomHandler as D, InputText as E, Footer as F, useSearchParams as G, Header as H, Image as I, fetchHookClient as J, KeyFilter as K, Link as L, ObjectUtils as O, PrimeReactContext as P, Ripple as R, SpinnerIcon as S, Tooltip as T, ZIndexUtils as Z, useRouter as a, useAsync as b, cn as c, IconBase as d, useMergeProps as e, usePrevious as f, useStyle as g, useResizeListener as h, useEventListener as i, useUpdateEffect as j, classNames as k, IconUtils as l, useDebounce as m, PrimeReact as n, useHandleStyle as o, packageJson as p, useOverlayListener as q, useMountEffect as r, useUnmountEffect as s, FilterService as t, useCart as u, localeOption as v, TimesIcon as w, Portal as x, CSSTransition as y, OverlayService as z };
