import { describe, expect, it } from "vitest";
import { bookingTotals, effectivePrice, formatDuration, formatMoney, groupByCategory } from "./totals";
import type { BookingService } from "./types";

const svc = (id: number, price: number, sale: number | null, minutes: number, category: number | null = 1): BookingService => ({
  id,
  category_id: category,
  name: `s${id}`,
  description: null,
  price,
  sale_price: sale,
  duration_minutes: minutes,
  branch_ids: [],
});

const services = [svc(1, 200, null, 45), svc(2, 300, 250, 60), svc(3, 100, 0, 15, null)];

describe("effectivePrice", () => {
  it("uses a real sale price only", () => {
    expect(effectivePrice(services[0])).toBe(200);
    expect(effectivePrice(services[1])).toBe(250);
    expect(effectivePrice(services[2])).toBe(100); // 0 is "no sale"
    expect(effectivePrice({ price: 100, sale_price: 150 })).toBe(100); // a "sale" above the price is ignored
  });
});

describe("bookingTotals", () => {
  it("adds prices and durations of the chosen services", () => {
    expect(bookingTotals(services, [1, 2])).toEqual({ count: 2, total: 450, totalBefore: 500, minutes: 105 });
  });

  it("ignores unknown and repeated ids", () => {
    expect(bookingTotals(services, [3, 3, 99])).toEqual({ count: 1, total: 100, totalBefore: 100, minutes: 15 });
    expect(bookingTotals(services, [])).toEqual({ count: 0, total: 0, totalBefore: 0, minutes: 0 });
  });

  it("rounds to piastres", () => {
    expect(bookingTotals([svc(1, 0.1, null, 5), svc(2, 0.2, null, 5)], [1, 2]).total).toBe(0.3);
  });
});

describe("formatting", () => {
  it("formats durations in Arabic", () => {
    expect(formatDuration(45)).toBe("45 دقيقة");
    expect(formatDuration(5)).toBe("5 دقائق");
    expect(formatDuration(60)).toBe("ساعة");
    expect(formatDuration(90)).toBe("ساعة و30 دقيقة");
    expect(formatDuration(120)).toBe("ساعتين");
    expect(formatDuration(135)).toBe("ساعتين و15 دقيقة");
  });

  it("formats money", () => {
    expect(formatMoney(150)).toBe("150 جنيه");
    expect(formatMoney(99.5)).toBe("99.50 جنيه");
  });
});

describe("groupByCategory", () => {
  it("keeps category order, drops empty ones and puts the rest last", () => {
    const groups = groupByCategory(
      [{ id: 2, name: "B" }, { id: 1, name: "A" }, { id: 5, name: "Empty" }],
      [svc(1, 1, null, 1, 1), svc(2, 1, null, 1, 2), svc(3, 1, null, 1, null), svc(4, 1, null, 1, 77)],
    );
    expect(groups.map((g) => [g.name, g.services.map((s) => s.id)])).toEqual([
      ["B", [2]],
      ["A", [1]],
      ["خدمات أخرى", [3, 4]],
    ]);
  });

  it("leaves the only group unnamed when there are no categories", () => {
    const groups = groupByCategory([], [svc(1, 1, null, 1, null)]);
    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe("");
  });
});
