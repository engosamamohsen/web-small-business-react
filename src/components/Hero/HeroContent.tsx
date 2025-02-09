"use client";

import Link from "next/link";
import styles from "./style.module.css";

function HeroContent({ data }: { data: any }) {
  const linkLocation =
    data?.type === "product"
      ? `/products/${data?.id}`
      : data?.type === "category"
        ? `/categories/${data?.id}`
        : data?.type === "external"
          ? data?.link || ""
          : "/";
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
