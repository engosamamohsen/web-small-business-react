// POST /api/shipping/track {number, phone_last4, altcha?}: the tracking page's "more details" box. POST keeps the
// digits out of URLs and logs. The company's API limits wrong tries per visitor and per shipment, and after a few
// wrong tries on a shipment asks for an ALTCHA proof of work with each try (details_captcha).
import type { APIRoute } from "astro";
import { errorBody, shippingApi } from "@/lib/shipping/server";
import { normalizeTrackingNo, westernDigits } from "@/lib/shipping/booking";
import { json, readJsonObject, routeContext } from "@/lib/shipping/proxy-route";
import type { CarrierTracking } from "@/lib/shipping/types";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const input = await readJsonObject(context.request);
    const number = normalizeTrackingNo(typeof input?.number === "string" ? input.number : "");
    const digits = westernDigits(typeof input?.phone_last4 === "string" ? input.phone_last4 : "").trim();
    const altcha = typeof input?.altcha === "string" && input.altcha.length <= 5000 ? input.altcha : "";
    if (!number || !/^[0-9]{4}$/.test(digits)) return json({ status: false, error_code: "validation" }, 422);

    const { ip, lang, apiBase } = routeContext(context);
    const result = await shippingApi<CarrierTracking>(apiBase, `track/${encodeURIComponent(number)}`, {
        ip, lang, query: altcha ? { phone_last4: digits, altcha } : { phone_last4: digits },
    });
    if (result.ok && result.body && result.body.status === true) {
        const { details, details_locked, details_captcha = false, digits_checked = true, lock_scope = null } = result.body.data;
        return json({ status: true, data: { details, details_locked, details_captcha, digits_checked, lock_scope } });
    }
    return json(errorBody(result), result.status || 502);
};
