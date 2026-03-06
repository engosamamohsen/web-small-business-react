import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_BA59mY36.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_tndNv13C.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { e as useCart, s as slugify, L as Link, I as Image, c as cn, u as useRouter, F as FaviconHandler, H as Header, a as Footer, p as packageJson } from '../../chunks/package_CKqGA1Rw.mjs';
import { Minus, Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { a as useCartServices, u as useCartHook } from '../../chunks/cart_C8eeB-G5.mjs';
import { P as PageLoader } from '../../chunks/PageLoader_hb1NStkx.mjs';
import { f as fetchSettings } from '../../chunks/fetchSettings_DFAIddcx.mjs';
export { renderers } from '../../renderers.mjs';

const CartItem = ({
  item,
  loading,
  updateCount,
  removeFromCart,
  onProductClick
}) => {
  const quantity = parseInt(item.qty);
  const itemTotal = item.item_total ?? Number(item.unit_price) * quantity;
  return /* @__PURE__ */ jsxs("div", { className: "mb-4 flex w-full flex-col gap-4 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-slate-100 transition-shadow max-md:flex-col-reverse md:flex-row md:items-center md:justify-between md:gap-6", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => onProductClick(String(item.product_id), item.product_name),
        className: "flex w-full cursor-pointer gap-4 max-md:flex-col",
        children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50", children: /* @__PURE__ */ jsx(
            Image,
            {
              src: item.product_image || "/placeholder-image.jpg",
              alt: item.product_name ? `صورة المنتج ${item.product_name}` : "صورة منتج في السلة",
              fill: true,
              sizes: "96px",
              className: "object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "line-clamp-2 text-sm font-semibold text-slate-900 md:text-base", children: item.product_name }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-3 text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-orange-500", children: [
                item.unit_price,
                " ج.م",
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: " (سعر الوحدة)" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
                "الكمية: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: quantity })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-slate-800", children: [
                "الإجمالي: ",
                /* @__PURE__ */ jsxs("span", { className: "text-slate-900", children: [
                  itemTotal,
                  " ج.م"
                ] })
              ] })
            ] }),
            item.variations && item.variations.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 flex flex-col gap-1 text-xs text-slate-600", children: item.variations.map((variation) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-wrap items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-700", children: [
                    variation.main_variation_name,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: variation.choices.map((choice) => /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px]",
                      children: [
                        choice.name,
                        choice.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500", children: [
                          "(+",
                          choice.price,
                          " ج.م)"
                        ] })
                      ]
                    },
                    choice.id
                  )) })
                ]
              },
              variation.main_variation_id
            )) }),
            item.product_note && /* @__PURE__ */ jsxs("div", { className: "mt-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "ملاحظة:" }),
              " ",
              item.product_note
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-4 md:w-auto md:flex-col md:items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: loading || quantity <= 1,
            onClick: () => updateCount(item.cart_item_id, quantity - 1, item.product_name),
            className: cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              (loading || quantity <= 1) && "cursor-not-allowed opacity-40 hover:bg-transparent"
            ),
            children: /* @__PURE__ */ jsx(Minus, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "mx-1 min-w-[2.25rem] rounded-md bg-white px-2 py-1 text-center text-sm font-semibold text-slate-800", children: quantity }),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: loading,
            onClick: () => updateCount(item.cart_item_id, quantity + 1, item.product_name),
            className: cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              loading && "cursor-not-allowed opacity-60"
            ),
            children: /* @__PURE__ */ jsx(Plus, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => !loading && removeFromCart(item),
          disabled: loading,
          className: cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-200 transition hover:bg-red-600 hover:text-white",
            loading && "cursor-not-allowed opacity-60"
          ),
          children: /* @__PURE__ */ jsx(X, { size: 18 })
        }
      )
    ] })
  ] });
};
const OrderSummary = ({
  subtotal,
  shipping = 0,
  tax = 0
}) => {
  const total = subtotal + shipping + tax;
  return /* @__PURE__ */ jsxs("div", { className: "h-fit rounded-lg bg-white p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-bold", children: "ملخص الطلب" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "إجمالي المنتجات" }),
        /* @__PURE__ */ jsxs("span", { children: [
          subtotal?.toFixed(2),
          " ج.م"
        ] })
      ] }),
      tax > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "الضريبة" }),
        /* @__PURE__ */ jsxs("span", { children: [
          tax,
          " ج.م"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 border-t pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-bold", children: [
        /* @__PURE__ */ jsx("span", { children: "الإجمالي" }),
        /* @__PURE__ */ jsxs("span", { children: [
          total?.toFixed(2),
          " ج.م"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      Link,
      {
        href: "/shop/checkout",
        className: "block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600",
        children: "إتمام الشراء"
      }
    )
  ] });
};
const EmptyCart = () => /* @__PURE__ */ jsxs("div", { className: "mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center", children: [
  /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl", children: "🛒" }),
  /* @__PURE__ */ jsx("h2", { className: "mb-2 text-2xl font-bold text-slate-900", children: "عربة التسوق فارغة" }),
  /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm text-slate-500", children: "أضف بعض المنتجات لعربة التسوق للمتابعة في عملية الشراء." }),
  /* @__PURE__ */ jsx(
    Link,
    {
      href: "/",
      className: "rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50",
      children: "العودة للتسوق"
    }
  )
] });
function Cart() {
  const router = useRouter();
  const { loading: cartLoading, data: cartResponse, retry } = useCartServices();
  const { loading, removeFromCart, updateCount } = useCartHook();
  const { setCartCount } = useCart();
  useEffect(() => {
    if (cartResponse?.cart_items) {
      const totalCount = cartResponse.cart_items.reduce(
        (sum, item) => sum + Number(item.qty ?? 0),
        0
      );
      setCartCount(totalCount);
    } else {
      setCartCount(0);
    }
  }, [cartResponse, setCartCount]);
  if (cartLoading) {
    return /* @__PURE__ */ jsx(PageLoader, { text: "جاري تحميل عربة التسوق" });
  }
  if (!cartResponse?.cart_items?.length) {
    return /* @__PURE__ */ jsx(EmptyCart, {});
  }
  const handleProductClick = (productId, productName) => {
    router.push(`/products/${slugify(productName)}-${productId}`);
  };
  const handleUpdateCount = async (itemId, newQuantity, productName) => {
    const response = await updateCount({
      cart_item_id: itemId,
      qty: newQuantity,
      product_name: productName
    });
    if (response?.status) retry();
  };
  const handleRemoveFromCart = async (item) => {
    const response = await removeFromCart({ cart_item_id: item });
    if (response?.status) retry();
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto my-10 min-h-[800px] max-w-7xl px-4 py-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-2 text-3xl font-bold text-slate-900", children: "عربة التسوق" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-slate-500", children: "يمكنك تعديل الكمية أو إزالة المنتجات قبل إتمام الطلب." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsx("div", { className: "max-h-[520px] overflow-y-auto rounded-2xl bg-slate-50 p-4 lg:p-6", children: cartResponse.cart_items.map((item) => /* @__PURE__ */ jsx(
        CartItem,
        {
          item,
          loading,
          updateCount: handleUpdateCount,
          removeFromCart: handleRemoveFromCart,
          onProductClick: handleProductClick
        },
        item.cart_item_id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "lg:self-start", children: /* @__PURE__ */ jsx(OrderSummary, { subtotal: cartResponse.total_price }) })
    ] })
  ] });
}

