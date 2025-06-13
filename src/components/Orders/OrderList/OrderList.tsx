"use client";
import React, { useState } from "react";
import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/global";

interface Order {
  id: number;
  order_type: number;
  order_status: number;
  sub_total: string;
  shipping: string;
  total: string;
  customer: string;
  phone: string;
  delivery_id: number;
  delivery: number;
  table_id: number;
  date: string;
}

function OrderList({ orders }: { orders: Order[] }) {
  const [activeTab] = useState<string>("All");
  const router = useRouter();

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open" && order.order_status === 1) return true;
    if (activeTab === "Shipped" && order.order_status === 2) return true;
    if (activeTab === "Completed" && order.order_status === 3) return true;
    return false;
  });

  // Get status text based on order_status code
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "مفتوح";
      case 2:
        return "شحن";
      case 3:
        return "تمت";
      case 4:
        return "ملغي";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mt-20 min-h-[calc(100vh-300px)]">
      <h1 className="text-3xl font-semibold">الطلبات السابقه</h1>
      <div className="mt-10 h-full overflow-x-auto">
        {" "}
        <div className="h-full bg-gray-100 p-4">
          {/* <div className="mb-8 flex border-b border-gray-300">
            {[
              { name: "الكل", key: "All" },
              { name: "المفتوح", key: "Open" },
              { name: "الشحن", key: "Shipped" },
              { name: "تمت", key: "Completed" },
              { name: "الملغي", key: "Canceled" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={cn(
                  styles.tabButton,
                  activeTab === tab.key && styles.active,
                  "!bg-gray-50",
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.name}
              </button>
            ))}
          </div> */}

          <div className="mx-auto mb-4 flex h-full max-h-[500px] w-full max-w-[500px] flex-col gap-6 overflow-y-auto p-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-md bg-white p-4 shadow-md"
                onClick={() => {
                  router.push(`/order/${order.id}`);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-3">
                    <bdi className="text-end text-gray-500">{order.id} #</bdi>
                    <h6 className="text-gray-500">{formatDate(order.date)}</h6>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h6
                    className={cn(
                      "rounded-full bg-gray-100 px-2 py-1 text-center",
                      order.order_status === 1 && "bg-orange-500 text-white",
                      order.order_status === 2 && "bg-green-500 text-white",
                      order.order_status === 3 && "bg-green-500 text-white",
                      order.order_status === 4 && "bg-red-500 text-white",
                    )}
                  >
                    {getStatusText(order.order_status)}
                  </h6>
                  <h6 className="text-gray-500">{order.total} ج.م</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
