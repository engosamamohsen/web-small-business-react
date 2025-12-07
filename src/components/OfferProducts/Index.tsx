// src/app/(wherever)/OfferProducts.tsx
import React from "react";
import SwiperOffer from "./SwiperOffer";
import NotFoundProducts from "../NotFoundProducts/NotFoundProducts";
import { fetchHook } from "@/hooks/fetch-hook";

async function OfferProducts() {
  const response = await fetchHook({
    url: "v1/product?offer=1",
    init: {
      // ✅ cache & dedupe offers list for 60s
      next: { revalidate: 60 },
    },
  });

  if (response?.ok) {
    return (
      <div className="container py-10">
        <h2 className="mb-8 text-2xl font-bold">العروض</h2>
        {response?.data?.data?.length ? (
          <SwiperOffer response={response} />
        ) : (
          <NotFoundProducts text="عروض" />
        )}
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
