import { revalidateTime } from "@/constants/constansts";
import { fetchingData } from "./fetching";

// Function to fetch settings data
export async function fetchSettings() {
  const settingResponse = await fetchingData({
    url: "/setting-profile",
    type: { next: { revalidate: revalidateTime } },
  });
  return settingResponse?.data;
}
