import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, i as addAttribute } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C9OKOB99.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { L as Link, c as cn, u as useRouter, H as Header, F as Footer, p as packageJson } from '../../chunks/package_CJwS4JJH.mjs';
import { f as formatDate } from '../../chunks/global_CwaxDU9D.mjs';
import { b as useOrderServices } from '../../chunks/order_B870YMn6.mjs';
import { P as PageLoader } from '../../chunks/PageLoader_B7d3o92E.mjs';
import { Package, ChevronLeft, XCircle, CheckCircle2, Truck, Clock3 } from 'lucide-react';
import { a as fetchSettings } from '../../chunks/fetchSettings_Ldq5l7Md.mjs';
export { renderers } from '../../renderers.mjs';

const EmptyOrderList = () => /* @__PURE__ */ jsxs("div", { className: "mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center", children: [
  /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-bold", children: "لا توجد طلبات" }),
  /* @__PURE__ */ jsx("p", { className: "mb-6 text-gray-600", children: "لم يتم العثور على أي طلبات سابقة" }),
  /* @__PURE__ */ jsx(
    Link,
    {
      href: "/",
      className: "font-semibold text-orange-500 hover:text-orange-600",
      children: "العودة للتسوق"
    }
  )
] });

function OrderList() {
  const { loading, data: orders } = useOrderServices();
  const [activeTab] = useState("All");
  const router = useRouter();
  console.log(orders, "orders list");
  if (loading) {
    return /* @__PURE__ */ jsx(PageLoader, { text: "جاري تحميل الطلبات" });
  }
  if (!orders?.length) {
    return /* @__PURE__ */ jsx(EmptyOrderList, {});
  }
  const filteredOrders = orders?.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open" && order.order_status_id === 1) return true;
    if (activeTab === "Shipped" && order.order_status_id === 2) return true;
    if (activeTab === "Completed" && order.order_status_id === 3) return true;
    return false;
  });
  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 1:
        return /* @__PURE__ */ jsx(Clock3, { className: "h-3.5 w-3.5" });
      case 2:
        return /* @__PURE__ */ jsx(Truck, { className: "h-3.5 w-3.5" });
      case 3:
        return /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" });
      case 4:
        return /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" });
      case 5:
        return /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5" });
      default:
        return /* @__PURE__ */ jsx(Package, { className: "h-3.5 w-3.5" });
    }
  };
  return (
    // section can take full width; header has its own padding
    /* @__PURE__ */ jsxs("section", { className: "mt-16 min-h-[calc(100vh-300px)] w-full", children: [
      /* @__PURE__ */ jsx("header", { className: "mb-6 flex w-full flex-col gap-2 px-4 text-right sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "الطلبات" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "استعرض كل طلباتك وتابع حالتها وتكلفتها بسهولة." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden flex-col items-end text-xs text-gray-500 sm:flex", children: [
          /* @__PURE__ */ jsx("span", { children: "إجمالي الطلبات" }),
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-[var(--main-color)]", children: [
            orders.length,
            " طلب"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full overflow-hidden rounded-none border-y border-gray-100 bg-gray-50 shadow-sm md:bg-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden border-b border-gray-100 bg-gray-50/80 py-3 text-[11px] text-gray-500 md:grid md:grid-cols-[1.5fr_1fr_1fr_0.5fr]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pr-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("span", { className: "text-right", children: "الطلب" }) }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full opacity-0", children: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "flex items-center pr-6 text-right", children: "التاريخ" }),
          /* @__PURE__ */ jsx("span", { className: "flex items-center pr-6 text-right", children: "حالة الطلب" }),
          /* @__PURE__ */ jsx("span", { className: "flex items-center pr-6 text-right", children: "الإجمالي" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[calc(100vh-260px)] w-full overflow-y-auto border-t border-gray-50 md:border-t-0 md:bg-white", children: filteredOrders.map((order) => /* @__PURE__ */ jsxs(
          "article",
          {
            role: "button",
            "aria-label": `تفاصيل الطلب رقم ${order.id}`,
            onClick: () => {
              router.push(`/order/${order.id}`);
            },
            className: cn(
              // 🔹 Mobile: card style with separation
              "group mx-3 my-2 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-right shadow-sm transition",
              // 🔹 Desktop: behave like table row (no card look)
              "md:mx-0 md:my-0 md:rounded-none md:border-0 md:border-b md:border-gray-50 md:px-0 md:shadow-none md:grid md:grid-cols-[1.5fr_1fr_1fr_0.5fr] md:items-center md:gap-4 md:hover:bg-gray-50/80 md:hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 md:justify-start md:pr-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: "رقم الطلب" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-gray-900", children: [
                    "#",
                    order.id
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500", children: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:pr-6", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: "التاريخ" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600", children: formatDate(order.created_at) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 sm:w-[120px] sm:max-w-[120px] md:w-[160px] md:max-w-[160px] md:pr-6", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: "الحالة" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium",
                      "bg-gray-100 text-gray-600",
                      order.order_status_id === 1 && "bg-yellow-500/90 text-white",
                      order.order_status_id === 2 && "bg-blue-500/90 text-white",
                      order.order_status_id === 3 && "bg-orange-400/90 text-white",
                      order.order_status_id === 4 && "bg-green-500/90 text-white",
                      order.order_status_id === 5 && "bg-red-500/90 text-white"
                    ),
                    children: [
                      getStatusIcon(order.order_status_id),
                      /* @__PURE__ */ jsx("span", { children: order.order_status_name })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 md:justify-start md:pr-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: "الإجمالي" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-gray-900", children: [
                    order.total,
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-500", children: "ج.م" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition group-hover:bg-[var(--main-color)]/10 group-hover:text-[var(--main-color)]", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }) })
              ] })
            ]
          },
          order.id
        )) })
      ] })
    ] })
  );
}

const $$Astro = createAstro("https://admin-osama.cashierthru.com");
const prerender = false;
const $$Orders = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Orders;
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
  const pageTitle = "\u0637\u0644\u0628\u0627\u062A\u064A - " + (settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631");
  const pageDescription = "\u0627\u0633\u062A\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0637\u0644\u0628\u0627\u062A\u0643 \u0648\u062A\u0627\u0628\u0639 \u062D\u0627\u0644\u0629 \u0643\u0644 \u0637\u0644\u0628";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "OrderList", OrderList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Orders/OrderList/OrderList", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
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
}, "F:/react js projects/kamal/web-small-business-react/src/pages/user/orders.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/user/orders.astro";
const $$url = "/user/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Orders,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
