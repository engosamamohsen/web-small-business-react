# Storefront themes

The store owner picks a theme in the dashboard (**Website settings**). The setting-profile API returns it
as `data.storefront_theme` (the backend registry is `App\Support\Storefront\StorefrontThemes`, see
`docs/storefront-themes.md` in the Laravel repo). Any store may use any theme; "For" below is who a
theme was made for, so the dashboard recommends it to them.

| Key | For | Home page |
|---|---|---|
| `classic` (default) | all stores | The original components, untouched |
| `studio` | online stores | Split banner, category tiles, flat bordered cards |
| `souq` | online stores (handmade, fashion) | Dark header, Kufic headings, round category photos, tall photos |
| `fashion` | online stores (clothing, shoes, bags) | Photo-cover banner with the words on it, tall portrait categories and cards, black and white |
| `furniture` | online stores (furniture, decor) | Split banner, wide room-photo categories with names on them, landscape cards, wood and linen |
| `bistro` | restaurants, cafés | Photo banner, sticky chip bar, menu rows grouped by category |
| `street` | fast food | Poster banner, chip bar, outlined cards, sticker prices |

## Where things live

- `src/themes/registry.ts`: keys, fonts and the home-page layout of each theme. Keep the keys identical to
  the backend list (`registry.test.ts` pins them).
- `src/middleware.ts`: sets `Astro.locals.theme` from the settings, or from an owner's preview.
- `src/layouts/Layout.astro`: `<html data-theme>`, the theme's Google Fonts, and the preview bar.
- `src/styles/themes.css`: each theme's tokens (`--main-color`, `--t-bg`, `--t-ink`, `--t-font`, …) and the
  shared hooks every page has (`.ct-header`, `.ct-header__name`, `.ct-header__icon`, `.ct-footer`,
  `.ct-footer__name`). Classic has no rules there: it is drawn by the components' own classes.
- `src/components/Themed/`: the home-page variants (`ThemedHero`, `CategoryNav`, `ThemedProducts`) and
  `themed.css`. `index.astro` uses them for every theme except Classic.
- `src/layouts/ColorHandler.tsx` only sets the inline brand colours for Classic, so it doesn't override a
  theme's colours.

## Motion

Each theme names its motion in `registry.ts` (`motion`): `lift`, `rise`, `fade`, `pop`, or `none` for Classic, which must
behave exactly like the original storefront.

- `Layout.astro` prints `<html data-motion>` and an inline snippet that turns on `ct-motion` before first paint (not for
  Classic, not with reduced motion; it switches itself off after 4 s if the module never starts).
- Components mark what comes in with `data-reveal` (`revealProps(i)`, where `i` is the item's place in its row for the
  cascade) and sideways-scrolling rows with `data-reveal-group`.
- `src/components/motion/scroll-reveal.ts` flags marked elements as they scroll into view (`data-revealed="in"`, then
  `"done"` so hover transitions come back). It waits until an island has hydrated before touching its HTML, so React
  never sees a mismatch.
- `src/styles/themes.css` → Motion: what each preset looks like (start offset, blur, duration, easing, cascade step).
- `themed.css` → Motion: the hero's first-paint entrance and each theme's hover/press feedback. Switching banners animates
  with the theme's preset (`src/components/motion/presets.ts`).
- Without JavaScript, or with reduced motion, nothing is hidden.

## Preview

The dashboard's "Preview on my store" opens `/?theme_preview=<key>`. The middleware keeps the key in a
session cookie (`ct_theme_preview`) so the owner can browse in that theme; customers never see it.
`?theme_preview=off` ends it. Only known keys are accepted.

## Adding themes or a store type (e.g. real estate)

Add the keys here and in the backend registry (with the store types they suit). A new kind of page
content (for example property cards) gets its own variant under `src/components/Themed/` and a new
value in `ThemeLayout`. Existing themes keep working.

## Local development with several stores

```bash
PUBLIC_DEV_API_ORIGIN="http://admin-{tenant}.localhost:8001" PUBLIC_DEV_TENANT=moda \
NODE_OPTIONS="--require /path/to/localhost-dns.cjs" npx astro dev --port 3000
```

`http://moda.localhost:3000` then loads the local `moda` store, `http://nilebakery.localhost:3000` the
`nilebakery` store (`src/lib/config.ts → devApiOrigin`). Node on Windows can't resolve `*.localhost`, so
the preload maps it to 127.0.0.1 (Chrome and curl already do).
