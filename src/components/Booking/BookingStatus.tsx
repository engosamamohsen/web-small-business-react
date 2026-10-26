// /booking/<token> — the customer's booking: status, time (Cairo), staff, services, total,
// cancel (with a confirm dialog) while the store allows it, and WhatsApp to the store.

import { useEffect, useRef, useState } from "react";
import { getApiUrl } from "@/lib/config";
import { BookingApiError, cancelBooking, parseBookingWhatsApp } from "@/lib/booking/api";
import { formatAppointmentWhen, formatClock } from "@/lib/booking/dates";
import { findMyBooking, saveMyBooking } from "@/lib/booking/my-bookings";
import { t } from "@/lib/booking/strings";
import { formatDuration, formatMoney } from "@/lib/booking/totals";
import type { AppointmentView } from "@/lib/booking/types";
import { bookingWhatsAppLink } from "@/lib/booking/whatsapp";
import type { WhatsAppNumberSource } from "@/lib/whatsapp-order";

const STATUS_TEXT: Record<string, string> = {
  pending: t.statusPending,
  confirmed: t.statusConfirmed,
  cancelled: t.statusCancelled,
  completed: t.statusCompleted,
  no_show: t.statusNoShow,
};

export default function BookingStatus({
  initial,
  contact,
  promptWhatsApp = false,
}: {
  initial: AppointmentView;
  contact: WhatsAppNumberSource | null;
  /** ?wa=1: WhatsApp didn't open after booking, so the button is pointed out. */
  promptWhatsApp?: boolean;
}) {
  const [booking, setBooking] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // The booking message the API built (saved on this device at booking time); until it is
  // read, and on other devices, a plain wa.me link with a short message.
  const [savedWhatsApp, setSavedWhatsApp] = useState<string | null>(null);
  useEffect(() => {
    setSavedWhatsApp(parseBookingWhatsApp({ url: findMyBooking(initial.token)?.whatsapp_url })?.url ?? null);
  }, [initial.token]);

  // Remember it on this device (convenience only).
  useEffect(() => {
    saveMyBooking(booking);
  }, [booking]);

  const whatsapp = savedWhatsApp ?? bookingWhatsAppLink(contact, booking);
  const minutes = booking.services.reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0);
  const statusText = STATUS_TEXT[booking.status] ?? booking.status_label ?? booking.status;
  const isHome = booking.location === "home";
  const fee = Number(booking.home_fee) || 0;

  const openDialog = () => {
    setMessage(null);
    const dialog = dialogRef.current;
    if (dialog?.showModal) dialog.showModal();
    else if (window.confirm(t.cancelConfirm)) void doCancel();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    cancelBtnRef.current?.focus();
  };

  const doCancel = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await cancelBooking(getApiUrl(), booking.token);
      setBooking(updated);
      setMessage({ kind: "ok", text: t.cancelled });
    } catch (error) {
      const e = error instanceof BookingApiError ? error : null;
      setMessage({ kind: "error", text: e?.kind === "too_late" ? t.tooLate : e?.message ?? t.errUnknown });
      if (e?.kind === "too_late") setBooking((b) => ({ ...b, can_cancel: false }));
    } finally {
      setBusy(false);
      dialogRef.current?.close();
    }
  };

  return (
    <div className="ct-bk-card">
      <h1 className="ct-bk-title">{t.statusTitle}</h1>
      <p className="mt-2" role="status" aria-live="polite">
        <span className={`ct-bk-badge ct-bk-badge--${booking.status}`}>{statusText}</span>
      </p>
      {booking.status === "pending" && <p className="ct-bk-hint mt-2">{isHome ? t.homePending : t.pendingHint}</p>}

      <dl className="ct-bk-dl">
        <dt>{t.when}</dt>
        <dd>
          {formatAppointmentWhen(booking.starts_at)}
          {booking.ends_at && <span className="ct-bk-hint"> – {formatClock(booking.ends_at)}</span>}
        </dd>
        <dt>{t.place}</dt>
        <dd>
          {isHome ? t.homeVisit : t.atSalon}
          {isHome && booking.address && <span className="ct-bk-choice__sub" style={{ whiteSpace: "pre-line" }}>{booking.address}</span>}
        </dd>
        <dt>{t.staff}</dt>
        <dd>{booking.staff || t.anyStaff}</dd>
        {booking.customer_name && (
          <>
            <dt>{t.customer}</dt>
            <dd>{booking.customer_name}</dd>
          </>
        )}
        {minutes > 0 && (
          <>
            <dt>{t.duration}</dt>
            <dd>{formatDuration(minutes)}</dd>
          </>
        )}
      </dl>

      <h2 className="ct-bk-h2">{t.services}</h2>
      <ul className="ct-bk-lines">
        {booking.services.map((s, i) => (
          <li key={`${s.name}-${i}`}>
            <span>{s.name}</span>
            <span>{formatMoney(s.price)}</span>
          </li>
        ))}
        {isHome && (
          <li>
            <span>{t.homeFee}</span>
            <span>{fee > 0 ? formatMoney(fee) : t.free}</span>
          </li>
        )}
        <li>
          <strong>{t.total}</strong>
          <strong>{formatMoney(booking.total)}</strong>
        </li>
      </ul>

      <div aria-live="polite">
        {message && (
          <p className={message.kind === "error" ? "ct-bk-alert" : "ct-bk-hint mt-3"} role={message.kind === "error" ? "alert" : "status"}>
            {message.text}
          </p>
        )}
      </div>

      {whatsapp && promptWhatsApp && booking.status !== "cancelled" && (
        <p className="ct-bk-hint mt-3" role="status">{t.whatsappHint}</p>
      )}
      <div className="ct-bk-actions">
        {whatsapp && (
          <a className="ct-bk-btn ct-bk-btn--wa" href={whatsapp} target="_blank" rel="noopener noreferrer">
            <i className="pi pi-whatsapp" aria-hidden="true" /> {t.whatsapp}
          </a>
        )}
        {booking.can_cancel && (
          <button ref={cancelBtnRef} type="button" className="ct-bk-btn ct-bk-btn--danger" onClick={openDialog} disabled={busy}>
            {busy ? t.cancelling : t.cancel}
          </button>
        )}
        <a className="ct-bk-btn ct-bk-btn--ghost" href="/book">{t.bookAnother}</a>
      </div>
      <p className="ct-bk-hint mt-3">{t.saved}</p>

      <dialog ref={dialogRef} className="ct-bk-dialog" aria-labelledby="bk-cancel-title" onCancel={() => cancelBtnRef.current?.focus()}>
        <p id="bk-cancel-title" className="ct-bk-h2">{t.cancelConfirm}</p>
        <p className="ct-bk-hint">{formatAppointmentWhen(booking.starts_at)}</p>
        <div className="ct-bk-actions">
          <button type="button" className="ct-bk-btn ct-bk-btn--ghost" onClick={closeDialog} autoFocus>
            {t.cancelNo}
          </button>
          <button type="button" className="ct-bk-btn ct-bk-btn--danger" onClick={doCancel} disabled={busy}>
            {busy ? t.cancelling : t.cancelYes}
          </button>
        </div>
      </dialog>
    </div>
  );
}
