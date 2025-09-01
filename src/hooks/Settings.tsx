import { $api } from "@/client";
import Cookies from "js-cookie";
import { useAsync } from "react-use";

// interface SettingsProfile {
//   id: number;
//   name: string;
//   logo: string;
//   website_url: string;
//   about_us: string;
//   keywords: string;
// }

export const useSettingsServices = () => {
  const token = Cookies.get("app_token");
  const { value, loading } = useAsync(async () => {
    return $api.get("v1/setting-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, []);

  return { data: value?.data?.data, loading };
};
