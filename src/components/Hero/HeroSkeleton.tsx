"use client";

import { Skeleton } from 'primereact/skeleton';
import styles from "./style.module.css";

export default function HeroSkeleton() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.slideContent}>
        {/* Skeleton Image */}
        <div className={styles.imageContainer}>
          <Skeleton width="100%" height="500px" />
          <div
            className={`${styles.gradientOverlay} bg-gradient-to-t from-[color-mix(in_srgb,var(--main-color)_80%,transparent)] to-transparent`}
          />
        </div>

        {/* Skeleton Content */}
        <div className={`${styles.textContainer} relative z-[999] flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center`}>
          <Skeleton width="60%" height="2rem" className="mb-2" />
          <Skeleton width="80%" height="1rem" className="mb-2" />
          <Skeleton width="70%" height="1rem" />
        </div>
      </div>
    </div>
  );
}
