import React from "react";
import { twMerge } from "tailwind-merge";
import { OrderStatusTrackerProps } from "./types";
import { getOrderStatus } from "./utils";

/**
 * Displays the current status of an order with a visual progress tracker
 */
export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orderStatus,
}) => {
  const status = getOrderStatus(orderStatus);

  return (
    <div className="mb-4 rounded-lg bg-gray-50 p-8 shadow-md">
      <div className="flex items-center">
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
            : "تم استلامه ويتم المعالجة"}
      </p>
    </div>
  );
};
