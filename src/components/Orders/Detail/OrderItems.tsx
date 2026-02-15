import React from "react";
import Image from "@/components/common/Image";
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
    <div className="mb-4 min-w-[500px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold text-slate-900">
          تفاصيل المنتجات
        </h3>
        {hasProducts && (
          <span className="text-xs text-slate-500">
            عدد العناصر:
            <span className="font-semibold">
              {order.order_products.length}
            </span>
          </span>
        )}
      </div>

      {/* Items table */}
      <table className="w-full border-separate border-spacing-0 text-sm">
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[10%]" />
          <col className="w-[25%]" />
          <col className="w-[25%]" />
        </colgroup>
        <thead>
          <tr className="border-b bg-slate-50 text-xs text-slate-500">
            <th className="py-2 px-4 text-start font-medium">المنتج</th>
            <th className="py-2 px-4 text-center font-medium">الكمية</th>
            <th className="py-2 px-4 text-center font-medium">سعر الوحدة</th>
            <th className="py-2 px-4 text-center font-medium">الإجمالي</th>
          </tr>
        </thead>

        <tbody>
          {hasProducts ? (
            order.order_products.map((item) => {
              const unitPrice = calculateActualPrice(
                String(item?.product_price ?? "0"),
                String(item?.discount ?? "0"),
              );
              const lineTotal = calculateItemTotal(
                String(item?.product_price ?? "0"),
                String(item?.discount ?? "0"),
                String(item?.qty ?? "0"),
              );

              return (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 odd:bg-white even:bg-slate-50/40 hover:bg-slate-50/80"
                >
                  {/* المنتج */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-start gap-3">
                      {item.main_image && (
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                          <Image
                            src={item.main_image}
                            alt={item.product_name || `Product #${item.id}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium text-slate-900">
                          {item.product_name || `Product #${item.id}`}
                        </p>

                        {/* Variations */}
                        {item.variations && item.variations.length > 0 && (
                          <div className="mt-1 space-y-1 text-[11px] text-slate-600">
                            {item.variations.map((variation) => (
                              <div
                                key={variation.variation_id}
                                className="flex flex-wrap items-center gap-1"
                              >
                                <span className="font-medium text-slate-700">
                                  {variation.variation_name}:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {variation.choices.map((choice) => (
                                    <span
                                      key={choice.id}
                                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px]"
                                    >
                                      <span>{choice.name}</span>
                                      {choice.price > 0 && (
                                        <span className="text-[10px] text-slate-500">
                                          (+{choice.price} ج.م)
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Product note */}
                        {item.product_note && (
                          <div className="mt-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
                            <span className="font-medium">ملاحظة:</span>
                            <span>{item.product_note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* الكمية */}
                  <td className="py-3 px-4 text-center align-top text-sm text-slate-800 tabular-nums">
                    {item?.qty ?? "0"}
                  </td>

                  {/* سعر الوحدة */}
                  <td className="py-3 px-4 text-center align-top text-sm text-slate-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-semibold tabular-nums">
                        {unitPrice} ج.م
                      </span>
                      <span className="text-[11px] text-slate-500">
                        قبل الخصم: {item.product_price} ج.م
                        {item.discount ? ` • خصم ${item.discount}%` : ""}
                        {item.additional_price
                          ? ` • إضافات ${item.additional_price} ج.م`
                          : ""}
                      </span>
                    </div>
                  </td>

                  {/* الإجمالي */}
                  <td className="py-3 px-4 text-center align-top text-sm text-slate-900">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-semibold tabular-nums">
                        {lineTotal} ج.م
                      </span>
                      {item.total_price && (
                        <span className="text-[11px] text-slate-500">
                          (من النظام: {item.total_price} ج.م)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={4}
                className="py-4 text-center text-sm text-slate-500"
              >
                لا يوجد منتجات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Notes + totals */}
      <div className="mt-5 space-y-4 text-sm">
        <div>
          <h5 className="mb-1 text-sm font-semibold text-slate-900">
            الملاحظات على الطلب:
          </h5>
          <p className="text-sm text-gray-600">
            {order?.notes || "لا يوجد ملاحظات"}
          </p>
        </div>

        <div className="space-y-1 border-t pt-3 text-sm text-slate-700">
          <div className="flex justify-between">
            <span>إجمالي المنتجات</span>
            <span className="font-semibold tabular-nums">
              {Number(order?.sub_total || 0).toFixed(2)} ج.م
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>الضريبة</span>
            <span className="tabular-nums">
              {Number(order?.vat || 0).toFixed(2)} ج.م
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>الشحن</span>
            <span className="tabular-nums">
              {Number(order?.shipping || 0).toFixed(2)} ج.م
            </span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-slate-900">
            <span>الإجمالي النهائي</span>
            <span className="tabular-nums">
              {Number(order?.total || 0).toFixed(2)} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
