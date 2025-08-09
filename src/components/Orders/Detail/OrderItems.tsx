import React from "react";
import { OrderItemsProps } from "./types";
import { calculateActualPrice, calculateItemTotal } from "./utils";

/**
 * Displays the list of items in an order with quantity, price and total
 */
export const OrderItems: React.FC<OrderItemsProps> = ({ order }) => {
  const hasProducts = React.useMemo(() => {
    return (
      order?.order_products &&
      Array.isArray(order.order_products) &&
      order.order_products.length > 0
    );
  }, [order.order_products]);

  return (
    <div className="mb-4 min-w-[500px] rounded-lg bg-gray-50 p-5 shadow-md">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-start">المنتج</th>
            <th className="pb-2 text-center">الكمية</th>
            <th className="pb-2 text-right">السعر</th>
            <th className="pb-2 text-right">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {hasProducts ? (
            order.order_products.map((item) => (
              <tr key={item?.id || Math.random()} className="border-b">
                <td className="py-3">
                  {item?.name || `Product #${item?.id || "Unknown"}`}
                </td>
                <td className="py-3 text-center">{item?.qty || "0"}</td>
                <td className="py-3 text-right">
                  EGP{" "}
                  {calculateActualPrice(
                    item?.product_price || "0",
                    item?.discount || "0",
                  )}
                </td>
                <td className="py-3 text-right">
                  EGP{" "}
                  {calculateItemTotal(
                    item?.product_price || "0",
                    item?.discount || "0",
                    item?.qty || "0",
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-3 text-center">
                لا يوجد منتجات متاحة{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <div className="mb-4">
          <h5 className="mb-2 text-sm font-semibold">الملاحظات علي الطلب:</h5>
          <p className="text-sm text-gray-600">
            {order?.notes || "لا يوجد ملاحظات"}
          </p>
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-semibold">
          <span>الإجمالي</span>
          <span>EGP {Number(order?.total)?.toFixed(2) || "0"}</span>
        </div>
      </div>
    </div>
  );
};
