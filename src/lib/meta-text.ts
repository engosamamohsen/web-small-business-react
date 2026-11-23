// ─── Page descriptions for search results and link previews (owner decision 2026-11-23) ───────────
//
// Google shows about 155 characters of a page's description. The home page used the store's whole
// "about us" (510 characters on emandbuild.com) and product pages cut theirs mid-word at 160. Every
// page (src/components/SEO.astro, all themes) now passes through clampDescription(): one line, at
// most 155 characters, cut after a whole word, with "…" when something was cut.

export const DESCRIPTION_MAX = 155;

export function clampDescription(text: string | null | undefined, max = DESCRIPTION_MAX): string {
    const clean = (text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const room = clean.slice(0, max - 1); // leave room for "…"
    const lastSpace = room.lastIndexOf(" ");
    // Cut at the last whole word, unless that loses most of the text (one very long word)
    const cut = lastSpace > max * 0.6 ? room.slice(0, lastSpace) : room;
    return `${cut.replace(/[\s،,.;:\-–—]+$/u, "")}…`;
}
