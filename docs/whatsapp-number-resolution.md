# WhatsApp Number Resolution — `whatsapp_phone` → `phone`, fail-closed

> **Status:** ✅ Implemented. 🟢 canonical.
> **Code:** `resolveWhatsappNumber()` / `isUsableWhatsappNumber()` /
> `normalizeWhatsappNumber()` in `src/lib/whatsapp-order.ts`.
> **Related:** [product-details-url-and-whatsapp-order.md](product-details-url-and-whatsapp-order.md)
> (the order message format), [free-trial-plan.md](free-trial-plan.md).

---

## The rule

Every `wa.me` link on the site — the floating contact button, the product-page
contact link, the cart's order button, and the Organization JSON-LD contact
point — resolves its number through **one** helper:

```
resolveWhatsappNumber(settings)
  = settings.whatsapp_phone   if usable
  = settings.phone            if usable   ← many shops fill only this one
  = null                      otherwise   ← fail closed
```

`null` means **hide the affordance** — no button, no link, no `contactPoint` in
structured data. Never substitute a default.

### `isUsableWhatsappNumber(phone)`

A number is usable only when **all** hold:

1. It has digits after stripping formatting.
2. It is **not** a known placeholder: `storeConfig.fallbackWhatsappNumber`
   (`201234567890`), `0123456789`, `01234567890`, `1234567890`, `00000000000`.
3. If it starts with `0` (a local number) it is **exactly 11 digits** — a full
   Egyptian mobile (`01X` + 8). A short local number fails closed.
4. After normalization (`0…` → `20…`) it is **10–15 digits** (E.164 bounds).

## Why fail closed

The WhatsApp number is **security-sensitive**: a fake, default or truncated
number silently routes a real customer's order to **whoever actually owns that
line**. A hidden button is a fixable configuration problem; a delivered order to
a stranger is not. So:

- ❌ Never fall back to a hardcoded/default number.
- ❌ Never link to a number that failed validation.
- ✅ Hide the button and show «الطلب عبر واتساب غير متاح حالياً» in the cart.

`storeConfig.fallbackWhatsappNumber` exists **only** as a placeholder to detect
and reject — it is never dialled.

## Known gotcha — a store whose `phone` is too short

Tenant `darsh` returns:

```jsonc
{ "phone": "0123653214", "whatsapp_phone": null }
```

`whatsapp_phone` is null, so the fallback kicks in — but `0123653214` is **10
digits**, one short of an Egyptian mobile, so rule 3 rejects it and the
storefront correctly shows **no WhatsApp button at all**.

> This is **not** a frontend bug and must not be "fixed" by relaxing the length
> check. The store has to enter a real 11-digit number in admin; the fallback
> then lights up with **no code change**. Locked in by
> `src/lib/whatsapp-order.test.ts` ("does NOT fall back to a truncated local
> phone").

## Callers — all go through the helper

| Where | File |
| --- | --- |
| Floating contact button (home, product, cart, checkout, orders, profile, order detail) | `src/pages/**.astro` → `buildWhatsAppLink(resolveWhatsappNumber(settingsData))` |
| Product detail page | `src/components/products/DetailPage.tsx` |
| Cart order button + order send | `src/components/Cart/Cart.tsx`, `src/lib/whatsapp-order.ts` (`buildWhatsAppOrderUrl`) |
| Organization JSON-LD `contactPoint` | `src/lib/seo.ts` |

> `src/lib/seo.ts` used to read `settings.whatsapp_phone` **raw** — it therefore
> missed the `phone` fallback *and* could publish a placeholder number as
> structured data. Fixed 2026-07-20 to use `resolveWhatsappNumber()` like
> everything else.

**When adding a new WhatsApp entry point, never read `settings.whatsapp_phone`
directly.** Use `resolveWhatsappNumber()` (and `buildWhatsAppLink()` for plain
contact links) so the fallback and the fail-closed guards apply everywhere.
