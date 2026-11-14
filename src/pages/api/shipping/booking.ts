// POST /api/shipping/booking: the /ship form's request, passed to the company's API
// (api/shipping/public/bookings) with the visitor's signed address. Only the form's own fields go through.
import type { APIRoute } from "astro";
import { errorBody, shippingApi } from "@/lib/shipping/server";
import { json, readJsonObject, routeContext } from "@/lib/shipping/proxy-route";
import { PARCEL_FIELDS, RECIPIENT_FIELDS, SENDER_FIELDS } from "@/lib/shipping/booking";
import type { CarrierBooked } from "@/lib/shipping/types";

export const prerender = false;

const ALLOWED = new Set<string>([
    ...SENDER_FIELDS, ...RECIPIENT_FIELDS, ...PARCEL_FIELDS,
    "idempotency_key", "form_token", "website", "altcha",
]);

export const POST: APIRoute = async (context) => {
    const input = await readJsonObject(context.request);
    if (!input) return json({ status: false, error_code: "validation", message: "Bad request." }, 400);

    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(input)) {
        if (ALLOWED.has(key) && (typeof value === "string" || typeof value === "number")) body[key] = String(value);
    }

    const { ip, lang, apiBase } = routeContext(context);
    const result = await shippingApi<CarrierBooked>(apiBase, "bookings", { ip, lang, method: "POST", body });
    if (result.ok && result.body && result.body.status === true) return json(result.body, result.status);
    return json(errorBody(result), result.status || 502);
};
