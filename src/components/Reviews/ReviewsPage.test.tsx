import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ReviewsPage from "./ReviewsPage";
import { NO_BRANCH_FORM, type ReviewForm } from "@/lib/reviews/api";
import { reviewsStrings } from "@/lib/reviews/strings";

// The /reviews form's branch dropdown (owner 2026-11-23): only with 2+ active branches, editable, the receipt's
// branch preselected; nothing for 0 / 1 branch stores.

const two: ReviewForm = { branchRequired: true, branches: [{ id: 3, name: "12 Tahrir St" }, { id: 4, name: "Nasr City" }], defaultBranchId: null };
const html = (props: Parameters<typeof ReviewsPage>[0]) => renderToStaticMarkup(<ReviewsPage {...props} />);

describe("the branch dropdown on /reviews", () => {
    it("is not shown for stores with no branch or one branch", () => {
        for (const form of [NO_BRANCH_FORM, { branchRequired: false, branches: [], defaultBranchId: 3 }]) {
            const page = html({ lang: "ar", form, initialBranch: 3 });
            expect(page).not.toContain("<select");
            expect(page).not.toContain(reviewsStrings("ar").branch);
        }
        expect(html({ lang: "en" })).not.toContain("<select"); // older callers: no form at all
    });

    it("is shown, required and empty for a store with several branches", () => {
        const page = html({ lang: "ar", form: two });
        expect(page).toContain("<select");
        expect(page).toContain('data-field="branch_id"');
        expect(page).toContain("required");
        expect(page).toContain(reviewsStrings("ar").branch);
        expect(page).toContain(`<option value="" selected="">${reviewsStrings("ar").branchPlaceholder}</option>`);
        expect(page).toContain('<option value="3">12 Tahrir St</option>');
        expect(page).toContain('<option value="4">Nasr City</option>');
        expect(page).not.toContain(reviewsStrings("ar").branchFromReceipt);
    });

    it("preselects the receipt's branch, still editable, and says so", () => {
        const page = html({ lang: "en", form: two, initialBranch: 4 });
        expect(page).toContain('<option value="4" selected="">Nasr City</option>');
        expect(page).not.toContain("disabled");
        expect(page).toContain(reviewsStrings("en").branchFromReceipt);
        expect(page).toContain(reviewsStrings("en").branch);
    });
});
