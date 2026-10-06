"use client";
import React, { useState } from "react";
import { cn } from "@/utils/utils";
import { useRouter } from "@/lib/navigation";
import { formatDate } from "@/lib/global";
import { useOrderServices } from "@/hooks/order";
import PageLoader from "@/components/PageLoader/PageLoader";
import EmptyOrderList from "./EmptyOrderList";
import RateOrderDialog, { RatingStars } from "./RateOrderDialog";
import { ORDER_TABS, orderStatus, type OrderTabKey } from "@/lib/order-status";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock3,
  Wallet,
  ChefHat,
} from "lucide-react";

function OrderList() {
  const { loading, data: orders, reload } = useOrderServices();
  const [activeTab, setActiveTab] = useState<OrderTabKey>("all");
  // Delivered order being rated (dialog open)
  const [ratingOrderId, setRatingOrderId] = useState<number | null>(null);
  const router = useRouter();

  if (loading) {
    return <PageLoader text="جاري تحميل الطلبات" />;
  }

  if (!orders?.length) {
    return <EmptyOrderList />;
  }

  const tab = ORDER_TABS.find((t) => t.key === activeTab) ?? ORDER_TABS[0];
  const filteredOrders = orders.filter((order) => tab.match(Number(order.order_status_id)));

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Clock3 className="h-3.5 w-3.5" />;
      case 2:
        return <Wallet className="h-3.5 w-3.5" />;
      case 3:
        return <ChefHat className="h-3.5 w-3.5" />;
      case 4:
        return <Truck className="h-3.5 w-3.5" />;
      case 5:
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 6:
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
        {/* Filter by status */}
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="تصفية الطلبات حسب الحالة">
          {ORDER_TABS.map((t) => {
            const count = orders.filter((o) => t.match(Number(o.order_status_id))).length;
            const selected = t.key === activeTab;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  selected
                    ? "border-[var(--main-color)] bg-[var(--main-color)] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[var(--main-color)]",
                )}
              >
                {t.label} <span className={cn("text-xs", selected ? "text-white/80" : "text-gray-400")}>({count})</span>
              </button>
            );
          })}
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
          {filteredOrders.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-gray-500">لا توجد طلبات في هذا القسم.</p>
          )}
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
                    "inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium",
                    orderStatus(order.order_status_id)?.pill ?? "bg-gray-100 text-gray-600",
                  )}
                >
                  {getStatusIcon(Number(order.order_status_id))}
                  <span>{orderStatus(order.order_status_id)?.label ?? order.order_status_name}</span>
                </span>
              </div>

              {/* Column 4: total + arrow */}
              <div className="flex items-center justify-between gap-3 md:justify-start md:pr-6">
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-400">الإجمالي</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {order.total}
                    <span className="text-[11px] text-gray-500">ج.م</span>
                  </span>
                </div>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition group-hover:bg-[var(--main-color)]/10 group-hover:text-[var(--main-color)]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </span>
              </div>
              {/* Delivered: rate it, or show the rating given */}
              {(order.can_rate || order.rating) && (
                <div
                  className="flex items-center gap-2 md:col-span-4 md:px-6 md:pb-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.rating ? (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <span>تقييمك</span>
                      <RatingStars value={order.rating.rating} />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRatingOrderId(order.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <RatingStars value={0} size={12} />
                      قيّم الطلب
                    </button>
                  )}
                </div>
              )}

            </article>
          ))}
        </div>
      </div>
      {ratingOrderId !== null && (
        <RateOrderDialog
          orderId={ratingOrderId}
          visible
          onHide={() => setRatingOrderId(null)}
          onRated={reload}
        />
      )}
    </section>
  );
}

export default OrderList;
