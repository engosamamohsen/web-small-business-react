# Plus & Basic Cart Order — WhatsApp button + shared order image (Plus also calls `basket/guest-buy`)

> **Status:** ✅ Implemented & verified live.
> Order lib in `src/lib/guest-order.ts`; screenshot helper in
> `src/lib/cart-screenshot.ts`; cart wiring in `src/components/Cart/Cart.tsx`;
> plan detection in `src/lib/subscription.ts` (`isPlusPlan`).
> **Related:** [subscription-modes-task.md](subscription-modes-task.md) (Basic/Plus),
> [product-details-url-and-whatsapp-order.md](product-details-url-and-whatsapp-order.md)
> (WhatsApp order message format),
> [README.md](README.md) (the two "plan" systems).

---

## What changed (latest)

**The order IMAGE is pushed straight into WhatsApp via the Web Share API — and it
NEVER downloads.** Both tiers order via a single green **"اطلب عبر واتساب"**
button. On click, all order details are rendered to a **PNG** and handed to
`navigator.share({ files:[png], text: greeting })`; the customer picks WhatsApp in
the **native share sheet** and the greeting becomes the caption.

> **Hard constraint:** a `wa.me` link can't carry a file, and the share sheet
> can't be pre-pointed at the shop's number — so you can't have BOTH "image
> attached" AND "auto-addressed to the shop number" in one web action. The product
> decision was **image-priority, no download** (the customer selects the shop
> contact themselves in the share sheet).

- **Share caption** = greeting only, e.g. `مرحبا بك فى مطعم عيدو` (from
  `buildWhatsAppGreeting`).
- **Order image** = the off-screen `<OrderReceipt>` element captured to PNG. It
  contains: products **with variations**, qty × unit = line total, per-item note,
  customer **name / phone / full address**, **subtotal**, **VAT**, **total**.
- **Fallback (no download):** when the device can't share a file
  (`navigator.canShare({files})` is false — e.g. desktop Firefox), open a `wa.me`
  **FULL-text order** to the shop number via `buildWhatsAppOrderUrl`.

The tiers differ only in whether a server order is also placed:

| Tier (`current_subscription_plan.name`) | On click |
| --- | --- |
| **Plus** | validate form → **`POST v1/basket/guest-buy`** (real order) → capture + share image (fallback: wa.me text) |
| **Basic** / unknown / missing | capture + share image (fallback: wa.me text) — **NO API call** |

> 📌 History: the order used to be a long **text** message → a *cart screenshot* +
> text → a receipt **image downloaded** + greeting-only wa.me text → now the
> receipt **image shared via Web Share (no download)** with a wa.me text fallback.
> The old `buildWhatsAppGreetingUrl` / `captureAndDownloadElement` are **gone**.
> The guest-buy contract / tax behaviour below are unchanged throughout.

This only applies in **WhatsApp checkout mode**
(`storeConfig.checkoutMode === "whatsapp"`, i.e. the static `basic` store mode).
In `premium` store mode the cart still links to the standard `/shop/checkout`
flow — none of this applies there.

> ⚠️ Two independent "plan" axes — don't conflate them (see
> [README.md](README.md)). **Store mode** `basic`/`premium` (static, in
> `store-config.ts`) decides WhatsApp-vs-API checkout. **Subscription tier**
> `Plus`/`Basic` (dynamic, from `setting-profile`) decides, *within WhatsApp
> mode*, whether the click also places a `guest-buy` order (Plus) or not (Basic).

## Order image — `OrderReceipt.tsx` + `cart-screenshot.ts`

The image is a **dedicated receipt element**, not a screenshot of the cart UI —
so there are no buttons / form inputs / blank cross-origin thumbnails, just the
order data.

- `src/components/Cart/OrderReceipt.tsx` — a `forwardRef` component rendered
  **off-screen** (`position: fixed; inset-inline-start: -10000px`) with the
  current items + customer + totals. Uses **inline styles with hex colors** (no
  Tailwind/oklch, no `<img>`) so the capture renders deterministically. Header =
  the greeting; then items (name, variations, qty×price, note), then `بيانات
  العميل` (Plus only), then subtotal / VAT / total.
- `src/lib/cart-screenshot.ts` → `captureAndShareElement(node, filename, text)`
  renders the element to PNG via **html2canvas** (dynamically imported, lazy) and
  shares it with `shareImageFile()` → `navigator.share`. Helpers:
  `captureElementToFile()` (PNG → `File`), `canShareImageFile()` (capability
  probe), `shareImageFile()` (the share, returns a `ShareResult`). **No download
  path exists.** html2canvas was chosen over `html-to-image`, which aborted on a
  cross-origin font `cssRules` `SecurityError` and on any failed image — see
  [[dom-screenshot-html2canvas]] in memory.

`ShareResult` drives the caller: `"shared"` (handed to the sheet), `"cancelled"`
(user dismissed — `AbortError`), `"unsupported"` (can't share a file →
text fallback), `"failed"` (capture/share error → text fallback).

## Fields collected

