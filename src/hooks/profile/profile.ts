import { useAsync } from "react-use";
import Cookies from "js-cookie";
import { $api } from "@/client";
import { useRouter } from "@/lib/navigation";
import { toast } from "react-toastify";

interface ProfileUpdateData {
  name?: string;
  phone?: string;
  image?: File | null;
}

export const useProfileServices = () => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.post("/get-profile");
  }, []);
  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return { data: value?.data?.data, loading };
};

export const useProfileUpdate = () => {
  const router = useRouter();
  const updateProfile = async (profileData: ProfileUpdateData) => {
    try {
      const formData = new FormData();
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.phone) formData.append("phone", profileData.phone);
      if (profileData.image) formData.append("image", profileData.image);

      const response = await $api.post("/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(`تم تحديث الملف الشخصي بنجاح`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      if (error.status === 403) {
        Cookies.remove("app_token");
        router.push("/auth/login");
      }
      toast.error(
        `  فشل تحديث الملف الشخصي : ${error?.response?.data?.message}`,
        {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        },
      );
      return {
        success: false,
        error: error?.response?.data || "Update failed",
      };
    }
  };

  return { updateProfile };
};
