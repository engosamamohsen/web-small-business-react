// ─── WhatsApp ordering (BASIC plan checkout) ─────────────────────────────────
//
// Builds the order message + wa.me link per docs/subscription-modes-task.md.
// Number and shop name come from the setting-profile API (settings.whatsapp_phone
// / settings.name / settings.shop_type); storeConfig only provides fallbacks.

import { storeConfig } from "@/lib/store-config";
import type { CartItemType } from "@/types/types";
import { getCartDiscountSummary, originalUnitPrice } from "@/lib/cart/cart-totals";

/**
 * Customer details collected on the cart for **Plus**-plan stores and appended
 * to the order message. Basic-plan stores pass nothing → the block is omitted.
 */
export interface WhatsAppCustomerInfo {
    name?: string | null;
    address?: string | null;
}

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

// Known placeholder / default numbers that must NEVER receive a real order.
// Covers the frontend fallback constant AND common backend defaults (e.g. an
// unconfigured shop returning "0123456789"), so a misconfigured store shows
// "number unavailable" instead of silently messaging a fake line.
const PLACEHOLDER_WHATSAPP_NUMBERS: ReadonlySet<string> = new Set(
    [
        storeConfig.fallbackWhatsappNumber, // "201234567890"
        "0123456789",
        "01234567890",
        "1234567890",
        "00000000000",
    ]
        .map((n) => normalizeWhatsappNumber(n))
        .filter((n): n is string => Boolean(n)),
);

/**
 * True only for a real, sendable WhatsApp number — rejects empty values and the
 * known placeholder / default numbers (see PLACEHOLDER_WHATSAPP_NUMBERS).
 */
export function isUsableWhatsappNumber(phone?: string | null): boolean {
    const normalized = normalizeWhatsappNumber(phone);
    if (normalized === null) return false;
    // Reject known placeholder / default numbers outright.
    if (PLACEHOLDER_WHATSAPP_NUMBERS.has(normalized)) return false;
    // Sanity bounds: a real international number is ~10–15 digits (E.164).
    // Blocks malformed values that could otherwise resolve to a stranger's chat.
    return normalized.length >= 10 && normalized.length <= 15;
}

/**
 * Plain wa.me contact link (no prefilled message) for the floating "contact us"
 * button. Returns null for missing OR placeholder/default numbers so the button
 * hides instead of linking to a fake line. Uses the same normalization as orders
 * (adds the country code), so "01093341796" → "https://wa.me/201093341796".
 */
export function buildWhatsAppLink(phone?: string | null): string | null {
    if (!isUsableWhatsappNumber(phone)) return null;
    const number = normalizeWhatsappNumber(phone);
    return number ? `https://wa.me/${number}` : null;
}

/**
 * Greeting includes the shop name and adapts to shop_type.
 * - restaurant + name without "مطعم" → "مرحبا بك فى مطعم {name}"
 * - restaurant + name already starts with "مطعم" → "مرحبا بك فى {name}"
 * - any other shop_type → "مرحبا بك فى {name}" (no category prefix)
 */
function buildGreeting(shopName?: string | null, shopType?: string | null): string {
    const name = shopName?.trim();
    if (!name) return "مرحبا بك";
    // Non-restaurant shops: skip the "مطعم" prefix entirely
    if (shopType && shopType !== "restaurant") {
        return `مرحبا بك فى ${name}`;
    }
    // Restaurant (or type unknown): prefix only when the name doesn't already include it
    return name.startsWith("مطعم")
        ? `مرحبا بك فى ${name}`
        : `مرحبا بك فى مطعم ${name}`;
}

function formatPrice(value: number): string {
    return value % 1 === 0 ? String(value) : value.toFixed(2);
}

/**
 * Order message sent via WhatsApp. All values come from the settings-profile API:
 * - shop name  → settings.name
 * - shop type  → settings.shop_type  (drives greeting prefix)
 *
 * Friendly, sectioned layout (WhatsApp *bold* + light emoji cues). Example for a
 * restaurant named "ROKA'S KITCHEN" with a Plus-plan customer:
 *
 *   مرحبا بك فى مطعم ROKA'S KITCHEN 👋
 *
 *   👤 *بيانات العميل*
 *   الاسم: اسامة محسن
 *   📍 العنوان: 8 على الليثى
 *
 *   🧾 *تفاصيل الطلب*
 *
 *   1. *فتة شاورما فراخ*
 *      ◾ الصوص: ثومية (+10)
 *      🔢 الكمية: 2 × 100 = 200 ج.م
 *
 *   💰 *الإجمالي: 200 ج.م*
 *
 *   شكراً لطلبكم 🙏
 */
