"use client";

import { Skeleton } from 'primereact/skeleton';

export default function OfferProductsSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton width="200px" height="2rem" className="mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg min-h-[350px]">
            {/* Product Image Skeleton */}
            <div className="relative h-[208px] max-sm:h-48">
              <Skeleton width="100%" height="208px" className="h-52 w-full" />
            </div>

            {/* Product Content Skeleton */}
            <div className="flex flex-col items-start justify-start gap-2 px-4 pb-6 pt-4">
              {/* Product Name */}
              <Skeleton width="80%" height="1.5rem" className="my-2" />

              {/* Price */}
              <div className="flex items-center justify-between w-full">
                <Skeleton width="60px" height="1.25rem" />
              </div>

              {/* View More Link */}
              <Skeleton width="80px" height="1rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
