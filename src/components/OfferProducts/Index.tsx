import React from "react";
import SwiperOffer from "./SwiperOffer";
import { fetchingData } from "@/hooks/fetching";
import { revalidateTime } from "@/constants/constansts";
import NotFoundProducts from "../NotFoundProducts/NotFoundProducts";

async function OfferProducts() {
  const response = await fetchingData({
    url: "v1/product?offer=1",
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
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
  } else {
    return (
      <>
        <section className="container py-10" id="products">
          <h2 className="mb-8 text-2xl font-bold">العروض</h2>
          <NotFoundProducts text="عروض" />
        </section>
      </>
    );
  }
}

export default OfferProducts;
