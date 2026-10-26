import { describe, it, expect } from "vitest";
import { buildGuestOrderItems, closedRefusal, extractPaymentUrl, stockRefusal } from "./guest-order";
import type { CartItemType } from "@/types/types";

// buildGuestOrderItems maps the cart (local or basket-API shape) into the
// basket/guest-buy `items` array used by the Plus-plan Confirm Order flow.

const item = (over: Partial<CartItemType> = {}): CartItemType =>
  ({
    cart_item_id: 1,
    product_id: "9",
    product_name: "شاورما",
    qty: "2",
    unit_price: 100,
    item_total: 200,
    product_note: null,
    variations: [],
    ...over,
  }) as CartItemType;

describe("buildGuestOrderItems", () => {
  it("maps product_id, quantity and note (note defaults to empty string)", () => {
    expect(buildGuestOrderItems([item()])).toEqual([
      { note: "", product_id: 9, quantity: 2 },
    ]);
  });

  it("keeps a product note when present", () => {
    const result = buildGuestOrderItems([
      item({ product_note: "بدون بصل" }),
    ]);
    expect(result[0].note).toBe("بدون بصل");
  });

  it("defaults quantity to 1 for a missing/zero qty", () => {
    expect(buildGuestOrderItems([item({ qty: "" })])[0].quantity).toBe(1);
  });

  it("normalizes the rich variation shape to { main_variation_id, choices:[id] }", () => {
    const result = buildGuestOrderItems([
      item({
        variations: [
          {
            main_variation_id: "2",
            main_variation_name: "الحجم",
            choices: [{ id: 31, name: "كبير", price: 20 }],
          },
        ],
      }),
    ]);
    expect(result[0].variations).toEqual([
      { main_variation_id: 2, choices: [31] },
    ]);
  });

  it("omits the variations key entirely when there are no choices", () => {
    const result = buildGuestOrderItems([item({ variations: [] })]);
    expect(result[0]).not.toHaveProperty("variations");
  });
});

describe("extractPaymentUrl", () => {
  it("finds a top-level payment_url", () => {
    expect(extractPaymentUrl({ payment_url: "https://pay.example/abc" })).toBe(
      "https://pay.example/abc",
    );
  });

  it("finds a nested data.url", () => {
    expect(extractPaymentUrl({ data: { url: "https://pay.example/x" } })).toBe(
      "https://pay.example/x",
    );
  });

  it("ignores non-absolute / non-string values", () => {
    expect(extractPaymentUrl({ payment_url: "/relative" })).toBeNull();
    expect(extractPaymentUrl({ url: 123 })).toBeNull();
    expect(extractPaymentUrl(null)).toBeNull();
    expect(extractPaymentUrl({})).toBeNull();
  });
});

describe("closedRefusal", () => {
  const err = (status: number, data: unknown) => ({ response: { status, data } });

  it("reads a store_closed / last_orders_closed 422", () => {
    const body = {
      status: false,
      error_code: "store_closed",
      message: "نحن مغلقون الآن. نفتح غداً الساعة 10:00.",
      next_open_at: "2026-12-03T10:00:00+02:00",
      closes_at: null,
    };
    expect(closedRefusal(err(422, body))).toEqual({
      code: "store_closed",
      message: body.message,
      nextOpenAt: body.next_open_at,
      closesAt: null,
    });
    expect(closedRefusal(err(422, { ...body, error_code: "last_orders_closed" }))?.code).toBe("last_orders_closed");
  });

  it("ignores other errors (stock 422, other codes, network)", () => {
    const stock = err(422, { unavailable_product_ids: [3], message: "x" });
    expect(closedRefusal(stock)).toBeNull();
    expect(stockRefusal(stock)).not.toBeNull();
    expect(closedRefusal(err(500, { error_code: "store_closed" }))).toBeNull();
    expect(closedRefusal(err(422, { error_code: "other" }))).toBeNull();
    expect(closedRefusal(new Error("network"))).toBeNull();
    expect(closedRefusal(undefined)).toBeNull();
  });

  it("a closed refusal is not mistaken for a stock refusal", () => {
    expect(stockRefusal(err(422, { error_code: "store_closed", message: "m" }))).toBeNull();
  });
});
