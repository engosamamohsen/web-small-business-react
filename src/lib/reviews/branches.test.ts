import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanBranchId, getReviewForm, NO_BRANCH_FORM, parseReviewError, parseReviewForm, preselectBranch, sendReview, validateReview } from "./api";
import { __STRING_SETS, reviewsHref } from "./strings";

// Branch reviews (owner 2026-11-23, Laravel GET v1/store-reviews/form + POST branch_id):
// 0 / 1 active branch = no dropdown and no branch_id; 2+ = an editable required dropdown; the receipt QR's
// ?branch=<id> only preselects it. The server validates the final branch_id again.

const fallback = { network: "net", unknown: "unknown", tooMany: "many", closed: "closed" };
const two = { status: true, data: { branch_required: true, branches: [{ id: 3, name: "12 Tahrir St" }, { id: 4, name: "Nasr City" }], default_branch_id: null } };

describe("the review form settings", () => {
    it("shows a dropdown only for 2+ branches", () => {
        expect(parseReviewForm(two)).toEqual({ branchRequired: true, branches: [{ id: 3, name: "12 Tahrir St" }, { id: 4, name: "Nasr City" }], defaultBranchId: null });
        // One active branch: the server assigns it, no dropdown
        expect(parseReviewForm({ data: { branch_required: false, branches: [{ id: 3, name: "Only" }], default_branch_id: 3 } }))
            .toEqual({ branchRequired: false, branches: [], defaultBranchId: 3 });
        // No branch
        expect(parseReviewForm({ data: { branch_required: false, branches: [], default_branch_id: null } })).toEqual(NO_BRANCH_FORM);
    });

    it("treats odd answers as no dropdown", () => {
        for (const body of [null, "x", {}, { data: null }, { data: { branch_required: "yes", branches: two.data.branches } }]) {
            expect(parseReviewForm(body)).toEqual(NO_BRANCH_FORM);
        }
        // "required" with fewer than 2 usable branches can not be answered: no dropdown (the server's 422 decides)
        expect(parseReviewForm({ data: { branch_required: true, branches: [{ id: 3, name: "A" }, { id: "x" }, { id: 3, name: "dup" }] } }).branchRequired).toBe(false);
        // An empty address gets a label
        expect(parseReviewForm({ data: { branch_required: true, branches: [{ id: 3, name: " " }, { id: 4, name: "B" }] } }).branches[0].name).toBe("#3");
    });

    it("cleans branch ids", () => {
        expect(cleanBranchId("7")).toBe(7);
        expect(cleanBranchId(7)).toBe(7);
        for (const bad of ["0", "-1", "abc", "7 OR 1=1", "1.5", "", null, undefined, 0, -3, 1.5, ["7"]]) {
            expect(cleanBranchId(bad)).toBeNull();
        }
    });

    it("preselects the receipt's branch only when it is one of the choices", () => {
        const form = parseReviewForm(two);
        expect(preselectBranch(form, "4")).toBe(4);
        expect(preselectBranch(form, "9")).toBeNull(); // closed or another store's branch
        expect(preselectBranch(form, "abc")).toBeNull();
        expect(preselectBranch(form, null)).toBeNull();
        // 0 / 1 branch stores never preselect (no dropdown, nothing sent)
        expect(preselectBranch({ branchRequired: false, branches: [], defaultBranchId: 4 }, "4")).toBeNull();
    });
});

describe("loading the form settings", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it("asks the form endpoint", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(two), { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);
        expect((await getReviewForm("http://x/api/")).branchRequired).toBe(true);
        expect(fetchMock.mock.calls[0][0]).toBe("http://x/api/v1/store-reviews/form");
    });

    it("never throws: errors, old servers (404) and no connection give no dropdown", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 404 })));
        expect(await getReviewForm("http://x/api/")).toEqual(NO_BRANCH_FORM);
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
        expect(await getReviewForm("http://x/api/")).toEqual(NO_BRANCH_FORM);
    });

    it("gives up after 3 s", async () => {
        vi.useFakeTimers();
        vi.stubGlobal("fetch", vi.fn().mockImplementation((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        })));
        const pending = getReviewForm("http://x/api/");
        await vi.advanceTimersByTimeAsync(3_000);
        expect(await pending).toEqual(NO_BRANCH_FORM);
    });
});

describe("sending with a branch", () => {
    afterEach(() => vi.unstubAllGlobals());
    const input = { name: "Mohamed", phone: "01001234567", rating: 5, message: "Good" };

    it("sends branch_id only when one was picked", async () => {
        const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ status: true, message: "Thanks" }), { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);
        await sendReview("http://x/api/", { ...input, branch_id: 4 }, "ar", fallback, "receipt");
        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ branch_id: 4, utm_source: "receipt" });
        await sendReview("http://x/api/", { ...input, branch_id: null }, "ar", fallback);
        expect(JSON.parse(fetchMock.mock.calls[1][1].body)).not.toHaveProperty("branch_id");
        await sendReview("http://x/api/", input, "ar", fallback);
        expect(JSON.parse(fetchMock.mock.calls[2][1].body)).not.toHaveProperty("branch_id");
    });

    it("requires a branch before sending only when the dropdown shows", () => {
        expect(validateReview({ ...input, branch_id: null }, true)).toEqual({ branch_id: true });
        expect(validateReview({ ...input, branch_id: 4 }, true)).toEqual({});
        expect(validateReview({ ...input, branch_id: null }, false)).toEqual({});
    });

    it("keeps the server's branch error on the branch field", () => {
        const error = parseReviewError(422, { status: false, message: "x", errors: { branch_id: ["Please choose the branch you visited."] } }, fallback);
        expect(error.kind).toBe("invalid");
        expect(error.fields.branch_id).toBe("Please choose the branch you visited.");
    });
});

describe("branch words and links", () => {
    it("has the branch words in both languages", () => {
        for (const key of ["branch", "branchPlaceholder", "branchFromReceipt", "errBranch"] as const) {
            expect(__STRING_SETS.ar[key]).toBeTruthy();
            expect(__STRING_SETS.en[key]).toBeTruthy();
            expect(__STRING_SETS.ar[key]).not.toBe(__STRING_SETS.en[key]);
        }
    });

    it("keeps the receipt's branch on the language switch", () => {
        expect(reviewsHref("en", "receipt", 4)).toBe("/reviews?lang=en&utm_source=receipt&branch=4");
        expect(reviewsHref("ar", null, 4)).toBe("/reviews?branch=4");
        expect(reviewsHref("ar", null, null)).toBe("/reviews");
    });
});
