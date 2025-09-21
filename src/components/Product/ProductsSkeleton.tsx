"use client";

import { Skeleton } from 'primereact/skeleton';

export default function ProductsSkeleton() {
  return (
    <section className="py-10" id="products">
      <div className="container">
        <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4">
          {/* Empty header area for consistency */}
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg min-h-[350px]"
            >
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

        {/* Pagination Skeleton */}
        <div className="my-8 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md">
            {/* Previous button skeleton */}
            <Skeleton width="2rem" height="2rem" className="rounded-full" />

            {/* Page numbers skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width="2rem" height="2rem" className="rounded-full" />
            ))}

            {/* Next button skeleton */}
            <Skeleton width="2rem" height="2rem" className="rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
