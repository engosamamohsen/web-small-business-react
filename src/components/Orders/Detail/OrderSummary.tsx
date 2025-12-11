import React from "react";
import { OrderSummaryProps } from "./types";
import { formatAddress } from "./utils";
import { formatDate } from "@/lib/global";

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const statusName = order.order_status_name;
  const orderType = order.order_type_name;

  return (
    <div className="mb-4 min-w-[500px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      {/* Header: title + order id + status */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">ملخص الطلب</h2>
          <p className="mt-1 text-xs text-slate-500">
            تم إنشاء الطلب في {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
            <span className="font-semibold">#{order.id}</span>
            {orderType && (
              <span className="text-slate-500">({orderType})</span>
            )}
          </span>
          {statusName && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
              {statusName}
            </span>
          )}
        </div>
      </div>

      {/* Customer + Address */}
      <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        {/* Customer info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">اسم العميل</p>
            <p className="text-sm font-medium text-slate-900">
              {order.customer?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">رقم الهاتف</p>
            <p className="text-sm text-slate-800">
              {order.customer?.phone || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">البريد الإلكتروني</p>
            <p className="text-sm text-slate-800">
              {order.customer?.email || "-"}
            </p>
          </div>
        </div>

        {/* Address info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">العنوان</p>
            <p className="text-sm text-slate-900">
              {formatAddress(order.address)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {order.address?.city_name} - {order.address?.area_name}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">تفاصيل إضافية</p>
            <p className="text-sm text-slate-800">
              مبنى {order.address?.building || "-"}، طابق
              {order.address?.floor ?? "-"}، شقة {order.address?.flat ?? "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              علامة مميزة: {order.address?.special_sign || "لا يوجد"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">هاتف العنوان</p>
            <p className="text-sm text-slate-800">
              {order.address?.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Financial summary */}
      {/* <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>إجمالي المنتجات</span>
            <span className="font-semibold">
              {Number(order.sub_total || 0).toFixed(2)} ج.م
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>الضريبة</span>
            <span className="font-semibold">
              {Number(order.vat || 0).toFixed(2)} ج.م
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>الشحن</span>
            <span className="font-semibold">
              {Number(order.shipping || 0).toFixed(2)} ج.م
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between border-t pt-3 text-base font-semibold text-slate-900 md:mt-0 md:border-t-0 md:pt-0">
          <span>الإجمالي النهائي</span>
          <span>{Number(order.total || 0).toFixed(2)} ج.م</span>
        </div>
      </div> */}
    </div>
  );
};
