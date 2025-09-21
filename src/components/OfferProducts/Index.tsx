import React from "react";
import SwiperOffer from "./SwiperOffer";
import OfferProductsSkeleton from "./OfferProductsSkeleton";
import { revalidateTime } from "@/constants/constansts";
import { fetchHook } from "@/hooks/fetch-hook";

async function OfferProducts() {
  const response = await fetchHook({
    url: "v1/product?offer=1",
    init: { next: { revalidate: revalidateTime } },
  });
  if (response?.ok) {
    return (
      <div className="container py-10">
        <h2 className="mb-8 text-2xl font-bold">العروض</h2>
        {response?.data?.data?.length ? (
          <SwiperOffer response={response} />
        ) : (
          <OfferProductsSkeleton />
        )}
      </div>
    );
  } else {
    return (
      <>
        <section className="container py-10" id="products">
          <h2 className="mb-8 text-2xl font-bold">العروض</h2>
          <OfferProductsSkeleton />
        </section>
      </>
    );
  }
}

export default OfferProducts;
