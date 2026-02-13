/* empty css                                        */
import { g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Package, XCircle, CheckCircle, Clock } from 'lucide-react';
import { f as fetchHook } from '../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../renderers.mjs';

const statusMap = {
  pending: { label: "قيد الانتظار", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  processing: { label: "جاري التجهيز", color: "text-blue-600 bg-blue-50", icon: Package },
  shipped: { label: "تم الشحن", color: "text-purple-600 bg-purple-50", icon: Package },
  delivered: { label: "تم التوصيل", color: "text-green-600 bg-green-50", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "text-red-600 bg-red-50", icon: XCircle }
};
function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("app_token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchHook({ url: "v1/orders", token }).then((res) => {
      if (res.ok) setOrders(res.data?.data || []);
      setIsLoading(false);
    });
  }, [token]);
  if (isLoading) return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) });
  if (!orders.length) return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx(Package, { className: "mb-4 h-16 w-16 text-gray-300" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "لا توجد طلبات" })
  ] });
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: orders.map((order) => {
    const status = statusMap[order.status] || statusMap.pending;
    const Icon = status.icon;
    return /* @__PURE__ */ jsx("a", { href: `/order/${order.id}`, className: "block rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          "طلب #",
          order.order_number
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: new Date(order.created_at).toLocaleDateString("ar-EG") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${status.color}`, children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
          status.label
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-bold text-[var(--main-color)]", children: [
          order.total,
          " ج.م"
        ] })
      ] })
    ] }) }, order.id);
  }) });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "\u0637\u0644\u0628\u0627\u062A\u064A";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <h1 class="mb-8 text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> <!-- Order List Component - React Island --> ${renderComponent($$result2, "OrderList", OrderList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Orders/OrderList", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/order/index.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/order/index.astro";
const $$url = "/order";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
