// /book — one page, top to bottom: services → where (salon / home, only when offered) →
// branch (only with several) → day → time → name and phone → confirm. Customers never pick a
// staff member: the store assigns one. Free times come from the booking API and are fetched
// again whenever a choice above them changes. Totals are display only; the server decides.
// Styles: src/styles/booking.css. Strings: src/lib/booking/strings.ts.

import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { getApiUrl } from "@/lib/config";
import { BookingApiError, createBooking, getSlots } from "@/lib/booking/api";
import { buildDateStrip, formatAppointmentWhen, formatTime12, splitByPeriod, type StripDay } from "@/lib/booking/dates";
import { saveMyBooking, upcomingMyBookings, type SavedBooking } from "@/lib/booking/my-bookings";
import { homeAreas, homeChoiceOffered, homeFee, locationErrors, locationPayload, MAX_ADDRESS_LENGTH } from "@/lib/booking/home";
import { isLikelyPhone, normalizePhone } from "@/lib/booking/phone";
import { t } from "@/lib/booking/strings";
import { bookingTotals, effectivePrice, formatDuration, formatMoney, groupByCategory } from "@/lib/booking/totals";
import type { BookingCatalog, BookingLocation } from "@/lib/booking/types";

export interface BookingWizardProps {
  catalog: BookingCatalog;
  /** Pre-selected from ?service= (already checked against the catalogue). */
  initialServiceIds: number[];
  initialBranchId: number | null;
  initialDate: string | null;
  /** Server time (ISO), so the date strip is the same on the server and in the browser. */
  now: string;
}

type Load<T> = { state: "idle" | "loading" | "done" | "error"; data: T; message?: string };

