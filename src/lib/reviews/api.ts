// Store reviews API client (Laravel routes/tenant-api.php → v1/store-reviews, openspec/changes/store-reviews).
// Works on the server (pass Astro.locals.apiBase) and in the browser (pass getApiUrl()).
// GET lists only the reviews the owner chose for the home page (never the phone); POST sends a guest review.

import type { ReviewsLang } from "./strings";

export interface PublicReview {
    id: number;
    name: string;
    rating: number;
    message: string;
    created_at: string | null;
}

export interface ReviewsPage {
    reviews: PublicReview[];
    count: number;
    average: number;
    page: number;
    lastPage: number;
}

export interface ReviewInput {
    name: string;
    phone: string;
    rating: number;
    message: string;
    /** Honeypot: people never see it; bots fill it. */
    website?: string;
    /** The branch the customer visited (stores with 2+ active branches only); the server checks it again. */
    branch_id?: number | null;
}

/** One active branch of the store; `name` is its address (owner D3). */
export interface ReviewBranch {
    id: number;
    name: string;
}

/** GET v1/store-reviews/form: whether the customer picks a branch (2+ active branches) and the choices. */
export interface ReviewForm {
    branchRequired: boolean;
    branches: ReviewBranch[];
    /** One active branch: the server assigns it, the form shows no dropdown. */
    defaultBranchId: number | null;
}

/** No branch dropdown: stores with 0 or 1 active branch, older servers, or a failed / slow form request. */
export const NO_BRANCH_FORM: ReviewForm = { branchRequired: false, branches: [], defaultBranchId: null };

export type ReviewErrorKind = "invalid" | "too_many" | "closed" | "network" | "unknown";

export class ReviewApiError extends Error {
    constructor(
        public kind: ReviewErrorKind,
        message: string,
        public status: number,
        public fields: Partial<Record<keyof ReviewInput, string>> = {},
    ) {
        super(message);
        this.name = "ReviewApiError";
    }
}

const TIMEOUT_MS = 15_000;
/** The home page waits at most this long for its reviews strip; slower = no strip, the page is not held up. */
export const HOME_TIMEOUT_MS = 3_000;

/**
 * A utm_source as the server keeps it (lower case a-z, 0-9, _ and -, 1-30 characters), or null.
 * `receipt` = the "Share your feedback" QR on receipts (Laravel ReviewQr).
 */
export function cleanSource(value: string | null | undefined): string | null {
    if (typeof value !== "string") return null;
    const v = value.trim().toLowerCase();
    return /^[a-z0-9_-]{1,30}$/.test(v) ? v : null;
}

/** A positive whole branch id (number or digits), or null. Never trusted: the server validates it again. */
export function cleanBranchId(value: unknown): number | null {
    if (typeof value === "number") return Number.isSafeInteger(value) && value > 0 ? value : null;
    if (typeof value !== "string") return null;
    const v = value.trim();
    return /^[1-9][0-9]{0,15}$/.test(v) ? Number(v) : null;
}

/** Reads the form body; anything malformed means no dropdown. A dropdown needs 2+ valid branches. */
export function parseReviewForm(body: unknown): ReviewForm {
    const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const d = (b.data && typeof b.data === "object" ? b.data : {}) as Record<string, unknown>;
    const seen = new Set<number>();
    const branches: ReviewBranch[] = [];
    for (const item of Array.isArray(d.branches) ? d.branches : []) {
        if (!item || typeof item !== "object") continue;
        const v = item as Record<string, unknown>;
        const id = cleanBranchId(v.id);
        if (id === null || seen.has(id)) continue;
        seen.add(id);
        const name = typeof v.name === "string" && v.name.trim() ? v.name.trim() : `#${id}`;
        branches.push({ id, name });
    }
    const branchRequired = d.branch_required === true && branches.length >= 2;
    return {
        branchRequired,
        branches: branchRequired ? branches : [],
        defaultBranchId: branchRequired ? null : cleanBranchId(d.default_branch_id),
    };
}

/**
 * The branch to preselect from the receipt QR's ?branch=<id>: only when the store shows the dropdown and the id
 * is one of its active branches. Only a starting value: the customer may change it (owner 2026-11-23).
 */
export function preselectBranch(form: ReviewForm, requested: unknown): number | null {
    const id = cleanBranchId(requested);
    return form.branchRequired && id !== null && form.branches.some((b) => b.id === id) ? id : null;
}

function url(base: string, path: string, params: Record<string, string> = {}): string {
    const u = new URL(path, base);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return u.toString();
}

function asReview(value: unknown): PublicReview | null {
    if (!value || typeof value !== "object") return null;
    const v = value as Record<string, unknown>;
    const id = Number(v.id);
    const rating = Math.round(Number(v.rating));
    if (!Number.isInteger(id) || id <= 0 || !(rating >= 1 && rating <= 5)) return null;
    return {
        id,
        name: typeof v.name === "string" ? v.name : "",
        rating,
        message: typeof v.message === "string" ? v.message : "",
        created_at: typeof v.created_at === "string" ? v.created_at : null,
    };
}

/** Reads the GET body; anything malformed becomes an empty page. Never keeps a phone. */
export function parseReviewsPage(body: unknown): ReviewsPage {
    const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const summary = (b.summary && typeof b.summary === "object" ? b.summary : {}) as Record<string, unknown>;
    const pagination = (b.pagination && typeof b.pagination === "object" ? b.pagination : {}) as Record<string, unknown>;
    const reviews = Array.isArray(b.data) ? b.data.map(asReview).filter((r): r is PublicReview => r !== null) : [];
    const average = Number(summary.average);
    return {
        reviews,
        count: Math.max(0, Math.trunc(Number(summary.count)) || 0),
        average: Number.isFinite(average) ? Math.min(5, Math.max(0, average)) : 0,
        page: Math.max(1, Math.trunc(Number(pagination.current_page)) || 1),
        lastPage: Math.max(1, Math.trunc(Number(pagination.last_page)) || 1),
    };
}

