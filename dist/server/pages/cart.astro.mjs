/* empty css                                        */
import { g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { c as cartCountAtom, $ as $$BaseLayout } from '../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { f as fetchHook } from '../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../renderers.mjs';

function Cart() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCartCount] = useAtom(cartCountAtom);
  const token = Cookies.get("app_token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchCart();
  }, [token]);
  const fetchCart = async () => {
    setIsLoading(true);
    const response = await fetchHook({
      url: "v1/basket",
      token
    });
    if (response.ok && response.data) {
      const cartItems = response.data.data || response.data;
      setItems(Array.isArray(cartItems) ? cartItems : []);
    }
    setIsLoading(false);
  };
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const response = await fetchHook({
      url: `v1/basket/${itemId}`,
      init: {
        method: "PUT",
        body: JSON.stringify({ quantity: newQuantity })
      },
      token
    });
    if (response.ok) {
      setItems(
        (prev) => prev.map(
          (item) => item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      toast.error("حدث خطأ في تحديث الكمية");
    }
  };
  const removeItem = async (itemId) => {
    const response = await fetchHook({
      url: `v1/basket/${itemId}`,
      init: { method: "DELETE" },
      token
    });
    if (response.ok) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setCartCount((prev) => Math.max(0, prev - 1));
      toast.success("تم حذف المنتج");
    } else {
      toast.error("حدث خطأ في الحذف");
    }
  };
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { className: "mb-4 h-16 w-16 text-gray-300" }),
      /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-medium text-gray-600", children: "السلة فارغة" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-gray-400", children: "لم تضف أي منتجات بعد" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "rounded-lg bg-[var(--main-color)] px-6 py-3 text-white hover:opacity-90",
          children: "تصفح المنتجات"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100 rounded-lg bg-white shadow", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 p-4", children: [
      item.image && /* @__PURE__ */ jsx(
        "img",
        {
          src: item.image,
          alt: item.name,
          className: "h-24 w-24 rounded object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium text-[var(--second-font-color)]", children: item.name }),
        item.variations && Object.keys(item.variations).length > 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: Object.values(item.variations).join(" / ") }),
        /* @__PURE__ */ jsxs("p", { className: "mt-auto font-bold text-[var(--main-color)]", children: [
          item.price,
          " ج.م"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => removeItem(item.id),
            className: "text-red-500 hover:text-red-700",
            children: /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => updateQuantity(item.id, item.quantity - 1),
              className: "flex h-8 w-8 items-center justify-center rounded-full border",
              children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "min-w-[24px] text-center", children: item.quantity }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => updateQuantity(item.id, item.quantity + 1),
              className: "flex h-8 w-8 items-center justify-center rounded-full border",
              children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] }, item.id)) }) }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-4 rounded-lg bg-white p-6 shadow", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-bold text-[var(--second-font-color)]", children: "ملخص الطلب" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex justify-between border-b pb-4", children: [
        /* @__PURE__ */ jsx("span", { children: "الإجمالي" }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-[var(--main-color)]", children: [
          total,
          " ج.م"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/checkout",
          className: "block w-full rounded-lg bg-[var(--main-color)] py-3 text-center font-medium text-white hover:opacity-90",
          children: "إتمام الطلب"
        }
      )
    ] }) })
  ] });
}

const prerender = false;
const $$Cart = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <h1 class="mb-8 text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> <!-- Cart Component - React Island for full interactivity --> ${renderComponent($$result2, "CartComponent", Cart, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Cart/Cart", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/cart.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/cart.astro";
const $$url = "/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cart,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
