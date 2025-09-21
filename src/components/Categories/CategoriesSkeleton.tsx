"use client";

import { Skeleton } from 'primereact/skeleton';

export default function CategoriesSkeleton() {
  return (
    <>
      {/* Categories Section */}
      <div className="relative overflow-visible bg-gray-50">
        <div className="container">
          <Skeleton width="200px" height="2rem" className="pt-6" />
        </div>
        <div className="container">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center min-w-fit">
                {/* Category Icon Skeleton */}
                <Skeleton width="64px" height="64px" className="rounded-full" />
                {/* Category Name Skeleton */}
                <Skeleton width="60px" height="1rem" className="mt-3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container flex items-center justify-between py-8 max-md:flex-col max-md:justify-center max-md:gap-4">
        <Skeleton width="150px" height="2rem" className="text-right" />

        {/* Sub-categories Skeleton */}
        <div className="flex max-w-full items-center justify-center gap-2 max-md:flex-col">
          <Skeleton width="120px" height="1rem" className="mb-4" />
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} width="90px" height="2rem" className="rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
