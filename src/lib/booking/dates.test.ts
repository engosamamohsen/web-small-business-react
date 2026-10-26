import { describe, expect, it } from "vitest";
import {
  buildDateStrip,
  formatAppointmentWhen,
  formatClock,
  formatTime12,
  satFirstIndex,
  splitByPeriod,
  zonedToday,
  MAX_STRIP_DAYS,
} from "./dates";

describe("zonedToday", () => {
  it("uses Cairo's calendar day, not UTC's", () => {
    // 2026-10-30 23:30 UTC = 2026-10-31 01:30 in Cairo (UTC+2 in winter, +3 in summer)
    expect(zonedToday(new Date("2026-10-30T23:30:00Z"))).toBe("2026-10-31");
    expect(zonedToday(new Date("2026-10-31T10:00:00Z"))).toBe("2026-10-31");
  });
});

describe("buildDateStrip", () => {
  // Monday 26 Oct 2026, 09:00 Cairo
  const now = new Date("2026-10-26T07:00:00Z");

  it("runs from today to today + max_days_ahead inclusive", () => {
    const strip = buildDateStrip(now, 30);
    expect(strip).toHaveLength(31);
    expect(strip[0].date).toBe("2026-10-26");
    expect(strip[30].date).toBe("2026-11-25");
  });

  it("labels today and tomorrow, then Arabic day names", () => {
    const strip = buildDateStrip(now, 7);
    expect(strip[0].label).toBe("النهارده");
    expect(strip[1].label).toBe("بكرة");
    expect(strip[2].label).toBe("الأربعاء");
    expect(strip[0].dayName).toBe("الاثنين");
    expect(strip[0].month).toBe("أكتوبر");
    expect(strip[6].month).toBe("نوفمبر");
  });

  it("starts weeks on Saturday", () => {
    const strip = buildDateStrip(now, 13);
    const saturday = strip.find((d) => d.date === "2026-10-31")!;
    expect(saturday.weekday).toBe(6);
    expect(saturday.weekStart).toBe(true);
    expect(strip.find((d) => d.date === "2026-10-30")!.week).toBe(0); // Friday ends the week
    expect(saturday.week).toBe(1);
    expect(strip.find((d) => d.date === "2026-11-07")!.week).toBe(2);
    expect(strip[0].weekStart).toBe(false);
  });

  it("does not mark a strip that starts on Saturday as a new week", () => {
    const strip = buildDateStrip(new Date("2026-10-31T08:00:00Z"), 7);
    expect(strip[0].weekday).toBe(6);
    expect(strip[0].weekStart).toBe(false);
    expect(strip[0].week).toBe(0);
    expect(strip[7].weekStart).toBe(true);
    expect(strip[7].week).toBe(1);
  });

  it("uses Cairo's date late at night", () => {
    // Friday 30 Oct 23:30 UTC is already Saturday 31 Oct in Cairo
    const strip = buildDateStrip(new Date("2026-10-30T23:30:00Z"), 1);
    expect(strip[0].date).toBe("2026-10-31");
    expect(strip[0].label).toBe("النهارده");
  });

  it("clamps silly values", () => {
    expect(buildDateStrip(now, -5)).toHaveLength(1);
    expect(buildDateStrip(now, Number.NaN)).toHaveLength(1);
    expect(buildDateStrip(now, 10_000)).toHaveLength(MAX_STRIP_DAYS + 1);
  });

  it("crosses month and year ends", () => {
    const strip = buildDateStrip(new Date("2026-12-30T10:00:00Z"), 3);
    expect(strip.map((d) => d.date)).toEqual(["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"]);
  });
});

describe("satFirstIndex", () => {
  it("puts Saturday first and Friday last", () => {
    expect(satFirstIndex(6)).toBe(0);
    expect(satFirstIndex(0)).toBe(1);
    expect(satFirstIndex(5)).toBe(6);
  });
});

describe("times", () => {
  it("formats 12-hour Arabic times", () => {
    expect(formatTime12("16:30")).toBe("4:30 م");
    expect(formatTime12("09:00")).toBe("9:00 ص");
    expect(formatTime12("12:15")).toBe("12:15 م");
    expect(formatTime12("00:30")).toBe("12:30 ص");
  });

  it("splits morning and evening", () => {
    expect(splitByPeriod(["10:00", "11:45", "12:00", "16:30"])).toEqual({
      morning: ["10:00", "11:45"],
      evening: ["12:00", "16:30"],
    });
  });

  it("shows an instant in Cairo time", () => {
    // 08:30 UTC on Saturday 31 Oct 2026 → 10:30 Cairo (EET, UTC+2)
    expect(formatAppointmentWhen("2026-10-31T08:30:00+00:00")).toBe("السبت 31 أكتوبر 2026، 10:30 ص");
    expect(formatClock("2026-10-31T14:00:00+02:00")).toBe("2:00 م");
    expect(formatAppointmentWhen("nonsense")).toBe("");
  });
});
