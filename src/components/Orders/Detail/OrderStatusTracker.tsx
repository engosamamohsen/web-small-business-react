import React, { useState } from "react";
import { ArrowBigLeftDash, Check, XCircle } from "lucide-react";
import { OrderStatusTrackerProps } from "./types";
import styles from "./style.module.css";
import { cn } from "@/utils/utils";
import DialogPaymentMethodsForm from "./DialogPaymentMethodsForm";
import { orderStatus, orderSteps, stepIndex } from "@/lib/order-status";
import { formatDate } from "@/lib/global";
import { useCancelOrder } from "@/hooks/order";

// Where the order is now (statuses 1-6 from the dashboard), and the customer's cancel button
// while the store hasn't started preparing it (full e-commerce plans).
export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orderStatus: rawStatus,
  orderId,
  createdAt,
  updatedAt,
  canCancel,
  onCancelled,
}) => {
  const statusId = Number(rawStatus);
  const current = orderStatus(statusId);
  const [showDialogPaymentMethods, setShowDialogPaymentMethods] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { cancelOrder, loading: cancelling } = useCancelOrder();

  const handleCancel = async () => {
    if (await cancelOrder(orderId)) {
      setConfirming(false);
      onCancelled?.();
    }
  };

  if (statusId === 6) {
    return (
      <div className="mb-6 flex flex-col items-center justify-center rounded-2xl bg-red-50 p-6 text-center shadow-sm ring-1 ring-red-100">
        <XCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold text-red-700">تم إلغاء الطلب</p>
        {updatedAt && <p className="mt-1 text-sm text-red-600/80">{formatDate(updatedAt)}</p>}
      </div>
    );
  }

  const steps = orderSteps(statusId);
  const activeIndex = stepIndex(statusId);

  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">حالة الطلب</p>
          <p className="text-lg font-semibold text-gray-900">{current?.label ?? "—"}</p>
        </div>
        {createdAt && (
          <p className="text-xs text-gray-500">
            تاريخ الطلب: <span className="font-medium text-gray-700">{formatDate(createdAt)}</span>
          </p>
        )}
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-flow-col sm:auto-cols-fr sm:gap-0" aria-label="مراحل الطلب">
        {steps.map((step, i) => {
          const done = i < activeIndex || statusId === 5;
          const active = i === activeIndex && statusId !== 5;
          return (
            <li key={step.id} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute hidden h-1 sm:top-5 sm:block sm:w-full",
                    i <= activeIndex || statusId === 5 ? "bg-[var(--main-color)]" : "bg-gray-200",
                  )}
                  style={{ insetInlineEnd: "50%" }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done && "border-[var(--main-color)] bg-[var(--main-color)] text-white",
                  active && "border-[var(--main-color)] bg-white text-[var(--main-color)]",
                  !done && !active && "border-gray-200 bg-gray-50 text-gray-400",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-5 w-5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn("text-sm sm:mt-2", done || active ? "font-semibold text-gray-900" : "text-gray-400")}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 text-center text-sm text-gray-600">{current?.hint}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {statusId === 2 && (
          <>
            <button
              onClick={() => setShowDialogPaymentMethods(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--main-color)] px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <ArrowBigLeftDash className={cn(styles["slide-left-right"])} />
              اختر طريقة الدفع
            </button>
            <DialogPaymentMethodsForm
              showDialog={showDialogPaymentMethods}
              setShowDialog={setShowDialogPaymentMethods}
              orderId={orderId}
            />
          </>
        )}

        {canCancel && !confirming && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            إلغاء الطلب
          </button>
        )}
      </div>

      {canCancel && confirming && (
        <div className="mx-auto mt-4 max-w-md rounded-xl bg-red-50 p-4 text-center ring-1 ring-red-100" role="alertdialog" aria-label="تأكيد إلغاء الطلب">
          <p className="text-sm font-medium text-red-800">هل تريد إلغاء هذا الطلب؟ لا يمكن التراجع بعد الإلغاء.</p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {cancelling ? "جارٍ الإلغاء…" : "نعم، ألغِ الطلب"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700"
            >
              تراجع
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
