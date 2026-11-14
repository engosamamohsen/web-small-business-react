import { describe, expect, it } from "vitest";
import {
    bookingPayload, bookingSchema, dateBounds, emptyBooking, isPhone, normalizeTrackingNo, stepOfField, toDecimal, toE164,
    westernDigits, whatsappShareUrl, newIdempotencyKey,
} from "./booking";
import { carrierStrings } from "./strings";

const ctx = { phonePrefix: "+20", governorates: ["C", "GZ"], categories: ["documents", "clothes"], payers: ["sender", "recipient", "cod"], now: new Date(2026, 10, 8, 10) };

function valid() {
    return {
        ...emptyBooking(),
        sender_name: "Mona Ali", sender_phone: "0101 234 5678", sender_governorate: "C", sender_address: "5 Abbas St",
        recipient_name: "Karim", recipient_phone: "+20 112 233 4455", recipient_governorate: "GZ", recipient_address: "9 Nile St",
        category: "clothes", packages_count: "2", who_pays_shipping: "recipient",
    };
}

describe("phones and numbers (same rules as Laravel's InputNormalizer)", () => {
    it("makes every Egyptian way of writing a mobile the same E.164", () => {
        for (const typed of ["01001234567", "1001234567", "00201001234567", "+20 100 123 4567", "+20 0100 123 4567", "201001234567", "٠١٠٠١٢٣٤٥٦٧", "(010) 0123-4567"]) {
            expect(toE164(typed, "+20")).toBe("+201001234567");
        }
        expect(isPhone("call me", "+20")).toBe(false);
        expect(isPhone("0100", "+20")).toBe(false);
    });

    it("accepts only the country's mobiles when the profile sends a pattern (owner, 2026-11-09)", () => {
        const eg = "^\\+201[0125][0-9]{8}$";
        for (const ok of ["01001234567", "01112345678", "+20 122 345 6789", "٠١٥٥١٢٣٤٥٦٧"]) expect(isPhone(ok, "+20", eg)).toBe(true);
        for (const bad of ["+1 202 555 0143", "+44 7700 900123", "0223456789", "01312345678"]) expect(isPhone(bad, "+20", eg)).toBe(false);
        // No pattern, or a broken one: any E.164 number (Laravel still checks)
        expect(isPhone("+1 202 555 0143", "+20")).toBe(true);
        expect(isPhone("+1 202 555 0143", "+20", "([")).toBe(true);
    });

    it("shows the mobile error on every phone field of the form", () => {
        const t = carrierStrings("en");
        const schema = bookingSchema(t, { ...ctx, mobilePattern: "^\\+201[0125][0-9]{8}$" });
        const result = schema.safeParse({ ...valid(), sender_phone: "+12025550143", recipient_phone2: "0223456789" });
        expect(result.success).toBe(false);
        const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
        expect(paths).toEqual(expect.arrayContaining(["sender_phone", "recipient_phone2"]));
    });

    it("reads one decimal comma but leaves a thousands comma wrong", () => {
        expect(toDecimal("80,5")).toBe("80.5");
        expect(toDecimal("٨٠٫٥")).toBe("80.5");
        expect(toDecimal("1,500")).toBe("1,500");
        expect(westernDigits("۱۲۳")).toBe("123");
    });
});

