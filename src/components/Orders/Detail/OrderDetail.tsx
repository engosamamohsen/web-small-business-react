"use client";

import React, { useMemo, Suspense } from "react";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { OrderSummary } from "./OrderSummary";
import { OrderItems } from "./OrderItems";
import { useOrderDetailServices } from "@/hooks/order";
import PageLoader from "@/components/PageLoader/PageLoader";

const MemoizedOrderStatusTracker = React.memo(OrderStatusTracker);
const MemoizedOrderSummary = React.memo(OrderSummary);
const MemoizedOrderItems = React.memo(OrderItems);

const OrderDetail = ({
  orderId,
}: {
  orderId: string | number;
}): React.ReactNode => {
  const { loading, data: order } = useOrderDetailServices(orderId);

  const content = useMemo(() => {
    if (loading) {
      return <PageLoader text="جاري تحميل التفاصيل" />;
    }

    if (!order) {
      return (
        <div className="container mt-20 flex min-h-[calc(100vh-300px)] items-center justify-center text-lg font-semibold">
          لا توجد تفاصيل متاحة لهذا الطلب
        </div>
      );
    }

    return (
      <div className="container mt-16 min-h-[calc(100vh-300px)] pb-10">
        <MemoizedOrderStatusTracker
          orderStatus={order.order_status_id}
          orderId={orderId}
        />

        <div className="mt-6 space-y-4">
          <div className="overflow-x-auto">
            <Suspense
              fallback={
                <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
              }
            >
              <MemoizedOrderSummary order={order} />
            </Suspense>
          </div>

          <div className="overflow-x-auto">
            <Suspense
              fallback={
                <div className="mt-4 h-64 animate-pulse rounded-lg bg-gray-100" />
              }
            >
              <MemoizedOrderItems order={order} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }, [loading, order, orderId]);

  return content;
};

export default OrderDetail;
