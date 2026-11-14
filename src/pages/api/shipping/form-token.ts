// POST /api/shipping/form-token: a new time-trap token for the /ship form, when the first one was refused
// (the form was open for hours, or sent too fast). The form keeps what the visitor typed and sends again
// a few seconds later, instead of asking for a reload. The Laravel rules (min and max age) still apply.
import type { APIRoute } from "astro";
import { freshProfile } from "@/lib/shipping/server";
import { json, routeContext } from "@/lib/shipping/proxy-route";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const { ip, lang, apiBase } = routeContext(context);
    const profile = await freshProfile(apiBase, ip, lang);
    if (!profile?.form_token) return json({ status: false, error_code: "server" }, 502);
    return json({ status: true, data: { form_token: profile.form_token, booking_open: profile.booking_open } });
};
