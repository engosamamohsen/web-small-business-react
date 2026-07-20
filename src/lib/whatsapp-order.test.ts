import { describe, it, expect } from "vitest";
import {
  normalizeWhatsappNumber,
  isUsableWhatsappNumber,
  resolveWhatsappNumber,
  buildWhatsAppLink,
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from "./whatsapp-order";
import type { CartItemType } from "@/types/types";

// SECURITY-SENSITIVE: the WhatsApp number must ALWAYS come from the settings API
// (settings.whatsapp_phone, else settings.phone) and NEVER fall back to a
// default/placeholder. The placeholder strings below (e.g. "201234567890") are
// present ONLY to assert that such numbers are REJECTED (the helpers return
// null / false) — they are never a source for a real link. These tests are the
// guardrail for that rule (see docs + project_whatsapp_failclosed memory).

const item = (over: Partial<CartItemType> = {}): CartItemType =>
  ({
    cart_item_id: 1,
    product_id: "9",
    product_name: "شاورما",
    qty: "2",
    unit_price: 100,
    item_total: 200,
    variations: [],
    ...over,
  }) as CartItemType;

describe("normalizeWhatsappNumber", () => {
  it("prepends the country code to a local number", () => {
    expect(normalizeWhatsappNumber("01093341796")).toBe("201093341796");
  });

  it("passes an already-international number through", () => {
    expect(normalizeWhatsappNumber("201093341796")).toBe("201093341796");
  });

  it("strips a 00 international prefix", () => {
    expect(normalizeWhatsappNumber("00201093341796")).toBe("201093341796");
  });

  it("returns null for empty / nullish", () => {
    expect(normalizeWhatsappNumber("")).toBeNull();
    expect(normalizeWhatsappNumber(null)).toBeNull();
  });
});

describe("isUsableWhatsappNumber (fail closed)", () => {
  it("accepts a real number", () => {
    expect(isUsableWhatsappNumber("01093341796")).toBe(true);
  });

  it("REJECTS the placeholder / default numbers", () => {
    expect(isUsableWhatsappNumber("201234567890")).toBe(false); // storeConfig fallback
    expect(isUsableWhatsappNumber("0123456789")).toBe(false);
  });

  it("rejects empty / nullish", () => {
    expect(isUsableWhatsappNumber(null)).toBe(false);
    expect(isUsableWhatsappNumber("")).toBe(false);
  });

  // A local number gets "20" prepended, which pads a truncated one back into the
  // 10–15 E.164 bounds — so it must be checked at its national length instead.
  it("REJECTS a local number that isn't the full national length", () => {
    // admin-asly's saved contact number: 10 digits, one short of a mobile.
    // Normalizes to the 11-digit "20123653214", which would otherwise pass.
    expect(isUsableWhatsappNumber("0123653214")).toBe(false);
    expect(isUsableWhatsappNumber("010933417960")).toBe(false); // one too many
  });

  it("still accepts full-length local and already-international numbers", () => {
    expect(isUsableWhatsappNumber("01093341796")).toBe(true);
    expect(isUsableWhatsappNumber("00201093341796")).toBe(true);
    expect(isUsableWhatsappNumber("201093341796")).toBe(true);
    // non-Egyptian, already international — keeps the generic E.164 bounds
    expect(isUsableWhatsappNumber("441234567891")).toBe(true);
  });
});

describe("resolveWhatsappNumber (whatsapp_phone → phone fallback)", () => {
  it("prefers whatsapp_phone when it is usable", () => {
    expect(
      resolveWhatsappNumber({ whatsapp_phone: "01093341796", phone: "01112124464" }),
    ).toBe("01093341796");
  });

  it("falls back to phone when whatsapp_phone is missing / empty", () => {
    expect(resolveWhatsappNumber({ phone: "01112124464" })).toBe("01112124464");
    expect(resolveWhatsappNumber({ whatsapp_phone: "", phone: "01112124464" })).toBe(
      "01112124464",
    );
    expect(
      resolveWhatsappNumber({ whatsapp_phone: null, phone: "01112124464" }),
    ).toBe("01112124464");
  });

  it("falls back to phone when whatsapp_phone is a placeholder", () => {
    expect(
      resolveWhatsappNumber({ whatsapp_phone: "201234567890", phone: "01112124464" }),
    ).toBe("01112124464");
  });

  it("stays fail-closed when NEITHER number is real", () => {
    expect(resolveWhatsappNumber({})).toBeNull();
    expect(resolveWhatsappNumber(null)).toBeNull();
    // a placeholder phone is not a usable fallback
    expect(
      resolveWhatsappNumber({ whatsapp_phone: "201234567890", phone: "0123456789" }),
    ).toBeNull();
  });

  // Real admin-asly settings: no WhatsApp number, and a contact phone that is
  // one digit short of a mobile → the storefront must keep hiding the button.
  it("does NOT fall back to a truncated local phone (admin-asly)", () => {
    expect(
      resolveWhatsappNumber({ whatsapp_phone: null, phone: "0123653214" }),
    ).toBeNull();
  });
});

describe("buildWhatsAppLink", () => {
  it("builds a wa.me link from a real number", () => {
    expect(buildWhatsAppLink("01093341796")).toBe("https://wa.me/201093341796");
  });

  it("returns null for a placeholder / missing number (never link to a fake line)", () => {
    expect(buildWhatsAppLink("201234567890")).toBeNull();
    expect(buildWhatsAppLink(null)).toBeNull();
  });
});

describe("buildWhatsAppOrderMessage", () => {
  it("renders the friendly, sectioned layout", () => {
    const msg = buildWhatsAppOrderMessage([item()], 200, "عيدو", "restaurant");
    expect(msg).toContain("🧾 *تفاصيل الطلب*");
    expect(msg).toContain("1. *شاورما*");
    expect(msg).toContain("🔢 الكمية: 2 × 100 = 200 ج.م");
    expect(msg).toContain("💰 *الإجمالي: 200 ج.م*");
  });

  it("includes the customer block only when provided (Plus plan)", () => {
    const withCustomer = buildWhatsAppOrderMessage([item()], 200, "عيدو", "restaurant", {
      name: "اسامة محسن",
      address: "8 على الليثى",
    });
    expect(withCustomer).toContain("👤 *بيانات العميل*");
    expect(withCustomer).toContain("الاسم: اسامة محسن");
    expect(withCustomer).toContain("📍 العنوان: 8 على الليثى");

    const withoutCustomer = buildWhatsAppOrderMessage([item()], 200, "عيدو", "restaurant");
    expect(withoutCustomer).not.toContain("👤 *بيانات العميل*");
  });

  it("lists variation choices with price add-ons", () => {
    const msg = buildWhatsAppOrderMessage(
      [
        item({
          variations: [
            {
              main_variation_id: "1",
              main_variation_name: "الصوص",
              choices: [{ id: "a", name: "ثومية", price: 10 }],
            },
          ] as unknown as CartItemType["variations"],
        }),
      ],
      210,
      "عيدو",
      "restaurant",
    );
    expect(msg).toContain("◾ الصوص: ثومية (+10)");
  });
});

describe("buildWhatsAppOrderUrl (number only from settings API)", () => {
  const settings = { whatsapp_phone: "01093341796", name: "عيدو", shop_type: "restaurant" };

  it("builds a wa.me order URL with an encoded message from the settings number", () => {
    const url = buildWhatsAppOrderUrl([item()], 200, settings);
    expect(url).toBeTypeOf("string");
    expect(url!.startsWith("https://wa.me/201093341796?text=")).toBe(true);
    expect(decodeURIComponent(url!)).toContain("الإجمالي: 200 ج.م");
  });

  it("returns null when the cart is empty", () => {
    expect(buildWhatsAppOrderUrl([], 0, settings)).toBeNull();
  });

  it("returns null when the settings number is a placeholder (never order to a fake line)", () => {
    expect(buildWhatsAppOrderUrl([item()], 200, { whatsapp_phone: "201234567890" })).toBeNull();
  });

  it("returns null when settings has no number at all", () => {
    expect(buildWhatsAppOrderUrl([item()], 200, {})).toBeNull();
    expect(buildWhatsAppOrderUrl([item()], 200, null)).toBeNull();
  });

  it("orders to settings.phone when whatsapp_phone is missing / a placeholder", () => {
    const noWhatsapp = buildWhatsAppOrderUrl([item()], 200, {
      phone: "01112124464",
      name: "عيدو",
      shop_type: "restaurant",
    });
    expect(noWhatsapp!.startsWith("https://wa.me/201112124464?text=")).toBe(true);

    const placeholderWhatsapp = buildWhatsAppOrderUrl([item()], 200, {
      whatsapp_phone: "201234567890",
      phone: "01112124464",
    });
    expect(placeholderWhatsapp!.startsWith("https://wa.me/201112124464?text=")).toBe(true);
  });

  it("still returns null when BOTH numbers are placeholders / missing", () => {
    expect(
      buildWhatsAppOrderUrl([item()], 200, {
        whatsapp_phone: "201234567890",
        phone: "0123456789",
      }),
    ).toBeNull();
  });
});
