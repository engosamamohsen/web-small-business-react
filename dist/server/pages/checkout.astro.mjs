/* empty css                                        */
import { g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DGf6_HP9.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { f as fetchHook } from '../chunks/fetchSettings_BSzKgKzb.mjs';
import { c as cn } from '../chunks/utils_B05Dmz_H.mjs';
export { renderers } from '../renderers.mjs';

function Checkout() {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("app_token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchAddresses();
  }, [token]);
  const fetchAddresses = async () => {
    const response = await fetchHook({
      url: "v1/addresses",
      token
    });
    if (response.ok && response.data) {
      const addrs = response.data.data || response.data;
      setAddresses(Array.isArray(addrs) ? addrs : []);
      const defaultAddr = addrs.find((a) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    }
    setIsLoading(false);
  };
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error("يرجى اختيار عنوان التوصيل");
      return;
    }
    setIsSubmitting(true);
    const response = await fetchHook({
      url: "v1/orders",
      init: {
        method: "POST",
        body: JSON.stringify({ address_id: selectedAddress })
      },
      token
    });
    if (response.ok) {
      toast.success("تم إرسال الطلب بنجاح");
      window.location.href = "/order";
    } else {
      toast.error(response.error || "حدث خطأ في إرسال الطلب");
    }
    setIsSubmitting(false);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8 flex justify-center gap-4", children: [1, 2].map((s) => /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
          step >= s ? "bg-[var(--main-color)] text-white" : "bg-gray-200 text-gray-500"
        ),
        children: s
      },
      s
    )) }),
    step === 1 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-6 shadow", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-6 text-xl font-bold text-[var(--second-font-color)]", children: "اختر عنوان التوصيل" }),
      addresses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-gray-500", children: "لا توجد عناوين محفوظة" }),
        /* @__PURE__ */ jsx("button", { className: "text-[var(--main-color)] hover:underline", children: "إضافة عنوان جديد" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: addresses.map((address) => /* @__PURE__ */ jsxs(
        "label",
        {
          className: cn(
            "block cursor-pointer rounded-lg border p-4 transition-colors",
            selectedAddress === address.id ? "border-[var(--main-color)] bg-orange-50" : "border-gray-200 hover:border-gray-300"
          ),
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "address",
                value: address.id,
                checked: selectedAddress === address.id,
                onChange: () => setSelectedAddress(address.id),
                className: "sr-only"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: address.name }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: address.phone }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
              address.street,
              address.city_name && `, ${address.city_name}`,
              address.governorate_name && ` - ${address.governorate_name}`
            ] })
          ]
        },
        address.id
      )) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStep(2),
          disabled: !selectedAddress,
          className: "mt-6 w-full rounded-lg bg-[var(--main-color)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50",
          children: "التالي"
        }
      )
    ] }),
    step === 2 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-6 shadow", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-6 text-xl font-bold text-[var(--second-font-color)]", children: "تأكيد الطلب" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg bg-gray-50 p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 font-medium", children: "عنوان التوصيل" }),
        addresses.find((a) => a.id === selectedAddress) && /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: addresses.find((a) => a.id === selectedAddress)?.street })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setStep(1),
            className: "flex-1 rounded-lg border border-gray-200 py-3 font-medium hover:bg-gray-50",
            children: "رجوع"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSubmitOrder,
            disabled: isSubmitting,
            className: "flex-1 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50",
            children: isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"
          }
        )
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <h1 class="mb-8 text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> <!-- Checkout Component - React Island for multi-step form --> ${renderComponent($$result2, "CheckoutComponent", Checkout, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Checkout/Checkout", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/checkout.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
