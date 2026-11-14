// The /ship booking form of a shipping company's site (phase 3): sender → recipient → parcel and COD →
// review. Every step checks its own fields (src/lib/shipping/booking.ts mirrors the Laravel rules).
// Bot checks: the hidden `website` honeypot, the time trap (form_token from the profile) and ALTCHA,
// solved in the background. One idempotency key per request, so a double tap or a retry after a lost
// connection never makes two requests. The price is confirmed by the company later (owner decision D1).
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    bookingPayload, bookingSchema, dateBounds, toE164, emptyBooking, newIdempotencyKey, stepOfField, STEPS, whatsappShareUrl,
    type BookingField, type BookingValues,
} from "@/lib/shipping/booking";
import { isAltchaChallenge, solveAltcha } from "@/lib/shipping/altcha";
import { formatDay, formatMoney } from "@/lib/shipping/format";
import { carrierStrings, optionLabel, pickText } from "@/lib/shipping/strings";
import type { CarrierBooked, CarrierLang, CarrierProfile } from "@/lib/shipping/types";

type AltchaState = "off" | "solving" | "ready" | "failed";

/** A new time-trap token is sent no sooner than this (Laravel: shipping.public_site.min_form_seconds = 4). */
const MIN_TOKEN_AGE_MS = 5000;

interface Props {
    profile: CarrierProfile;
    formToken: string;
    lang: CarrierLang;
    /** https://<company host>, for the share link */
    siteOrigin: string;
}

