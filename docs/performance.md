# Storefront performance

Work done on 7 Oct 2026 from `STOREFRONT_PERFORMANCE.md`. It applies to **every store**: the storefront and the image
service are shared, so existing stores get it with the next deploy, nothing to do per store.

## Results (Lighthouse 12, mobile, simulated slow 4G)

Measured locally on production builds of the old and new code, both behind a gzip proxy (what nginx will do once
section "Server" is applied). Local numbers are pessimistic: the local Laravel is a single-threaded `artisan serve`
(TTFB 300–800 ms vs ~250 ms in production).

| Page | | Perf | A11y | Best pr. | SEO | LCP | CLS | FCP | Bytes | JS |
|---|---|---|---|---|---|---|---|---|---|---|
| Home (Classic, nilebakery) | before | 55 | 95 | 96 | 100 | 7.6 s | 0.254 | 3.5 s | 2405 KB | 222 KB |
| | after | **76** | 95 | **100** | 100 | 5.6 s | **0** | 2.3 s | **995 KB** | 188 KB |
| Product page | before | 70 | 87 | 96 | 100 | 5.6 s | 0 | 3.7 s | 557 KB | 235 KB |
| | after | **76** | **94** | **100** | 100 | 5.4 s | 0 | 2.7 s | 500 KB | 231 KB |
| Home (Studio theme, moda) | before | 71 | 94 | 96 | 100 | 5.4 s | 0 | 3.5 s | 1720 KB | 215 KB |
| | after | **80** | **100** | **100** | 100 | 4.5 s | 0.023 | 2.5 s | **874 KB** | 194 KB |

Without gzip (production today) the home page was perf 47, LCP 13.3 s, 3.1 MB: the server step below matters most.

## What changed

**Images (biggest saving):** store images are resized on the server into WebP and the storefront asks for the size
it actually shows.
- Laravel: `GET /img/{width}/image/…jpg.webp` (`ImageResizeController`, widths 64–1600). The first request makes the
  file at that same public path, so after that nginx sends it as a static file and PHP never runs for it again.
- Storefront: `src/lib/responsive-image.ts` builds `src`/`srcset`/`sizes`. The shared `<Image>` uses it everywhere,
  and the theme components, product gallery and meal helper use `storeImageProps`. Only store images
  (`admin-*` host, `/image` or `/uploads`) are rewritten; anything else is left as is.

**First paint**
- The first banner is preloaded with its `srcset` (`Layout.astro` `preloadImage`), and the store's `admin-*` origin is
  preconnected.
- Cairo is self-hosted (`public/fonts/cairo`, `src/styles/fonts.css`) and preloaded: no Google Fonts connections, and
  the text no longer jumps when the font arrives (that was the home page's CLS 0.25).
- Classic's store colours are printed on `<html>` by the server, not only after JavaScript runs.

**CSS:** PrimeReact's theme (224 KB) moved out of every page. Components that use PrimeReact import
`@/styles/primereact-theme`; the header's sign-in dialog loads it on demand (`primereact-theme-lazy.ts`). The home page
CSS went from 306 KB to ~40 KB. The theme is in `@layer primereact`, so the look doesn't change.

**JavaScript**
- The add-to-cart button and the colour loader no longer use PrimeReact (the home page doesn't load PrimeReact at all).
- Favicon, toasts and the settings cookie hydrate when the browser is idle.
- API calls were logged to the console in production (with customers' data): now only in development.
- The web-vitals beacons went to an endpoint that only answered 404 and did nothing: removed.

**Fixes found on the way**
- The `/auth/*` pages linked `/src/…` and `/node_modules/…` stylesheets that only exist on the dev server: in
  production they were unstyled. They now import their CSS.
- Accessibility: names for the quantity and sign-in buttons; policy headings in order.

## Server (nginx), apply on cashierthru-prod

```nginx
# http {} block or both server blocks (storefront and admin-*)
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_types text/css application/javascript text/javascript application/json image/svg+xml application/xml text/plain font/ttf;
```

In the Laravel (admin-*) server block, so images are cached by browsers:

```nginx
location ^~ /img/ {
    try_files $uri /index.php?$query_string;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Access-Control-Allow-Origin "*";
}
location ~* ^/(image|uploads)/.*\.(jpe?g|png|webp|gif|svg)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}
```

Then `nginx -t && systemctl reload nginx`.

## Not done (needs a decision)

- **Colour contrast:** Classic's orange (`#FC7643`) text and white-on-orange buttons fail WCAG contrast (2.7:1). Fixing
  it changes how Classic looks, which the rules don't allow without the owner's say.
- **PrimeReact on checkout/product pages:** still used there (dialogs, dropdowns). Replacing it would save ~45 KB more.
- **Server data caching** (banners/categories per store): settings are already cached 5 min on the Astro server.

## How to measure

```bash
# production build against the local stores
PUBLIC_DEV_API_ORIGIN="http://admin-{tenant}.localhost:8001" npx astro build
HOST=127.0.0.1 PORT=4401 node dist/server/entry.mjs     # behind a proxy that sets X-Forwarded-Host
npx lighthouse http://nilebakery.localhost:<port>/ --only-categories=performance,accessibility,best-practices,seo
```

A production build serves `http://<store>.localhost:<port>` against the local Laravel (`src/middleware.ts`), like the
dev server.
