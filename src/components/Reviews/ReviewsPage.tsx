// /reviews island ("Share your feedback"): the review form only (stars required, name, phone,
// message, hidden honeypot). No reviews list here (owner, 2026-11-22): the reviews the owner
// chooses show on the home page (StoreReviews.astro). After a successful send the customer is
// taken back to the store's home page. openspec/changes/store-reviews. Styles: src/styles/reviews.css.
import { useEffect, useId, useRef, useState } from "react";
import { getApiUrl } from "@/lib/config";
import { getReviewForm, NO_BRANCH_FORM, ReviewApiError, sendReview, validateReview, type ReviewForm, type ReviewInput } from "@/lib/reviews/api";
import { homeHref, reviewsStrings, type ReviewsLang } from "@/lib/reviews/strings";

/** How long the thank-you shows before going back to the store. */
export const REDIRECT_AFTER_MS = 2500;
interface Props {
    lang: ReviewsLang;
    /** Clean utm_source of the page (`receipt` from the receipt QR), sent with the review. */
    source?: string | null;
    /** Branch dropdown settings (GET v1/store-reviews/form); shown only when branchRequired (2+ active branches). */
    form?: ReviewForm;
    /** Preselected branch from the receipt QR (?branch=), already checked against form.branches; editable. */
    initialBranch?: number | null;
}

type FieldErrors = Partial<Record<keyof ReviewInput, string>>;

