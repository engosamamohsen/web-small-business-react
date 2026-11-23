import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanPhone, cleanSource, getReviews, HOME_TIMEOUT_MS, parseReviewError, parseReviewsPage, sendReview, validateReview } from "./api";
import { __STRING_SETS, homeHref, pickReviewsLang, reviewsHref, reviewsStrings } from "./strings";
import { initialOf, MIN_CARDS_PER_HALF, reviewsStrip, SECONDS_PER_CARD } from "./home";

const fallback = { network: "net", unknown: "unk", tooMany: "many", closed: "closed" };

describe("reviews words", () => {
    it("has every key in Arabic and English, none empty", () => {
        const ar = __STRING_SETS.ar as Record<string, unknown>;
        const en = __STRING_SETS.en as Record<string, unknown>;
        expect(Object.keys(en).sort()).toEqual(Object.keys(ar).sort());
        for (const [key, value] of Object.entries({ ...ar, ...en })) {
            if (typeof value === "string") expect(value.trim(), key).not.toBe("");
            if (typeof value === "function") expect(String(value(3)).trim(), key).not.toBe("");
        }
        expect(ar.dir).toBe("rtl");
        expect(en.dir).toBe("ltr");
    });

    it("picks English only for ?lang=en", () => {
        expect(pickReviewsLang("en")).toBe("en");
        expect(pickReviewsLang("ar")).toBe("ar");
        expect(pickReviewsLang(null)).toBe("ar");
        expect(pickReviewsLang("fr")).toBe("ar");
        expect(reviewsStrings("en").reviewsCount(1)).toBe("1 review");
        expect(reviewsStrings("ar").reviewsCount(2)).toBe("رأيين");
    });
});

describe("reading the public list", () => {
    it("keeps valid reviews and never a phone", () => {
        const page = parseReviewsPage({
            data: [
                { id: 3, name: "Mohamed", rating: 5, message: "Great", created_at: "2026-11-22T10:00:00+02:00", phone: "0100" },
                { id: 0, name: "bad id", rating: 5 },
                { id: 4, name: "bad stars", rating: 9 },
            ],
            summary: { count: 7, average: 4.3 },
            pagination: { current_page: 1, last_page: 2 },
        });
        expect(page.reviews).toEqual([{ id: 3, name: "Mohamed", rating: 5, message: "Great", created_at: "2026-11-22T10:00:00+02:00" }]);
        expect(JSON.stringify(page)).not.toContain("phone");
        expect(page).toMatchObject({ count: 7, average: 4.3, page: 1, lastPage: 2 });
    });

    it("turns junk into an empty page", () => {
        expect(parseReviewsPage(null)).toEqual({ reviews: [], count: 0, average: 0, page: 1, lastPage: 1 });
        expect(parseReviewsPage({ summary: { average: 99 } }).average).toBe(5);
    });
});

describe("checking a review before sending", () => {
    const ok = { name: "Mohamed", phone: "0100 123 4567", rating: 5, message: "Great place" };

    it("accepts a good review", () => {
        expect(validateReview(ok)).toEqual({});
    });

    it("flags each bad field", () => {
        expect(validateReview({ ...ok, rating: 0 })).toEqual({ rating: true });
        expect(validateReview({ ...ok, rating: 6 })).toEqual({ rating: true });
        expect(validateReview({ ...ok, name: " M " })).toEqual({ name: true });
        expect(validateReview({ ...ok, phone: "0100" })).toEqual({ phone: true });
        expect(validateReview({ ...ok, message: "  hi " })).toEqual({ message: true });
        expect(validateReview({ ...ok, message: "a".repeat(1001) })).toEqual({ message: true });
    });

    it("reads Arabic digits in the phone", () => {
        expect(cleanPhone("٠١٠٠ ١٢٣ ٤٥٦٧")).toBe("01001234567");
        expect(cleanPhone("+20 (100) 123-4567")).toBe("201001234567");
    });
});

describe("server answers", () => {
    it("maps errors", () => {
        expect(parseReviewError(0, null, fallback).kind).toBe("network");
        expect(parseReviewError(429, { message: "Too many" }, fallback)).toMatchObject({ kind: "too_many", message: "Too many" });
        const invalid = parseReviewError(422, { message: "Pick stars", errors: { rating: ["Pick stars"] } }, fallback);
        expect(invalid.kind).toBe("invalid");
        expect(invalid.fields.rating).toBe("Pick stars");
        expect(parseReviewError(420, {}, fallback).kind).toBe("closed");
        expect(parseReviewError(500, { message: "SQL error" }, fallback)).toMatchObject({ kind: "unknown", message: "unk" });
    });
});

