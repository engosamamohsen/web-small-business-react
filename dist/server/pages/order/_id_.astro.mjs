import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, i as addAttribute } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C9OKOB99.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React__default, { useEffect, useState, useMemo, Suspense } from 'react';
import { twMerge } from 'tailwind-merge';
import { CircleX, ArrowBigLeftDash } from 'lucide-react';
import { s as styles } from '../../chunks/_id_.08fbb95e_BU9H0_4q.mjs';
import { I as Image, $ as $api, u as useRouter, D as Dialog, B as Button, c as cn, H as Header, F as Footer, p as packageJson } from '../../chunks/package_CJwS4JJH.mjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { u as useAsyncRetry } from '../../chunks/useAsyncRetry_RBGU_9EX.mjs';
import { u as usePayment, a as useOrderDetailServices } from '../../chunks/order_B870YMn6.mjs';
import { f as formatDate } from '../../chunks/global_CwaxDU9D.mjs';
import { P as PageLoader } from '../../chunks/PageLoader_B7d3o92E.mjs';
import { a as fetchSettings } from '../../chunks/fetchSettings_Ldq5l7Md.mjs';
export { renderers } from '../../renderers.mjs';

const getOrderStatus = (status) => {
  const statusInt = parseInt(status);
  return {
    waitingApproval: statusInt === 1,
    waitingPayment: statusInt === 2,
    waitingShipping: statusInt === 3,
    delivered: statusInt === 4,
    cancelled: statusInt === 5
  };
};
const formatAddress = (address) => {
  if (!address) return "Address not available";
  return `${address.city_name || ""}, ${address.area_name || ""}, ${address.street || ""}, Building ${address.building || ""}, Floor ${address.floor || ""}, Flat ${address.flat || ""}`;
};
const calculateActualPrice = (price, discount) => {
  const priceNum = parseFloat(price || "0");
  const discountNum = parseFloat(discount || "0");
  return (priceNum - discountNum).toFixed(2);
};
const calculateItemTotal = (price, discount, quantity) => {
  const actualPrice = parseFloat(calculateActualPrice(price, discount));
  const qty = parseInt(quantity || "0", 10);
  return (actualPrice * qty).toFixed(2);
};

const PaymentMethodsList = ({
  paymentMethods,
  selectedPaymentId,
  onSelectPaymentMethod
}) => {
  return /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3", children: paymentMethods?.map((method) => /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: () => onSelectPaymentMethod(method),
      className: `flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-all ${selectedPaymentId === method.paymentId ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-10 w-16 shrink-0 overflow-hidden", children: /* @__PURE__ */ jsx(
            Image,
            {
              src: method.logo,
              alt: method.name_ar,
              fill: true,
              className: "object-contain",
              onError: (e) => {
                e.currentTarget.src = "/payment-default.png";
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium", children: method.name_ar }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: method.name_en })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-5 w-5 min-w-5 rounded-full border ${selectedPaymentId === method.paymentId ? "border-orange-500 bg-orange-500" : "border-gray-300"} flex items-center justify-center`,
            children: selectedPaymentId === method.paymentId && /* @__PURE__ */ jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-white" })
          }
        )
      ]
    },
    method.paymentId
  )) }) });
};

const paymentFormSchema = z.object({
  paymentMethod: z.any({
    required_error: "يرجى اختيار طريقة الدفع"
  }).refine(
    (val) => val?.paymentId !== "" && val?.paymentId !== null && val?.paymentId !== void 0,
    {
      message: "يرجى اختيار طريقة الدفع"
    }
  )
});
const paymentFormSchemaDefaultValues = {
  paymentMethod: ""
};

const usePaymentMethods = () => {
  const router = useRouter();
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get("/payment/methods");
  }, []);
  const errorStatus = error?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return { data: value?.data?.data, loading, retry };
};

