// ─── Firebase Realtime Database — order tracking ─────────────────────────────
//
// Uses the REST API with a server-side increment sentinel so the write is
// atomic even under concurrent clicks. No Firebase SDK required.
//
// Path: web_order/{subdomain}/count
// DB:   https://cashier-thru-default-rtdb.firebaseio.com/

import { getShopName } from "@/lib/config";

const FIREBASE_DB =
    "https://cashier-thru-default-rtdb.firebaseio.com";

/**
 * Atomically increments the WhatsApp order counter for the current shop.
 * Returns a promise that resolves when the write completes; NEVER rejects —
 * callers should fire-and-forget so a Firebase outage never blocks the user.
 */
export async function trackWhatsAppOrder(): Promise<void> {
    const subdomain = getShopName();
    const url = `${FIREBASE_DB}/web_order/${subdomain}/count.json`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            // Server-side increment: atomic, initialises to 1 if the node is missing
            body: JSON.stringify({ ".sv": { increment: 1 } }),
        });
        if (!res.ok) {
            console.warn("[tracker] Firebase increment failed:", res.status);
        }
    } catch (err) {
        // Network error — swallow so the caller is never blocked
        console.warn("[tracker] Firebase unreachable:", err);
    }
}
