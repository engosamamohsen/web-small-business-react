"use client";
import React, { useState } from "react";
import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/global";
import { useOrderServices } from "@/hooks/order";
import PageLoader from "@/components/PageLoader/PageLoader";
import EmptyOrderList from "./EmptyOrderList";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

function OrderList() {
  const { loading, data: orders } = useOrderServices();
  const [activeTab] = useState<string>("All"); // ✅ logic unchanged
  const router = useRouter();

  console.log(orders, "orders list");

  if (loading) {
    return <PageLoader text="جاري تحميل الطلبات" />;
  }

  if (!orders?.length) {
    return <EmptyOrderList />;
  }

  // ✅ same filtering logic
  const filteredOrders = orders?.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open" && order.order_status_id === 1) return true;
    if (activeTab === "Shipped" && order.order_status_id === 2) return true;
    if (activeTab === "Completed" && order.order_status_id === 3) return true;
    return false;
  });

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Clock3 className="h-3.5 w-3.5" />;
      case 2:
        return <Truck className="h-3.5 w-3.5" />;
      case 3:
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 4:
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 5:
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <Package className="h-3.5 w-3.5" />;
    }
  };

  return (
    // section can take full width; header has its own padding
    <section className="mt-16 min-h-[calc(100vh-300px)] w-full">
      {/* Header row */}
      <header className="mb-6 flex w-full flex-col gap-2 px-4 text-right sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">الطلبات</h1>
            <p className="mt-1 text-sm text-gray-500">
              استعرض كل طلباتك وتابع حالتها وتكلفتها بسهولة.
            </p>
          </div>

          <div className="hidden flex-col items-end text-xs text-gray-500 sm:flex">
            <span>إجمالي الطلبات</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-[var(--main-color)]">
              {orders.length} طلب
            </span>
          </div>
        </div>
      </header>

      {/* full-width table wrapper */}
      <div className="w-full overflow-hidden rounded-none border-y border-gray-100 bg-gray-50 shadow-sm md:bg-white">
        {/* Table-like header row (desktop) */}
        <div className="hidden border-b border-gray-100 bg-gray-50/80 py-3 text-[11px] text-gray-500 md:grid md:grid-cols-[1.5fr_1fr_1fr_0.5fr]">
          {/* first column header aligned with rows */}
          <div className="flex items-center gap-2 pr-6">
            <div className="flex flex-col">
              <span className="text-right">الطلب</span>
            </div>
            {/* invisible icon keeps same width as row icon */}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full opacity-0">
              <Package className="h-4 w-4" />
            </span>
          </div>

          <span className="flex items-center pr-6 text-right">التاريخ</span>
          <span className="flex items-center pr-6 text-right">
            حالة الطلب
          </span>
          <span className="flex items-center pr-6 text-right">الإجمالي</span>
        </div>

        {/* Orders list – responsive */}
        <div className="max-h-[calc(100vh-260px)] w-full overflow-y-auto border-t border-gray-50 md:border-t-0 md:bg-white" >
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              role="button"
              aria-label={`تفاصيل الطلب رقم ${order.id}`}
              onClick={() => {
                router.push(`/order/${order.id}`);
              }}
              className={cn(
                // 🔹 Mobile: card style with separation
                "group mx-3 my-2 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-right shadow-sm transition",
                // 🔹 Desktop: behave like table row (no card look)
                "md:mx-0 md:my-0 md:rounded-none md:border-0 md:border-b md:border-gray-50 md:px-0 md:shadow-none md:grid md:grid-cols-[1.5fr_1fr_1fr_0.5fr] md:items-center md:gap-4 md:hover:bg-gray-50/80 md:hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
              )}
            >
              {/* Column 1: order id */}
              <div className="flex items-center justify-between gap-2 md:justify-start md:pr-6">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400">رقم الطلب</span>
                  <span className="text-sm font-semibold text-gray-900">
                    #{order.id}
                  </span>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Package className="h-4 w-4" />
                </span>
              </div>

              {/* Column 2: date */}
              <div className="flex flex-col md:pr-6">
                <span className="text-[11px] text-gray-400">التاريخ</span>
                <span className="text-xs text-gray-600">
                  {formatDate(order.created_at)}
                </span>
              </div>

              {/* Column 3: status */}
              <div className="flex flex-col gap-1 sm:w-[120px] sm:max-w-[120px] md:w-[160px] md:max-w-[160px] md:pr-6">
                <span className="text-[11px] text-gray-400">الحالة</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium",
                    "bg-gray-100 text-gray-600",
                    order.order_status_id === 1 &&
                    "bg-yellow-500/90 text-white",
                    order.order_status_id === 2 &&
                    "bg-blue-500/90 text-white",
                    order.order_status_id === 3 &&
                    "bg-orange-400/90 text-white",
                    order.order_status_id === 4 &&
                    "bg-green-500/90 text-white",
                    order.order_status_id === 5 && "bg-red-500/90 text-white"
                  )}
                >
                  {getStatusIcon(order.order_status_id)}
                  <span>{order.order_status_name}</span>
                </span>
              </div>

              {/* Column 4: total + arrow */}
              <div className="flex items-center justify-between gap-3 md:justify-start md:pr-6">
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-400">الإجمالي</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {order.total}{" "}
                    <span className="text-[11px] text-gray-500">ج.م</span>
                  </span>
                </div>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition group-hover:bg-[var(--main-color)]/10 group-hover:text-[var(--main-color)]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrderList;
