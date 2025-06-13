import React from "react";
import { OrderDetailProps } from "./types";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { OrderSummary } from "./OrderSummary";
import { OrderItems } from "./OrderItems";

/**
 * Main OrderDetail component that displays complete order information
 * with status tracker, order summary and items list
 */
const OrderDetail = ({ order }: OrderDetailProps): React.ReactNode => {
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
}

export default OrderDetail;
