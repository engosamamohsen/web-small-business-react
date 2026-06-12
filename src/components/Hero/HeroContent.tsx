"use client";

import Link from "@/components/common/Link";
import { buildProductPath } from "@/lib/product-url";
import styles from "./style.module.css";

function HeroContent({ data }: { data: any }) {
  // Banner API contract: {type, product_id, category_id, link, title, desc, image}
  const linkLocation = (() => {
    if (data?.type === "product") {
      if (data?.product_id != null)
        return buildProductPath({ id: data.product_id });
      if (data?.slug) return `/products/${data.slug}`; // legacy banner shape
    }
    // Category banners filter the home products grid to that category
    if (data?.type === "category" && data?.category_id != null)
      return `/?category=${data.category_id}#products`;
    if (data?.link) return data.link;
    return "/";
  })();
  return (
    <>
      <Link
        href={linkLocation}
        aria-label={`Navigate to ${data.title}`}
        className={`${styles.textContainer} relative z-[999] flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center`}
      >
        <h1
          // style={{ color: globalData.mainBackground }}
          className={`${styles.title} w-fit text-white`}
        >
          {data.title}
        </h1>
        <p className={`${styles.desc} text-white opacity-[0.8]`}>{data.desc}</p>
      </Link>
    </>
  );
}

export default HeroContent;
