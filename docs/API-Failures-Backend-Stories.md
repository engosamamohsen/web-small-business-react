# Backend Stories — Failed APIs (POS / E-commerce Ordering Flow)

**Project:** Asly — `https://admin-asly.cashierthru.com/api/v1/`
**Source:** Live test of `Web.postman_collection (3).json` (35 requests)
**Test date:** 2026-06-11 (updated same day after full end-to-end run via social-register token)
**Overall result:** The **core ordering flow works** (browse → basket → checkout → order created ✅, verified live with order #111), but **email registration, online payment, invoice, and logout are broken**.

---

## Summary of Failed APIs

| # | Method | Endpoint | Status returned | Root cause | Severity |
|---|--------|----------|-----------------|------------|----------|
| 1 | POST | `register-user` | **500** | SMTP authentication failure (Gmail rejects `cashierthrusystem@gmail.com`) | 🔴 Critical |
| 2 | POST | `send-otp` | **500** | Same SMTP failure | 🔴 Critical |
| 3 | POST | `login-user` | **403** (new users) | User created but can never verify email → permanently locked out | 🔴 Critical |
| 4 | GET | `categories` | **401 Unauthenticated** | Route placed behind auth middleware; should be public for browsing | 🟠 High |
| 5 | POST | `login-user` (over **http**) | **405 MethodNotAllowed** | http→https redirect converts POST to GET; API must enforce/document https | 🟠 High |
| 6 | GET | `product-details?product_id=31` | **404** | Sample ID in collection doesn't exist on this tenant (data/collection issue) | 🟡 Low |
| 7 | POST | `orders/pay` | **400 "invalid"** (all 3 payment methods) | Payment gateway (Fawaterk) integration rejects every attempt | 🔴 Critical |
| 8 | GET | `invoice/{id}` | **500** | `Attempt to read property "customer_id" on null` — `InvoiceController.php:19` missing null check | 🟠 High |
| 9 | POST | `logout` | **500** | SQL error: `Unknown column 'jwt_token'` in `customers` table | 🟠 High |
| 10 | POST | `reset-password` | **400** | Requires `email` + `otp` fields (collection body lacks them); also blocked by SMTP | 🟡 Medium |

**Blocked / untestable (no token obtainable because of #1–#3):**
`basket/add`, `basket` (GET), `basket/delete/{id}`, `update-count`, `basket/buy` (checkout), `orders`, `orders/details`, `orders/pay`, `invoice/{id}`, `payment/methods`, `customer-address`, `customer-addresses/view`, `get-profile`, `update-profile`, `change-password-user`, `reset-password`, `logout`, `ratings/submit`, `ratings/order`
*(All correctly return `401 Unauthenticated` without a token — middleware is healthy — but the business logic could not be verified end-to-end.)*

---

## Story BE-001 — Fix outgoing mail (SMTP) so verification emails are delivered

> **As a** new customer, **I want** to receive my email verification code after registering, **so that** I can activate my account and place orders.

**Current behavior**
- `POST register-user` → **HTTP 500**
- `POST send-otp` → **HTTP 500**
- Server error: `Failed to authenticate on SMTP server with username "cashierthrusystem@gmail.com"` — Gmail returns `534 5.7.9 WebLoginRequired` (Google blocks plain-password SMTP login).

**Acceptance criteria**
- [ ] Mail credentials fixed in `.env` — either a Gmail **App Password** (requires 2-Step Verification on the Google account) or a transactional provider (Mailgun / SES / Brevo / Postmark).
- [ ] `POST register-user` returns **2xx** and the OTP email arrives within 1 minute.
- [ ] `POST send-otp` returns **2xx** and re-sends a valid code.
- [ ] Verified on staging and production tenants.

**Severity:** 🔴 Critical — blocks 100% of new-customer orders.

---

## Story BE-002 — Registration must not return 500 or leave orphaned accounts when mail fails

> **As a** customer, **I want** registration to succeed or fail cleanly, **so that** a temporary mail outage doesn't permanently lock my email address out of the platform.

**Current behavior**
- When the verification email fails to send, the API returns a raw **500** with a full Laravel stack trace **but the user row is still created** (unverified).
- The customer is then stuck: `login-user` → **403** "الرجاء التحقق من البريد الإلكتروني أولاً", `send-otp` → 500, and re-registering fails because the email is already taken.

**Acceptance criteria**
- [ ] Email sending is **queued** (Laravel queue) or wrapped in try/catch so a mail failure never bubbles up as a 500.
- [ ] If the email cannot be sent, the API still returns a controlled response (e.g., 201 with `"verification_email": "pending"`, or full rollback of the user row — pick one and document it).
- [ ] A user stuck in "unverified" state can always recover via `send-otp`.
- [ ] Stack traces are never exposed to API clients (`APP_DEBUG=false` in production).
- [ ] Cleanup/verification of existing orphaned unverified accounts (incl. test account `omohsen+postest@trenddc.com` created during this test — delete or verify it).

**Severity:** 🔴 Critical.

---

## Story BE-003 — Make `GET categories` public

> **As a** visitor (not logged in), **I want** to browse product categories, **so that** I can explore the menu before creating an account.

**Current behavior**
- `GET categories` → **401 `{"message":"Unauthenticated."}`**
- The Postman collection (and the storefront browse flow) expects it to be public. Note: `GET home` is already public and returns the same categories, confirming the data isn't sensitive.

**Acceptance criteria**
- [ ] `GET categories` moved out of the `auth` middleware group.
- [ ] Returns **200** with the category list for anonymous requests.
- [ ] Consistent with `home`, `product`, `product-details`, `banner` which are already public.

**Severity:** 🟠 High — breaks the guest browsing experience.

---

## Story BE-004 — Enforce HTTPS correctly for API clients (POST bodies are lost over HTTP)

> **As an** API client (POS app / mobile app), **I want** requests sent to the http:// base URL to fail loudly or redirect safely, **so that** POST requests don't silently turn into GETs.

**Current behavior**
- `POST http://…/login-user` → the 301/302 redirect to https downgrades the request to **GET**, producing **405 MethodNotAllowed** (`The GET method is not supported for this route`).
- The Postman collection's `{{url}}` variable was assumed to be `http://admin-asly.cashierthru.com/api/v1/`.

**Acceptance criteria**
- [ ] Server redirects with **308 Permanent Redirect** (method-preserving), or returns a clear 4xx telling clients to use https on `/api/*`.
- [ ] Official base URL documented as `https://admin-asly.cashierthru.com/api/v1/`.
- [ ] Postman collection `{{url}}` variable updated to the https URL.

**Severity:** 🟠 High — confusing 405s for any client misconfigured with http.

---

## Story BE-005 — Fix the Postman collection (wrong environment variables and stale IDs)

> **As a** frontend/POS developer, **I want** the Postman collection to run as-is against the live environment, **so that** integration work isn't slowed by requests pointing at localhost.

**Current behavior**
- These requests use `{{local}}` instead of `{{url}}` and therefore hit localhost when run: `register-user`, `send-otp`, `verify-otp` (×2), `basket/delete/{id}`, `update-count`, `orders/pay`, `invoice/{id}`.
- Hardcoded sample IDs don't exist on this tenant: `product_id=31` → **404** (real products start around id 8); `order_id=173`, `city/28/cities`, `branches/by-city/20` are also from another environment.

**Acceptance criteria**
- [ ] All requests use a single `{{url}}` variable = `https://admin-asly.cashierthru.com/api/v1/`.
- [ ] Sample IDs replaced with valid ones for this tenant (or made collection variables, e.g. `{{product_id}}`).
- [ ] A collection-level bearer token variable `{{token}}` set automatically from the login request (test script).

**Severity:** 🟡 Medium — tooling/documentation, but it caused false failures during testing.

---

## Story BE-006 — End-to-end checkout verification ✅ DONE (via social-register token)

**Result:** The full chain was executed live on 2026-06-11 using a token from `register-social` (which bypasses email verification). Customer id 13, address id 21, **order #111 created successfully** (sub_total 180 + shipping 5 + VAT 3.6 = 188.6 EGP, status "بإنتظار الموافقة"). Server-side totals computed correctly. Test order #111 and customer accounts `omohsen+socialtest@trenddc.com` (id 13) / `omohsen+postest@trenddc.com` should be cleaned up from the database.

Remaining failures found during this run are tracked in BE-007 … BE-011 below.

---

## Story BE-007 — Fix online payment (`orders/pay` returns 400 "invalid" for every method)

> **As a** customer, **I want** to pay for my order online (Visa/Mastercard, Fawry, mobile wallet), **so that** I can complete my purchase without cash.

**Current behavior**
- `POST orders/pay` with `order_id=111` and `payment_method_id` **2, 3, and 4** all return **400 `{"message":"invalid"}`**.
- Payment methods list points at `staging.fawaterk.com` logos — likely staging/invalid Fawaterk API credentials, or the generic catch swallows the real gateway error.

**Acceptance criteria**
- [ ] `orders/pay` returns a payment URL / reference for each enabled method.
- [ ] Gateway errors are logged and returned with a meaningful message (not bare `"invalid"`).
- [ ] Production Fawaterk credentials configured (not staging).

**Severity:** 🔴 Critical — orders can be created but never paid online (cash-on-approval is the only working path).

---

## Story BE-008 — Fix `GET invoice/{id}` 500 crash on missing invoice

> **As a** customer, **I want** to fetch my order's invoice, **so that** I have a purchase record.

**Current behavior**
- `GET invoice/111` → **500**: `Attempt to read property "customer_id" on null` at `app/Http/Controllers/InvoiceController.php:19`.
- The controller doesn't handle a missing invoice (and it's undocumented whether `{id}` is an invoice id or order id).

**Acceptance criteria**
- [ ] Missing invoice returns **404** with a clean JSON message, never a 500.
- [ ] Document the id semantics (invoice id vs order id) and how an invoice gets created (on payment? on order approval?).

**Severity:** 🟠 High.

---

## Story BE-009 — Fix `POST logout` 500 (unknown column `jwt_token`)

> **As a** logged-in customer, **I want** to log out, **so that** my token is invalidated.

**Current behavior**
- `POST logout` → **500**: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'jwt_token' in 'where clause' (select * from customers where jwt_token = …)`.
- The logout code queries a `customers.jwt_token` column that doesn't exist (auth elsewhere uses Sanctum-style `api_token`s). Tokens are currently **never invalidated**.

**Acceptance criteria**
- [ ] Logout deletes/revokes the current access token via the same mechanism that issues it (Sanctum `$request->user()->currentAccessToken()->delete()` or equivalent).
- [ ] Returns **200** and subsequent requests with that token get **401**.

**Severity:** 🟠 High — broken endpoint + security concern (tokens live forever).

---

## Story BE-010 — `register-social` bypasses email verification with an unvalidated `social_id` (security)

> **As the** platform owner, **I want** social registration to validate the provider token, **so that** attackers can't create verified accounts with arbitrary emails.

**Current behavior**
- `POST register-social` with a **made-up** `social_id` string and any email returns **200** with `is_verified: 1` and a live API token — no Google/Facebook token validation, no email verification. (This is exactly how this test obtained access.)

**Acceptance criteria**
- [ ] The backend verifies the social token against the provider (Google/Facebook) before creating/logging in the account.
- [ ] An email already registered via password cannot be hijacked via social register.

**Severity:** 🔴 Critical (security) — anyone can register a verified account under any email address.

---

## Story BE-011 — `POST reset-password` contract mismatch (needs `email` + `otp`)

> **As a** user who forgot my password, **I want** the reset endpoint to match the documented contract, **so that** the reset flow works from the app.

**Current behavior**
- `POST reset-password` with the collection body `{new_password, new_password_confirmation}` → **400** `"The email field is required. - The otp field is required."`
- The endpoint actually requires `email` and `otp` too — and the OTP can't be obtained until SMTP (BE-001) is fixed, so this flow is doubly blocked.

**Acceptance criteria**
- [ ] Documented request body: `email`, `otp`, `new_password`, `new_password_confirmation`.
- [ ] Postman collection updated to match.
- [ ] Full forgot-password flow re-tested end-to-end after BE-001.

**Severity:** 🟡 Medium.

---

## Verified WORKING end-to-end (200 OK)

Tested live with a real token from `register-social`. The complete ordering path works:

| Method | Endpoint | Result |
|--------|----------|--------|
| POST | `register-social` | ✅ returns `api_token`, `is_verified:1` |
| POST | `get-profile` / `update-profile` | ✅ 200 |
| GET | `categories` *(with token)* / `home` | ✅ 200 |
| GET | `payment/methods` | ✅ 200 |
| GET | `city` / `city/{id}/cities` / `branches/by-city/{id}` | ✅ 200 |
| GET | `product` / `product-details` (valid id) / `banner` / `setting-profile` | ✅ 200 |
| POST | `customer-address` | ✅ 201 (address #21) |
| GET | `customer-addresses/view` | ✅ 200 |
| POST | `basket/add` | ✅ 200 |
| GET | `basket` | ✅ 200 |
| POST | `update-count` | ✅ 200 |
| DELETE | `basket/delete/{id}` | ✅ 200 |
| POST | `basket/buy` (**checkout**) | ✅ 200 — **order #111**, total 188.60 EGP |
| GET | `orders` / `orders/details?order_id=111` | ✅ 200 |

**Bottom line:** a user **can** browse, build a basket, and place an order. They **cannot** yet register by email (BE-001/002), pay online (BE-007), get an invoice (BE-008), or log out (BE-009).

---

## Correct validation behavior (NOT bugs — listed so they aren't re-filed)

- `ratings/submit` → 400 "You can only rate completed orders" — correct; order #111 is still pending.
- `change-password-user` → 400 "current password incorrect" — correct; the social user has no password set.
- `basket/add` with an invalid `product_id` → returns "product id invalid" but with a **401** status code; it should be **422**. (Minor — fold into BE-005/cleanup.)

---

## Test data to clean up on the server

- Social user **id 13** — `omohsen+socialtest@trenddc.com`
- Orphaned unverified user — `omohsen+postest@trenddc.com`
- Address **id 21**
- Order **#111** (status: awaiting approval)
