import React from "react";
import SwiperOffer from "./SwiperOffer";
import { fetchingData } from "@/hooks/fetching";
import { revalidateTime } from "@/constants/constansts";

async function OfferProducts() {
  const response = await fetchingData({
    url: "/product?offer=1",
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
    return (
      <div className="container py-10">
        <h2 className="mb-8 text-2xl font-bold">العروض</h2>
        <SwiperOffer response={response} />
      </div>
    );
  } else {
    return <></>;
  }
}

export default OfferProducts;