Plus tier collects three **required** customer fields on the cart (previously
name + address only) plus an optional order note. All of it renders only when
`isPlusOrder` is true.

| Field | Required | In API request key | In order image |
| --- | --- | --- | --- |
| اسم العميل (name) | ✅ | `full_name` | بيانات العميل → الاسم |
| رقم الهاتف (phone) | ✅ (7–15 digits) | `phone` | بيانات العميل → الهاتف |
| العنوان بالتفصيل (address) | ✅ | `full_address` | بيانات العميل → العنوان |
| ملاحظات الطلب (order notes) | optional | `notes` | (not drawn on the image) |

**Payment method is fixed to cash on delivery** (`payment_method = 1`). There is
**no payment-method selector in the UI** — online payment (`2`) is not enabled
yet (the gateway is broken, see
[API-Failures-Backend-Stories.md](API-Failures-Backend-Stories.md) BE-007). The
`GuestPaymentMethod` type still allows `2` and `extractPaymentUrl()` is kept in
the lib so online can be re-enabled later without rework.

## Fields collected

Plus tier collects three **required** customer fields on the cart (previously
name + address only) plus an optional order note. All of it renders only when
`isPlusOrder` is true.

| Field | Required | Maps to request key |
| --- | --- | --- |
| اسم العميل (name) | ✅ | `full_name` |
| رقم الهاتف (phone) | ✅ (7–15 digits) | `phone` |
| العنوان بالتفصيل (address) | ✅ | `full_address` |
| ملاحظات الطلب (order notes) | optional | `notes` |

**Payment method is fixed to cash on delivery** (`payment_method = 1`). There is
**no payment-method selector in the UI** — online payment (`2`) is not enabled
yet (the gateway is broken, see
[API-Failures-Backend-Stories.md](API-Failures-Backend-Stories.md) BE-007). The
`GuestPaymentMethod` type still allows `2` and `extractPaymentUrl()` is kept in
the lib so online can be re-enabled later without rework.

## Order total — tax (VAT)

The cart's order summary adds **tax** to the total for Plus orders and
recalculates:

```
taxRate   = parseFloat(settings.vat)          // e.g. "2.00" → 2 (a percentage)
tax       = subtotal × taxRate / 100          // rounded to 2 decimals
total     = subtotal + tax                    // service / shipping are 0 for web orders
```

- The rate comes from `setting-profile` → `data.vat` (a percentage string). A
  missing / `0` vat → no tax line shown, total = subtotal.
- This **mirrors what the backend stores on the order**: verified against real
  orders in the RTDB export — `order.tax = sub_total × vat%`,
  `order.total = sub_total + tax` (e.g. order 137: `sub_total 200, tax 4,
  total 204` at vat 2%; order 128: `455 → 9.1 → 464.1`).
- Tax is **only shown for the Plus guest-buy order** (`isPlusOrder`). The Basic
  WhatsApp flow and the premium `/shop/checkout` flow are unchanged.
- **Tax is NOT sent in the request** — the backend computes `tax` / `total`
  itself from the items; the cart figure is a matching display estimate.

## Request contract — `POST v1/basket/guest-buy`

```jsonc
{
  "items": [
    {
      "note": "",
      "product_id": 1,
      "quantity": 1,
      "variations": [            // optional — omitted when the item has none
        { "main_variation_id": 2, "choices": [31] }
      ]
    }
  ],
  "payment_method": 1,           // ALWAYS 1 (cash on delivery) — sent statically
  "full_name": "test",
  "full_address": "...",
  "phone": "01152517142",
  "notes": "..."
}
```

- **`items`** is built from the cart by `buildGuestOrderItems()`. The cart's
  rich variation shape
  (`{ main_variation_id, main_variation_name, choices: [{ id, name, price }] }`)
  is normalized back to the API shape `{ main_variation_id, choices: [id] }` —
  the **same** normalization `hooks/cart/cart.ts` already does for `basket/add`.
  The `variations` key is omitted entirely when the line has no choices.
- The cart is **local** in `basic` store mode, so the items travel in the
  request body (guest order — no server-side basket, no auth/token required).

## Flow — `handleWhatsAppOrder` (`Cart.tsx`, both tiers)

```text
items empty? → return
        │
Plus tier only: validate name + phone (7–15 digits) + address
        │  (invalid → inline errors + toast, nothing happens)
        ▼
isUsableWhatsappNumber(settings)   → false → toast + return  (fail BEFORE ordering)
        ▼
setProcessing(true)
        ├─ Plus tier only: file = await captureElementToFile(receiptRef, order-<ts>.png)
        ├─ Plus tier only: orderResult = submitGuestOrder({ items, payment_method: 1, full_name,
        │                     full_address, phone, notes })   POST v1/basket/guest-buy
        │                     (kept IN FLIGHT — NOT awaited before the share, so the
        │                      network round-trip can't spend the share activation)
        ├─ result = file ? await shareImageFile(file, greeting) : "failed"   ← share while the click is still "fresh"
        ├─ order = await orderResult → rejected? toast error, cart KEPT, STOP
        ├─ trackWhatsAppOrder()        → Firebase counter (fire-and-forget)
        └─ branch on result:
              ├─ "shared"      → finishOrder (clear cart + success toast)
              ├─ "cancelled"   → Plus: finishOrder (order already placed); Basic: KEEP cart + info toast
              └─ "unsupported"/"failed" → buildWhatsAppOrderUrl(items, total, settings, customer) → window.open
                     ├─ opened        → finishOrder (clear cart + success toast)
                     ├─ blocked & Plus → order IS placed → finishOrder anyway
                     └─ blocked & Basic → no order placed → KEEP cart + "allow popups" error
```

