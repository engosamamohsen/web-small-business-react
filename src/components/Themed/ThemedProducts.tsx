"use client";

import { useProductsFilter } from "@/hooks/useProductsFilter";
import { ProductType } from "@/lib/types";
import { buildProductPath } from "@/lib/product-url";
import { autoSelectedExtra } from "@/lib/product/variations";
import { isPriceOnRequest, PRICE_ON_REQUEST } from "@/lib/price-display";
import Link from "@/components/common/Link";
import { ButtonAddToCart } from "@/components/Product/ButtonAddToCart";
import { revealProps } from "@/components/motion/scroll-reveal";
import type { ThemeLayout } from "@/themes/registry";
import "./themed.css";
import { storeImageProps } from "@/lib/responsive-image";
import { useState } from "react";
import { collectProductImages } from "@/components/products/detail-components/gallery-images";

// ─── Price helpers (same maths as the classic card, src/components/Product/Product.tsx) ───

function discountOf(product: ProductType): number {
  const raw = product?.discount ?? 0;
  return typeof raw === "number" ? raw : parseFloat(String(raw)) || 0;
}

function prices(product: ProductType) {
  // + the extra of a choice picked for the customer (required group, one available choice).
  // Like the server: the discount applies to the product price only, the extra at full price.
  const price = Number(product?.price) || 0;
  const extra = autoSelectedExtra(product?.variations);
  const base = price + extra;
  const discount = discountOf(product);
  const hasDiscount = price > 0 && discount > 0;
  const now = hasDiscount
    ? parseFloat((price - (price * discount) / 100 + extra).toFixed(2))
    : base;
  return { base, now, discount, hasDiscount };
}

const money = (n: number) => `${n % 1 === 0 ? n : n.toFixed(2)} ج.م`;

// The API's "no image" placeholder is not a real photo (collectProductImages drops it).
function firstImage(product: ProductType, defaultImage?: string): string {
  // The platform's default (image/setting/product_image.svg) is a placeholder too; a store-uploaded default is kept
  const storeDefault = defaultImage?.trim() && !/(^|\/)image\/setting\/product_image\.svg(\?.*)?$/i.test(defaultImage.trim()) ? defaultImage.trim() : "";
  return collectProductImages(product)[0] || storeDefault;
}

/**
 * True when an <img> finished with no pixels. A failed resized copy is first swapped to the original
 * (Layout.astro), so only the original failing too counts; also catches a failure before hydration.
 */
function isBrokenImage(img: HTMLImageElement | null): boolean {
  return !!img && img.complete && img.naturalWidth === 0;
}

function plainText(html?: string): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Grid card (Studio, Souq, Street) ─────────────────────────────────────────

