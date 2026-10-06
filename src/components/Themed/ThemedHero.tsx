"use client";

import { useState } from "react";
import Link from "@/components/common/Link";
import { buildProductPath } from "@/lib/product-url";
import { MotionProvider, useFirstRender } from "@/components/motion/Reveal";
import { motionPreset } from "@/components/motion/presets";
import type { ThemeMotion } from "@/themes/registry";
import { m } from "motion/react";
import "./themed.css";

export interface HeroSlide {
  id?: number | string;
  title?: string;
  desc?: string;
  image?: string;
  type?: string;
  product_id?: number | string | null;
  category_id?: number | string | null;
  slug?: string;
  link?: string | null;
}

// Same destinations as the classic banner (src/components/Hero/HeroContent.tsx).
export function bannerHref(slide: HeroSlide): string {
  if (slide?.type === "product") {
    if (slide.product_id != null)
      return buildProductPath({ id: slide.product_id });
    if (slide.slug) return `/products/${slide.slug}`;
  }
  if (slide?.type === "category" && slide.category_id != null) {
    return `/?category=${slide.category_id}#products`;
  }
  if (slide?.link) return slide.link;
  return "#products";
}

/**
 * Banners for the Studio, Souq and Street themes: photo beside a text panel
 * (Street draws it as a poster). With no banners it becomes the store intro:
 * the store's name and about text with a button to the products.
 */
export default function ThemedHero({
  slides,
  storeName,
  about,
  cta,
  motion,
}: {
  slides: HeroSlide[];
  storeName?: string;
  about?: string;
  cta: string;
  motion?: ThemeMotion;
}) {
  const [index, setIndex] = useState(0);
  // The first slide is server HTML and gets the CSS entrance (themed.css); slides the
  // visitor switches to enter with the theme's motion preset.
  const preset = motionPreset(motion);
  const switched = !useFirstRender();
  const enter = preset && switched ? preset.from : false;

  const items: HeroSlide[] = slides.length
    ? slides
    : [{ title: storeName, desc: about?.replace(/\s+/g, " ").trim() }];
  const slide = items[Math.min(index, items.length - 1)];
  const isIntro = slides.length === 0;
  const href = isIntro ? "#products" : bannerHref(slide);
  const hasMedia = Boolean(slide.image);

  if (!slide.title && !slide.desc && !hasMedia) return null;

  return (
    <MotionProvider>
      <section
        className="ct-hero ct-wrap"
        aria-label={isIntro ? storeName : "العروض"}
      >
        <div
          className={hasMedia ? "ct-hero__frame has-media" : "ct-hero__frame"}
        >
          <m.div
            key={`text-${index}`}
            className="ct-hero__text"
            initial={enter}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={preset?.transition}
          >
            {/* The page's one h1: the store's name, or the banner on screen (Classic does the same) */}
            {slide.title && <h1 className="ct-hero__title">{slide.title}</h1>}
            {slide.desc && <p className="ct-hero__desc">{slide.desc}</p>}
            <Link href={href} className="ct-btn">
              {cta}
            </Link>
          </m.div>
          {hasMedia && (
            <m.div
              key={`media-${index}`}
              className="ct-hero__media"
              initial={preset && switched ? { opacity: 0, scale: 1.04 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img
                src={slide.image}
                alt={slide.title ? `صورة إعلان ${slide.title}` : "صورة إعلانية"}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                decoding="async"
              />
            </m.div>
          )}
        </div>

        {items.length > 1 && (
          <div className="ct-hero__nav">
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                className="ct-hero__dot"
                aria-label={`الإعلان ${i + 1}${item.title ? `: ${item.title}` : ""}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </section>
    </MotionProvider>
  );
}
