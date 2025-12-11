import { Suspense } from "react";
import Hero from "@/components/Hero/Hero";
import OfferProducts from "@/components/OfferProducts/Index";
import Categories from "@/components/Categories/Categories";
import Products from "@/components/Product/Products";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Loading skeletons for better UX
function HeroSkeleton() {
  return <div className="h-96 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg" />;
}

function SectionSkeleton() {
  return <div className="h-48 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg" />;
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-80 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg" />
      ))}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="space-y-8">
      {/* Hero Banner - Loads first */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      {/* Offer Products - Streams independently */}
      <Suspense fallback={<SectionSkeleton />}>
        <OfferProducts />
      </Suspense>

      {/* Categories - Streams independently */}
      <Suspense fallback={<SectionSkeleton />}>
        <Categories searchParams={searchParams} />
      </Suspense>

      {/* Products Grid - Streams independently */}
      <Suspense fallback={<ProductsSkeleton />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
