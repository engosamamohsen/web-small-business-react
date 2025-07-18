import React from "react";
import { OrderSummaryProps } from "./types";
import { formatAddress } from "./utils";
import { formatDate } from "@/lib/global";

/**
 * Displays order summary information including order ID, restaurant, timestamp,
 * address and contact details
 */
export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  // Safely handle branches display
  // const branchNames = React.useMemo(() => {
  //   if (!order.branches) return "-";
  //   if (!Array.isArray(order.branches)) return "غير محدد";

  //   return (
  //     order.branches
  //       .filter((branch) => branch && branch.name)
  //       .map((branch) => branch.name)
  //       .join(", ") || "غير محدد"
  //   );
  // }, [order.branches]);
  return (
    <div className="mb-4 min-w-[500px] rounded-lg bg-gray-50 p-5 shadow-md">
      <h2 className="border-b pb-2 text-lg font-semibold">ملخص الطلب</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-3">
            <p className="text-sm text-gray-500">رقم الطلب</p>
            <p>{order.id}</p>
          </div>

          {/* <div className="mb-3">
            <p className="text-sm text-gray-500">مطعم</p>
            <p>{branchNames}</p>
          </div> */}

          <div className="mb-3">
            <p className="text-sm text-gray-500">الوقت</p>
            <p>{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <p className="text-sm text-gray-500">العنوان</p>
            <p>{formatAddress(order.address)}</p>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">اتجاهات إضافية</p>
            <p>{order?.address?.special_sign || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500"> رقم الهاتف</p>
            <p>{order?.customer?.phone || "-"} </p>
          </div>
        </div>
      </div>
    </div>
  );
};