function DialogPaymentMethodsForm({
  showDialog,
  setShowDialog,
  orderId
}) {
  const router = useRouter();
  const { data: paymentMethods, loading: paymentLoading } = usePaymentMethods();
  const { handleSubmit, setValue, setError, watch } = useForm({
    mode: "all",
    defaultValues: paymentFormSchemaDefaultValues,
    resolver: zodResolver(paymentFormSchema)
  });
  useEffect(() => {
    if (paymentMethods?.length) {
      const visaMethod = paymentMethods.find(
        (method) => method.paymentId === 2
      );
      if (visaMethod) {
        setValue("paymentMethod", visaMethod);
      }
    }
  }, [paymentMethods, setValue]);
  const { createPayment, loading } = usePayment();
  const onSubmit = async (inputs) => {
    const { data } = await createPayment(
      inputs.paymentMethod.paymentId,
      orderId
    );
    if (data?.status === 200 && data?.data?.requires_redirect) {
      router.push(data?.data?.payment_url);
    }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Dialog,
    {
      visible: showDialog,
      modal: true,
      className: "mx-4 flex w-full items-center justify-center shadow-none",
      onHide: () => {
        if (!showDialog) return;
        setShowDialog(false);
      },
      content: ({ hide }) => /* @__PURE__ */ jsx("div", { className: "h-full w-fit overflow-y-auto rounded-md max-md:max-h-[700px] max-sm:max-h-[550px]", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-fit min-h-fit w-full max-w-[550px] flex-col items-center justify-start gap-2 overflow-y-auto rounded-md bg-[var(--main-background)] p-6 py-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute top-1 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]", children: [
          /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-1", children: /* @__PURE__ */ jsx("h4", { className: "text-[15px] font-semibold text-[var(--main-color)]", children: "اختر طريقة الدفع" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              icon: /* @__PURE__ */ jsx(CircleX, {}),
              rounded: true,
              text: true,
              onClick: (e) => hide(e),
              className: "w-fit text-[var(--second-font-color)] !shadow-none !outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col items-center justify-start gap-4", children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: handleSubmit(onSubmit),
            className: "w-full space-y-4",
            children: [
              /* @__PURE__ */ jsx(Fragment, { children: paymentLoading ? /* @__PURE__ */ jsxs("div", { className: "mt-6 min-w-[500px] animate-pulse space-y-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-6 w-1/4 rounded bg-gray-200" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-32 rounded bg-gray-200" }),
                  /* @__PURE__ */ jsx("div", { className: "h-32 rounded bg-gray-200" }),
                  /* @__PURE__ */ jsx("div", { className: "h-32 rounded bg-gray-200" })
                ] })
              ] }) : /* @__PURE__ */ jsx(
                PaymentMethodsList,
                {
                  paymentMethods,
                  selectedPaymentId: watch("paymentMethod")?.paymentId || null,
                  onSelectPaymentMethod: (selectedPayment) => {
                    setValue("paymentMethod", selectedPayment);
                    setError("paymentMethod", {
                      type: "manual",
                      message: ""
                    });
                  }
                }
              ) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading,
                  className: "w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600",
                  children: "تأكيد الدفع"
                }
              )
            ]
          }
        ) })
      ] }) })
    }
  ) });
}

const OrderStatusTracker = ({
  orderStatus,
  orderId
}) => {
  const status = getOrderStatus(orderStatus);
  const [showDialogPaymentMethods, setShowDialogPaymentMethods] = useState(false);
  if (status.cancelled) {
    return /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col items-center justify-center rounded-2xl bg-red-50 p-6 shadow-sm ring-1 ring-red-100", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white", children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-8 w-8",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M6 18L18 6M6 6l12 12"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-lg font-semibold text-red-600", children: "تم إلغاء الطلب" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.waitingApproval ? "border-yellow-500 bg-yellow-500 text-white" : "border-gray-200 bg-gray-100 text-gray-400"
            ),
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: twMerge(
              "absolute -ml-8 mt-16 text-xs font-medium",
              status.waitingApproval ? "text-yellow-600" : "text-gray-400"
            ),
            children: "بانتظار الموافقة"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "h-1 flex-1",
              status.waitingPayment || status.waitingShipping || status.delivered ? "bg-yellow-500" : "bg-gray-200"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.waitingPayment ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-gray-100 text-gray-400"
            ),
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.waitingPayment ? "text-blue-600" : "text-gray-400"
            ),
            children: "بانتظار الدفع"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "h-1 flex-1",
              status.waitingShipping || status.delivered ? "bg-blue-500" : "bg-gray-200"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.waitingShipping ? "border-orange-400 bg-orange-400 text-white" : "border-gray-200 bg-gray-100 text-gray-400"
            ),
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.waitingShipping ? "text-orange-500" : "text-gray-400"
            ),
            children: "بانتظار الشحن"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "h-1 flex-1",
              status.delivered ? "bg-orange-500" : "bg-gray-200"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.delivered ? "border-green-500 bg-green-500 text-white" : "border-gray-200 bg-gray-100 text-gray-400"
            ),
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.delivered ? "text-green-600" : "text-gray-400"
            ),
            children: "تم التسليم"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-600", children: [
      "طلبك",
      status.delivered ? "تم تسليمه بنجاح." : status.waitingShipping ? "بإنتظار الشحن وسوف يتم توصيله إليك قريباً." : status.waitingPayment ? "بإنتظار الدفع لإتمام الطلب." : "بإنتظار الموافقة من الإدارة."
    ] }),
    status.waitingPayment && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowDialogPaymentMethods(true),
          className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600",
          children: [
            /* @__PURE__ */ jsx(ArrowBigLeftDash, { className: cn(styles["slide-left-right"]) }),
            "اختر طريقة الدفع"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        DialogPaymentMethodsForm,
        {
          showDialog: showDialogPaymentMethods,
          setShowDialog: setShowDialogPaymentMethods,
          orderId
        }
      )
    ] })
  ] });
};

