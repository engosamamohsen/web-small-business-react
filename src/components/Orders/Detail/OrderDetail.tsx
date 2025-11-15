"use client";

import React, { useMemo, Suspense } from "react";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { OrderSummary } from "./OrderSummary";
import { OrderItems } from "./OrderItems";
import { useOrderDetailServices } from "@/hooks/order";
import PageLoader from "@/components/PageLoader/PageLoader";

// Memoized sub-components to prevent unnecessary re-renders
const MemoizedOrderStatusTracker = React.memo(OrderStatusTracker);
const MemoizedOrderSummary = React.memo(OrderSummary);
const MemoizedOrderItems = React.memo(OrderItems);

/**
 * Main OrderDetail component that displays complete order information
 * with status tracker, order summary and items list
 */
const OrderDetail = ({
  orderId,
}: {
  orderId: string | number;
}): React.ReactNode => {
  const { loading, data: order } = useOrderDetailServices(orderId);

  // Using useMemo to prevent unnecessary recalculations
  const content = useMemo(() => {
    if (loading) {
      return <PageLoader text="جاري تحميل التفاصيل" />;
    }

    if (!order) {
      return (
        <div className="container mt-20 flex min-h-[calc(100vh-300px)] items-center justify-center text-lg font-semibold">
          ليس لديك أي طلبات
        </div>
      );
    }

    return (
      <div className="container mt-20 min-h-[calc(100vh-300px)]">
        <MemoizedOrderStatusTracker
          orderStatus={order.order_status_id}
          orderId={orderId}
        />

        <div className="overflow-x-auto">
          <Suspense
            fallback={
              <div className="h-32 animate-pulse rounded bg-gray-100"></div>
            }
          >
            <MemoizedOrderSummary order={order} />
          </Suspense>
        </div>

        <div className="overflow-x-auto">
          <Suspense
            fallback={
              <div className="mt-4 h-64 animate-pulse rounded bg-gray-100"></div>
            }
          >
            <MemoizedOrderItems order={order} />
          </Suspense>
        </div>
      </div>
    );
  }, [loading, order, orderId]);

  return content;
};

export default OrderDetail;