export default function ShipForm({ profile, formToken, lang, siteOrigin }: Props) {
    const t = carrierStrings(lang);
    const schema = useMemo(
        () =>
            bookingSchema(t, {
                phonePrefix: profile.phone_prefix,
                mobilePattern: profile.mobile_pattern,
                governorates: profile.governorates.map((g) => g.code),
                categories: profile.categories.map((c) => c.key),
                payers: profile.payers.map((p) => p.key),
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lang, profile],
    );
    const form = useForm<BookingValues>({ resolver: zodResolver(schema), defaultValues: emptyBooking(), mode: "onTouched" });
    const { register, trigger, getValues, setError, formState } = form;
    const errors = formState.errors;
    // A field that shows a mistake is checked again on every change, so the message goes as soon as it's fixed
    const reg = (name: BookingField) =>
        register(name, {
            onChange: () => {
                if (form.formState.errors[name]) void trigger(name);
            },
        });

    const [step, setStep] = useState(0);
    const [sending, setSending] = useState(false);
    const [alert, setAlert] = useState<{ text: string; reload?: boolean } | null>(null);
    const [booked, setBooked] = useState<CarrierBooked | null>(null);
    const [copied, setCopied] = useState(false);
    // Until React runs, the buttons do nothing: a tap before then must not send the bare HTML form
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const honeypotRef = useRef<HTMLInputElement>(null);
    // The time-trap token and when this page got it (a refused one is replaced, see send())
    const tokenRef = useRef({ token: formToken, at: Date.now() });
    const keyRef = useRef<string>("");
    if (!keyRef.current) keyRef.current = newIdempotencyKey();

    // ── ALTCHA in the background ─────────────────────────────────────────────────────────────────
    const [altcha, setAltcha] = useState<AltchaState>(profile.altcha ? "solving" : "off");
    const altchaRef = useRef<Promise<string | null> | null>(null);
    const altchaAbort = useRef<AbortController | null>(null);
    function startAltcha() {
        if (!profile.altcha) return;
        altchaAbort.current?.abort();
        const controller = new AbortController();
        altchaAbort.current = controller;
        setAltcha("solving");
        altchaRef.current = (async () => {
            try {
                const res = await fetch("/api/shipping/altcha", { method: "POST", headers: { Accept: "application/json" }, signal: controller.signal });
                const challenge = await res.json().catch(() => null);
                if (!res.ok || !isAltchaChallenge(challenge)) throw new Error("challenge");
                const payload = await solveAltcha(challenge, controller.signal);
                if (!payload) throw new Error("solve");
                if (!controller.signal.aborted) setAltcha("ready");
                return payload;
            } catch {
                if (!controller.signal.aborted) setAltcha("failed");
                return null;
            }
        })();
    }
    useEffect(() => {
        startAltcha();
        return () => altchaAbort.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Move focus to the step's heading so screen readers and keyboards follow the step change
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        headingRef.current?.focus();
        headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [step, booked]);

    async function next() {
        setAlert(null);
        const ok = await trigger([...STEPS[step]] as FieldPath<BookingValues>[], { shouldFocus: true });
        if (ok) setStep((s) => Math.min(s + 1, 3));
    }

    async function submit() {
        if (sending) return;
        setAlert(null);
        const valid = await trigger();
        if (!valid) {
            const first = Object.keys(form.formState.errors)[0];
            const s = first ? stepOfField(first) : null;
            if (s !== null) setStep(s);
            setAlert({ text: t.errFixFields });
            return;
        }
        setSending(true);
        try {
            await send(false);
        } catch {
            setAlert({ text: t.errNetwork });
        } finally {
            setSending(false);
        }
    }

    /** One try; `retried` is true on the automatic second try with a new time-trap token. */
    async function send(retried: boolean): Promise<void> {
        let altchaPayload: string | null = null;
        if (profile.altcha) {
            if (!altchaRef.current) startAltcha();
            altchaPayload = await altchaRef.current;
            if (!altchaPayload) {
                setAlert({ text: t.securityFailed });
                return;
            }
        }
        const res = await fetch("/api/shipping/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                ...bookingPayload(getValues(), profile.phone_prefix),
                idempotency_key: keyRef.current,
                form_token: tokenRef.current.token,
                website: honeypotRef.current?.value ?? "",
                ...(altchaPayload ? { altcha: altchaPayload } : {}),
            }),
        });
        const body = await res.json().catch(() => null);
        if (res.ok && body?.status && body.data?.tracking_no) {
            setBooked(body.data as CarrierBooked);
            return;
        }
        // Only the time trap refused it (open for hours, or sent within seconds): keep everything the
        // visitor typed, get a new token, and send once more when the token is old enough
        const onlyToken = body?.error_code === "validation" && body.errors && Object.keys(body.errors).every((f) => f === "form_token");
        if (onlyToken && !retried && (await refreshToken())) {
            const wait = MIN_TOKEN_AGE_MS - (Date.now() - tokenRef.current.at);
            if (wait > 0) await new Promise((r) => setTimeout(r, wait));
            return send(true);
        }
        handleRefusal(res.status, body);
    }

    async function refreshToken(): Promise<boolean> {
        try {
            const res = await fetch("/api/shipping/form-token", { method: "POST", headers: { Accept: "application/json" } });
            const body = await res.json().catch(() => null);
            if (!res.ok || !body?.data?.form_token) return false;
            tokenRef.current = { token: String(body.data.form_token), at: Date.now() };
            return true;
        } catch {
            return false;
        }
    }

    function handleRefusal(status: number, body: { error_code?: string; message?: string; errors?: Record<string, string[]> } | null) {
        const code = body?.error_code;
        if (code === "validation" && body?.errors) {
            let firstStep: number | null = null;
            let reload = false;
            for (const [field, messages] of Object.entries(body.errors)) {
                const s = stepOfField(field);
                if (s !== null) {
                    setError(field as BookingField, { type: "server", message: messages[0] });
                    firstStep = firstStep === null ? s : Math.min(firstStep, s);
                } else if (field === "form_token" || field === "form") {
                    reload = true;
                }
            }
            if (firstStep !== null) {
                // A stale token next to field mistakes: get a new one quietly for the next try
                if (reload && body.errors.form_token) void refreshToken();
                setStep(firstStep);
                setAlert({ text: t.errFixFields });
                return;
            }
            if (reload) {
                setAlert({ text: body.errors.form_token?.[0] ?? body.errors.form?.[0] ?? body.message ?? t.errServer, reload: true });
                return;
            }
            setAlert({ text: t.errFixFields });
            return;
        }
        // The ALTCHA solution was used or refused: solve a new one for the next try
        if (code === "altcha_failed" || code === "daily_limit" || status >= 500) startAltcha();
        setAlert({ text: body?.message || (status === 0 ? t.errNetwork : t.errServer) });
    }

    // ── Success ─────────────────────────────────────────────────────────────────────────────────
    if (booked) {
        const trackUrl = `${siteOrigin}${booked.track_path}`;
        const share = whatsappShareUrl(t.shareText(profile.name, booked.tracking_no, trackUrl));
        return (
            <section className="cr-card cr-success" aria-live="polite">
                <div className="cr-success__icon" aria-hidden="true">✓</div>
                <h1 ref={headingRef} tabIndex={-1}>{t.bookedTitle}</h1>
                <p style={{ margin: 0 }}>{t.bookedNumber}</p>
                <p className="cr-number">{booked.tracking_no}</p>
                <div className="cr-actions">
                    <button
                        type="button"
                        className="cr-btn cr-btn--brand"
                        onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(booked.tracking_no);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2500);
                            } catch {
                                setCopied(false);
                            }
                        }}
                    >
                        {copied ? t.copied : t.copy}
                    </button>
                    <a className="cr-btn cr-btn--ghost" href={share} target="_blank" rel="noopener">{t.shareWhatsapp}</a>
                    <a className="cr-btn cr-btn--ghost" href={booked.track_path}>{t.trackNow}</a>
                </div>
                <span className="cr-visually-hidden" role="status">{copied ? t.copied : ""}</span>
                <p className="cr-note cr-note--brand" style={{ marginTop: 18, textAlign: "start" }}>{pickText(booked.after_booking, lang)}</p>
                <a className="cr-btn cr-btn--action" href="/ship" style={{ marginTop: 8 }}>{t.anotherShipment}</a>
            </section>
        );
    }

    // ── Form ────────────────────────────────────────────────────────────────────────────────────
    const stepNames = [t.stepSender, t.stepRecipient, t.stepParcel, t.stepReview];
    const govOptions = profile.governorates.map((g) => ({ value: g.code, label: optionLabel(g, lang) }));
    const { min: minDate, max: maxDate } = dateBounds();

    const field = (name: BookingField, label: string, input: ReactNode, opts: { required?: boolean; hint?: string } = {}) => {
        const error = errors[name]?.message;
        return (
            <div className="cr-field">
                <label className="cr-label" htmlFor={`f-${name}`}>
                    {label} {opts.required ? <span aria-hidden="true">*</span> : <small>({t.optional})</small>}
                </label>
                {input}
                {opts.hint && <span className="cr-hint" id={`h-${name}`}>{opts.hint}</span>}
                {error && <span className="cr-error" id={`e-${name}`}>{String(error)}</span>}
            </div>
        );
    };
    const aria = (name: BookingField, hint = false) => ({
        id: `f-${name}`,
        "aria-invalid": errors[name] ? (true as const) : undefined,
        "aria-describedby": [hint ? `h-${name}` : "", errors[name] ? `e-${name}` : ""].filter(Boolean).join(" ") || undefined,
    });
    const text = (name: BookingField, label: string, opts: { required?: boolean; max: number; placeholder?: string; autoComplete?: string }) =>
        field(name, label, <input className="cr-input" {...aria(name)} {...reg(name)} maxLength={opts.max} placeholder={opts.placeholder} autoComplete={opts.autoComplete ?? "off"} />, opts);
    const area = (name: BookingField, label: string, opts: { required?: boolean; max: number; placeholder?: string }) =>
        field(name, label, <textarea className="cr-textarea" rows={3} {...aria(name)} {...reg(name)} maxLength={opts.max} placeholder={opts.placeholder} />, opts);
    const phone = (name: BookingField, label: string, required: boolean) =>
        field(name, label, <input className="cr-input" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" placeholder={t.phonePlaceholder} {...aria(name)} {...reg(name)} maxLength={20} />, { required });
    const decimal = (name: BookingField, label: string, opts: { hint?: string } = {}) =>
        field(name, label, <input className="cr-input" inputMode="decimal" dir="ltr" autoComplete="off" {...aria(name, Boolean(opts.hint))} {...reg(name)} maxLength={12} />, opts);
    const governorate = (name: BookingField) =>
        field(
            name,
            t.governorate,
            <select className="cr-select" {...aria(name)} {...reg(name)}>
                <option value="">{t.governoratePick}</option>
                {govOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>,
            { required: true },
        );
    const radios = (name: "category" | "who_pays_shipping", label: string, options: { key: string; label: string }[]) => (
        <fieldset className="cr-field" style={{ border: 0, padding: 0, margin: "0 0 14px" }} aria-describedby={errors[name] ? `e-${name}` : undefined}>
            <legend className="cr-label" style={{ marginBottom: 6 }}>{label} <span aria-hidden="true">*</span></legend>
            <div className="cr-radios">
                {options.map((o) => (
                    <label className="cr-radio" key={o.key}>
                        <input type="radio" value={o.key} {...reg(name)} />
                        <span>{o.label}</span>
                    </label>
                ))}
            </div>
            {errors[name] && <span className="cr-error" id={`e-${name}`}>{String(errors[name]?.message)}</span>}
        </fieldset>
    );

    const v = getValues();
    const gov = (code: string) => govOptions.find((g) => g.value === code)?.label ?? code;
    const cat = (key: string) => optionLabel(profile.categories.find((c) => c.key === key) ?? { label_ar: key, label_en: key }, lang);
    const payer = (key: string) => optionLabel(profile.payers.find((p) => p.key === key) ?? { label_ar: key, label_en: key }, lang);
    const shownPhone = (value: string) => (value.trim() ? toE164(value, profile.phone_prefix) : "");
    const row = (label: string, value: string | undefined) => (value ? <><dt>{label}</dt><dd>{value}</dd></> : null);

    return (
        <section className="cr-card">
            <ol className="cr-stepper" aria-label={t.stepOf(step + 1, 4)}>
                {stepNames.map((name, i) => (
                    <li key={name} data-state={i < step ? "done" : i === step ? "current" : "todo"} aria-current={i === step ? "step" : undefined}>
                        {name}
                    </li>
                ))}
            </ol>
            <p className="cr-hint" style={{ margin: "0 0 4px" }}>{t.stepOf(step + 1, 4)}</p>
            <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: "1.3rem", margin: "0 0 14px" }}>{stepNames[step]}</h1>

            {alert && (
                <div className="cr-alert" role="alert">
                    {alert.text}
                    {alert.reload && (
                        <div style={{ marginTop: 8 }}>
                            <button type="button" className="cr-btn cr-btn--ghost" onClick={() => window.location.reload()}>{t.reload}</button>
                        </div>
                    )}
                </div>
            )}

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    if (step < 3) void next();
                    else void submit();
                }}
            >
                {/* Honeypot: hidden from people and screen readers; bots fill it */}
                <div className="cr-hp" aria-hidden="true">
                    <label htmlFor="cr-website">Website</label>
                    <input id="cr-website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} defaultValue="" />
                </div>

                <div hidden={step !== 0}>
                    {text("sender_name", t.senderName, { required: true, max: 120, autoComplete: "name" })}
                    {phone("sender_phone", t.senderPhone, true)}
                    <div className="cr-row cr-row--2">
                        {governorate("sender_governorate")}
                        {text("sender_area", t.area, { max: 120 })}
                    </div>
                    {area("sender_address", t.address, { required: true, max: 500, placeholder: t.addressPlaceholder })}
                    {area("sender_notes", t.pickupNotes, { max: 500 })}
                </div>

                <div hidden={step !== 1}>
                    {text("recipient_name", t.recipientName, { required: true, max: 120 })}
                    <div className="cr-row cr-row--2">
                        {phone("recipient_phone", t.recipientPhone, true)}
                        {phone("recipient_phone2", t.recipientPhone2, false)}
                    </div>
                    <div className="cr-row cr-row--2">
                        {governorate("recipient_governorate")}
                        {text("recipient_area", t.area, { max: 120 })}
                    </div>
                    {area("recipient_address", t.address, { required: true, max: 500, placeholder: t.addressPlaceholder })}
                    {area("recipient_notes", t.deliveryNotes, { max: 500 })}
                </div>

                <div hidden={step !== 2}>
                    {radios("category", t.category, profile.categories.map((c) => ({ key: c.key, label: optionLabel(c, lang) })))}
                    {text("description", t.description, { max: 500, placeholder: t.descriptionPlaceholder })}
                    <div className="cr-row cr-row--2">
                        {field("packages_count", t.packages, <input className="cr-input" inputMode="numeric" dir="ltr" {...aria("packages_count")} {...reg("packages_count")} maxLength={3} />, { required: true })}
                        {decimal("weight_kg", t.weight)}
                    </div>
                    {decimal("cod_amount", `${t.cod} (${profile.currency})`, { hint: t.codHint })}
                    {radios("who_pays_shipping", t.whoPays, profile.payers.map((p) => ({ key: p.key, label: optionLabel(p, lang) })))}
                    {field("preferred_delivery_date", t.preferredDate, <input className="cr-input" type="date" min={minDate} max={maxDate} {...aria("preferred_delivery_date")} {...reg("preferred_delivery_date")} />)}
                    <details className="cr-details" style={{ marginBottom: 14 }}>
                        <summary>{t.moreDetails}</summary>
                        <div className="cr-row cr-row--3">
                            {decimal("length_cm", t.length)}
                            {decimal("width_cm", t.width)}
                            {decimal("height_cm", t.height)}
                        </div>
                        <div className="cr-row cr-row--2">
                            {decimal("declared_value", `${t.declaredValue} (${profile.currency})`)}
                            {text("special_handling", t.specialHandling, { max: 255, placeholder: t.specialHandlingPlaceholder })}
                        </div>
                    </details>
                    {area("notes", t.notes, { max: 1000 })}
                    <p className="cr-note cr-note--brand">{t.noPriceNote}</p>
                </div>

                {step === 3 && (
                    <div className="cr-review">
                        <section>
                            <h3>{t.stepSender} <button type="button" className="cr-linkbtn" onClick={() => setStep(0)}>{t.edit}</button></h3>
                            <dl>
                                {row(t.senderName, v.sender_name)}
                                {row(t.senderPhone, shownPhone(v.sender_phone))}
                                {row(t.governorate, gov(v.sender_governorate))}
                                {row(t.area, v.sender_area)}
                                {row(t.address, v.sender_address)}
                                {row(t.pickupNotes, v.sender_notes)}
                            </dl>
                        </section>
                        <section>
                            <h3>{t.stepRecipient} <button type="button" className="cr-linkbtn" onClick={() => setStep(1)}>{t.edit}</button></h3>
                            <dl>
                                {row(t.recipientName, v.recipient_name)}
                                {row(t.recipientPhone, shownPhone(v.recipient_phone))}
                                {row(t.recipientPhone2, shownPhone(v.recipient_phone2))}
                                {row(t.governorate, gov(v.recipient_governorate))}
                                {row(t.area, v.recipient_area)}
                                {row(t.address, v.recipient_address)}
                                {row(t.deliveryNotes, v.recipient_notes)}
                            </dl>
                        </section>
                        <section>
                            <h3>{t.stepParcel} <button type="button" className="cr-linkbtn" onClick={() => setStep(2)}>{t.edit}</button></h3>
                            <dl>
                                {row(t.category, cat(v.category))}
                                {row(t.description, v.description)}
                                {row(t.packages, v.packages_count)}
                                {row(t.weight, v.weight_kg)}
                                {row(t.cod, v.cod_amount ? formatMoney(v.cod_amount.replace(",", "."), profile.currency, lang) : "")}
                                {row(t.whoPays, payer(v.who_pays_shipping))}
                                {row(t.preferredDate, formatDay(v.preferred_delivery_date, lang))}
                                {row(t.notes, v.notes)}
                            </dl>
                        </section>
                        <p className="cr-note cr-note--brand" style={{ margin: 0 }}>{t.noPriceNote}</p>
                        {profile.altcha && (
                            <div className="cr-status" role="status">
                                {altcha === "ready" && <span>✓ {t.securityReady}</span>}
                                {altcha === "solving" && <span>{t.securityChecking}</span>}
                                {altcha === "failed" && (
                                    <button type="button" className="cr-linkbtn" onClick={startAltcha}>{t.securityFailed}</button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="cr-form-actions">
                    {step > 0 && (
                        <button type="button" className="cr-btn cr-btn--ghost" onClick={() => { setAlert(null); setStep((s) => s - 1); }} disabled={sending || !hydrated}>
                            {t.back}
                        </button>
                    )}
                    <button type="submit" className={`cr-btn ${step < 3 ? "cr-btn--brand" : "cr-btn--action"}`} disabled={sending || !hydrated} aria-busy={sending || undefined}>
                        {step < 3 ? t.next : sending ? t.sending : t.submit}
                    </button>
                </div>
            </form>
        </section>
    );
}
