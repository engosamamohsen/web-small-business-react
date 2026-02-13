/* empty css                                           */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { f as fetchHook } from '../../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../../renderers.mjs';

function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("app_token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!orderId) return;
    fetchHook({ url: `v1/orders/${orderId}`, token }).then(
      (res) => {
        if (res.ok) {
          const data = res.data;
          const orderData = data?.data ?? data;
          setOrder(orderData);
        }
        setIsLoading(false);
      }
    );
  }, [token, orderId]);
  if (isLoading)
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) });
  if (!order)
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500", children: "الطلب غير موجود" });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-6 shadow", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 font-bold", children: "تفاصيل الطلب" }),
      /* @__PURE__ */ jsx("div", { className: "divide-y", children: order.items?.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 py-4", children: [
        item.image && /* @__PURE__ */ jsx(
          "img",
          {
            src: item.image,
            alt: item.name,
            className: "h-16 w-16 rounded object-cover"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: item.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            "الكمية: ",
            item.quantity
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "font-bold text-[var(--main-color)]", children: [
          item.price * item.quantity,
          " ج.م"
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t pt-4 text-left", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "الإجمالي:" }),
        /* @__PURE__ */ jsxs("span", { className: "mr-2 text-xl font-bold text-[var(--main-color)]", children: [
          order.total,
          " ج.م"
        ] })
      ] })
    ] }),
    order.address && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-6 shadow", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-bold", children: "عنوان التوصيل" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: order.address.street })
    ] })
  ] });
}

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$orderId = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$orderId;
  const { order_id } = Astro2.params;
  const pageTitle = `\u0627\u0644\u0637\u0644\u0628 #${order_id}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <div class="mb-8 flex items-center gap-4"> <a href="/order" class="text-[var(--main-color)] hover:underline" aria-label="العودة للطلبات">
← العودة للطلبات
</a> <h1 class="text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> </div> <!-- Order Detail Component - React Island --> ${renderComponent($$result2, "OrderDetail", OrderDetail, { "client:load": true, "orderId": order_id, "client:component-hydration": "load", "client:component-path": "@/components/Orders/OrderDetail", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/order/[order_id].astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/order/[order_id].astro";
const $$url = "/order/[order_id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$orderId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