/** Maps a failed POST to a ReviewApiError with per-field messages from the server (already localized). */
export function parseReviewError(status: number, body: unknown, fallback: { network: string; unknown: string; tooMany: string; closed: string }): ReviewApiError {
    const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const message = typeof b.message === "string" && b.message.trim() ? b.message.trim() : null;
    if (status === 0) return new ReviewApiError("network", fallback.network, 0);
    if (status === 429) return new ReviewApiError("too_many", message ?? fallback.tooMany, status);
    if (status === 422) {
        const fields: Partial<Record<keyof ReviewInput, string>> = {};
        if (b.errors && typeof b.errors === "object") {
            for (const [key, value] of Object.entries(b.errors as Record<string, unknown>)) {
                if (Array.isArray(value) && typeof value[0] === "string") fields[key as keyof ReviewInput] = value[0];
            }
        }
        return new ReviewApiError("invalid", message ?? fallback.unknown, status, fields);
    }
    // 420 / 403 / 404: the store is suspended or doesn't take reviews
    if ([403, 404, 420].includes(status)) return new ReviewApiError("closed", fallback.closed, status);
    return new ReviewApiError("unknown", fallback.unknown, status);
}

async function call(target: string, init: RequestInit, timeoutMs = TIMEOUT_MS): Promise<{ status: number; body: unknown }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(target, {
            ...init,
            signal: controller.signal,
            headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
        });
        let body: unknown = null;
        try {
            body = await res.json();
        } catch {
            body = null;
        }
        return { status: res.status, body };
    } catch {
        return { status: 0, body: null };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * The reviews the owner chose for the home page; `limit` 1–20 (the server's default is 10).
 * `timeoutMs`: the home page passes HOME_TIMEOUT_MS so a slow answer never holds the page (it throws; no strip).
 */
export async function getReviews(base: string, page = 1, limit?: number, timeoutMs = TIMEOUT_MS): Promise<ReviewsPage> {
    const params: Record<string, string> = { page: String(Math.max(1, Math.trunc(page))) };
    if (limit !== undefined) params.limit = String(Math.min(20, Math.max(1, Math.trunc(limit))));
    const { status, body } = await call(url(base, "v1/store-reviews", params), { method: "GET" }, timeoutMs);
    if (status !== 200) throw new Error(`reviews ${status}`);
    return parseReviewsPage(body);
}

/**
 * The review form's settings (branch dropdown). Never throws: a slow (> timeoutMs), failed or odd answer gives
 * NO_BRANCH_FORM, and the server's 422 on `branch_id` brings the dropdown back if the store does need one.
 */
export async function getReviewForm(base: string, timeoutMs = HOME_TIMEOUT_MS): Promise<ReviewForm> {
    try {
        const { status, body } = await call(url(base, "v1/store-reviews/form"), { method: "GET" }, timeoutMs);
        return status === 200 ? parseReviewForm(body) : NO_BRANCH_FORM;
    } catch {
        return NO_BRANCH_FORM;
    }
}

/** Digits only, the same way the server stores it. */
export function cleanPhone(value: string): string {
    // Arabic-Indic and Persian digits typed on Arabic keyboards become 0-9
    const latin = value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
    return latin.replace(/\D+/g, "");
}

/** The same rules as the server, so most mistakes show before sending. */
export function validateReview(input: ReviewInput, branchRequired = false): Partial<Record<keyof ReviewInput, true>> {
    const errors: Partial<Record<keyof ReviewInput, true>> = {};
    if (branchRequired && cleanBranchId(input.branch_id) === null) errors.branch_id = true;
    if (!(Number.isInteger(input.rating) && input.rating >= 1 && input.rating <= 5)) errors.rating = true;
    const name = input.name.trim();
    if (name.length < 2 || name.length > 80) errors.name = true;
    const phone = cleanPhone(input.phone);
    if (phone.length < 8 || phone.length > 15) errors.phone = true;
    const message = input.message.trim();
    if (message.length < 3 || message.length > 1000) errors.message = true;
    return errors;
}

export async function sendReview(
    base: string,
    input: ReviewInput,
    lang: ReviewsLang,
    fallback: { network: string; unknown: string; tooMany: string; closed: string },
    source?: string | null,
): Promise<string> {
    const utmSource = cleanSource(source);
    const payload = {
        name: input.name.trim(),
        phone: cleanPhone(input.phone),
        rating: input.rating,
        message: input.message.trim(),
        website: input.website ?? "",
        lang,
        // Where the customer came from (`receipt` = the receipt QR); the panel counts reviews from receipts
        ...(utmSource ? { utm_source: utmSource } : {}),
        // Only what the customer picked in the dropdown (2+ branches); none for 0 / 1 branch (the server assigns it)
        ...(cleanBranchId(input.branch_id) !== null ? { branch_id: cleanBranchId(input.branch_id) } : {}),
    };
    const { status, body } = await call(url(base, "v1/store-reviews", { lang }), {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Accept-Language": lang },
    });
    if (status === 201) {
        const message = (body as { message?: unknown } | null)?.message;
        return typeof message === "string" ? message : "";
    }
    throw parseReviewError(status, body, fallback);
}
