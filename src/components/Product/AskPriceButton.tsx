"use client";

import { MessageCircle } from "lucide-react";
import { buildProductPath } from "@/lib/product-url";
import { ASK_PRICE, askPriceHref, storeContact, type StoreContact } from "@/lib/price-request";

/**
 * "اسأل عن السعر" for a price-on-request product (src/lib/price-request.ts), in place of the cart
 * buttons. The link is worked out on click (the store's contact is only known in the browser), so the
 * server HTML and the hydrated button are the same.
 *
 * variant "card": same pill as "اختر الخيارات" (themes restyle `.ct-choose`); "page": the product
 * page's full-width button.
 */
export function AskPriceButton({
    product,
    variant = "card",
    contact,
}: {
    product: { id: number | string; name?: string | null };
    variant?: "card" | "page";
    /** The product page passes the store settings; cards read window.__CT_STORE__. */
    contact?: StoreContact | null;
}) {
    const onClick = () => {
        const path = buildProductPath(product);
        const url = typeof window !== "undefined" ? `${window.location.origin}${encodeURI(path)}` : path;
        const href = askPriceHref(contact ?? storeContact(), product.name, url);
        if (!href) {
            window.location.assign(path); // no WhatsApp or phone: the product page says "اطلب السعر"
        } else if (href.startsWith("tel:")) {
            window.location.href = href;
        } else {
            window.open(href, "_blank", "noopener");
        }
    };

    if (variant === "page") {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
                <MessageCircle size={16} aria-hidden="true" />
                <span>{ASK_PRICE}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            // ct-choose / ct-choose__icon: the same pill the themes give "اختر الخيارات" (themed.css)
            className="ct-choose items-center gap-1.5 rounded-full bg-[var(--main-color)] px-3 py-1.5 text-xs font-semibold text-white shadow transition-opacity hover:opacity-90"
            aria-label={`${ASK_PRICE}: ${product.name ?? "المنتج"}`}
        >
            <MessageCircle className="ct-choose__icon hidden h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="ct-choose__label">{ASK_PRICE}</span>
        </button>
    );
}
