// The home page's reviews strip (StoreReviews.astro): which cards to draw and whether they scroll.
import type { PublicReview } from "./api";

/** Fewer reviews than this: a still, centred row (a 1–2 card loop looks broken). */
export const MIN_TO_SCROLL = 3;
/** Each half of the loop holds at least this many cards, so it is wider than any screen. */
export const MIN_CARDS_PER_HALF = 8;
/** Seconds each card takes to pass: the speed stays the same whatever the count. */
export const SECONDS_PER_CARD = 6;

export interface ReviewsStrip {
    /** Draw nothing at all (owner: an empty store shows no section). */
    show: boolean;
    scrolls: boolean;
    /** One loop's cards; the page draws it twice (the copy is aria-hidden) when `scrolls`. */
    half: PublicReview[];
    durationSeconds: number;
    /** Real reviews in `half`; the rest are repeats (hidden from screen readers). */
    uniqueCount: number;
}

export function reviewsStrip(reviews: PublicReview[]): ReviewsStrip {
    const usable = reviews.filter((r) => r.message.trim() !== "" && r.name.trim() !== "");
    if (usable.length === 0) return { show: false, scrolls: false, half: [], durationSeconds: 0, uniqueCount: 0 };
    if (usable.length < MIN_TO_SCROLL) return { show: true, scrolls: false, half: usable, durationSeconds: 0, uniqueCount: usable.length };

    const half: PublicReview[] = [];
    while (half.length < MIN_CARDS_PER_HALF) half.push(...usable);
    return { show: true, scrolls: true, half, durationSeconds: half.length * SECONDS_PER_CARD, uniqueCount: usable.length };
}

/** The first letter for the round avatar. */
export function initialOf(name: string): string {
    const first = Array.from(name.trim())[0];
    return first ? first.toUpperCase() : "?";
}