describe("the booking schema", () => {
    const t = carrierStrings("en");

    it("accepts a full, valid request", () => {
        expect(bookingSchema(t, ctx).safeParse(valid()).success).toBe(true);
    });

    it("puts each mistake on its own field", () => {
        const r = bookingSchema(t, ctx).safeParse({
            ...valid(), sender_name: " ", sender_phone: "call me", recipient_governorate: "ALX", packages_count: "0",
            cod_amount: "1,500", preferred_delivery_date: "2026-11-07", weight_kg: "abc",
        });
        expect(r.success).toBe(false);
        const fields = new Set(r.error!.issues.map((i) => String(i.path[0])));
        for (const f of ["sender_name", "sender_phone", "recipient_governorate", "packages_count", "cod_amount", "preferred_delivery_date", "weight_kg"]) {
            expect(fields.has(f), f).toBe(true);
        }
        expect(r.error!.issues.find((i) => i.path[0] === "recipient_governorate")!.message).toBe(t.errGovernorate);
    });

    it("takes amounts with at most 2 decimals and no exponent, like Laravel", () => {
        for (const bad of ["10.555", "1e5", "+5", "0x1A", "1,500"]) {
            expect(bookingSchema(t, ctx).safeParse({ ...valid(), cod_amount: bad }).success, bad).toBe(false);
        }
        for (const good of ["10.55", "10,5", "0.01", "9999999"]) {
            expect(bookingSchema(t, ctx).safeParse({ ...valid(), cod_amount: good }).success, good).toBe(true);
        }
    });

    it("needs a COD amount when shipping is taken from it", () => {
        const r = bookingSchema(t, ctx).safeParse({ ...valid(), who_pays_shipping: "cod", cod_amount: "" });
        expect(r.success).toBe(false);
        expect(r.error!.issues[0].path).toEqual(["cod_amount"]);
        expect(bookingSchema(t, ctx).safeParse({ ...valid(), who_pays_shipping: "cod", cod_amount: "850,5" }).success).toBe(true);
    });

    it("keeps the preferred date within today and 90 days", () => {
        const { min, max } = dateBounds(ctx.now);
        expect(min).toBe("2026-11-08");
        expect(max).toBe("2027-02-06");
        expect(bookingSchema(t, ctx).safeParse({ ...valid(), preferred_delivery_date: "2027-03-01" }).success).toBe(false);
        expect(bookingSchema(t, ctx).safeParse({ ...valid(), preferred_delivery_date: "2026-11-08" }).success).toBe(true);
    });

    it("speaks the visitor's language", () => {
        const ar = carrierStrings("ar");
        const r = bookingSchema(ar, ctx).safeParse({ ...valid(), sender_phone: "x" });
        expect(r.error!.issues[0].message).toBe(ar.errPhone);
    });
});

describe("what is sent", () => {
    it("sends E.164 phones and dotted decimals, and leaves empty fields out", () => {
        const payload = bookingPayload({ ...valid(), cod_amount: "850,5", weight_kg: "١٫٥", packages_count: "٢" }, "+20");
        expect(payload.sender_phone).toBe("+201012345678");
        expect(payload.recipient_phone).toBe("+201122334455");
        expect(payload.cod_amount).toBe("850.5");
        expect(payload.weight_kg).toBe("1.5");
        expect(payload.packages_count).toBe("2");
        expect("sender_notes" in payload).toBe(false);
    });

    it("maps a server error to its step", () => {
        expect(stepOfField("sender_phone")).toBe(0);
        expect(stepOfField("recipient_phone2")).toBe(1);
        expect(stepOfField("cod_amount")).toBe(2);
        expect(stepOfField("form_token")).toBeNull();
    });

    it("makes keys Laravel accepts", () => {
        expect(newIdempotencyKey()).toMatch(/^[A-Za-z0-9-]{16,64}$/);
        expect(newIdempotencyKey()).not.toBe(newIdempotencyKey());
    });
});

describe("tracking numbers and sharing", () => {
    it("accepts what Laravel accepts and nothing else", () => {
        expect(normalizeTrackingNo(" shl-2611-0001 ")).toBe("SHL-2611-0001");
        expect(normalizeTrackingNo("abc")).toBeNull();
        expect(normalizeTrackingNo("../etc/passwd")).toBeNull();
        expect(normalizeTrackingNo("A".repeat(33))).toBeNull();
        expect(normalizeTrackingNo(null)).toBeNull();
    });

    it("builds a free wa.me link", () => {
        expect(whatsappShareUrl("رقم 1 & 2")).toBe("https://wa.me/?text=" + encodeURIComponent("رقم 1 & 2"));
    });
});