const $$Astro = createAstro("https://admin-osama.cashierthru.com");
const prerender = false;
const $$Cart = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cart;
  const token = Astro2.cookies.get("app_token")?.value;
  if (!token) {
    return Astro2.redirect("/auth/login");
  }
  const settingsResponse = await fetchSettings(token);
  const settingsData = settingsResponse?.data ?? null;
  const isLogin = settingsResponse?.ok ? Boolean(settingsResponse?.is_login) : false;
  const cartCount = settingsResponse?.cart_count ?? 0;
  const appVersion = packageJson.version;
  function buildWhatsAppLink(phone) {
    if (!phone) return null;
    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (!digitsOnly) return null;
    return `https://wa.me/${encodeURIComponent(digitsOnly)}`;
  }
  const whatsappLink = buildWhatsAppLink(settingsData?.whatsapp_phone);
  const pageTitle = "\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A - " + (settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631");
  const pageDescription = "\u0639\u0631\u0636 \u0648\u0625\u062F\u0627\u0631\u0629 \u0645\u0646\u062A\u062C\u0627\u062A \u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "favicon": settingsData?.logo }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })} ${renderComponent($$result3, "FaviconHandler", FaviconHandler, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/FaviconHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "CartComponent", Cart, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Cart/Cart", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
            flex h-12 w-12 items-center overflow-hidden
            rounded-full bg-green-500 text-white shadow-lg
            transition-all duration-300
            group-hover:w-[150px] group-hover:shadow-xl
          "> <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center"> <i class="pi pi-whatsapp text-2xl"></i> </div> <span class="
              max-w-0 translate-x-2 whitespace-nowrap text-sm font-medium
              opacity-0 transition-all duration-300
              group-hover:max-w-[100px] group-hover:translate-x-0 group-hover:opacity-100
            ">
تواصل معنا
</span> </div> <span class="sr-only">تواصل معنا عبر الواتساب</span> </a>`} ${renderComponent($$result3, "Footer", Footer, { "settingsData": settingsData, "appVersion": appVersion, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Footer", "client:component-export": "default" })}  ${renderComponent($$result3, "ToastContainer", null, { "position": "bottom-right", "rtl": true, "autoClose": 3e3, "hideProgressBar": false, "newestOnTop": true, "closeOnClick": true, "pauseOnFocusLoss": true, "draggable": true, "pauseOnHover": true, "theme": "light", "client:only": "react", "client:component-hydration": "only", "client:component-path": "react-toastify", "client:component-export": "ToastContainer" })} ` })} ` })}`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/shop/cart.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/shop/cart.astro";
const $$url = "/shop/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cart,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