describe("talking to the API", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("sends a clean payload with the language and returns the thank-you text", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, message: "Thanks" }), { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);

        const message = await sendReview("http://admin-x.localhost:8001/api/", { name: " Mohamed ", phone: "0100 123 4567", rating: 4, message: " Good " }, "en", fallback);
        expect(message).toBe("Thanks");
        const [target, init] = fetchMock.mock.calls[0];
        expect(target).toBe("http://admin-x.localhost:8001/api/v1/store-reviews?lang=en");
        expect(JSON.parse(init.body)).toEqual({ name: "Mohamed", phone: "01001234567", rating: 4, message: "Good", website: "", lang: "en" });
    });

    it("throws the server's field errors", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: false, message: "Bad", errors: { phone: ["Bad phone"] } }), { status: 422 })));
        await expect(sendReview("http://x/api/", { name: "Mohamed", phone: "1", rating: 4, message: "Good" }, "ar", fallback)).rejects.toMatchObject({ kind: "invalid", fields: { phone: "Bad phone" } });
    });

    it("reports no connection as network", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
        await expect(sendReview("http://x/api/", { name: "Mohamed", phone: "01001234567", rating: 4, message: "Good" }, "ar", fallback)).rejects.toMatchObject({ kind: "network" });
    });

    it("reads a page of reviews", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [], summary: { count: 0, average: 0 } }), { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);
        await getReviews("http://x/api/", 2);
        expect(fetchMock.mock.calls[0][0]).toBe("http://x/api/v1/store-reviews?page=2");
        await getReviews("http://x/api/", 1, 12);
        expect(fetchMock.mock.calls[1][0]).toBe("http://x/api/v1/store-reviews?page=1&limit=12");
        await getReviews("http://x/api/", 1, 99);
        expect(fetchMock.mock.calls[2][0]).toBe("http://x/api/v1/store-reviews?page=1&limit=20");
    });

    it("sends the receipt source, and only a clean one", async () => {
        const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ status: true, message: "Thanks" }), { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);
        const input = { name: "Mohamed", phone: "01001234567", rating: 5, message: "Good" };
        await sendReview("http://x/api/", input, "ar", fallback, "receipt");
        expect(JSON.parse(fetchMock.mock.calls[0][1].body).utm_source).toBe("receipt");
        await sendReview("http://x/api/", input, "ar", fallback, "<script>");
        expect(JSON.parse(fetchMock.mock.calls[1][1].body)).not.toHaveProperty("utm_source");
        await sendReview("http://x/api/", input, "ar", fallback);
        expect(JSON.parse(fetchMock.mock.calls[2][1].body)).not.toHaveProperty("utm_source");
    });

    it("cleans a utm_source like the server", () => {
        expect(cleanSource("receipt")).toBe("receipt");
        expect(cleanSource(" Receipt ")).toBe("receipt");
        expect(cleanSource("qr_menu-2")).toBe("qr_menu-2");
        expect(cleanSource("a".repeat(31))).toBeNull();
        expect(cleanSource("re ceipt")).toBeNull();
        expect(cleanSource("")).toBeNull();
        expect(cleanSource(null)).toBeNull();
    });

    it("gives up on a slow home page request after its own timeout", async () => {
        vi.useFakeTimers();
        try {
            // A server that never answers until the request is aborted
            vi.stubGlobal("fetch", vi.fn().mockImplementation((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
                init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
            })));
            const pending = getReviews("http://x/api/", 1, 12, HOME_TIMEOUT_MS);
            const settled = expect(pending).rejects.toThrow("reviews 0");
            await vi.advanceTimersByTimeAsync(HOME_TIMEOUT_MS - 1);
            await vi.advanceTimersByTimeAsync(1);
            await settled;
            expect(HOME_TIMEOUT_MS).toBeLessThanOrEqual(3_000);
        } finally {
            vi.useRealTimers();
        }
    });
});

describe("links keep the language and the source", () => {
    it("builds the reviews and home links", () => {
        expect(reviewsHref("ar")).toBe("/reviews");
        expect(reviewsHref("en")).toBe("/reviews?lang=en");
        expect(reviewsHref("ar", "receipt")).toBe("/reviews?utm_source=receipt");
        expect(reviewsHref("en", "receipt")).toBe("/reviews?lang=en&utm_source=receipt");
        expect(homeHref("ar")).toBe("/");
        expect(homeHref("en")).toBe("/?lang=en");
    });

    it("has the footer link and the home strip words in both languages", () => {
        expect(reviewsStrings("ar").footerLink).toBe("شاركنا رأيك");
        expect(reviewsStrings("en").footerLink).toBe("Share your feedback");
        expect(reviewsStrings("en").homeTitle).not.toBe(reviewsStrings("ar").homeTitle);
        expect(reviewsStrings("en").dir).toBe("ltr");
    });
});

describe("the home page strip", () => {
    const r = (id: number, extra: Partial<{ name: string; message: string }> = {}) => ({ id, name: "Mohamed", rating: 5, message: "Great", created_at: null, ...extra });

    it("shows nothing without reviews", () => {
        expect(reviewsStrip([])).toMatchObject({ show: false, scrolls: false, half: [] });
        expect(reviewsStrip([r(1, { message: "  " })]).show).toBe(false);
    });

    it("keeps 1-2 reviews still", () => {
        const strip = reviewsStrip([r(1), r(2)]);
        expect(strip).toMatchObject({ show: true, scrolls: false, uniqueCount: 2 });
        expect(strip.half.map((x) => x.id)).toEqual([1, 2]);
    });

    it("scrolls 3 or more, each half wider than the screen, same speed per card", () => {
        const strip = reviewsStrip([r(1), r(2), r(3)]);
        expect(strip.scrolls).toBe(true);
        expect(strip.half.length).toBeGreaterThanOrEqual(MIN_CARDS_PER_HALF);
        expect(strip.half.slice(0, 3).map((x) => x.id)).toEqual([1, 2, 3]);
        expect(strip.uniqueCount).toBe(3);
        expect(strip.durationSeconds).toBe(strip.half.length * SECONDS_PER_CARD);
        const twelve = reviewsStrip(Array.from({ length: 12 }, (_, i) => r(i + 1)));
        expect(twelve.half.length).toBe(12);
    });

    it("picks the avatar letter", () => {
        expect(initialOf(" mohamed")).toBe("M");
        expect(initialOf("محمد")).toBe("م");
        expect(initialOf("")).toBe("?");
    });
});
