// Shared bits of the /api/shipping/* routes (server only): the browser talks to this server, which
// calls the company's API with the visitor's signed address (src/lib/shipping/server.ts).

import type { APIContext } from "astro";
import { visitorIp } from "./server";
import { CARRIER_LANG_COOKIE, pickCarrierLang } from "./strings";
import type { CarrierLang } from "./types";

export const MAX_BODY_BYTES = 32 * 1024;

export function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
}

export function routeContext(context: APIContext): { ip: string; lang: CarrierLang; apiBase: string } {
    let address: string | undefined;
    try {
        address = context.clientAddress;
    } catch {
        address = undefined;
    }
    return {
        ip: visitorIp(context.request, address),
        lang: pickCarrierLang(null, context.cookies.get(CARRIER_LANG_COOKIE)?.value),
        apiBase: context.locals.apiBase,
    };
}

/** The JSON object the browser sent, or null (wrong type, too big, not an object). */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
    if (!/\bapplication\/json\b/i.test(request.headers.get("content-type") ?? "")) return null;
    const text = await request.text().catch(() => "");
    if (!text || text.length > MAX_BODY_BYTES) return null;
    try {
        const value = JSON.parse(text);
        return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
    } catch {
        return null;
    }
}
