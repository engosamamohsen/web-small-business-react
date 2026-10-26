import { describe, expect, it } from "vitest";
import { isLikelyPhone, normalizePhone } from "./phone";
import { readMyBookings, saveMyBooking, MY_BOOKINGS_KEY } from "./my-bookings";
import { bookingWhatsAppLink } from "./whatsapp";

describe("normalizePhone", () => {
  it("turns Arabic-Indic digits to ASCII and drops separators", () => {
    expect(normalizePhone("٠١٠ ١٢٣٤-٥٦٧٨")).toBe("01012345678");
    expect(normalizePhone(" +20 101 234 5678 ")).toBe("+201012345678");
  });
});

describe("isLikelyPhone", () => {
  it("accepts complete Egyptian mobiles", () => {
    for (const p of ["01012345678", "01112345678", "01212345678", "01512345678", "+201012345678", "00201012345678", "٠١٠١٢٣٤٥٦٧٨"]) {
      expect(isLikelyPhone(p), p).toBe(true);
    }
  });

  it("rejects short or wrong Egyptian mobiles", () => {
    for (const p of ["0101234567", "010123456789", "01312345678", "+20131234567", "", "abc"]) {
      expect(isLikelyPhone(p), p).toBe(false);
    }
  });

  it("lets other international numbers through", () => {
    expect(isLikelyPhone("+966501234567")).toBe(true);
  });
});

describe("my bookings", () => {
  const memory = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  };
  const tok = (c: string) => c.repeat(32);

  it("saves newest first without duplicates", () => {
    const store = memory();
    saveMyBooking({ token: tok("a"), starts_at: "2026-11-01T10:00:00+02:00" }, store, 1);
    saveMyBooking({ token: tok("b"), starts_at: "2026-11-02T10:00:00+02:00" }, store, 2);
    saveMyBooking({ token: tok("a"), starts_at: "2026-11-01T10:00:00+02:00" }, store, 3);
    expect(readMyBookings(store).map((b) => b.token)).toEqual([tok("a"), tok("b")]);
  });

  it("ignores bad tokens and broken storage", () => {
    const store = memory();
    saveMyBooking({ token: "nope", starts_at: "x" }, store);
    expect(readMyBookings(store)).toEqual([]);
    store.setItem(MY_BOOKINGS_KEY, "{not json");
    expect(readMyBookings(store)).toEqual([]);
    expect(readMyBookings(null)).toEqual([]);
  });
});

describe("bookingWhatsAppLink", () => {
  it("prefills the date and name", () => {
    const link = bookingWhatsAppLink({ whatsapp_phone: "01093341796" }, { starts_at: "2026-10-31T08:30:00Z", customer_name: "منى" });
    expect(link).toMatch(/^https:\/\/wa\.me\/201093341796\?text=/);
    const text = decodeURIComponent(link!.split("text=")[1]);
    expect(text).toContain("منى");
    expect(text).toContain("السبت 31 أكتوبر 2026، 10:30 ص");
  });

  it("is null without a usable number", () => {
    expect(bookingWhatsAppLink({ whatsapp_phone: "0123456789" }, { starts_at: "2026-10-31T08:30:00Z" })).toBeNull();
    expect(bookingWhatsAppLink(null, { starts_at: "2026-10-31T08:30:00Z" })).toBeNull();
  });
});

describe("saved WhatsApp link", () => {
  it("keeps the link from booking time when the status page saves again", async () => {
    const { findMyBooking } = await import("./my-bookings");
    const data = new Map<string, string>();
    const store = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
    const token = "c".repeat(32);
    saveMyBooking({ token, starts_at: "2026-11-01T10:00:00+02:00", whatsapp_url: "https://api.whatsapp.com/send?phone=1" }, store);
    saveMyBooking({ token, starts_at: "2026-11-01T10:00:00+02:00" }, store);
    expect(findMyBooking(token, store)?.whatsapp_url).toBe("https://api.whatsapp.com/send?phone=1");
    expect(findMyBooking("d".repeat(32), store)).toBeNull();
  });
});
