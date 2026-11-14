// POST /api/shipping/altcha: a fresh ALTCHA challenge for the /ship form, from the company's API.
// POST (not GET) so the page middleware's settings lookup doesn't run for it.
import type { APIRoute } from "astro";
import { errorBody, shippingApi } from "@/lib/shipping/server";
import { isAltchaChallenge, type AltchaChallenge } from "@/lib/shipping/altcha";
import { json, routeContext } from "@/lib/shipping/proxy-route";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const { ip, lang, apiBase } = routeContext(context);
    const result = await shippingApi<AltchaChallenge>(apiBase, "altcha", { ip, lang });
    // This endpoint answers with the bare challenge, not {status, data}
    if (result.ok && isAltchaChallenge(result.body)) return json(result.body);
    return json(errorBody(result), result.status || 502);
};
