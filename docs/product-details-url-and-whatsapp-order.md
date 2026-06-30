# Product Details URL Structure & WhatsApp Order APIs

Documentation for two related areas of the storefront:

1. **[Product Details URL structure](#1-product-details-url-structure)** — the new SEO‑friendly
   product URL (slug + product name).
2. **[WhatsApp Order — APIs used](#2-whatsapp-order--apis-used)** — every API / endpoint the
   WhatsApp ordering flow depends on.

---

## 1. Product Details URL Structure

### 1.1 Canonical format

```text
/product/{slug}-{seo-name}
```

* `{slug}` — the **API‑provided slug**, which already embeds the product **id** as its trailing
  number (e.g. `ft-shaorma-frakh-9` → id `9`).
* `{seo-name}` — the **slugified product name**, appended **for SEO only**. It never participates
  in product lookup.

#### Examples

| Product slug (from API) | Product name      | Generated URL                                   |
| ----------------------- | ----------------- | ----------------------------------------------- |
| `ft-shaorma-frakh-9`    | `فتة شاورما فراخ` | `/product/ft-shaorma-frakh-9-فتة-شاورما-فراخ`   |
| `chicken-shawarma-9`    | `Chicken Shawarma`| `/product/chicken-shawarma-9-chicken-shawarma`  |

### 1.2 How a URL is built — `buildProductPath()`

File: `src/lib/product-url.ts`

```ts
buildProductPath({ id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" })
// → "/product/ft-shaorma-frakh-9-فتة-شاورما-فراخ"
```

Rules:

* Takes the API slug, appends `-{slugify(name)}`.
* **Idempotent** — an `endsWith` guard prevents the name from being appended twice, so the path can
  never grow on repeated builds.
* Fallbacks: `{id}-{seo-name}` when there is no API slug, or bare `{id}` when there is no name.

All product links across the app already route through this single helper
(`Product.tsx`, `Cart.tsx`, `SearchBar.tsx`, `HeroContent.tsx`, `ButtonAddToCart.tsx`, …), so the
new format propagates everywhere automatically.

### 1.3 The slug generator — `slugify()`

File: `src/utils/utils.ts`

```ts
slugify("فتة شاورما فراخ")          // → "فتة-شاورما-فراخ"
slugify("Chicken Shawarma!! (Spicy)") // → "chicken-shawarma-spicy"
```

* Lower‑cases and trims.
* **Spaces → hyphens** (`\s+` → `-`).
* **Removes unsupported / special characters** while **preserving Arabic (UTF‑8)** — uses the
  Unicode‑aware class `[^\p{L}\p{N}-]+` with the `u` flag (`\p{L}` = any letter incl. Arabic,
  `\p{N}` = any number). The previous `\w`‑based version silently stripped Arabic to an empty string.
* Collapses repeated hyphens and trims leading/trailing hyphens.

### 1.4 Product lookup — `parseProductParam()`

File: `src/lib/product-url.ts`

```ts
parseProductParam("ft-shaorma-frakh-9-فتة-شاورما-فراخ") // → { id: "9", slug: <param> }
parseProductParam("ft-shaorma-frakh-9")                 // → { id: "9", ... }   (old links)
parseProductParam("8")                                  // → { id: "8", ... }
parseProductParam("no-number")                          // → null
```

* **Lookup uses the id only.** The id is extracted as the **last numeric token** in the param.
* Because the appended SEO name carries no digits, the last numeric token is always the id from the
  slug — this keeps **old (name‑less) links working** while tolerating the new name suffix.
* If the name in the URL is **missing, outdated, or wrong**, the page still loads — only the id
  matters.

> ⚠️ **Known caveat:** the format is a flat `{slug}-{name}` concatenation. If a product *name*
> itself ended in digits, the "last numeric token" heuristic could pick the wrong number. This does
> not occur with the current data (Arabic / transliterated names, id only inside the slug). A fully
> unambiguous scheme would put the id first (`/product/{id}/{name}`).

### 1.5 Page logic, canonical URL & redirects

File: `src/pages/product/[slug].astro`

The page already implements canonical handling and redirects — **no per‑request page changes were
needed** beyond the helpers above:

1. `parseProductParam(rawParam)` → extract `id` (404 if none).
2. Fetch product by id: `GET v1/product-details?product_id={id}` (404 if not found).
3. `canonicalPath = buildProductPath(productData)` — built from the **latest** product name, so the
   canonical always reflects the current name.
4. **301 Permanent Redirect** if the requested path ≠ canonical path (old `/product/{slug}` links or
   a stale name redirect to the fresh canonical). Decoded comparison keeps it loop‑safe with Arabic,
   and query params (utm, …) are preserved.
5. Emit `<link rel="canonical">` and `Product` JSON‑LD using the canonical URL.

Legacy route `src/pages/products/[slug].astro` resolves the id and **301‑redirects** to the new
canonical, so previously‑indexed/shared links keep working.

> ⚠️ **Gotcha — redirect target must be percent-encoded.** The canonical path now contains raw
> Arabic (e.g. `…-فتة-شاورما-فراخ`). HTTP `Location` headers (and the `<link rel="canonical">` href)
> must be ASCII, so the redirect target is wrapped in `encodeURI(...)` before being passed to
> `Astro.redirect()`. Passing the raw Arabic path throws
> `TypeError: Cannot convert argument to a ByteString …` → **500** on every product URL that
> triggers a redirect (old `/product/{slug}` links, shared links). `encodeURI` keeps `/` and `-`
> intact and escapes only the non-ASCII characters. Applies to both
> `src/pages/product/[slug].astro` and `src/pages/products/[slug].astro`. The redirect-loop guard
> still compares the **decoded** current path against the raw canonical path, so encoding only the
> redirect target does not reintroduce a loop.

### 1.6 Acceptance criteria → implementation

| Requirement                                            | Where                                            |
| ------------------------------------------------------ | ------------------------------------------------ |
| URLs include the product name                          | `buildProductPath()`                             |
| Arabic **and** English names supported                 | `slugify()` (Unicode `\p{L}\p{N}`)               |
| Spaces converted to hyphens                            | `slugify()`                                      |
| Existing product links keep working                    | `parseProductParam()` (last‑numeric‑token) + legacy 301 |
| Lookup based on the existing slug/id only              | `GET v1/product-details?product_id={id}`         |
| Canonical always reflects the latest name              | `buildProductPath(productData)` in the page      |
| 301 redirect on name change / non‑canonical URL        | `Astro.redirect(canonicalPath, 301)`             |

### 1.7 Files touched

| File                              | Change                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| `src/utils/utils.ts`              | `slugify()` made Unicode‑aware (preserves Arabic).            |
| `src/lib/product-url.ts`          | `buildProductPath()` appends SEO name; `parseProductParam()` extracts id as last numeric token. |
| `src/pages/product/[slug].astro`  | (Unchanged logic) consumes the helpers → canonical + 301.     |

---

## 2. WhatsApp Order — APIs used

> **Plan context:** the active store **mode** is **BASIC** (`CURRENT_PLAN = "basic"` in
> `src/lib/store-config.ts`), where `checkoutMode = "whatsapp"` and the cart lives in
> `localStorage`. The "order" is **not** POSTed to a backend order endpoint — it is delivered to the
> shop as a **`wa.me` deep link** with a pre‑filled message. The APIs below are everything the flow
> reads from or writes to.
>
> ⚠️ **Superseded — the cart no longer sends this text message as the primary path.** Both tiers now
> send the order as a **PNG image shared into WhatsApp via `navigator.share`** (a clean `<OrderReceipt>`
> with products+variations, qty, customer name/phone/address, subtotal/VAT/total); the greeting is the
> caption. **It never downloads.** Plus also POSTs `v1/basket/guest-buy` first; Basic sends no API. The
> sectioned text format documented in §2.3–§2.4 below (`buildWhatsAppOrderMessage`/`buildWhatsAppOrderUrl`)
> is now the **fallback** used only when the device can't share a file (e.g. desktop Firefox).
> Current flow: [plus-plan-guest-order.md](plus-plan-guest-order.md). Tier (`Plus`/`Basic`) is
> independent of store mode (`basic`/`premium`) — see [README.md](README.md). The API inventory below
> still applies (settings, product-details, local cart, firebase counter).

### 2.1 API / endpoint inventory

| # | Method & Endpoint                                   | Purpose in the WhatsApp order flow                                             | Called from                                              |
| - | --------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1 | `GET v1/setting-profile`                            | Source of the **WhatsApp number** (`whatsapp_phone`), **shop name** (`name`) and **shop type** (`shop_type`) used for the wa.me link and greeting. | `src/hooks/fetchSettings.tsx` (`fetchSettings()`)        |
| 2 | `GET v1/product-details?product_id={id}`            | Product data that gets added to the cart before ordering.                      | `src/pages/product/[slug].astro`, `src/services/productService.ts` |
| 3 | **localStorage** `local_cart_v1` (BASIC — no HTTP)  | Holds the cart items/quantities/prices that become the order message. Mirrors `GET v1/basket`'s response shape. | `src/lib/cart/local-cart.ts`                             |
| 4 | `GET https://wa.me/{number}?text={message}`         | **The order channel.** Opens WhatsApp with the pre‑filled order message.        | `src/lib/whatsapp-order.ts` (`buildWhatsAppOrderUrl()`)  |
| 5 | `PUT https://cashier-thru-default-rtdb.firebaseio.com/web_order/{subdomain}/count.json` | Atomically increments the shop's WhatsApp‑order counter (analytics, fire‑and‑forget). | `src/lib/firebase-tracker.ts` (`trackWhatsAppOrder()`)   |

#### PREMIUM‑plan basket APIs (reference)

When `plan = "premium"`, the cart is server‑side (not WhatsApp checkout). These endpoints are **not**
part of the WhatsApp order path but are listed for completeness — `src/hooks/cart/cart.ts`:

| Method & Endpoint                       | Purpose            |
| --------------------------------------- | ------------------ |
| `GET v1/basket`                         | Fetch cart         |
| `POST v1/basket/add`                    | Add item           |
| `POST update-count`                     | Update quantity    |
| `DELETE v1/basket/delete/{cart_item_id}`| Remove item        |

### 2.2 Flow

```text
Product page                Cart (BASIC)                 WhatsApp
────────────                ────────────                 ────────
GET v1/product-details ──▶  add to localStorage cart
GET v1/setting-profile ──▶  whatsapp_phone / name / shop_type
                            │
  user taps "اطلب عبر واتساب"
                            │
                            ├─▶ buildWhatsAppOrderUrl(items, total, settings)
                            │      → https://wa.me/{number}?text={message}
                            │
                            ├─▶ trackWhatsAppOrder()   (Firebase counter, fire‑and‑forget)
                            │
                            └─▶ window.open(url)  ──────────────────▶  WhatsApp chat opens
                                 (cart cleared only AFTER the window opened)
```

### 2.3 WhatsApp helpers — `src/lib/whatsapp-order.ts`

| Function                       | Responsibility                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `normalizeWhatsappNumber()`    | Strips non‑digits and prepends the country code (`"01093341796"` → `"201093341796"`).            |
| `isUsableWhatsappNumber()`     | **Fail‑closed** guard — rejects empty, placeholder/default numbers, and out‑of‑range lengths.    |
| `buildWhatsAppLink()`          | Plain `wa.me` contact link (no message) for the floating "contact us" button; `null` if unusable.|
| `buildWhatsAppOrderMessage()`  | Builds the Arabic order message (greeting + items + variations + qty + price + total).            |
| `buildWhatsAppOrderUrl()`      | Full `wa.me/{number}?text={encoded message}`, or `null` when no usable number / empty cart.      |

> **Security note:** the WhatsApp number is sensitive. The order button is hidden whenever
> `isUsableWhatsappNumber()` is false, so an order can **never** be routed to a fake/default line.
> Only the shop's real number from `v1/setting-profile` is used — `storeConfig.fallbackWhatsappNumber`
> is treated as a placeholder, not a real destination.

### 2.4 Example order message (friendly, sectioned format)

WhatsApp renders `*text*` as **bold**.

> **Note:** the `👤 بيانات العميل` customer block appears for **Plus**-tier orders
> (the cart passes the name + address via the `customer` param). **Basic**-tier
> messages omit it and start at the `🧾 تفاصيل الطلب` section. Both tiers also
> download a cart screenshot to attach — see
> [plus-plan-guest-order.md](plus-plan-guest-order.md).
>
> ⚠️ Emoji caveat: under the Vite **dev** server these emojis were observed
> encoding as `%EF%BF%BD` (U+FFFD) in the wa.me URL even though the source is
> correct — verify in a production build.

```text
مرحبا بك فى مطعم ROKA'S KITCHEN 👋

👤 *بيانات العميل*
الاسم: اسامة محسن
📍 العنوان: 8 على الليثى

🧾 *تفاصيل الطلب*

1. *فتة شاورما فراخ*
   ◾ الحجم: كبير (+20)
   🔢 الكمية: 2 × 100 = 200 ج.م
   📝 ملاحظة: بدون بصل

💰 *الإجمالي: 200 ج.م*

شكراً لطلبكم 🙏
```

### 2.5 Files involved

| File                                | Role                                                            |
| ----------------------------------- | --------------------------------------------------------------- |
| `src/lib/whatsapp-order.ts`         | Number normalization, guards, order message + `wa.me` URL.      |
| `src/components/Cart/Cart.tsx`      | "Order via WhatsApp" button + `handleWhatsAppOrder()`.          |
| `src/hooks/fetchSettings.tsx`       | `GET v1/setting-profile` → number / name / shop type.           |
| `src/lib/cart/local-cart.ts`        | BASIC‑plan localStorage cart (order line items).                |
| `src/lib/firebase-tracker.ts`       | Firebase order counter (`trackWhatsAppOrder()`).               |
| `src/lib/store-config.ts`           | Plan flags (`checkoutMode`, `usesLocalCart`, fallback number).  |
| `src/services/productService.ts`    | `GET v1/product-details` for product data.                      |
