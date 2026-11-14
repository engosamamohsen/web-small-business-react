// "More details" on the tracking page: the last 4 digits of the sender's or one of the recipient's mobiles
// show both first names and the COD due. The company's API limits wrong tries (per visitor, then per shipment)
// and, after a few wrong tries on a shipment, wants an ALTCHA proof of work with each try: this box then solves
// one in the background (about a second) and sends it, so a real customer just waits a moment.
import { useEffect, useRef, useState } from "react";
import { isAltchaChallenge, solveAltcha } from "@/lib/shipping/altcha";
import { westernDigits } from "@/lib/shipping/booking";
import { formatMoney } from "@/lib/shipping/format";
import { carrierStrings } from "@/lib/shipping/strings";
import type { CarrierLang, CarrierTracking } from "@/lib/shipping/types";

type Details = NonNullable<CarrierTracking["details"]>;

export default function TrackDetails({ trackingNo, lang }: { trackingNo: string; lang: CarrierLang }) {
    const t = carrierStrings(lang);
    // A fixed id, not useId(): Astro renders each island as its own React root, so useId() differs between the
    // server HTML and the browser and React warns about a hydration mismatch (QA 2026-11-08). One box per page.
    const id = "cr-td";
    const [digits, setDigits] = useState("");
    const [busy, setBusy] = useState(false);
    const [details, setDetails] = useState<Details | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    // Bumped on every message, so the alert is a new element each time and screen readers announce a repeated
    // message too (the same text twice in a row would otherwise not re-render; QA review 2026-11-14).
    const [messageKey, setMessageKey] = useState(0);
    const say = (text: string) => {
        setMessage(text);
        setMessageKey((k) => k + 1);
    };
    const [locked, setLocked] = useState(false);
    const [needsCaptcha, setNeedsCaptcha] = useState(false);
    // The server HTML has a working-looking box before React takes over; until then "Show details" stays disabled,
    // and anything typed early is picked up so the visitor doesn't have to type it again (QA 2026-11-14, finding 1).
    const [hydrated, setHydrated] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const early = westernDigits(inputRef.current?.value ?? "").replace(/\D/g, "").slice(0, 4);
        if (early) setDigits(early);
        setHydrated(true);
    }, []);

    async function proofOfWork(): Promise<string | null> {
        try {
            const res = await fetch("/api/shipping/altcha", { method: "POST", headers: { Accept: "application/json" } });
            const challenge = await res.json().catch(() => null);
            return res.ok && isAltchaChallenge(challenge) ? await solveAltcha(challenge) : null;
        } catch {
            return null;
        }
    }

    async function check(clean: string, withCaptcha: boolean): Promise<Response> {
        const altcha = withCaptcha ? await proofOfWork() : null;
        return fetch("/api/shipping/track", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(altcha ? { number: trackingNo, phone_last4: clean, altcha } : { number: trackingNo, phone_last4: clean }),
        });
    }

    function lockedMessage(scope: unknown): string {
        if (scope === "shipment") return t.detailsLockedAll;
        if (scope === "unavailable") return t.detailsUnavailable;
        return t.detailsLocked;
    }

    async function submit(event: { preventDefault(): void }) {
        event.preventDefault();
        const clean = westernDigits(digits).replace(/\D/g, "");
        if (clean.length !== 4) {
            say(t.detailsShort);
            return;
        }
        setBusy(true);
        if (needsCaptcha) say(t.detailsChecking);
        else setMessage(null);
        try {
            let res = await check(clean, needsCaptcha);
            let body = await res.json().catch(() => null);
            // The digits weren't checked because a proof of work was needed: solve one and send them again, once.
            // (details_captcha after a checked wrong try only means the NEXT try needs one.)
            if (res.ok && body?.status && body.data.details_captcha && body.data.digits_checked === false && !body.data.details_locked) {
                say(t.detailsChecking);
                res = await check(clean, true);
                body = await res.json().catch(() => null);
            }
            if (res.ok && body?.status) {
                setNeedsCaptcha(Boolean(body.data.details_captcha));
                if (body.data.details) {
                    setDetails(body.data.details);
                    setMessage(null);
                } else {
                    setLocked(Boolean(body.data.details_locked));
                    say(body.data.details_locked ? lockedMessage(body.data.lock_scope) : t.detailsWrong);
                }
            } else {
                say(body?.message || (res.status === 0 ? t.errNetwork : t.errServer));
            }
        } catch {
            say(t.errNetwork);
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className="cr-card" aria-labelledby={`${id}-h`}>
            <h2 id={`${id}-h`}>{t.detailsTitle}</h2>
            {details ? (
                <dl className="cr-facts">
                    <div><dt>{t.senderFirst}</dt><dd>{details.sender_first_name || "—"}</dd></div>
                    <div><dt>{t.recipientFirst}</dt><dd>{details.recipient_first_name || "—"}</dd></div>
                    <div>
                        <dt>{t.codDue}</dt>
                        <dd>{Number(details.cod_amount) > 0 ? formatMoney(details.cod_amount, details.currency, lang) : t.noCod}</dd>
                    </div>
                </dl>
            ) : (
                <>
                    <p>{t.detailsHint}</p>
                    <form className="cr-digits" onSubmit={submit} noValidate>
                        <div className="cr-field">
                            <label className="cr-label" htmlFor={`${id}-d`}>{t.last4}</label>
                            <input
                                id={`${id}-d`}
                                ref={inputRef}
                                className="cr-input"
                                inputMode="numeric"
                                autoComplete="off"
                                maxLength={4}
                                value={digits}
                                disabled={locked}
                                aria-invalid={message && message !== t.detailsChecking ? true : undefined}
                                aria-describedby={message ? `${id}-m` : undefined}
                                onChange={(e) => setDigits(westernDigits(e.target.value).replace(/\D/g, "").slice(0, 4))}
                            />
                        </div>
                        <button className="cr-btn cr-btn--brand" type="submit" disabled={busy || locked || !hydrated}>
                            {t.showDetails}
                        </button>
                    </form>
                    {/* Without JavaScript the box can't check digits: say so instead of a silently disabled button */}
                    <noscript><p className="cr-hint">{t.detailsNoScript}</p></noscript>
                    {message && <p className="cr-error" id={`${id}-m`} role="alert" key={messageKey}>{message}</p>}
                </>
            )}
        </section>
    );
}
