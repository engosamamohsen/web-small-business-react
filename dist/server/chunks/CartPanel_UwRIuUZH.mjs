import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useEffect, useRef } from 'react';
import { ShoppingCart, ArrowLeft, X } from 'lucide-react';
import { c as cn, L as Link, I as Image } from './package_DrFn9nlR.mjs';
import { a as useCartServices } from './cart_CodIGWOb.mjs';

const MiniCartItem = ({ item }) => {
  const qty = parseInt(item.qty);
  const total = item.item_total ?? Number(item.unit_price) * qty;
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3 py-3 border-b border-slate-100 last:border-0", children: [
    /* @__PURE__ */ jsx("div", { className: "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50", children: /* @__PURE__ */ jsx(
      Image,
      {
        src: item.product_image || "/placeholder-image.jpg",
        alt: item.product_name || "Product",
        fill: true,
        sizes: "64px",
        className: "object-cover"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1 min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 line-clamp-2 text-right", children: item.product_name }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-orange-500", children: [
          total,
          " ج.م"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "الكمية: ",
          qty
        ] })
      ] }),
      item.variations && item.variations.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-0.5", children: item.variations.map(
        (v) => v.choices.map((c) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600",
            children: c.name
          },
          c.id
        ))
      ) })
    ] })
  ] });
};
const MobileBottomSheet = ({ isOpen, onClose, items, total, loading }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ),
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-y-0" : "translate-y-full"
        ),
        style: { paddingBottom: "env(safe-area-inset-bottom)" },
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsx("div", { className: "h-1 w-10 rounded-full bg-slate-200" }) }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 pt-4 text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-green-100", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-7 w-7 text-green-600" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-slate-800", children: "تمت الإضافة للسلة ✓" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "المنتج أُضيف بنجاح إلى سلة التسوق" })
            ] }),
            loading ? /* @__PURE__ */ jsx("div", { className: "flex h-20 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) }) : items.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mb-4 max-h-48 overflow-y-auto rounded-xl bg-slate-50 p-3", children: [
              items.map((item) => /* @__PURE__ */ jsx(MiniCartItem, { item }, item.cart_item_id)),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-bold", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-orange-500", children: [
                  total.toFixed(2),
                  " ج.م"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "الإجمالي" })
              ] })
            ] }) : null,
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: "/shop/cart",
                  className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] py-4 text-base font-semibold text-white shadow-md transition hover:opacity-90",
                  children: [
                    /* @__PURE__ */ jsx(ShoppingCart, { size: 18 }),
                    "عرض السلة والدفع"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: onClose,
                  className: "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--main-color)] py-4 text-base font-semibold text-[var(--main-color)] transition hover:bg-[var(--main-color)]/5",
                  children: [
                    /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }),
                    "متابعة التسوق"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
};
const DesktopSidebar = ({ isOpen, onClose, items, total, loading }) => {
  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 hidden md:block",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ),
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: sidebarRef,
        className: cn(
          "fixed top-0 right-0 z-50 hidden h-full w-[420px] max-w-[95vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:flex",
          isOpen ? "translate-x-0" : "translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 px-6 py-5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200",
                "aria-label": "إغلاق",
                children: /* @__PURE__ */ jsx(X, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "سلة التسوق" }),
              /* @__PURE__ */ jsx(ShoppingCart, { size: 20, className: "text-[var(--main-color)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex h-40 flex-col items-center justify-center gap-3 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl", children: "🛒" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "السلة فارغة" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: items.map((item) => /* @__PURE__ */ jsx(MiniCartItem, { item }, item.cart_item_id)) }) }),
          items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 px-6 py-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-right", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-slate-800", children: [
                total.toFixed(2),
                " ج.م"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-500", children: "الإجمالي" })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/shop/checkout",
                className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] py-4 text-base font-semibold text-white shadow-md transition hover:opacity-90",
                children: "إتمام الشراء"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50",
                children: "متابعة التسوق"
              }
            )
          ] })
        ]
      }
    )
  ] });
};
function CartPanel({ isOpen, onClose }) {
  const { data: cartResponse, loading, retry } = useCartServices();
  const items = cartResponse?.cart_items ?? [];
  const total = cartResponse?.total_price ?? 0;
  useEffect(() => {
    if (isOpen) {
      retry();
    }
  }, [isOpen]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MobileBottomSheet,
      {
        isOpen,
        onClose,
        items,
        total,
        loading
      }
    ),
    /* @__PURE__ */ jsx(
      DesktopSidebar,
      {
        isOpen,
        onClose,
        items,
        total,
        loading
      }
    )
  ] });
}

export { CartPanel as default };
