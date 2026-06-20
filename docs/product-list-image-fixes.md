# Product List Image Fixes (Home → Products)

Two issues on the home products list, both in `src/components/Product/Product.tsx`.
The product API data was **fine** — every product returned a valid `product_image`
(`https://admin-<tenant>.cashierthru.com/uploads/products/…jpg`, HTTP 200). The bugs
were purely in how the card rendered the images.

---

## Issue 1 — Product images never loaded

### Cause

The main `<img>` was rendered **invisible by default** and depended entirely on
client-side JavaScript to reveal it:

```html
<!-- before: SSR markup -->
<img src=".../uploads/products/….jpg"
     class="object-cover transition-opacity duration-300 opacity-0" />
```

- `opacity-0` → the image only became visible once React set `imgLoaded = true`
  (via `onLoad` / `node.complete`). If that flip didn't happen, the image stayed
  permanently invisible and only the skeleton showed.
- The shared `<Image>` wrapper (`src/components/common/Image.tsx`) **silently ignores
  the `fill` prop**, so the image had **no sizing** (`position`/`width`/`height`) — it
  collapsed instead of filling the 4/3 box.

### Fix

Make the image **fill its box** and be **visible without depending on a JS opacity
flip**. The skeleton sits behind it and is covered as soon as the browser paints the
image.

```jsx
// after
<Image
  ref={handleImgRef}
  src={currentImage}
  fill
  loading="lazy"
  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
  className="absolute inset-0 h-full w-full object-cover"
  onLoad={() => setImgLoaded(true)}
  onError={() => setImgLoaded(true)}
/>
```

- `absolute inset-0 h-full w-full` provides the fill positioning the `<Image>` wrapper
  drops (the parent is `relative` with `aspect-ratio: 4/3`).
- No `opacity-0`: the image shows the moment it paints. `onLoad`/`onError` still hide
  the skeleton, but image visibility no longer hinges on JS.
- The thumbnail strip got the same `absolute inset-0 h-full w-full object-cover` fix.

---

## Issue 2 — The settings image repeated on every product

### Cause

The shop's `product_default_image` (a `/image/setting/…` URL from `v1/setting-profile`)
was **appended to every product's image list**, so it showed up as an extra thumbnail
on every card:

```js
// before — defaultImage always appended
const allImages = [
  product?.product_image,
  ...(product?.gallery_images ?? []),
  defaultImage,            // ← added to EVERY product
].filter(Boolean);
```

In the rendered HTML the default image appeared **19 times** (once per card).

### Fix — default image is a FALLBACK ONLY

> **Rule:** the default image is used **only when a product has no image of its own**.
> It is **never** attached to a product that already has an image.

```js
// after — defaultImage used only when the product has no images
const productImages = [
  product?.product_image,
  ...(product?.gallery_images ?? []),
].filter(Boolean);

const images =
  productImages.length > 0
    ? productImages
    : defaultImage
      ? [defaultImage]
      : [""];
```

After the fix the product default image renders **0 times** as an `<img>` (it remains
only as the `defaultImage` fallback prop passed to the island).

---

## Verification

Reproduced locally against the live `admin-asly` tenant (`npm run dev`) and inspected
the SSR HTML:

| Check | Before | After |
| ----- | ------ | ----- |
| Main `<img>` class | `…object-cover…opacity-0` (collapsed, JS-gated) | `absolute inset-0 h-full w-full object-cover` (fills box, visible) |
| `<img>` rendering `product_default_image` | 19 | **0** |
| Production `astro check` | — | **0 errors** |

## Files changed

| File | Change |
| ---- | ------ |
| `src/components/Product/Product.tsx` | Default image is fallback-only; main image + thumbnails fill their box and no longer depend on a JS opacity flip. |

## Related / latent

- `src/components/common/Image.tsx` still **ignores `fill`** (and `quality`). Other
  `<Image fill>` usages (e.g. the cart) rely on Tailwind preflight for rough sizing.
  Implementing `fill` properly in the wrapper would fix those too — deferred to keep
  this change scoped to the product list (the reported area) and avoid touching shared
  UI used across the live storefront.