const OrderSummary = ({ order }) => {
  const statusName = order.order_status_name;
  const orderType = order.order_type_name;
  return /* @__PURE__ */ jsxs("div", { className: "mb-4 min-w-[500px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 border-b pb-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "ملخص الطلب" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
          "تم إنشاء الطلب في ",
          formatDate(order.created_at)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-2 text-xs", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            "#",
            order.id
          ] }),
          orderType && /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
            "(",
            orderType,
            ")"
          ] })
        ] }),
        statusName && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700", children: statusName })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "اسم العميل" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900", children: order.customer?.name || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "رقم الهاتف" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-800", children: order.customer?.phone || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "البريد الإلكتروني" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-800", children: order.customer?.email || "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "العنوان" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-900", children: formatAddress(order.address) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] text-slate-500", children: [
            order.address?.city_name,
            " - ",
            order.address?.area_name
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "تفاصيل إضافية" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-800", children: [
            "مبنى ",
            order.address?.building || "-",
            "، طابق",
            order.address?.floor ?? "-",
            "، شقة ",
            order.address?.flat ?? "-"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] text-slate-500", children: [
            "علامة مميزة: ",
            order.address?.special_sign || "لا يوجد"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "هاتف العنوان" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-800", children: order.address?.phone || "-" })
        ] })
      ] })
    ] })
  ] });
};

const OrderItems = ({ order }) => {
  const hasProducts = React__default.useMemo(() => {
    return order?.order_products && Array.isArray(order.order_products) && order.order_products.length > 0;
  }, [order.order_products]);
  return /* @__PURE__ */ jsxs("div", { className: "mb-4 min-w-[500px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between border-b pb-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "تفاصيل المنتجات" }),
      hasProducts && /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
        "عدد العناصر:",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: order.order_products.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("table", { className: "w-full border-separate border-spacing-0 text-sm", children: [
      /* @__PURE__ */ jsxs("colgroup", { children: [
        /* @__PURE__ */ jsx("col", { className: "w-[40%]" }),
        /* @__PURE__ */ jsx("col", { className: "w-[10%]" }),
        /* @__PURE__ */ jsx("col", { className: "w-[25%]" }),
        /* @__PURE__ */ jsx("col", { className: "w-[25%]" })
      ] }),
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b bg-slate-50 text-xs text-slate-500", children: [
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 text-start font-medium", children: "المنتج" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 text-center font-medium", children: "الكمية" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 text-center font-medium", children: "سعر الوحدة" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 text-center font-medium", children: "الإجمالي" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: hasProducts ? order.order_products.map((item) => {
        const unitPrice = calculateActualPrice(
          String(item?.product_price ?? "0"),
          String(item?.discount ?? "0")
        );
        const lineTotal = calculateItemTotal(
          String(item?.product_price ?? "0"),
          String(item?.discount ?? "0"),
          String(item?.qty ?? "0")
        );
        return /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b last:border-b-0 odd:bg-white even:bg-slate-50/40 hover:bg-slate-50/80",
            children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 align-top", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                item.main_image && /* @__PURE__ */ jsx("div", { className: "relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100", children: /* @__PURE__ */ jsx(
                  Image,
                  {
                    src: item.main_image,
                    alt: item.product_name || `Product #${item.id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900", children: item.product_name || `Product #${item.id}` }),
                  item.variations && item.variations.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 space-y-1 text-[11px] text-slate-600", children: item.variations.map((variation) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex flex-wrap items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-700", children: [
                          variation.variation_name,
                          ":"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: variation.choices.map((choice) => /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px]",
                            children: [
                              /* @__PURE__ */ jsx("span", { children: choice.name }),
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
                    variation.variation_id
                  )) }),
                  item.product_note && /* @__PURE__ */ jsxs("div", { className: "mt-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-800", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "ملاحظة:" }),
                    /* @__PURE__ */ jsx("span", { children: item.product_note })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center align-top text-sm text-slate-800 tabular-nums", children: item?.qty ?? "0" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center align-top text-sm text-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold tabular-nums", children: [
                  unitPrice,
                  " ج.م"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-500", children: [
                  "قبل الخصم: ",
                  item.product_price,
                  " ج.م",
                  item.discount ? ` • خصم ${item.discount}%` : "",
                  item.additional_price ? ` • إضافات ${item.additional_price} ج.م` : ""
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center align-top text-sm text-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold tabular-nums", children: [
                  lineTotal,
                  " ج.م"
                ] }),
                item.total_price && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-500", children: [
                  "(من النظام: ",
                  item.total_price,
                  " ج.م)"
                ] })
              ] }) })
            ]
          },
          item.id
        );
      }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
        "td",
        {
          colSpan: 4,
          className: "py-4 text-center text-sm text-slate-500",
          children: "لا يوجد منتجات متاحة"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h5", { className: "mb-1 text-sm font-semibold text-slate-900", children: "الملاحظات على الطلب:" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: order?.notes || "لا يوجد ملاحظات" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-t pt-3 text-sm text-slate-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "إجمالي المنتجات" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold tabular-nums", children: [
            Number(order?.sub_total || 0).toFixed(2),
            " ج.م"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
          /* @__PURE__ */ jsx("span", { children: "الضريبة" }),
          /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
            Number(order?.vat || 0).toFixed(2),
            " ج.م"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
          /* @__PURE__ */ jsx("span", { children: "الشحن" }),
          /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
            Number(order?.shipping || 0).toFixed(2),
            " ج.م"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-between text-base font-semibold text-slate-900", children: [
          /* @__PURE__ */ jsx("span", { children: "الإجمالي النهائي" }),
          /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
            Number(order?.total || 0).toFixed(2),
            " ج.م"
          ] })
        ] })
      ] })
    ] })
  ] });
};