const Check = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BookingWizard({ catalog, initialServiceIds, initialBranchId, initialDate, now }: BookingWizardProps) {
  const { services, settings } = catalog;
  const groups = useMemo(() => groupByCategory(catalog.categories, services), [catalog.categories, services]);
  const days = useMemo(() => buildDateStrip(new Date(now), settings.max_days_ahead), [now, settings.max_days_ahead]);

  const [selected, setSelected] = useState<number[]>(initialServiceIds);
  const [branchId, setBranchId] = useState<number | null>(initialBranchId);
  const [date, setDate] = useState<string>(
    initialDate && days.some((d) => d.date === initialDate) ? initialDate : days[0]?.date ?? "",
  );
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Load<string[]>>({ state: "idle", data: [] });
  const [suggested, setSuggested] = useState<string[]>([]);
  const [slotsKey, setSlotsKey] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ services?: string; area?: string; address?: string; time?: string; name?: string; phone?: string }>({});
  // Home visits: where, the area (with its fee) and the address.
  const [locationPick, setLocationPick] = useState<BookingLocation>("salon");
  const [cityId, setCityId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const areaRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [mine, setMine] = useState<SavedBooking[]>([]);

  const timeSectionRef = useRef<HTMLFieldSetElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const servicesRef = useRef<HTMLFieldSetElement>(null);

  // Branches every chosen service is offered in (a service with no branch list is everywhere).
  const branches = useMemo(() => {
    const chosen = services.filter((s) => selected.includes(s.id));
    return settings.branches.filter((b) => chosen.every((s) => !s.branch_ids?.length || s.branch_ids.includes(b.id)));
  }, [services, selected, settings.branches]);
  const askBranch = settings.branches.length > 1;
  const effectiveBranch = askBranch ? branchId : null;

  useEffect(() => {
    if (!askBranch) return;
    if (branchId === null || !branches.some((b) => b.id === branchId)) setBranchId(branches[0]?.id ?? null);
  }, [askBranch, branches, branchId]);

  const areas = useMemo(() => homeAreas(settings), [settings]);
  const askWhere = homeChoiceOffered(settings, services, selected);
  const location: BookingLocation = askWhere ? locationPick : "salon";
  const fee = location === "home" ? homeFee(areas, cityId) : 0;
  const totals = useMemo(() => bookingTotals(services, selected), [services, selected]);
  const ready = selected.length > 0 && (!askBranch || effectiveBranch !== null);

  // "My bookings on this device" (browser only, after hydration).
  useEffect(() => {
    const upcoming = upcomingMyBookings();
    setMine(upcoming.slice(0, 3));
  }, []);

  // Keep the choices in the address so refresh / Back keep them.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selected.length) params.set("service", selected.join(","));
    if (effectiveBranch) params.set("branch", String(effectiveBranch));
    if (date) params.set("date", date);
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [selected, effectiveBranch, date]);

  // Selected day in view on first paint.
  useEffect(() => {
    daysRef.current?.querySelector<HTMLElement>("label:has(input:checked)")?.scrollIntoView?.({ block: "nearest", inline: "center" });
  }, []);

  // Free times for the day (re-fetched on any change, and after a 409).
  useEffect(() => {
    if (!ready || !date) {
      setSlots({ state: "idle", data: [] });
      return;
    }
    const controller = new AbortController();
    setSlots((prev) => ({ state: "loading", data: prev.data }));
    getSlots(getApiUrl(), { serviceIds: selected, date, branchId: effectiveBranch, location }, { signal: controller.signal })
      .then((result) => {
        const times = Array.isArray(result?.times) ? result.times : [];
        setSlots({ state: "done", data: times });
        setTime((current) => (current && times.includes(current) ? current : null));
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setSlots({ state: "error", data: [], message: error instanceof BookingApiError ? error.message : t.errUnknown });
      });
    return () => controller.abort();
  }, [ready, selected, date, effectiveBranch, location, slotsKey]);

  const toggleService = (id: number) => {
    setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
    setSuggested([]);
    setErrors((e) => ({ ...e, services: undefined }));
  };

  const pickDay = (day: StripDay) => {
    setDate(day.date);
    setSuggested([]);
  };

  const validate = useCallback(() => {
    const next: typeof errors = {};
    if (!selected.length) next.services = t.errServices;
    const where = locationErrors({ location, cityId, address }, areas);
    if (where.area) next.area = t.errArea;
    if (where.address) next.address = t.errAddress;
    if (!time) next.time = t.errTime;
    if (!name.trim()) next.name = t.errName;
    if (!isLikelyPhone(phone)) next.phone = t.errPhone;
    setErrors(next);
    if (next.services) servicesRef.current?.focus();
    else if (next.area) areaRef.current?.focus();
    else if (next.address) addressRef.current?.focus();
    else if (next.time) timeSectionRef.current?.focus();
    else if (next.name) nameRef.current?.focus();
    else if (next.phone) phoneRef.current?.focus();
    return Object.keys(next).length === 0;
  }, [selected, time, name, phone, location, cityId, address, areas]);

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;
    setFormError(null);
    if (!validate() || !time) return;

    sendingRef.current = true;
    setSending(true);
    // The booking also goes to the store's WhatsApp. Open the tab now, while the click still
    // allows pop-ups, and point it at WhatsApp only once the store has saved the booking
    // (like the Basic WhatsApp order in Cart.tsx). Any refusal closes it.
    let win: Window | null = null;
    try {
      win = window.open("", "_blank");
    } catch {
      win = null;
    }
    const closeWin = () => {
      try {
        win?.close();
      } catch {
        // already gone
      }
    };
    try {
      const { booking, whatsapp } = await createBooking(getApiUrl(), {
        service_ids: selected,
        branch_id: effectiveBranch,
        date,
        time,
        customer_name: name.trim(),
        customer_phone: normalizePhone(phone),
        notes: notes.trim() || undefined,
        ...locationPayload({ location, cityId, address }),
        website,
      });
      saveMyBooking({ ...booking, whatsapp_url: whatsapp?.url ?? null });
      let opened = false;
      if (win && whatsapp) {
        try {
          win.opener = null;
          win.location.href = whatsapp.url;
          opened = true;
        } catch {
          opened = false;
        }
      }
      if (!opened) closeWin();
      // No WhatsApp tab (blocked or no link): the booking page shows the "send on WhatsApp" button first.
      window.location.assign(`/booking/${booking.token}${opened ? "" : "?wa=1"}`);
      return; // keep the button disabled while the next page loads
    } catch (error) {
      closeWin(); // never WhatsApp on 409 / 422 / 429 / network errors
      const e = error instanceof BookingApiError ? error : null;
      if (e?.kind === "slot_taken") {
        setTime(null);
        setSuggested(e.nextFree);
        setFormError(t.errSlotTaken);
        setSlotsKey((k) => k + 1);
        timeSectionRef.current?.focus();
      } else if (e?.kind === "off") {
        setFormError(t.errOff);
      } else {
        setFormError(e?.message ?? t.errUnknown);
      }
    }
    sendingRef.current = false;
    setSending(false);
  };

  // Times to show: the day's free times; after a 409 the suggested ones are marked.
  const { morning, evening } = splitByPeriod(slots.data);
  const slotsMessage = !ready
    ? t.pickServicesFirst
    : slots.state === "loading"
      ? t.loadingTimes
      : slots.state === "error"
        ? slots.message
        : slots.state === "done" && slots.data.length === 0
          ? t.noTimes
          : "";

  const timeChip = (value: string) => (
    <label key={value} className={`ct-bk-choice ct-bk-time${suggested.includes(value) ? " ct-bk-time--hint" : ""}`}>
      <input
        className="ct-bk-sr"
        type="radio"
        name="time"
        value={value}
        checked={time === value}
        disabled={slots.state === "loading"}
        onChange={() => {
          setTime(value);
          setErrors((e) => ({ ...e, time: undefined }));
          setFormError(null);
        }}
      />
      <span>{formatTime12(value)}</span>
    </label>
  );

  let step = 0;
  const stepNo = () => <span className="ct-bk-step" aria-hidden="true">{++step}</span>;
  const selectedDay = days.find((d) => d.date === date);

  return (
    <form className="ct-bk-layout" onSubmit={submit} noValidate aria-busy={sending}>
      <div>
        <h1 className="ct-bk-title">{t.bookTitle}</h1>
        {mine.length > 0 && (
          <nav className="ct-bk-hint" aria-label={t.myBookings}>
            {t.myBookings}:{" "}
            {mine.map((b, i) => (
              <span key={b.token}>
                {i > 0 && " · "}
                <a href={`/booking/${b.token}`} className="underline">
                  {formatAppointmentWhen(b.starts_at)}
                </a>
              </span>
            ))}
          </nav>
        )}

        {/* Services */}
        <fieldset className="ct-bk-card ct-bk-section" ref={servicesRef} tabIndex={-1} aria-describedby="bk-services-hint">
          <legend className="ct-bk-sr">{t.stepServices}</legend>
          <p className="ct-bk-h2" aria-hidden="true">{stepNo()}{t.stepServices}</p>
          <p className="ct-bk-hint" id="bk-services-hint">{t.stepServicesHint}</p>
          {groups.map((g) => (
            <div key={g.id ?? "other"} className="mb-3 last:mb-0">
              {g.name && groups.length > 1 && <p className="ct-bk-period">{g.name}</p>}
              <div className="ct-bk-list ct-bk-list--two">
                {g.services.map((s) => {
                  const price = effectivePrice(s);
                  return (
                    <label key={s.id} className="ct-bk-choice">
                      <input className="ct-bk-sr" type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleService(s.id)} />
                      <span className="ct-bk-tick"><Check /></span>
                      <span className="ct-bk-choice__body">
                        <span className="ct-bk-choice__title">{s.name}</span>
                        <span className="ct-bk-choice__sub">
                          {formatDuration(s.duration_minutes)} · {formatMoney(price)}
                          {price < s.price && (
                            <del className="ms-1">
                              <span className="ct-bk-sr">{t.priceWas}: </span>
                              {formatMoney(s.price)}
                            </del>
                          )}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {errors.services && <p className="ct-bk-error" role="alert">{errors.services}</p>}
        </fieldset>

        {/* Where: in the salon or at home (only when the store offers it for these services) */}
        {askWhere && (
          <fieldset className="ct-bk-card ct-bk-section">
            <legend className="ct-bk-sr">{t.whereTitle}</legend>
            <p className="ct-bk-h2" aria-hidden="true">{stepNo()}{t.whereTitle}</p>
            <div className="ct-bk-list ct-bk-list--two">
              {(["salon", "home"] as const).map((value) => (
                <label key={value} className="ct-bk-choice">
                  <input
                    className="ct-bk-sr"
                    type="radio"
                    name="location"
                    checked={locationPick === value}
                    onChange={() => {
                      setLocationPick(value);
                      setSuggested([]);
                      setErrors((e) => ({ ...e, area: undefined, address: undefined }));
                    }}
                  />
                  <span className="ct-bk-tick ct-bk-tick--round"><Check /></span>
                  <span className="ct-bk-choice__body">
                    <span className="ct-bk-choice__title">{value === "home" ? t.atHome : t.atSalon}</span>
                    <span className="ct-bk-choice__sub">{value === "home" ? t.atHomeHint : t.atSalonHint}</span>
                  </span>
                </label>
              ))}
            </div>
            {location === "home" && (
              <div className="mt-3">
                <div className="ct-bk-field">
                  <label htmlFor="bk-area">{t.area}</label>
                  <select
                    id="bk-area"
                    ref={areaRef}
                    className="ct-bk-select"
                    value={cityId ?? ""}
                    aria-invalid={errors.area ? true : undefined}
                    aria-describedby={errors.area ? "bk-area-err" : undefined}
                    onChange={(e) => {
                      setCityId(e.target.value ? Number(e.target.value) : null);
                      setErrors((x) => ({ ...x, area: undefined }));
                    }}
                  >
                    <option value="">{t.areaPick}</option>
                    {areas.map((a) => (
                      <option key={a.city_id} value={a.city_id}>
                        {a.name} — {t.homeFee}: {a.fee > 0 ? formatMoney(a.fee) : t.free}
                      </option>
                    ))}
                  </select>
                  {errors.area && <p className="ct-bk-error" id="bk-area-err">{errors.area}</p>}
                </div>
                <div className="ct-bk-field">
                  <label htmlFor="bk-address">{t.address}</label>
                  <textarea
                    id="bk-address"
                    ref={addressRef}
                    rows={2}
                    maxLength={MAX_ADDRESS_LENGTH}
                    autoComplete="street-address"
                    placeholder={t.addressPlaceholder}
                    value={address}
                    aria-invalid={errors.address ? true : undefined}
                    aria-describedby={errors.address ? "bk-address-err" : undefined}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors((x) => ({ ...x, address: undefined }));
                    }}
                  />
                  {errors.address && <p className="ct-bk-error" id="bk-address-err">{errors.address}</p>}
                </div>
              </div>
            )}
          </fieldset>
        )}

        {/* Branch (only with several) */}
        {askBranch && (
          <fieldset className="ct-bk-card ct-bk-section">
            <legend className="ct-bk-sr">{t.stepBranch}</legend>
            <p className="ct-bk-h2" aria-hidden="true">{stepNo()}{t.stepBranch}</p>
            <div className="ct-bk-list ct-bk-list--two">
              {settings.branches.map((b) => {
                const offered = branches.some((x) => x.id === b.id);
                return (
                  <label key={b.id} className="ct-bk-choice">
                    <input
                      className="ct-bk-sr"
                      type="radio"
                      name="branch"
                      checked={branchId === b.id}
                      disabled={!offered}
                      onChange={() => setBranchId(b.id)}
                    />
                    <span className="ct-bk-tick ct-bk-tick--round"><Check /></span>
                    <span className="ct-bk-choice__body"><span className="ct-bk-choice__title">{b.name}</span></span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Day */}
        <fieldset className="ct-bk-card ct-bk-section">
          <legend className="ct-bk-sr">{t.stepDate}</legend>
          <p className="ct-bk-h2" aria-hidden="true">{stepNo()}{t.stepDate}</p>
          <div className="ct-bk-days" ref={daysRef}>
            {days.map((d) => (
              <DayChip key={d.date} day={d} checked={d.date === date} onPick={pickDay} />
            ))}
          </div>
        </fieldset>

        {/* Time */}
        <fieldset className="ct-bk-card ct-bk-section" ref={timeSectionRef} tabIndex={-1} aria-describedby="bk-slots-status">
          <legend className="ct-bk-sr">{t.stepTime}{selectedDay ? ` — ${selectedDay.dayName} ${selectedDay.day} ${selectedDay.month}` : ""}</legend>
          <p className="ct-bk-h2" aria-hidden="true">
            {stepNo()}{t.stepTime}
            {selectedDay && <span className="ct-bk-hint" style={{ fontWeight: 600 }}> — {selectedDay.dayName} {selectedDay.day} {selectedDay.month}</span>}
          </p>
          <p className="ct-bk-status-line" id="bk-slots-status" aria-live="polite">{slotsMessage}</p>
          {slots.data.length > 0 && (
            <>
              {morning.length > 0 && (
                <>
                  <p className="ct-bk-period">{t.morning}</p>
                  <div className="ct-bk-times">{morning.map(timeChip)}</div>
                </>
              )}
              {evening.length > 0 && (
                <>
                  <p className="ct-bk-period">{t.evening}</p>
                  <div className="ct-bk-times">{evening.map(timeChip)}</div>
                </>
              )}
            </>
          )}
          {errors.time && <p className="ct-bk-error" role="alert">{errors.time}</p>}
        </fieldset>

        {/* Contact */}
        <fieldset className="ct-bk-card ct-bk-section">
          <legend className="ct-bk-sr">{t.stepContact}</legend>
          <p className="ct-bk-h2" aria-hidden="true">{stepNo()}{t.stepContact}</p>
          <div className="ct-bk-field">
            <label htmlFor="bk-name">{t.name}</label>
            <input
              id="bk-name"
              ref={nameRef}
              type="text"
              autoComplete="name"
              maxLength={120}
              value={name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "bk-name-err" : undefined}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((x) => ({ ...x, name: undefined }));
              }}
            />
            {errors.name && <p className="ct-bk-error" id="bk-name-err">{errors.name}</p>}
          </div>
          <div className="ct-bk-field">
            <label htmlFor="bk-phone">{t.phone}</label>
            <input
              id="bk-phone"
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder={t.phonePlaceholder}
              value={phone}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "bk-phone-err" : undefined}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((x) => ({ ...x, phone: undefined }));
              }}
            />
            {errors.phone && <p className="ct-bk-error" id="bk-phone-err">{errors.phone}</p>}
          </div>
          <div className="ct-bk-field">
            <label htmlFor="bk-notes">{t.notes}</label>
            <textarea id="bk-notes" rows={2} maxLength={500} placeholder={t.notesPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {/* Honeypot: hidden from people and screen readers; bots fill it and the server refuses. */}
          <div className="ct-bk-sr" aria-hidden="true">
            <label htmlFor="bk-website">{t.honeypot}</label>
            <input id="bk-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </fieldset>
      </div>

      {/* Summary + confirm: sticky at the bottom on phones, a side column on desktop */}
      <aside className="ct-bk-summary" aria-label={t.summary}>
        <div className="ct-bk-summary__row">
          <span>
            {totals.count > 0 ? t.servicesCount(totals.count) : t.summary}
            {totals.minutes > 0 && <span className="ct-bk-hint"> · {formatDuration(totals.minutes)}</span>}
          </span>
          <span className="ct-bk-summary__total">
            {formatMoney(totals.total + fee)}
            {totals.totalBefore > totals.total && (
              <del className="ct-bk-hint ms-1" style={{ fontWeight: 500 }}>
                <span className="ct-bk-sr">{t.priceWas}: </span>
                {formatMoney(totals.totalBefore + fee)}
              </del>
            )}
          </span>
        </div>
        {totals.count > 0 && (
          <ul className="ct-bk-summary__list">
            {services
              .filter((s) => selected.includes(s.id))
              .map((s) => (
                <li key={s.id}>
                  <span>{s.name}</span>
                  <span>{formatMoney(effectivePrice(s))}</span>
                </li>
              ))}
          </ul>
        )}
        {location === "home" && cityId !== null && (
          <p className="ct-bk-hint" style={{ margin: "0.25rem 0 0" }}>
            {t.homeVisit} · {t.homeFee}: {fee > 0 ? formatMoney(fee) : t.free}
          </p>
        )}
        {time && selectedDay && (
          <p className="ct-bk-hint" style={{ margin: "0.25rem 0 0" }}>
            {selectedDay.dayName} {selectedDay.day} {selectedDay.month} · {formatTime12(time)}
          </p>
        )}
        <p className="ct-bk-summary__note">{t.assignNote} {t.totalNote}</p>
        <div aria-live="assertive">{formError && <p className="ct-bk-alert" role="alert">{formError}</p>}</div>
        <button type="submit" className="ct-bk-btn ct-bk-btn--block" disabled={sending} aria-disabled={sending}>
          {sending ? t.sending : t.confirm}
        </button>
      </aside>
    </form>
  );
}

function DayChip({ day, checked, onPick }: { day: StripDay; checked: boolean; onPick: (d: StripDay) => void }) {
  return (
    <>
      {day.weekStart && <span className="ct-bk-week" aria-hidden="true">{day.week === 1 ? t.nextWeek : ""}</span>}
      <label className="ct-bk-choice ct-bk-day">
        <input className="ct-bk-sr" type="radio" name="date" value={day.date} checked={checked} onChange={() => onPick(day)} />
        <span className="ct-bk-day__label">{day.label}</span>
        <span className="ct-bk-day__num">{day.day}</span>
        <span className="ct-bk-day__month">{day.month}</span>
        <span className="ct-bk-sr">{day.label !== day.dayName ? day.dayName : ""}</span>
      </label>
    </>
  );
}
