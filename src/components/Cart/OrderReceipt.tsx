import { forwardRef } from "react";
import type { CartItemType } from "@/types/types";
import { originalUnitPrice } from "@/lib/cart/cart-totals";

// ─── Order receipt (rendered to a PNG for WhatsApp) ──────────────────────────
//
// The WhatsApp order message is text-free except for a greeting — every order
// detail (products + variations, qty, prices, customer name/phone/address,
// subtotal, VAT, total) is delivered as THIS element captured to a PNG and
// downloaded, which the customer attaches in the chat.
//
// Rendered OFF-SCREEN (left:-10000px) so it's laid out for html2canvas but never
// visible. Uses inline styles with explicit hex colors (no Tailwind/oklch, no
// remote images) so the captured image renders deterministically.

export interface ReceiptCustomer {
    name?: string;
    phone?: string;
    address?: string;
}

interface OrderReceiptProps {
    greeting: string;
    items: CartItemType[];
    customer?: ReceiptCustomer;
    /** Post-discount products subtotal. */
    subtotal: number;
    /** Pre-discount products subtotal (shown struck when a discount applies). */
    originalSubtotal?: number;
    /** Total saved across the order. */
    discountAmount?: number;
    vatRate?: number;
    vatAmount?: number;
    total: number;
}

const C = {
    ink: "#0f172a",
    sub: "#475569",
    muted: "#64748b",
    line: "#e2e8f0",
    lineSoft: "#f1f5f9",
    note: "#b45309",
    noteBg: "#fffbeb",
    accent: "#ea580c",
};

const money = (n: number) => `${(Math.round(n * 100) / 100).toFixed(2)} ج.م`;

const row = (label: string, value: string, bold = false) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: bold ? "16px" : "14px",
            fontWeight: bold ? 700 : 400,
            color: C.ink,
            marginTop: bold ? "6px" : "2px",
        }}
    >
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(
    ({ greeting, items, customer, subtotal, originalSubtotal = 0, discountAmount = 0, vatRate = 0, vatAmount = 0, total }, ref) => {
        const hasDiscount = discountAmount > 0;
        const hasCustomer =
            customer &&
            (customer.name?.trim() ||
                customer.phone?.trim() ||
                customer.address?.trim());

        return (
            <div
                ref={ref}
                dir="rtl"
                style={{
                    position: "fixed",
                    top: 0,
                    insetInlineStart: "-10000px",
                    width: "440px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    color: C.ink,
                    padding: "24px",
                    textAlign: "right",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    pointerEvents: "none",
                }}
            >
                {/* Header — greeting / shop name */}
                <div style={{ fontSize: "20px", fontWeight: 700 }}>{greeting}</div>
                <div style={{ fontSize: "13px", color: C.muted, marginBottom: "16px" }}>
                    تفاصيل الطلب
                </div>

                {/* Items */}
                {items.map((item, i) => {
                    const qty = Number(item.qty) || 1;
                    const unit = Number(item.unit_price) || 0;
                    const origUnit = originalUnitPrice(item);
                    const lineDiscounted = origUnit > unit;
                    const lineTotal = Math.round(unit * qty * 100) / 100;
                    return (
                        <div
                            key={item.cart_item_id ?? i}
                            style={{
                                paddingBottom: "10px",
                                marginBottom: "10px",
                                borderBottom: `1px solid ${C.lineSoft}`,
                            }}
                        >
                            <div style={{ fontSize: "15px", fontWeight: 600 }}>
                                {i + 1}. {item.product_name}
                            </div>

                            {Array.isArray(item.variations) &&
                                item.variations.map((v) =>
                                    v?.choices?.length ? (
                                        <div
                                            key={v.main_variation_id}
                                            style={{ fontSize: "13px", color: C.sub }}
                                        >
                                            {v.main_variation_name
                                                ? `${v.main_variation_name}: `
                                                : ""}
                                            {v.choices
                                                .map((c) =>
                                                    Number(c.price) > 0
                                                        ? `${c.name} (+${c.price})`
                                                        : c.name,
                                                )
                                                .join("، ")}
                                        </div>
                                    ) : null,
                                )}

                            <div style={{ fontSize: "13px", color: C.sub, marginTop: "2px" }}>
                                الكمية: {qty} ×{" "}
                                {lineDiscounted ? (
                                    <span style={{ textDecoration: "line-through", color: C.muted }}>
                                        {money(origUnit)}
                                    </span>
                                ) : null}{" "}
                                {money(unit)} = {money(lineTotal)}
                            </div>

                            {item.product_note ? (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: C.note,
                                        background: C.noteBg,
                                        borderRadius: "6px",
                                        padding: "3px 8px",
                                        marginTop: "4px",
                                    }}
                                >
                                    ملاحظة: {item.product_note}
                                </div>
                            ) : null}
                        </div>
                    );
                })}

                {/* Customer (Plus tier) */}
                {hasCustomer ? (
                    <div
                        style={{
                            marginTop: "4px",
                            paddingTop: "10px",
                            borderTop: `1px solid ${C.line}`,
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                            بيانات العميل
                        </div>
                        {customer?.name?.trim() ? (
                            <div style={{ fontSize: "13px", color: C.ink }}>
                                الاسم: {customer.name}
                            </div>
                        ) : null}
                        {customer?.phone?.trim() ? (
                            <div style={{ fontSize: "13px", color: C.ink }}>
                                الهاتف: {customer.phone}
                            </div>
                        ) : null}
                        {customer?.address?.trim() ? (
                            <div style={{ fontSize: "13px", color: C.ink }}>
                                العنوان: {customer.address}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {/* Totals */}
                <div
                    style={{
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: `1px solid ${C.line}`,
                    }}
                >
                    {hasDiscount ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                                color: C.muted,
                                marginTop: "2px",
                            }}
                        >
                            <span>الإجمالي قبل الخصم</span>
                            <span style={{ textDecoration: "line-through" }}>
                                {money(originalSubtotal)}
                            </span>
                        </div>
                    ) : null}
                    {hasDiscount ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#16a34a",
                                marginTop: "2px",
                            }}
                        >
                            <span>الخصم</span>
                            <span>- {money(discountAmount)}</span>
                        </div>
                    ) : null}
                    {row(hasDiscount ? "الإجمالي الفرعي بعد الخصم" : "الإجمالي الفرعي", money(subtotal))}
                    {vatAmount > 0
                        ? row(`الضريبة${vatRate > 0 ? ` (${vatRate}%)` : ""}`, money(vatAmount))
                        : null}
                    {row("الإجمالي", money(total), true)}
                </div>

                <div
                    style={{
                        marginTop: "16px",
                        fontSize: "12px",
                        color: C.accent,
                        textAlign: "center",
                    }}
                >
                    شكراً لطلبكم
                </div>
            </div>
        );
    },
);

OrderReceipt.displayName = "OrderReceipt";

export default OrderReceipt;
