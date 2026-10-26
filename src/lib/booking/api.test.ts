import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingApiError, bookingPayload, createBooking, getSlots, isBookingToken, parseBookingError } from "./api";
import { bookingFromSettings } from "./enabled";

describe("parseBookingError", () => {
  it("tells booking_off from an unknown token", () => {
    expect(parseBookingError(404, { status: false, error_code: "booking_off", message: "مقفول" }).kind).toBe("off");
    expect(parseBookingError(404, { message: "Not Found" }).kind).toBe("not_found");
    expect(parseBookingError(404, null).kind).toBe("not_found");
  });

  it("reads next_free from a 409 and drops junk", () => {
    const e = parseBookingError(409, {
      status: false,
      error_code: "slot_taken",
      message: "الميعاد اتحجز",
      next_free: ["10:30", "11:00", 5, "bad", "9:00"],
    });
    expect(e.kind).toBe("slot_taken");
    expect(e.message).toBe("الميعاد اتحجز");
    expect(e.nextFree).toEqual(["10:30", "11:00"]);
  });

  it("handles a 409 without next_free", () => {
    const e = parseBookingError(409, { error_code: "slot_taken" });
    expect(e.nextFree).toEqual([]);
    expect(e.message).toContain("اتحجز");
  });

  it("maps 429, too_late and validation errors", () => {
    expect(parseBookingError(429, { error_code: "too_many", message: "كتير" }).message).toBe("كتير");
    expect(parseBookingError(429, { message: "Too Many Attempts." }).message).toContain("استنى");
    expect(parseBookingError(422, { error_code: "too_late", message: "متأخر" }).kind).toBe("too_late");
    const v = parseBookingError(422, { message: "The given data was invalid.", errors: { customer_phone: ["رقم غلط"] } });
    expect(v.kind).toBe("invalid");
    expect(v.message).toBe("رقم غلط");
    expect(parseBookingError(422, { status: false, message: "مرفوض" }).message).toBe("مرفوض");
  });

  it("hides server error text on 5xx and reports network failures", () => {
    expect(parseBookingError(500, { message: "SQLSTATE…" }).message).not.toContain("SQL");
    expect(parseBookingError(0, null).kind).toBe("network");
  });
});

describe("isBookingToken", () => {
  it("accepts 32 letters and digits only", () => {
    expect(isBookingToken("a".repeat(32))).toBe(true);
    expect(isBookingToken("a".repeat(31))).toBe(false);
    expect(isBookingToken("../" + "a".repeat(29))).toBe(false);
    expect(isBookingToken(null)).toBe(false);
  });
});

describe("bookingFromSettings", () => {
  it("is on only for enabled: true", () => {
    expect(bookingFromSettings({ enabled: true })).toEqual({ enabled: true });
    expect(bookingFromSettings({ enabled: "yes" })).toEqual({ enabled: false });
    expect(bookingFromSettings(undefined)).toEqual({ enabled: false });
  });
});

describe("requests", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends service_ids[] and lang, skipping empty filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: true, data: { date: "2026-11-02", times: ["10:00"] } }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = await getSlots("http://admin-x.localhost:8000/api/", { serviceIds: [1, 2], date: "2026-11-02" });
    expect(result.times).toEqual(["10:00"]);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe("/api/v1/booking/slots");
    expect(url.searchParams.getAll("service_ids[]")).toEqual(["1", "2"]);
    expect(url.searchParams.get("date")).toBe("2026-11-02");
    expect(url.searchParams.has("staff_id")).toBe(false);
    expect(url.searchParams.get("lang")).toBe("ar");
  });

  it("throws a slot_taken error with next_free on 409", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: false, error_code: "slot_taken", message: "اتحجز", next_free: ["12:00"] }), { status: 409 }),
      ),
    );
    const error = await createBooking("http://x/api/", {
      service_ids: [1],
      date: "2026-11-02",
      time: "11:00",
      customer_name: "Mona",
      customer_phone: "01012345678",
      website: "",
    }).catch((e) => e);
    expect(error).toBeInstanceOf(BookingApiError);
    expect(error.kind).toBe("slot_taken");
    expect(error.nextFree).toEqual(["12:00"]);
  });

  it("never sends staff_id: the store assigns the specialist", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, data: { token: "c".repeat(32) } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    // Even if an old caller slips one in, it is dropped.
    const request = {
      service_ids: [1],
      branch_id: 2,
      date: "2026-11-02",
      time: "11:00",
      customer_name: "Mona",
      customer_phone: "01012345678",
      website: "",
      staff_id: 93,
    } as Parameters<typeof createBooking>[1];
    await createBooking("http://x/api/", request);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sent).not.toHaveProperty("staff_id");
    expect(sent).toMatchObject({ service_ids: [1], branch_id: 2, time: "11:00" });
    expect(JSON.parse(bookingPayload(request))).not.toHaveProperty("staff_id");
  });

  it("turns a failed fetch into a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const error = await getSlots("http://x/api/", { serviceIds: [1], date: "2026-11-02" }).catch((e) => e);
    expect(error.kind).toBe("network");
  });
});

describe("booking WhatsApp hand-off", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepts only WhatsApp https links", async () => {
    const { parseBookingWhatsApp } = await import("./api");
    const ok = parseBookingWhatsApp({ number: "201000000000", message: "hi", url: "https://api.whatsapp.com/send?phone=201000000000&text=hi" });
    expect(ok?.url).toContain("api.whatsapp.com/send");
    expect(parseBookingWhatsApp({ url: "https://wa.me/201000000000" })?.url).toBe("https://wa.me/201000000000");
    expect(parseBookingWhatsApp({ url: "javascript:alert(1)" })).toBeNull();
    expect(parseBookingWhatsApp({ url: "https://evil.example/send" })).toBeNull();
    expect(parseBookingWhatsApp({ url: "http://wa.me/1" })).toBeNull();
    expect(parseBookingWhatsApp(null)).toBeNull();
  });

  it("returns the booking and the whatsapp block from a 201", async () => {
    const data = { token: "a".repeat(32), status: "confirmed", starts_at: "2026-10-31T10:00:00+02:00" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: true, data, whatsapp: { number: "2010", message: "m", url: "https://api.whatsapp.com/send?phone=2010&text=m" } }), { status: 201 }),
      ),
    );
    const res = await createBooking("http://x/api/", {
      service_ids: [1], date: "2026-10-31", time: "10:00", customer_name: "M", customer_phone: "01012345678", website: "",
    });
    expect(res.booking.token).toBe(data.token);
    expect(res.whatsapp?.number).toBe("2010");
  });

  it("is null when the 201 has no whatsapp", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, data: { token: "b".repeat(32) }, whatsapp: null }), { status: 201 })));
    const res = await createBooking("http://x/api/", {
      service_ids: [1], date: "2026-10-31", time: "10:00", customer_name: "M", customer_phone: "01012345678", website: "",
    });
    expect(res.whatsapp).toBeNull();
  });
});
