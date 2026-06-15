# Task: Include Product Variations in the WhatsApp Order

> **Status:** ✅ Implemented (2026-06-15) — committed `fce9254` on branch `astro-dev`.
> **Created:** 2026-06-15
> **Related:** [subscription-modes-task.md](subscription-modes-task.md) — defines the
> BASIC-plan WhatsApp ordering flow this fix completes.

---

## Problem

On the product detail page, a customer could select variations (size, color,
extras, toppings…), but the selections never appeared in the WhatsApp order
message (BASIC plan). The chain dropped the data in three places:

1. **`local-cart.ts` → `addLocalCartItem`** stored `variations: []` (hardcoded),
   so the local (WhatsApp) cart discarded every selection on add. *(primary bug)*
2. **`DetailPage.tsx` → `formattedVariations`** kept only choice **IDs**
   (`{ main_variation_id, choices: [id] }`) — no human-readable names/prices to
   display even if they had been stored.
3. **`whatsapp-order.ts` → `buildWhatsAppOrderMessage`** never read
   `item.variations`, so it only printed name / qty / price / note.

## Fix

Carry one **rich, display-ready** shape from selection → cart → WhatsApp, and
normalize back to the API shape at the premium boundary:

```ts
// rich shape (matches CartItemType.variations that Cart.tsx already renders)
{ main_variation_id, main_variation_name, choices: [{ id, name, price }] }
```

| File | Change |
|---|---|
| `src/components/products/DetailPage.tsx` | `formattedVariations` now builds the rich shape (looks up the variation name from `product.variations`, keeps choice name + price) |
| `src/components/products/detail-components/CartActions.tsx` | `FormattedVariation` interface updated to the rich shape |
| `src/lib/cart/local-cart.ts` | `addLocalCartItem` persists `product.variations` instead of `[]` |
| `src/lib/whatsapp-order.ts` | Order message lists each variation by name with its chosen value(s) and any `+price` add-on |
| `src/hooks/cart/cart.ts` | `transformData` normalizes the rich shape back to the basket API's `{ main_variation_id, choices: [id] }` — **premium path unchanged** |
| `src/components/products/detail-components/VariationsSelector.tsx` | Pre-existing working-tree change folded in: required/optional badge |

## Resulting message

```text
1. برجر لحم
   الحجم: كبير (+20)
   الإضافات: جبنة شيدر، بطاطس
   الكمية: 1
   السعر: 140
   ملاحظة: بدون بصل
```

Both required (radio, e.g. الحجم) and optional (checkbox, e.g. الإضافات)
variations are listed clearly by their variation name. The rich shape matches
`CartItemType.variations`, so the cart UI (`Cart.tsx`) shows the selection too —
not just WhatsApp.

## Notes

- `useProductOptions` currently treats checkbox variations as single-select
  (`handleCheckboxChange` replaces rather than accumulates), so each optional
  variation carries one choice today. The message/cart code already handles
  multiple choices per variation, so true multi-select would render
  automatically if enabled later.
- Verify on a real device: add a product with size + extras, open the cart, tap
  "اطلب عبر واتساب", and confirm the message reads correctly in RTL.