- **No download anywhere.** Supported devices share the image; unsupported devices
  get a wa.me **text** order — neither path writes a file.
- **Share BEFORE awaiting the order** (Plus). `navigator.share()` needs transient
  user activation; awaiting the `guest-buy` POST *before* the share spent that
  activation, so the share threw and the image silently fell back to text (the
  "no screenshot" bug). The order request is now **fired before the share but
  kept in flight** (not awaited) so the network round-trip can't cost us the
  activation, then **confirmed after** the share. If the POST rejects, the cart
  is **kept** and an error toast is shown — the image may already be in WhatsApp,
  which the shop still receives. The customer dismissing the share sheet
  (`"cancelled"`) doesn't undo the placed Plus order.
- **Fail fast:** an unusable/placeholder WhatsApp number is rejected *before* a
  Plus order is placed, so we never create an order we can't deliver.
- **Double-submit guard:** `processing` disables the button ("جارٍ تجهيز الطلب...").
- **Payment is always cash** (`payment_method: 1`, no selector). Online (`2`) is
  deferred — gateway broken (BE-007); `extractPaymentUrl()` is kept in the lib for
  later.

## Files

| File | Change |
| --- | --- |
| `src/lib/guest-order.ts` | **New.** `GuestOrderPayload`/`GuestPaymentMethod` types, `buildGuestOrderItems()`, `submitGuestOrder()`, `extractPaymentUrl()`. |
| `src/lib/guest-order.test.ts` | **New.** Item-mapping + variation-normalization + payment-URL tests. |
| `src/lib/cart-screenshot.ts` | **New.** `captureAndShareElement()` / `captureElementToFile()` / `shareImageFile()` / `canShareImageFile()` — html2canvas DOM→PNG → `navigator.share` (Web Share). No download path. |
| `src/components/Cart/OrderReceipt.tsx` | **New.** Off-screen `forwardRef` receipt element (inline styles) captured into the order PNG. |
| `src/lib/whatsapp-order.ts` | **+`buildWhatsAppGreeting()`** (share caption). `buildWhatsAppOrderUrl()` (full text) is the no-share fallback. The old `buildWhatsAppGreetingUrl()` was removed. |
| `src/components/Cart/Cart.tsx` | Both tiers → green WhatsApp button (`handleWhatsAppOrder`): render `<OrderReceipt>` off-screen → `captureElementToFile(receiptRef)` then `shareImageFile(file, greeting)` → share image (fallback: `buildWhatsAppOrderUrl` wa.me text). Plus fires `guest-buy` in flight and shares **before** awaiting it (keeps the `navigator.share` activation), then confirms the order; also shows the name/phone/address/notes form + VAT line. |
| `src/providers/SettingsProvider.tsx` | `SettingsData` gains `shop_type?` (used by the greeting). |
| `package.json` | **+`html2canvas`** dependency. |

## Notes / caveats

- The **floating "تواصل معنا" WhatsApp contact button** on the cart page
  (`src/pages/shop/cart.astro`) is unchanged — it's a support contact link, not
  the order channel.
- **Recipient is chosen by the customer.** Because the image is shared via the
  native sheet, WhatsApp + the contact are picked in the OS — the shop's number
  can't be pre-filled when a file is attached. Only the **text fallback** (wa.me)
  auto-addresses the shop number.
- The share caption and the text fallback both come from the shop name/type; the
  full-text `buildWhatsAppOrderMessage()` (used by the fallback) still carries
  emoji.
- **Known limitation:** the order image draws no product thumbnails (by design —
  avoids cross-origin blanks). All listed fields render correctly.
- **How to verify locally:** the dev tenant (`admin-asly`) *is* Plus. Add an item
  (or seed `localStorage.local_cart_v1`), fill the fields, then to avoid a real
  order + the native share dialog, stub `navigator.share` (capture the `File`) and
  intercept the `basket/guest-buy` XHR before clicking the button. Check:
  share receives `{ files:[image/png], text: greeting }`, **zero downloads**, and
  the cart clears on `"shared"`. The actual delivery into a WhatsApp chat can only
  be confirmed on a **real phone**. (Verified live against `admin-asly`,
  2026-06-23: 85 KB RTL PNG with products+variations, qty, name/phone/address,
  subtotal 1020 / VAT 2% 20.40 / total 1040.40; share got the file + greeting; no
  download; cart cleared.)