export function buildWhatsAppOrderMessage(
    items: CartItemType[],
    totalPrice: number,
    shopName?: string | null,
    shopType?: string | null,
    customer?: WhatsAppCustomerInfo | null,
): string {
    const currency = "ج.م";
    const lines: string[] = [];

    // Friendly header — greeting adapts to the shop name / type.
    lines.push(`${buildGreeting(shopName, shopType)} 👋`);
    lines.push("");

    // Plus-plan stores collect the customer name + full address on the cart and
    // include them here. Basic-plan stores pass no customer → block is skipped.
    const customerName = customer?.name?.trim();
    const customerAddress = customer?.address?.trim();
    if (customerName || customerAddress) {
        lines.push("👤 *بيانات العميل*");
        if (customerName) lines.push(`الاسم: ${customerName}`);
        if (customerAddress) lines.push(`📍 العنوان: ${customerAddress}`);
        lines.push("");
    }

    lines.push("🧾 *تفاصيل الطلب*");
    lines.push("");

    items.forEach((item, index) => {
        const qty = Number(item.qty) || 1;
        const unitPrice = Number(item.unit_price) || 0;
        const lineTotal = Math.round(unitPrice * qty * 100) / 100;

        // Product name in bold (WhatsApp renders *text* as bold).
        lines.push(`${index + 1}. *${item.product_name}*`);

        // Selected variations (size / color / extras / toppings …) as bullets —
        // prefix with the variation name only when the API actually provides one.
        if (Array.isArray(item.variations)) {
            item.variations.forEach((variation) => {
                if (!variation?.choices?.length) return;
                const label = variation.main_variation_name?.trim();
                const choiceText = variation.choices
                    .map((choice) =>
                        Number(choice.price) > 0
                            ? `${choice.name} (+${formatPrice(Number(choice.price))})`
                            : choice.name,
                    )
                    .join("، ");
                lines.push(`   ◾ ${label ? `${label}: ` : ""}${choiceText}`);
            });
        }

        // Quantity × unit price = line total, on one readable line. When the
        // item is discounted, show the pre-discount unit price struck (~..~ is
        // WhatsApp strikethrough) before the final one.
        const origUnit = originalUnitPrice(item);
        const unitText =
            origUnit > unitPrice
                ? `~${formatPrice(origUnit)}~ ${formatPrice(unitPrice)}`
                : formatPrice(unitPrice);
        lines.push(
            `   🔢 الكمية: ${qty} × ${unitText} = ${formatPrice(lineTotal)} ${currency}`,
        );
        if (item.product_note) lines.push(`   📝 ملاحظة: ${item.product_note}`);
        lines.push("");
    });

    // Before/after-discount summary — only when the order actually has savings.
    const { originalSubtotal, discountAmount, hasDiscount } =
        getCartDiscountSummary(items);
    if (hasDiscount) {
        lines.push(
            `🏷️ الإجمالي قبل الخصم: ${formatPrice(originalSubtotal)} ${currency}`,
        );
        lines.push(`🎁 الخصم: -${formatPrice(discountAmount)} ${currency}`);
    }

    lines.push(`💰 *الإجمالي: ${formatPrice(totalPrice)} ${currency}*`);
    lines.push("");
    lines.push("شكراً لطلبكم 🙏");

    return lines.join("\n");
}

/**
 * Full wa.me URL for the order, or null when no usable number exists.
 * All values are resolved dynamically from the setting-profile API at runtime.
 */
export function buildWhatsAppOrderUrl(
    items: CartItemType[],
    totalPrice: number,
    settings?: {
        name?: string | null;
        whatsapp_phone?: string | null;
        shop_type?: string | null;
    } | null,
    customer?: WhatsAppCustomerInfo | null,
): string | null {
    // Only ever use the shop's REAL number from the settings API. Never fall
    // back to the placeholder/default — orders must not go to a fake line.
    if (!isUsableWhatsappNumber(settings?.whatsapp_phone)) return null;
    const number = normalizeWhatsappNumber(settings?.whatsapp_phone);
    if (!number || !items.length) return null;

    const message = buildWhatsAppOrderMessage(
        items,
        totalPrice,
        settings?.name,
        settings?.shop_type,
        customer,
    );
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Public greeting ("مرحبا بك فى مطعم {name}") used as the caption that rides along
 * with the order-receipt image shared into WhatsApp.
 */
export function buildWhatsAppGreeting(
    shopName?: string | null,
    shopType?: string | null,
): string {
    return buildGreeting(shopName, shopType);
}
