/* empty css                                              */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Clock, XCircle, CheckCircle, X, Printer } from 'lucide-react';
import { f as fetchHook } from '../../../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../../../renderers.mjs';

const STATUS_CONFIG = {
  success: {
    title: "Payment successful!!!",
    titleColor: "text-green-500",
    icon: /* @__PURE__ */ jsx(CheckCircle, { size: 60 }),
    iconColor: "text-green-500"
  },
  failed: {
    title: "Payment failed",
    titleColor: "text-red-500",
    icon: /* @__PURE__ */ jsx(XCircle, { size: 60 }),
    iconColor: "text-red-500"
  },
  pending: {
    title: "Payment pending",
    titleColor: "text-yellow-500",
    icon: /* @__PURE__ */ jsx(Clock, { size: 60 }),
    iconColor: "text-yellow-500"
  }
};
function StatusHeader({ config }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-6 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: `mb-4 text-xl font-medium ${config.titleColor}`, children: config.title }),
    /* @__PURE__ */ jsx("div", { className: `mb-6 ${config.iconColor}`, children: config.icon })
  ] });
}
function PaymentDetailRow({ label, value }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "text-right text-sm font-medium", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-left text-sm text-gray-600", children: label })
  ] });
}
function PaymentDetailsSection({ details }) {
  return /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-y-3", children: [
    /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Payment type", value: details.paymentType }),
    details.netBanking && /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Net banking", value: details.netBanking }),
    /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Mobile", value: details.phone }),
    /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Email", value: details.email }),
    /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Amount paid", value: details.amountPaid }),
    /* @__PURE__ */ jsx(PaymentDetailRow, { label: "Transaction id", value: details.transactionId })
  ] }) });
}
function ActionButtons({ onPrint, onClose }) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: onClose,
        className: "flex items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600",
        children: [
          /* @__PURE__ */ jsx(X, { size: 18 }),
          " CLOSE"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: onPrint,
        className: "flex items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600",
        children: [
          /* @__PURE__ */ jsx(Printer, { size: 18 }),
          " PRINT"
        ]
      }
    )
  ] });
}
function TransactionsPage({ invoiceData, status, invoiceId }) {
  const statusParam = status || "success";
  const currentStatus = Object.keys(STATUS_CONFIG).includes(statusParam) ? statusParam : "success";
  const currentConfig = STATUS_CONFIG[currentStatus];
  const paymentDetails = {
    paymentType: invoiceData.payment_type || "N/A",
    phone: invoiceData.phone ?? "",
    email: invoiceData.email ?? "",
    amountPaid: invoiceData.total || "0.00",
    transactionId: invoiceId || invoiceData.invoice_id || "N/A",
    netBanking: invoiceData.netBanking ?? ""
  };
  const handlePrint = () => window.print();
  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = "/";
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[80vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-lg bg-white shadow-xl", children: [
    /* @__PURE__ */ jsx(StatusHeader, { config: currentConfig }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6", children: [
      /* @__PURE__ */ jsx(PaymentDetailsSection, { details: paymentDetails }),
      /* @__PURE__ */ jsx(ActionButtons, { onPrint: handlePrint, onClose: handleClose })
    ] })
  ] }) });
}

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$Transactions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Transactions;
  const invoiceNumber = Astro2.url.searchParams.get("invoice_number");
  let invoiceData = null;
  if (invoiceNumber) {
    try {
      const response = await fetchHook({
        url: `invoices?invoice_number=${invoiceNumber}`
      });
      if (response.ok && response.data?.data) {
        const data = response.data.data;
        invoiceData = {
          ...data.invoice,
          ...data.customer
        };
      }
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
    }
  }
  const status = Astro2.url.searchParams.get("status") || "success";
  const invoiceId = Astro2.url.searchParams.get("invoice_id");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Payment Transactions", "description": "View payment transaction status" }, { "default": async ($$result2) => renderTemplate`${invoiceData ? renderTemplate`${renderComponent($$result2, "TransactionsPage", TransactionsPage, { "client:load": true, "invoiceData": invoiceData, "status": status, "invoiceId": invoiceId, "client:component-hydration": "load", "client:component-path": "@/components/Payment/TransactionsPage", "client:component-export": "default" })}` : renderTemplate`${maybeRenderHead()}<div class="flex min-h-[80vh] items-center justify-center px-4"> <div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl"> <div class="mb-4 text-6xl">❌</div> <h2 class="mb-2 text-xl font-medium text-gray-800">Invoice Not Found</h2> <p class="text-gray-600">The requested invoice could not be found.</p> <a href="/" class="mt-6 inline-block rounded bg-[var(--main-color)] px-6 py-2 text-white hover:opacity-90">
Go Home
</a> </div> </div>`}` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/admin/payment/transactions.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/admin/payment/transactions.astro";
const $$url = "/admin/payment/transactions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Transactions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
