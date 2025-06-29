"use client";

import React from "react";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { OrderSummary } from "./OrderSummary";
import { OrderItems } from "./OrderItems";
import { useOrderDetailServices } from "@/hooks/order";
import PageLoader from "@/components/PageLoader/PageLoader";

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
      <OrderStatusTracker orderStatus={order.order_status} />

      <div className="overflow-x-auto">
        <OrderSummary order={order} />
      </div>

      <div className="overflow-x-auto">
        <OrderItems order={order} />
      </div>
    </div>
  );
};

export default OrderDetail;
