"use client";

import { useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { useSearchParams } from "@/lib/navigation";
import { CategoryType } from "@/lib/types";
import { scrollToProducts } from "@/components/Categories/CategorySwiper";
import SubCategories from "@/components/Categories/SubCategories";
import { revealProps } from "@/components/motion/scroll-reveal";
import type { ThemeLayout } from "@/themes/registry";
import "./themed.css";

type Variant = Exclude<ThemeLayout["categories"], "swiper">;

// Categories cascade in one after another; long lists stop adding delay after this many.
const cascade = (index: number) => revealProps(Math.min(index, 8));

const categoryParam = (category: CategoryType) =>
  `${category.id}-${category.slug}`;

// Same URL mechanics as the classic swiper (src/components/Categories/CategorySwiper.tsx):
// the products island listens for pushState and reloads the list.
function selectCategory(category: CategoryType | null) {
  const sp = new URLSearchParams(window.location.search);
  const next = category ? categoryParam(category) : null;
  sp.delete("sub_category");
  sp.set("page", "1");
  if (!next || sp.get("category") === next) {
    sp.delete("category");
  } else {
    sp.set("category", next);
  }
  window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
  scrollToProducts({ elementId: "products", top: 140 });
}

/** Category navigation for the non-classic themes: photo tiles, round photos or a chip bar. */
export default function CategoryNav({
  categories,
  variant,
  title,
  initialCategory = null,
}: {
  categories: CategoryType[];
  variant: Variant;
  title: string | null;
  /** The page's ?category= value. The server can't read the browser URL, so it renders this. */
  initialCategory?: string | null;
}) {
  const searchParams = useSearchParams();
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
        role="group"
        aria-label="الأقسام"
        data-reveal-group=""
      >
        <button
          type="button"
          className="ct-chip ct-chip--plain"
          aria-pressed={isActive(null)}
          {...cascade(0)}
          onClick={() => selectCategory(null)}
        >
          الكل
        </button>
        {categories.map((category, i) => (
          <button
            key={category.id}
            type="button"
            className="ct-chip"
            aria-pressed={isActive(category)}
            {...cascade(i + 1)}
            onClick={() => selectCategory(category)}
          >
            {category.icon && (
              <img src={category.icon} alt="" loading="lazy" decoding="async" />
            )}
            {category.name}
          </button>
        ))}
      </div>
    ) : (
      <div
        className={variant === "tiles" ? "ct-tiles" : "ct-rounds"}
        role="group"
        aria-label="الأقسام"
        data-reveal-group=""
      >
        {[null, ...categories].map((category, i) => {
          const base = variant === "tiles" ? "ct-tile" : "ct-round";
          return (
            <button
              key={category?.id ?? "all"}
              type="button"
              className={base}
              aria-pressed={isActive(category)}
              {...cascade(i)}
              onClick={() => selectCategory(category)}
            >
              <span className={`${base}__img`}>
                {category?.icon ? (
                  <img
                    src={category.icon}
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
            </button>
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
        {list}
        {subcategories.length > 0 && (
          <div className="ct-subcats">
            <SubCategories categories={subcategories} />
          </div>
        )}
      </div>
    </section>
  );
}
