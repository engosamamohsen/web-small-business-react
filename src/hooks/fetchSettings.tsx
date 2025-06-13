import { fetchingData } from "./fetching";

// Function to fetch settings data
export async function fetchSettings() {
  const settingResponse = await fetchingData({
    url: "v1/setting-profile",
    type: { next: { revalidate: 600 } },
  });
  return settingResponse?.data;
}
