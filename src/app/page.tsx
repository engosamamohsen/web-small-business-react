import dynamic from "next/dynamic";
import Hero from "@/components/Hero/Hero";
const OfferProducts = dynamic(
  () => import("@/components/OfferProducts/Index"),
  {
    ssr: true,
    loading: () => <div className="h-16 animate-pulse bg-gray-50"></div>,
  },
);

const Categories = dynamic(() => import("@/components/Categories/Categories"), {
  ssr: true,
  loading: () => <div className="h-16 animate-pulse bg-gray-50"></div>,
});

const Products = dynamic(() => import("@/components/Product/Products"), {
  ssr: true,
  loading: () => <div className="h-16 animate-pulse bg-gray-50"></div>,
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main>
      <Hero />
      <OfferProducts />
      <Categories searchParams={searchParams} />
      <Products searchParams={searchParams} />
    </main>
  );
}
