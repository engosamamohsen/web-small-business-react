// Order statuses as the store's dashboard saves them (order_statuses ids 1-6).
// One place for labels and colours, used by the orders list and the order page.

export type OrderStatusId = 1 | 2 | 3 | 4 | 5 | 6;

export type OrderStatusInfo = {
    id: OrderStatusId;
    label: string;
    /** One sentence for the order page. */
    hint: string;
    /** Tailwind classes for the status pill. */
    pill: string;
};

export const ORDER_STATUSES: Record<OrderStatusId, OrderStatusInfo> = {
    1: { id: 1, label: "بانتظار الموافقة", hint: "استلمنا طلبك وهو بانتظار موافقة المتجر.", pill: "bg-amber-100 text-amber-800" },
    2: { id: 2, label: "بانتظار الدفع", hint: "طلبك بانتظار الدفع لإتمامه.", pill: "bg-sky-100 text-sky-800" },
    3: { id: 3, label: "جاري التجهيز", hint: "المتجر يجهز طلبك الآن.", pill: "bg-indigo-100 text-indigo-800" },
    4: { id: 4, label: "في الطريق إليك", hint: "طلبك خرج للتوصيل وسيصلك قريبًا.", pill: "bg-orange-100 text-orange-800" },
    5: { id: 5, label: "تم التسليم", hint: "تم تسليم طلبك. شكرًا لطلبك!", pill: "bg-emerald-100 text-emerald-800" },
    6: { id: 6, label: "ملغي", hint: "تم إلغاء هذا الطلب.", pill: "bg-red-100 text-red-700" },
};

export function orderStatus(id: number | string | null | undefined): OrderStatusInfo | null {
    const key = Number(id) as OrderStatusId;
    return ORDER_STATUSES[key] ?? null;
}

/** Steps on the order page, in order. "Waiting for payment" shows only while it applies. */
export function orderSteps(statusId: number): OrderStatusInfo[] {
    const ids: OrderStatusId[] = statusId === 2 ? [1, 2, 3, 4, 5] : [1, 3, 4, 5];
    return ids.map((id) => ORDER_STATUSES[id]);
}

/** Position of the current status within orderSteps (waiting for payment counts as the first step done). */
export function stepIndex(statusId: number): number {
    const steps = orderSteps(statusId).map((s) => s.id as number);
    return Math.max(0, steps.indexOf(statusId));
}

/** Tabs on the orders list. */
export const ORDER_TABS = [
    { key: "all", label: "الكل", match: () => true },
    { key: "active", label: "جارية", match: (id: number) => id >= 1 && id <= 4 },
    { key: "delivered", label: "تم التسليم", match: (id: number) => id === 5 },
    { key: "cancelled", label: "ملغاة", match: (id: number) => id === 6 },
] as const;

export type OrderTabKey = (typeof ORDER_TABS)[number]["key"];
