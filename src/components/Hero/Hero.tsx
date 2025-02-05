import { fetchingData } from "@/hooks/fetching";
import SwiperBanner from "./SwiperBanner";
import { revalidateTime } from "@/constants/constansts";

export default async function Hero() {
  const response = await fetchingData({
    url: "/banner",
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
    return <SwiperBanner response={response} />;
  } else {
    return <></>;
  }
}
