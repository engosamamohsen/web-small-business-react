// ─── Order totals, exactly as the server stores them ─────────────────────────
//
// Every payable total the customer sees before ordering (cart summary, mini
// cart, checkout, order image, WhatsApp text) comes from here, so it equals the
// order the server saves.
//
// The server's rule (Laravel, app/Http/Controllers/API/V1/BasketController.php):
//   • guest / WhatsApp orders, placeGuestOrder():
//       vat = settings.vat, service = 0 (never charged on website orders),
//       shipping = the city's fee (cities.shipping_fees) for "delivery" with a
//       city_id, else 0; a `shipping` number from the browser is ignored (the
//       storefront sends no city, and the WhatsApp endpoint forces 0),
//       OrderCalculationService::calculateOrderTotals():
//         vat   = vat% > 0 ? vat% × sub_total / 100 : 0      ← every plan, every order type
//         total = sub_total + vat + service + shipping
//   • logged-in checkout, buy():
//       vat = settings.vat × subtotal / 100, total = subtotal + city shipping + vat
// sub_total is Σ (price − price × discount% + extras) × qty — the product discount
// applies to the base price only, extras at full price (getLinePrices). It is
// the cart's total_price.

const round2 = (n: number) => Math.round(n * 100) / 100;

export interface OrderTotalsInput {
    /** Products sub-total after the product discounts (the cart's total_price). */
    subtotal: number;
    /** settings.vat — a percentage (string or number); missing / 0 → no VAT. */
    vatRate?: number | string | null;
    /** Delivery fee added by the server (0 when the order has none). */
    shipping?: number | string | null;
}

export interface OrderTotals {
    subtotal: number;
    /** The VAT percentage applied (0 when the store has none). */
    vatRate: number;
    /** VAT amount, rounded to 2 decimals for display. */
    vat: number;
    shipping: number;
    /** sub_total + vat + shipping, rounded to 2 decimals. */
    total: number;
}

/** Parse settings.vat ("14", "14.00", 14, null…) into a non-negative percentage. */
export function parseVatRate(value: unknown): number {
    const rate = parseFloat(String(value ?? 0));
    return Number.isFinite(rate) && rate > 0 ? rate : 0;
}

/** The totals the server will store for this order (see the rule above). */
export function computeOrderTotals({ subtotal, vatRate, shipping }: OrderTotalsInput): OrderTotals {
    const sub = Number(subtotal) || 0;
    const rate = parseVatRate(vatRate);
    const ship = Math.max(0, Number(shipping) || 0);
    const vatRaw = rate > 0 ? (rate * sub) / 100 : 0;

    return {
        subtotal: round2(sub),
        vatRate: rate,
        vat: round2(vatRaw),
        shipping: round2(ship),
        total: round2(sub + vatRaw + ship),
    };
}

/**
 * The totals of an order the server saved (the `order` of the guest-buy / buy
 * response: OrdersCustomerResource {sub_total, vat, shipping, total}), or null
 * when the response carries no usable total. Used to word the confirmation
 * from what was actually stored.
 */
export function totalsFromServerOrder(order: unknown): OrderTotals | null {
    const o = order as Record<string, unknown> | null | undefined;
    if (!o || o.total === undefined || o.total === null || o.total === "") return null;
    const total = Number(o.total);
    if (!Number.isFinite(total)) return null;
    const subtotal = Number(o.sub_total) || 0;
    const vat = Number(o.vat) || 0;
    return {
        subtotal: round2(subtotal),
        vatRate: subtotal > 0 && vat > 0 ? round2((vat * 100) / subtotal) : 0,
        vat: round2(vat),
        shipping: round2(Number(o.shipping) || 0),
        total: round2(total),
    };
}
