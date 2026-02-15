import React from "react";
import SwiperOffer from "./SwiperOffer";
import NotFoundProducts from "../NotFoundProducts/NotFoundProducts";
// import { fetchHook } from "@/hooks/fetch-hook";


interface OfferProductsProps {
  offerProducts: any[];
}

function OfferProducts({ offerProducts }: OfferProductsProps) {
  // const response = { ok: true, data: { data: offerProducts } }; // Mock response structure for SwiperOffer if needed, or better, update SwiperOffer to take array directly.
  // Looking at SwiperOffer usage in index.astro, it expects { response: { data: { data: [] }, ok: boolean } }
  // Let's construct the response object here to maintain compatibility with SwiperOffer

  const response = {
    ok: true,
    data: {
      data: offerProducts
    }
  };

  if (offerProducts?.length) {
    return (
      <div className="container py-10">
        <h2 className="mb-8 text-2xl font-bold">العروض</h2>
        <SwiperOffer response={response} />
      </div>
    );
  }

  return (
    <section className="container py-10" id="products">
      <h2 className="mb-8 text-2xl font-bold">العروض</h2>
      <NotFoundProducts text="عروض" />
    </section>
  );
}

export default OfferProducts;
