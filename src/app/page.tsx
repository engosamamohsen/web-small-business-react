import Categories from "@/components/Categories/Categories";
import Hero from "@/components/Hero/Hero";
import OfferProducts from "@/components/OfferProducts/Index";
import Products from "@/components/Product/Products";

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
      <OfferProducts />
      <OfferProducts />
    </main>
  );
}
