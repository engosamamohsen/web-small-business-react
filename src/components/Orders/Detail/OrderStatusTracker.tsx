import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { OrderStatusTrackerProps } from "./types";
import { getOrderStatus } from "./utils";
import { ArrowBigLeftDash } from "lucide-react";
import styles from "./style.module.css";
import { cn } from "@/utils/utils";
import DialogPaymentMethodsForm from "./DialogPaymentMethodsForm";
/**
 * Displays the current status of an order with a visual progress tracker
 */
export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orderStatus,
  orderId,
}) => {
  const status = getOrderStatus(orderStatus);

  const [showDialogPaymentMethods, setShowDialogPaymentMethods] =
    useState(false);

  return (
    <div className="mb-4 flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 shadow-md">
      <div className="flex w-full items-center">
        {/* Waiting for Approval Status */}
        <div className="flex flex-1 items-center">
          <div
            className={twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.waitingApproval
                ? "border-yellow-500 bg-yellow-500 text-white"
                : "border-gray-200 bg-gray-200",
            )}
          >
            {status.waitingApproval && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <span
            className={twMerge(
              "absolute -ml-8 mt-16 text-xs font-medium",
              status.waitingApproval ? "text-yellow-500" : "text-gray-400",
            )}
          >
            بإنتظار الموافقة
          </span>

          <div
            className={twMerge(
              "h-1 flex-1",
              status.waitingPayment ? "bg-yellow-500" : "bg-gray-200",
            )}
          ></div>
        </div>

        {/* Waiting for Payment Status */}
        <div className="flex flex-1 items-center">
          <div
            className={twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.waitingPayment
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-200 bg-gray-200",
            )}
          >
            {status.waitingPayment && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </div>
          <span
            className={twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.waitingPayment ? "text-blue-500" : "text-gray-400",
            )}
          >
            بإنتظار الدفع
          </span>

          <div
            className={twMerge(
              "h-1 flex-1",
              status.received ? "bg-blue-500" : "bg-gray-200",
            )}
          ></div>
        </div>

        {/* Received Status */}
        <div className="flex flex-1 items-center">
          <div
            className={twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.received
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-200 bg-gray-200",
            )}
          >
            {status.received && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={twMerge(
              "absolute -ml-2 mt-16 text-xs font-medium",
              status.received ? "text-green-500" : "text-gray-400",
            )}
          >
            استلام
          </span>

          <div
            className={twMerge(
              "h-1 flex-1",
              status.preparing ? "bg-green-500" : "bg-gray-200",
            )}
          ></div>
        </div>

        {/* Preparing Status */}
        <div className="flex flex-1 items-center">
          <div
            className={twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.preparing
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-200 bg-gray-200",
            )}
          >
            {status.preparing && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.preparing ? "text-green-500" : "text-gray-400",
            )}
          >
            قيد التحضير
          </span>

          <div
            className={twMerge(
              "h-1 flex-1",
              status.delivered ? "bg-green-500" : "bg-gray-200",
            )}
          ></div>
        </div>

        {/* Delivered Status */}
        <div className="flex items-center">
          <div
            className={twMerge(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
              status.delivered
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-200 bg-gray-200",
            )}
          >
            {status.delivered && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={twMerge(
              "absolute -ml-6 mt-16 text-xs font-medium",
              status.delivered ? "text-green-500" : "text-gray-400",
            )}
          >
            تم التوصيل
          </span>
        </div>
      </div>
      <p className="mt-10 text-center text-gray-600">
        طلبك{" "}
        {status.delivered
          ? "تم التوصيل"
          : status.preparing
            ? "الآن قيد التحضير وسوف يتم توصيله اليك قريبا!"
            : status.received
              ? "تم استلامه ويتم المعالجة"
              : status.waitingPayment
                ? "بإنتظار الدفع"
                : "بإنتظار الموافقة"}
      </p>
      {status.waitingPayment && (
        <>
          <button
            onClick={() => setShowDialogPaymentMethods(true)}
            className="mx-auto mt-2 flex items-center gap-1 rounded-md bg-blue-500 px-4 py-2 text-xs text-white"
          >
            <ArrowBigLeftDash
              className={cn(
                "h-5 w-5 animate-bounce",
                styles["slide-left-right"],
              )}
            />
            اتمام الدفع
          </button>
          <DialogPaymentMethodsForm
            showDialog={showDialogPaymentMethods}
            setShowDialog={setShowDialogPaymentMethods}
            orderId={orderId}
          />
        </>
      )}
    </div>
  );
};