export default function ReviewsPage({ lang, source = null, form: initialForm = NO_BRANCH_FORM, initialBranch = null }: Props) {
    const t = reviewsStrings(lang);
    const uid = useId();
    const [branchForm, setBranchForm] = useState<ReviewForm>(initialForm);
    const [form, setForm] = useState<ReviewInput>({ name: "", phone: "", rating: 0, message: "", website: "", branch_id: initialForm.branchRequired ? initialBranch : null });
    // "We picked the branch on your receipt" shows until the customer picks another one
    const [fromReceipt, setFromReceipt] = useState(initialForm.branchRequired && initialBranch !== null);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState<string | null>(null);
    const [hover, setHover] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);
    const sentRef = useRef<HTMLDivElement>(null);

    // Sent: say thanks, then back to the store's home page
    useEffect(() => {
        if (!sent) return;
        // The form was long: bring the thank-you to the top (under the sticky header), then focus it
        window.scrollTo({ top: 0 });
        sentRef.current?.focus({ preventScroll: true });
        const timer = window.setTimeout(() => window.location.assign(homeHref(lang)), REDIRECT_AFTER_MS);
        return () => window.clearTimeout(timer);
    }, [sent, lang]);

    function set<K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) {
        setForm((f) => ({ ...f, [key]: value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    }

    async function submit(event: { preventDefault: () => void }) {
        event.preventDefault();
        if (sending) return;
        setFormError(null);
        const local = validateReview(form, branchForm.branchRequired);
        const messages: Record<keyof ReviewInput, string> = { branch_id: t.errBranch, rating: t.errRating, name: t.errName, phone: t.errPhone, message: t.errMessage, website: "" };
        const found = Object.keys(local) as (keyof ReviewInput)[];
        if (found.length) {
            setErrors(Object.fromEntries(found.map((k) => [k, messages[k]])));
            // Centre the first wrong field: a plain focus() left it under the sticky header (QA I2, 390 px)
            const first = formRef.current?.querySelector<HTMLElement>(`[data-field="${found[0]}"]`);
            first?.focus({ preventScroll: true });
            first?.scrollIntoView?.({ block: "center" });
            return;
        }
        setSending(true);
        try {
            // Only a branch picked in the dropdown is sent; 0 / 1 branch stores send none
            const input = branchForm.branchRequired ? form : { ...form, branch_id: null };
            await sendReview(getApiUrl(), input, lang, { network: t.errNetwork, unknown: t.errUnknown, tooMany: t.errTooMany, closed: t.errClosed }, source);
            setSent(t.sentBody);
        } catch (error) {
            if (error instanceof ReviewApiError) {
                // The store needs a branch but the dropdown was not loaded (slow / failed form request, or the
                // branches changed): load the choices now and show the dropdown with the server's message
                if (error.kind === "invalid" && error.fields.branch_id) {
                    const fresh = await getReviewForm(getApiUrl());
                    if (fresh.branchRequired) {
                        setBranchForm(fresh);
                        setForm((f) => ({ ...f, branch_id: fresh.branches.some((b) => b.id === f.branch_id) ? f.branch_id : null }));
                    }
                    setFromReceipt(false);
                }
                if (error.kind === "invalid" && Object.keys(error.fields).length) setErrors(error.fields);
                else setFormError(error.message);
            } else {
                setFormError(t.errUnknown);
            }
        } finally {
            setSending(false);
        }
    }

    if (sent) {
        return (
            <section className="ct-rv-card ct-rv-formcard">
                <div className="ct-rv-sent" role="status" tabIndex={-1} ref={sentRef}>
                    <span className="ct-rv-sent__icon" aria-hidden="true">✓</span>
                    <h2>{t.sentTitle}</h2>
                    <p>{sent}</p>
                    <p className="ct-rv-muted ct-rv-redirect">
                        <span className="ct-rv-spinner" aria-hidden="true" /> {t.redirecting}
                    </p>
                    <a className="ct-rv-btn" href={homeHref(lang)}>{t.backToStore}</a>
                </div>
            </section>
        );
    }

    const shown = hover || form.rating;

    return (
        <section className="ct-rv-card ct-rv-formcard" aria-labelledby={`${uid}-form`}>
            <h2 id={`${uid}-form`} className="ct-rv-h2">{t.formTitle}</h2>
            <form ref={formRef} onSubmit={submit} noValidate>
                <p className="ct-rv-muted">{t.formLead}</p>

                {branchForm.branchRequired && (
                    <div className="ct-rv-field">
                        <label htmlFor={`${uid}-branch`}>
                            {t.branch} <span aria-hidden="true">*</span>
                        </label>
                        <select
                            id={`${uid}-branch`}
                            data-field="branch_id"
                            value={form.branch_id ?? ""}
                            onChange={(e) => {
                                setFromReceipt(false);
                                set("branch_id", e.target.value ? Number(e.target.value) : null);
                            }}
                            aria-invalid={Boolean(errors.branch_id)}
                            aria-describedby={[fromReceipt ? `${uid}-branch-hint` : "", errors.branch_id ? `${uid}-branch-err` : ""].filter(Boolean).join(" ") || undefined}
                            required
                        >
                            <option value="">{t.branchPlaceholder}</option>
                            {branchForm.branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        {fromReceipt && <p id={`${uid}-branch-hint`} className="ct-rv-muted ct-rv-hint">{t.branchFromReceipt}</p>}
                        {errors.branch_id && <p id={`${uid}-branch-err`} className="ct-rv-err">{errors.branch_id}</p>}
                    </div>
                )}

                <fieldset className="ct-rv-field" aria-describedby={errors.rating ? `${uid}-rating-err` : undefined}>
                    <legend>
                        {t.ratingLegend} <span aria-hidden="true">*</span>
                    </legend>
                    <div className="ct-rv-picker" onMouseLeave={() => setHover(0)}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <label key={n} className={n <= shown ? "is-on" : ""} onMouseEnter={() => setHover(n)}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={n}
                                    checked={form.rating === n}
                                    onChange={() => set("rating", n)}
                                    data-field={n === 1 ? "rating" : undefined}
                                    aria-label={t.starsLabel(n)}
                                />
                                <span aria-hidden="true">★</span>
                            </label>
                        ))}
                        <span className="ct-rv-muted ct-rv-picker__hint">{form.rating ? t.starsLabel(form.rating) : t.ratingHint}</span>
                    </div>
                    {errors.rating && <p id={`${uid}-rating-err`} className="ct-rv-err">{errors.rating}</p>}
                </fieldset>

                <div className="ct-rv-field">
                    <label htmlFor={`${uid}-name`}>
                        {t.name} <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id={`${uid}-name`}
                        data-field="name"
                        type="text"
                        autoComplete="name"
                        maxLength={80}
                        value={form.name}
                        placeholder={t.namePlaceholder}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                        required
                    />
                    {errors.name && <p id={`${uid}-name-err`} className="ct-rv-err">{errors.name}</p>}
                </div>

                <div className="ct-rv-field">
                    <label htmlFor={`${uid}-phone`}>
                        {t.phone} <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id={`${uid}-phone`}
                        data-field="phone"
                        type="tel"
                        inputMode="tel"
                        dir="ltr"
                        autoComplete="tel"
                        maxLength={20}
                        value={form.phone}
                        placeholder={t.phonePlaceholder}
                        onChange={(e) => set("phone", e.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${uid}-phone-err` : ""}`}
                        required
                    />
                    <p id={`${uid}-phone-hint`} className="ct-rv-muted ct-rv-hint">{t.phoneHint}</p>
                    {errors.phone && <p id={`${uid}-phone-err`} className="ct-rv-err">{errors.phone}</p>}
                </div>

                <div className="ct-rv-field">
                    <label htmlFor={`${uid}-message`}>
                        {t.message} <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id={`${uid}-message`}
                        data-field="message"
                        rows={4}
                        maxLength={1000}
                        value={form.message}
                        placeholder={t.messagePlaceholder}
                        onChange={(e) => set("message", e.target.value)}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? `${uid}-message-err` : undefined}
                        required
                    />
                    <p className="ct-rv-muted ct-rv-count" aria-hidden="true">{form.message.length}/1000</p>
                    {errors.message && <p id={`${uid}-message-err`} className="ct-rv-err">{errors.message}</p>}
                </div>

                {/* Honeypot: hidden from people and screen readers; bots fill it */}
                <div className="ct-rv-hp" aria-hidden="true">
                    <label htmlFor={`${uid}-website`}>Website</label>
                    <input id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>

                {formError && (
                    <p className="ct-rv-alert" role="alert">
                        {formError}
                    </p>
                )}

                <button type="submit" className="ct-rv-btn ct-rv-submit" disabled={sending}>
                    {sending ? t.sending : t.send}
                </button>
            </form>
        </section>
    );
}
