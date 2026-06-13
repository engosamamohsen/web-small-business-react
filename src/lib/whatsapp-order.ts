// ─── WhatsApp ordering (BASIC plan checkout) ─────────────────────────────────
//
// Builds the order message + wa.me link per docs/subscription-modes-task.md.
// Number and shop name come from the setting-profile API (settings.whatsapp_phone
// / settings.name); storeConfig only provides fallbacks.

import { storeConfig } from "@/lib/store-config";
import type { CartItemType } from "@/types/types";

/**
 * "01093341796" → "201093341796" (wa.me needs international, digits only).
 * Already-international numbers pass through unchanged.
 */
export function normalizeWhatsappNumber(
    phone?: string | null,
    countryCode: string = storeConfig.whatsappCountryCode,
): string | null {
    if (!phone) return null;
    let digits = String(phone).replace(/[^\d]/g, "");
    if (!digits) return null;
    if (digits.startsWith("00")) digits = digits.slice(2);
    if (digits.startsWith("0")) digits = countryCode + digits.slice(1);
    return digits;
}

/** Greeting includes the shop name without doubling "مطعم مطعم …". */
function buildGreeting(shopName?: string | null): string {
    const name = shopName?.trim();
    if (!name) return "مرحبا بك";
    return name.startsWith("مطعم")
        ? `مرحبا بك فى ${name}`
        : `مرحبا بك فى مطعم ${name}`;
}

function formatPrice(value: number): string {
    return value % 1 === 0 ? String(value) : value.toFixed(2);
}

/**
 * Order message, e.g.:
 *
 *   مرحبا بك فى مطعم عيدو
 *
 *   السلام عليكم
 *
 *   أرغب في طلب المنتجات التالية:
 *
 *   1. فتة شاورما فراخ
 *      الكمية: 2
 *      السعر: 100
 *
 *   الإجمالي: 280 جنيه
 *
 *   شكراً
 */
export function buildWhatsAppOrderMessage(
    items: CartItemType[],
    totalPrice: number,
    shopName?: string | null,
): string {
    const lines: string[] = [
        buildGreeting(shopName),
        "",
        "السلام عليكم",
        "",
        "أرغب في طلب المنتجات التالية:",
        "",
    ];

    items.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.product_name}`);
        lines.push(`   الكمية: ${Number(item.qty) || 1}`);
        lines.push(`   السعر: ${formatPrice(Number(item.unit_price) || 0)}`);
        if (item.product_note) lines.push(`   ملاحظة: ${item.product_note}`);
        lines.push("");
    });

    lines.push(`الإجمالي: ${formatPrice(totalPrice)} جنيه`);
    lines.push("");
    lines.push("شكراً");

    return lines.join("\n");
}

/**
 * Full wa.me URL for the order, or null when no usable number exists.
 */
export function buildWhatsAppOrderUrl(
    items: CartItemType[],
    totalPrice: number,
    settings?: { name?: string | null; whatsapp_phone?: string | null } | null,
): string | null {
    const number =
        normalizeWhatsappNumber(settings?.whatsapp_phone) ??
        normalizeWhatsappNumber(storeConfig.fallbackWhatsappNumber);
    if (!number || !items.length) return null;

    const message = buildWhatsAppOrderMessage(items, totalPrice, settings?.name);
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
