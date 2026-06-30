# SEO Go-Live Checklist

Step-by-step to get a store **indexed and ranking** in Google. 🟢 canonical.

> Reality check: ranking **#1 for the store's own name** (e.g. "Talent Store") is
> very achievable once Google has **indexed** the site — brand-name competition is
> low. Ranking for **generic terms** ("online store", "مطعم شاورما") is months of
> content/links/reviews and is never guaranteed. The steps below cover the part
> you control: getting indexed correctly. Indexing is the #1 blocker — until it's
> done, nothing ranks.

---

## 0. Prerequisite — deploy the code

The dynamic sitemap/robots/canonical/structured-data all ship in the app, so the
branch must be deployed first. See [git-deploy-commands.md](git-deploy-commands.md).
Confirm they're live:

```bash
curl -sI https://<store>.cashierthru.com/sitemap.xml | head -1   # → 200
curl -s  https://<store>.cashierthru.com/robots.txt              # → lists the Sitemap line
```

---

## 1. Verify ownership in Google Search Console (DNS — covers ALL stores at once)

Best method for this multi-tenant setup: a **Domain property** for
`cashierthru.com`, verified by **one DNS TXT record** → automatically covers
`roka.*`, `asly.*`, `talent.*`, and every future subdomain.

1. https://search.google.com/search-console → Add property → **Domain** → enter
   `cashierthru.com`.
2. Google shows a TXT record. In **Cloudflare → cashierthru.com → DNS → Add record**:
   - **Type** `TXT` · **Name** `@` · **Content** `google-site-verification=…` · **TTL** Auto
   - Keep any existing `google-site-verification` records — **add**, don't replace.
3. Click **Verify** (Cloudflare propagates in ~1 min).

> The `PUBLIC_GOOGLE_SITE_VERIFICATION` env var is for the *other* (HTML-tag)
> method only — not needed for the DNS/Domain method above.

---

## 2. Submit the sitemap (per store)

In Search Console → **Sitemaps** → submit:

```
https://<store>.cashierthru.com/sitemap.xml
```

Do this for each store you want indexed (`asly`, `talent`, …). The sitemap is
**dynamic** (see the section at the bottom) — submit it once; Google re-fetches
it and picks up new products on its own.

---

## 3. Request indexing for the key pages

Search Console → **URL Inspection** → paste the URL → **Request indexing**. Do the
homepage first, then a few top products:

```
https://<store>.cashierthru.com/
https://<store>.cashierthru.com/product/<id>-<name>
```

This nudges Google to crawl now instead of waiting days.

---

## 4. Google Business Profile (huge for brand + local searches)

If the store has a physical location: https://business.google.com → create the
profile with the **exact store name**, address, phone, hours, website
(`https://<store>.cashierthru.com`). This produces the knowledge panel + map
result that dominates a brand-name search.

---

## 5. On-page essentials (mostly automatic — just verify the data)

The app already injects these from the store's settings; make sure the **admin
settings** are filled correctly:

| Signal | Source | Where in code |
| --- | --- | --- |
| `<title>`, meta description | `settings.name`, `settings.about_us` | `src/pages/index.astro` → `Layout`/`SEO.astro` |
| Canonical / Open Graph (on the store's own domain) | request host | `src/lib/site-origin.ts`, `SEO.astro` |
| Organization + WebSite structured data | `settings.name`, `logo`, `whatsapp_phone` | `src/pages/index.astro` |
| Product structured data | product details | `src/pages/product/[slug].astro` |

➡️ Make sure each store's **name** (e.g. "Talent Store"), **logo**, and **about
us** are set in its admin — that's what shows in the title and search snippet.

> **All of this is driven by the settings API** (`GET v1/setting-profile`),
> resolved **per tenant at request time** (`src/hooks/fetchSettings.tsx`, host →
> admin API via `src/middleware.ts`). So editing a store's name/logo/about in its
> admin updates that store's title, description, Open Graph and Organization
> schema **live — no rebuild**. SEO metadata is as dynamic as the sitemap.

---

## 6. Verify structured data (Rich Results)

The JSON-LD ships from the app — Organization + WebSite on the homepage
(`src/components/StructuredData.astro`), and a Product + store Organization on
each product page (built inline in `src/pages/product/[slug].astro`), fed live
from the settings/product APIs. A malformed or empty schema ships **silently**,
so confirm it's in the live HTML and valid.

```bash
# JSON-LD is present (homepage + a product page):
curl -s https://<store>.cashierthru.com/                    | grep -o 'application/ld+json'
curl -s https://<store>.cashierthru.com/product/<id>-<name> | grep -o 'application/ld+json'
```

Then validate the markup (catches fields Google needs for rich results):

- **Rich Results Test** — https://search.google.com/test/rich-results → paste the
  homepage and a product URL. The product page should report a valid **Product**
  result; the homepage an **Organization** / **WebSite**.
- **Schema Markup Validator** — https://validator.schema.org for full schema.org
  validation (not just Google's rich-result subset).
- Later, Search Console → **Enhancements** reports Product issues across the site.

> The product page's `priceCurrency` is **EGP** and the Open Graph `og:locale`
> is **`ar_EG`** (Arabic — Egypt) — correct for these stores, which serve Egypt
> only. (Was previously `ar_SA` / Saudi Arabia; removed.)
>
> Known gotcha: the `WebSite` schema advertises a `SearchAction` at `/search?q=…`,
> but **that route doesn't exist** in this app — either build it or drop the
> `SearchAction` so the markup doesn't point at a dead path.

---

## 7. Ongoing (for non-brand / generic terms)

- Add inbound links (Facebook/Instagram bios already in settings, partners, directories).
- Keep product names/descriptions descriptive and unique.
- Reviews on the Business Profile.
- Be patient: brand-name #1 usually lands days–weeks after indexing; generic terms take months.

---

## Is the sitemap dynamic? — Yes

`src/pages/sitemap.xml.ts` is a server endpoint (`prerender = false`), **not** a
static file:

- Generated **per request, per tenant**: it reads the requesting host
  (`X-Forwarded-Host`) and emits URLs on that store's own domain.
- Pulls the store's **live catalogue** from its API each time — homepage +
  active categories + **all products** (paged through `v1/product`, up to a 50-page
  safety cap). New products show up automatically — **no rebuild needed**.
- Same per-tenant API layer as everything else: the host resolves to the store's
  admin API (`src/middleware.ts`), and page SEO metadata comes from the **settings
  API** (`v1/setting-profile`) — so the sitemap *and* the titles/descriptions/schema
  all reflect the current backend data without a redeploy.
- Cached for 1 hour at the edge (`Cache-Control: public, max-age=3600`), so it's
  fresh without being regenerated on every hit.
- `robots.txt` (`src/pages/robots.txt.ts`, also dynamic) points Google to it with
  the correct per-store host.

So you submit `https://<store>.cashierthru.com/sitemap.xml` once and it stays
current on its own.

---

## Quick start (the 3 actions that matter most)

1. **Verify** the Cloudflare DNS TXT record → click Verify in Search Console.
2. **Submit** `https://<store>.cashierthru.com/sitemap.xml` + **Request indexing** on the homepage.
3. **Create** a Google Business Profile (if the store has a location).
