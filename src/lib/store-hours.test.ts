import { describe, it, expect } from "vitest";
import { closedText, formatOpening, storeStatus, type StoreHoursSetting } from "./store-hours";

// Times are Cairo wall clock. December: Cairo is UTC+2 (no summer time).
// 2026-12-02 is a Wednesday (weekday 3); Fri = 4 Dec, Sat = 5 Dec.
const cairo = (local: string) => new Date(`${local}+02:00`);

const everyDay = (ranges: { opens: string; closes: string }[], except: number[] = []) =>
  [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, ranges: except.includes(weekday) ? [] : ranges }));

const hours = (over: Partial<StoreHoursSetting> = {}): StoreHoursSetting => ({
  enabled: true,
  timezone: "Africa/Cairo",
  last_order_minutes: 0,
  message: "نحن مغلقون الآن.",
  week: everyDay([{ opens: "10:00", closes: "22:00" }]),
  closures_next_14_days: [],
  ...over,
});

describe("storeStatus", () => {
  it("hours off → always open and accepting", () => {
    const s = storeStatus({ enabled: false }, cairo("2026-12-02T03:00:00"));
    expect(s).toMatchObject({ enabled: false, open: true, accepting: true, closesAt: null, nextOpenAt: null });
    expect(storeStatus(null).accepting).toBe(true);
    expect(storeStatus(undefined).accepting).toBe(true);
  });

  it("open inside a range, closed after it with the next opening tomorrow", () => {
    const open = storeStatus(hours(), cairo("2026-12-02T12:00:00"));
    expect(open).toMatchObject({ open: true, accepting: true });
    expect(open.closesAt).toEqual(cairo("2026-12-02T22:00:00"));

    const closed = storeStatus(hours(), cairo("2026-12-02T23:00:00"));
    expect(closed).toMatchObject({ open: false, accepting: false, closesAt: null });
    expect(closed.nextOpenAt).toEqual(cairo("2026-12-03T10:00:00"));
  });

  it("overnight range runs past midnight (17:00–01:00)", () => {
    const h = hours({ week: everyDay([{ opens: "17:00", closes: "01:00" }]) });
    const s = storeStatus(h, cairo("2026-12-03T00:30:00")); // Thursday 00:30, from Wednesday's range
    expect(s).toMatchObject({ open: true, accepting: true });
    expect(s.closesAt).toEqual(cairo("2026-12-03T01:00:00"));
    expect(storeStatus(h, cairo("2026-12-03T01:00:00")).open).toBe(false);
  });

  it("touching ranges are one opening (Fri 18:00–00:00 + Sat 00:00–02:00)", () => {
    const week = everyDay([], [0, 1, 2, 3, 4, 5, 6]);
    week[5] = { weekday: 5, ranges: [{ opens: "18:00", closes: "00:00" }] };
    week[6] = { weekday: 6, ranges: [{ opens: "00:00", closes: "02:00" }] };
    const h = hours({ week, last_order_minutes: 30 });
    const s = storeStatus(h, cairo("2026-12-04T23:45:00")); // Friday 23:45
    expect(s).toMatchObject({ open: true, accepting: true });
    expect(s.closesAt).toEqual(cairo("2026-12-05T02:00:00"));
  });

  it("00:00–00:00 is open 24 hours", () => {
    const h = hours({ week: everyDay([{ opens: "00:00", closes: "00:00" }]) });
    for (const t of ["00:00:00", "03:00:00", "12:00:00", "23:59:00"]) {
      expect(storeStatus(h, cairo(`2026-12-02T${t}`)).accepting).toBe(true);
    }
  });

  it("a closure cuts time out, and the next opening comes after it", () => {
    const h = hours({
      closures_next_14_days: [
        { starts_at: "2026-12-02T00:00:00+02:00", ends_at: "2026-12-04T00:00:00+02:00", reason: "عطلة" },
      ],
    });
    const s = storeStatus(h, cairo("2026-12-02T12:00:00"));
    expect(s).toMatchObject({ open: false, accepting: false });
    expect(s.nextOpenAt).toEqual(cairo("2026-12-04T10:00:00"));
  });

  it("last-order cut-off: 21:30 accepted, 21:31 refused (close 22:00, 30 min)", () => {
    const h = hours({ last_order_minutes: 30 });
    const at2130 = storeStatus(h, cairo("2026-12-02T21:30:00"));
    expect(at2130).toMatchObject({ open: true, accepting: true, closingSoon: true });

    const at2131 = storeStatus(h, cairo("2026-12-02T21:31:00"));
    expect(at2131).toMatchObject({ open: true, accepting: false });
    expect(at2131.nextOpenAt).toEqual(cairo("2026-12-03T10:00:00"));
  });

  it("closed weekday → next open day (Friday off, Saturday-start week)", () => {
    const h = hours({ week: everyDay([{ opens: "10:00", closes: "14:00" }], [5]) });
    const s = storeStatus(h, cairo("2026-12-03T20:00:00")); // Thursday evening
    expect(s.accepting).toBe(false);
    expect(s.nextOpenAt).toEqual(cairo("2026-12-05T10:00:00")); // Saturday, Friday skipped
    expect(storeStatus(h, cairo("2026-12-04T11:00:00")).open).toBe(false); // Friday
    expect(storeStatus(h, cairo("2026-12-05T11:00:00")).open).toBe(true); // Saturday
  });

  it("works across Cairo summer time (UTC+3)", () => {
    // 2026-07-01 Cairo is UTC+3
    const s = storeStatus(hours(), new Date("2026-07-01T09:30:00+03:00"));
    expect(s.open).toBe(false);
    expect(s.nextOpenAt).toEqual(new Date("2026-07-01T10:00:00+03:00"));
  });
});

describe("formatOpening / closedText", () => {
  const now = cairo("2026-12-02T23:00:00"); // Wednesday

  it("today / tomorrow / weekday in Arabic and English", () => {
    expect(formatOpening(cairo("2026-12-02T23:30:00"), now)).toBe("اليوم الساعة 23:30");
    expect(formatOpening(cairo("2026-12-03T17:00:00"), now)).toBe("غداً الساعة 17:00");
    expect(formatOpening(cairo("2026-12-05T10:00:00"), now)).toBe("يوم السبت 5/12 الساعة 10:00");
    expect(formatOpening(cairo("2026-12-03T17:00:00"), now, "en")).toBe("tomorrow at 17:00");
    expect(formatOpening(cairo("2026-12-05T10:00:00"), now, "en")).toBe("on Saturday 5/12 at 10:00");
  });

  it("closed text = the owner's message + the next opening; empty while accepting", () => {
    const h = hours({ message: "إجازة قصيرة." });
    expect(closedText(h, storeStatus(h, now), now)).toBe("إجازة قصيرة. نفتح غداً الساعة 10:00.");
    const noon = cairo("2026-12-02T12:00:00");
    expect(closedText(h, storeStatus(h, noon), noon)).toBe("");
  });

  it("last orders text while still open", () => {
    const h = hours({ last_order_minutes: 30 });
    const t = cairo("2026-12-02T21:45:00");
    expect(closedText(h, storeStatus(h, t), t, "en")).toBe(
      "We stopped taking orders 30 minutes before closing. We open tomorrow at 10:00.",
    );
  });
});
