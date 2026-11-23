"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { useSearchParams } from "@/lib/navigation";
import { CategoryType } from "@/lib/types";
import { scrollToProducts } from "@/components/Categories/CategorySwiper";
import SubCategories from "@/components/Categories/SubCategories";
import { revealProps } from "@/components/motion/scroll-reveal";
import type { ThemeLayout } from "@/themes/registry";
import "./themed.css";
import { storeImageProps } from "@/lib/responsive-image";
import { categoryPagePath, categoryParam, inPlaceClick, isSelectedCategory } from "@/lib/category/category-param";

type Variant = Exclude<ThemeLayout["categories"], "swiper">;

// Categories cascade in one after another; long lists stop adding delay after this many.
const cascade = (index: number) => revealProps(Math.min(index, 8));

// Same URL mechanics as the classic swiper (src/components/Categories/CategorySwiper.tsx):
// the products island listens for pushState and reloads the list. The shared categoryParam()
// gives "<id>" for a category without a slug (it used to write "<id>-null").
export function selectCategory(category: CategoryType | null) {
  const sp = new URLSearchParams(window.location.search);
  const next = category ? categoryParam(category) : null;
  sp.delete("sub_category");
  sp.set("page", "1");
  if (!next || isSelectedCategory(sp.get("category"), category)) {
    sp.delete("category");
  } else {
    sp.set("category", next);
  }
  window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
  scrollToProducts({ elementId: "products", top: 140 });
}

/**
 * Sideways scrolling for a category row (chips, rounds): which ends still have hidden categories, and
 * a step to scroll there. Works in RTL (Chrome reports scrollLeft from 0 down to a negative number).
 * The server and the first browser render show no arrows, so hydration matches; they appear once
 * the row is measured.
 */
function useRowScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ends, setEnds] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setEnds({ start: pos > 2, end: max - pos > 2 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    resize?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      resize?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /** One "page" (most of the visible width) towards the row's start or end. */
  const step = (towards: "start" | "end") => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const amount = Math.max(160, el.clientWidth * 0.8);
    const sign = (towards === "end" ? 1 : -1) * (rtl ? -1 : 1);
    const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sign * amount, behavior: smooth ? "smooth" : "auto" });
  };

  return { ref, ends, step };
}

// The categories are real links (search engines follow them to each category page, owner decision
// 2026-11-23); a plain click still filters in place without a reload.
const linkProps = (category: CategoryType | null) => ({
  href: category ? categoryPagePath(category) : "/",
  onClick: inPlaceClick(() => selectCategory(category)),
});

/** Category navigation for the non-classic themes: photo tiles, round photos or a chip bar. */
export default function CategoryNav({
  categories,
  variant,
  title,
  initialCategory = null,
  initialSubCategory = null,
}: {
  categories: CategoryType[];
  variant: Variant;
  title: string | null;
  /** The page's ?category= value. The server can't read the browser URL, so it renders this. */
  initialCategory?: string | null;
  /** The page's ?sub_category= value, for the sub-category chips (same reason). */
  initialSubCategory?: string | null;
}) {
  const searchParams = useSearchParams();
  const row = useRowScroll();
  // Same value on the server and in the hydrating browser, so the selected category is
  // marked in the HTML the visitor first sees; afterwards the URL decides.
  const selectedParam =
    typeof window === "undefined"
      ? initialCategory
      : searchParams.get("category");
  const selected = useMemo(
    () =>
      categories.find(
        (c) => selectedParam?.match(/^(\d+)/)?.[1] === String(c.id),
      ) ?? null,
    [categories, selectedParam],
  );

  if (!categories.length) return null;

  const isActive = (category: CategoryType | null) =>
    category ? selected?.id === category.id : !selectedParam;

  const subcategories = selected?.subcategories ?? [];

  const list =
    variant === "chips" ? (
      <div
        className="ct-chips"
        ref={row.ref}
        role="group"
        aria-label="الأقسام"
        data-reveal-group=""
      >
        <a
          className="ct-chip ct-chip--plain"
          aria-current={isActive(null) ? "true" : undefined}
          {...cascade(0)}
          {...linkProps(null)}
        >
          الكل
        </a>
        {categories.map((category, i) => (
          <a
            key={category.id}
            className="ct-chip"
            aria-current={isActive(category) ? "true" : undefined}
            {...cascade(i + 1)}
            {...linkProps(category)}
          >
            {category.icon && (
              <img {...storeImageProps(category.icon, "28px", 28)} alt="" width={28} height={28} loading="lazy" decoding="async" />
            )}
            {category.name}
          </a>
        ))}
      </div>
    ) : (
      <div
        className={variant === "tiles" ? "ct-tiles" : "ct-rounds"}
        ref={variant === "tiles" ? undefined : row.ref}
        role="group"
        aria-label="الأقسام"
        data-reveal-group=""
      >
        {[null, ...categories].map((category, i) => {
          const base = variant === "tiles" ? "ct-tile" : "ct-round";
          return (
            <a
              key={category?.id ?? "all"}
              className={base}
              aria-current={isActive(category) ? "true" : undefined}
              {...cascade(i)}
              {...linkProps(category)}
            >
              <span className={`${base}__img`}>
                {category?.icon ? (
                  <img
                    {...storeImageProps(
                      category.icon,
                      variant === "tiles" ? "(min-width: 1024px) 200px, 45vw" : "96px",
                      variant === "tiles" ? 400 : 96,
                    )}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : category ? (
                  <span className="text-xl font-bold">
                    {category.name?.charAt(0)}
                  </span>
                ) : (
                  <LayoutGrid className="h-6 w-6" aria-hidden="true" />
                )}
              </span>
              <span className={`${base}__name`}>
                {category ? category.name : "الكل"}
              </span>
            </a>
          );
        })}
      </div>
    );

  return (
    <section
      className={variant === "chips" ? "ct-chipbar" : "ct-cats"}
      aria-label={title ?? "الأقسام"}
    >
      <div className="ct-wrap">
        {title && (
          <h2 className="ct-cats__title" {...revealProps()}>
            {title}
          </h2>
        )}
        {variant === "tiles" ? (
          list
        ) : (
          // Sideways row: arrows at the ends that still hide categories, plus a soft fade there
          <div
            className="ct-catrow"
            data-more-start={row.ends.start ? "" : undefined}
            data-more-end={row.ends.end ? "" : undefined}
          >
            {list}
            {row.ends.start && (
              <button
                type="button"
                className="ct-catrow__arrow ct-catrow__arrow--start"
                aria-label="الأقسام السابقة"
                onClick={() => row.step("start")}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
            )}
            {row.ends.end && (
              <button
                type="button"
                className="ct-catrow__arrow ct-catrow__arrow--end"
                aria-label="المزيد من الأقسام"
                onClick={() => row.step("end")}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        {subcategories.length > 0 && (
          <div className="ct-subcats">
            <SubCategories categories={subcategories} initialSubCategory={initialSubCategory} />
          </div>
        )}
      </div>
    </section>
  );
}
