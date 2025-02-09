import Categories from "@/components/Categories/Categories";
import Hero from "@/components/Hero/Hero";
import OfferProducts from "@/components/OfferProducts/Index";
import Products from "@/components/Product/Products";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main>
      <Hero />
      <OfferProducts />
      <Categories />
      <Products />
      <OfferProducts />

      <OfferProducts />
      <OfferProducts />

      <OfferProducts />

      <OfferProducts />
    </main>
  );
}