const MemoizedOrderStatusTracker = React__default.memo(OrderStatusTracker);
const MemoizedOrderSummary = React__default.memo(OrderSummary);
const MemoizedOrderItems = React__default.memo(OrderItems);
const OrderDetail = ({
  orderId
}) => {
  const { loading, data: order } = useOrderDetailServices(orderId);
  console.log(order, "order detail data");
  const content = useMemo(() => {
    if (loading) {
      return /* @__PURE__ */ jsx(PageLoader, { text: "جاري تحميل التفاصيل" });
    }
    if (!order) {
      return /* @__PURE__ */ jsx("div", { className: "container mt-20 flex min-h-[calc(100vh-300px)] items-center justify-center text-lg font-semibold", children: "لا توجد تفاصيل متاحة لهذا الطلب" });
    }
    return /* @__PURE__ */ jsxs("div", { className: "container mt-16 min-h-[calc(100vh-300px)] pb-10", children: [
      /* @__PURE__ */ jsx(
        MemoizedOrderStatusTracker,
        {
          orderStatus: order.order_status_id,
          orderId
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-32 animate-pulse rounded-lg bg-gray-100" }),
            children: /* @__PURE__ */ jsx(MemoizedOrderSummary, { order })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "mt-4 h-64 animate-pulse rounded-lg bg-gray-100" }),
            children: /* @__PURE__ */ jsx(MemoizedOrderItems, { order })
          }
        ) })
      ] })
    ] });
  }, [loading, order, orderId]);
  return content;
};

const $$Astro = createAstro("https://admin-osama.cashierthru.com");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const token = Astro2.cookies.get("app_token")?.value;
  if (!token) {
    return Astro2.redirect("/auth/login");
  }
  const id = Astro2.params.id;
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
  const pageTitle = `\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 #${id} - ` + (settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631");
  const pageDescription = `\u0627\u0633\u062A\u0639\u0631\u0636 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0631\u0642\u0645 ${id} \u0648\u062A\u0627\u0628\u0639 \u062D\u0627\u0644\u062A\u0647`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "OrderDetail", OrderDetail, { "orderId": id, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Orders/Detail/OrderDetail", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
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
}, "F:/react js projects/kamal/web-small-business-react/src/pages/order/[id].astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/order/[id].astro";
const $$url = "/order/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
