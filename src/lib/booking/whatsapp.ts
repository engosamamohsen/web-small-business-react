// wa.me link to the store about a booking, with a short prefilled message.

import { buildWhatsAppLink, resolveWhatsappNumber, type WhatsAppNumberSource } from "@/lib/whatsapp-order";
import { formatAppointmentWhen } from "./dates";
import { t } from "./strings";

/** null when the store has no usable WhatsApp / phone number. */
export function bookingWhatsAppLink(
  settings: WhatsAppNumberSource | null | undefined,
  booking: { starts_at: string; customer_name?: string | null },
): string | null {
  const link = buildWhatsAppLink(resolveWhatsappNumber(settings));
  if (!link) return null;
  const message = t.whatsappMessage(formatAppointmentWhen(booking.starts_at), (booking.customer_name ?? "").trim());
  return `${link}?text=${encodeURIComponent(message)}`;
}
