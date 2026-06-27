import { describe, it, expect } from "vitest";
import { buildGuestOrderItems, extractPaymentUrl } from "./guest-order";
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
