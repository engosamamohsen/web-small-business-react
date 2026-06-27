// ─── Element → PNG → WhatsApp (Web Share, no download) ───────────────────────
//
// Renders a DOM element to a PNG and pushes it straight into WhatsApp via the
// Web Share API (navigator.share with a file). Used for the WhatsApp order: the
// order detail (products, qty, prices, customer, totals) lives in the image, and
// the customer attaches it by picking WhatsApp in the native share sheet — they
// NEVER have to download anything. The capture target is the off-screen
// <OrderReceipt> element (a clean, image-only layout).
//
// A wa.me link can't carry a file and the share sheet can't be pre-pointed at the
// shop's number, so the caller falls back to a TEXT order (wa.me to the shop) when
// the device can't share a file — see "unsupported" below. Still never downloads.
//
// Uses html2canvas (dynamically imported, cart-island-only): unlike html-to-image
// it does NOT abort the capture when a resource is cross-origin or fails to load,
// and it doesn't read cross-origin stylesheet rules (which throws a SecurityError).

/**
 * Outcome of a share attempt:
 * - "shared"      → handed to the OS share sheet (the order image is on its way)
 * - "cancelled"   → user dismissed the share sheet (nothing sent; don't fall back)
 * - "unsupported" → this browser can't share a file (caller should use text order)
 * - "failed"      → capture/share errored (caller should use text order)
 */
export type ShareResult = "shared" | "cancelled" | "unsupported" | "failed";

/**
 * Render `node` to a PNG File. Returns `null` on any failure (lib load error, no
 * node, empty canvas) so the caller can fall back without throwing.
 */
export async function captureElementToFile(
    node: HTMLElement | null,
    filename = "order.png",
): Promise<File | null> {
    if (!node || typeof window === "undefined") return null;
    try {
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(node, {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true, // load cross-origin images when the host allows it
            imageTimeout: 4000, // don't hang on a slow/broken image — skip it
            logging: false,
        });

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), "image/png"),
        );
        if (!blob) return null;

        return new File([blob], filename, { type: "image/png" });
    } catch {
        return null;
    }
}

/** True when the browser can share THIS image file via the native share sheet. */
export function canShareImageFile(file: File): boolean {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
        return false;
    }
    // canShare({files}) is the only reliable file-share capability probe; a
    // missing canShare means file sharing isn't supported (treat as no).
    if (typeof navigator.canShare !== "function") return false;
    try {
        return navigator.canShare({ files: [file] });
    } catch {
        return false;
    }
}

/**
 * Push an already-captured image File into WhatsApp (and the rest of the share
 * sheet). `text` rides along as the message/caption (the greeting). Returns a
 * ShareResult; never throws.
 *
 * Call this as directly as possible after the user's click — navigator.share
 * needs transient user activation, which a long async chain before it can spend.
 */
export async function shareImageFile(file: File, text?: string): Promise<ShareResult> {
    if (!canShareImageFile(file)) return "unsupported";
    try {
        await navigator.share(text ? { files: [file], text } : { files: [file] });
        return "shared";
    } catch (err) {
        // The user dismissing the sheet rejects with AbortError — that's not a
        // failure to fall back from, the customer simply chose not to send.
        if (err && typeof err === "object" && (err as Error).name === "AbortError") {
            return "cancelled";
        }
        return "failed";
    }
}

/**
 * Capture `node` to a PNG and share it. Convenience wrapper around
 * captureElementToFile + shareImageFile. Returns "failed" if capture produced no
 * file so the caller can fall back to a text order.
 */
export async function captureAndShareElement(
    node: HTMLElement | null,
    filename: string,
    text?: string,
): Promise<ShareResult> {
    const file = await captureElementToFile(node, filename);
    if (!file) return "failed";
    return shareImageFile(file, text);
}