function Card({
  product,
  defaultImage,
  cascade,
}: {
  product: ProductType;
  defaultImage?: string;
  /** Place in its row, for the scroll-reveal cascade (src/components/motion/scroll-reveal.ts). */
  cascade: number;
}) {
  const { base, now, discount, hasDiscount } = prices(product);
  const [broken, setBroken] = useState(false); // the photo failed to load: show "no image"
  const image = broken ? "" : firstImage(product, defaultImage);
  const href = buildProductPath(product);

  return (
    <article className="ct-card" {...revealProps(cascade)}>
      <Link
        href={href}
        className="ct-card__img"
        aria-label={`عرض تفاصيل ${product.name}`}
      >
        {image ? (
          <img
            {...storeImageProps(image, "(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw", 400)}
            alt={`صورة المنتج ${product.name}`}
            loading="lazy"
            decoding="async"
            ref={(node) => { if (isBrokenImage(node)) setBroken(true); }}
            onError={(e) => { if (isBrokenImage(e.currentTarget)) setBroken(true); }}
          />
        ) : (
          <span className="ct-card__noimg">لا توجد صورة</span>
        )}
      </Link>
      {hasDiscount && (
        <span className="ct-badge">
          <span className="sr-only">خصم </span>
          {discount}%
        </span>
      )}
      <div className="ct-card__body">
        {product.category?.name && (
          <span className="ct-card__cat">{product.category.name}</span>
        )}
        <Link href={href}>
          <h3 className="ct-card__name">{product.name}</h3>
        </Link>
        <div className="ct-card__foot">
          <span className="ct-price">
            {/* Price 0 = "price on request" (src/lib/price-display.ts) */}
            <span className="ct-price__now">{isPriceOnRequest(now) ? PRICE_ON_REQUEST : money(now)}</span>
            {hasDiscount && !isPriceOnRequest(now) && (
              <span className="ct-price__was">{money(base)}</span>
            )}
          </span>
          <span className="ct-add">
            <ButtonAddToCart product={product} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Menu row (Bistro) ─────────────────────────────────────────────────────────

function MenuRow({
  product,
  defaultImage,
  cascade,
}: {
  product: ProductType;
  defaultImage?: string;
  /** Place in its row, for the scroll-reveal cascade (src/components/motion/scroll-reveal.ts). */
  cascade: number;
}) {
  const { base, now, discount, hasDiscount } = prices(product);
  const [broken, setBroken] = useState(false); // a photo that fails to load is hidden
  const image = broken ? "" : firstImage(product, defaultImage);
  const href = buildProductPath(product);
  const description = plainText(product.description);

  return (
    <article className="ct-row" {...revealProps(cascade)}>
      {image && (
        <Link
          href={href}
          className="ct-row__img"
          aria-label={`عرض تفاصيل ${product.name}`}
        >
          <img
            {...storeImageProps(image, "88px", 88)}
            width={88}
            height={88}
            alt={`صورة ${product.name}`}
            loading="lazy"
            decoding="async"
            ref={(node) => { if (isBrokenImage(node)) setBroken(true); }}
            onError={(e) => { if (isBrokenImage(e.currentTarget)) setBroken(true); }}
          />
        </Link>
      )}
      <div className="ct-row__body">
        <div className="ct-row__line">
          <Link href={href}>
            <h3 className="ct-row__name">{product.name}</h3>
          </Link>
          <span className="ct-row__dots" aria-hidden="true" />
          {hasDiscount && !isPriceOnRequest(now) && <span className="ct-row__was">{money(base)}</span>}
          <span className="ct-row__price">{isPriceOnRequest(now) ? PRICE_ON_REQUEST : money(now)}</span>
        </div>
        {description && <p className="ct-row__desc">{description}</p>}
        <div className="ct-row__foot">
          {hasDiscount ? (
            <span className="ct-row__tag">خصم {discount}%</span>
          ) : (
            <span />
          )}
          <span className="ct-add">
            <ButtonAddToCart product={product} />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Products keep their order; each category becomes a menu section. */
function groupByCategory(products: ProductType[]) {
  const groups: { name: string; items: ProductType[] }[] = [];
  for (const product of products) {
    const name = product.category?.name || "أصناف أخرى";
    const group = groups.find((g) => g.name === name);
    if (group) group.items.push(product);
    else groups.push({ name, items: [product] });
  }
  return groups;
}

// ─── Section ──────────────────────────────────────────────────────────────────

/** The home-page product list for the non-classic themes (grid cards or menu rows). */
export default function ThemedProducts({
  products,
  defaultImage,
  layout,
  title,
}: {
  // Same shape the classic ProductsSection gets from the page (products API items).
  products?: { data?: any[]; pagination?: any };
  defaultImage?: string;
  layout: ThemeLayout["products"];
  title: string;
}) {
  const {
    products: list,
    isLoading,
    isEmpty,
  } = useProductsFilter(products?.data, products?.pagination);
  const items: ProductType[] = list ?? [];

  let body;
  if (isLoading) {
    body = (
      <div className="ct-state" role="status">
        <span className="ct-spinner" aria-hidden="true" />
        جاري تحميل المنتجات...
      </div>
    );
  } else if (isEmpty || items.length === 0) {
    body = (
      <div className="ct-state">
        <strong>لا توجد منتجات هنا</strong>
        جرّب قسماً آخر.
      </div>
    );
  } else if (layout === "menu") {
    body = groupByCategory(items).map((group) => (
      <section
        key={group.name}
        className="ct-menu__group"
        aria-label={group.name}
      >
        <h3 className="ct-menu__heading" {...revealProps()}>
          {group.name}
        </h3>
        <div className="ct-menu__list">
          {group.items.map((product, i) => (
            <MenuRow
              key={product.id}
              product={product}
              defaultImage={defaultImage}
              cascade={i % 2}
            />
          ))}
        </div>
      </section>
    ));
  } else {
    body = (
      <div className="ct-grid">
        {items.map((product, i) => (
          <Card
            key={product.id}
            product={product}
            defaultImage={defaultImage}
            cascade={i % 4}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="ct-products ct-wrap">
      <h2 className="ct-products__title" {...revealProps()}>
        {title}
      </h2>
      {body}
    </div>
  );
}
