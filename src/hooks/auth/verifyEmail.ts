import { $api } from "@/client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verifyEmail = async (email: string, code: string) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
      
      const { data: response } = await $api.post(`verify-email`, formData);
      
      toast.success("تم التحقق من البريد الإلكتروني بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });
      
      // Set token if available in response
      if (response?.data?.jwt_token) {
        Cookies.set("app_token", response.data.jwt_token, {
          expires: 1,
          path: "/",
        });
      }
      
      // Redirect to home page
      router.push("/");
      
      return response;
    } catch (error: any) {
      toast.error(`فشل التحقق: ${error?.response?.data?.message || "حدث خطأ ما"}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("email", email);
      
      const { data: response } = await $api.post(`resend-verification-code`, formData);
      
      toast.success("تم إرسال رمز التحقق مرة أخرى!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });
      
      return response;
    } catch (error: any) {
      toast.error(`فشل إرسال الرمز: ${error?.response?.data?.message || "حدث خطأ ما"}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyEmail,
    resendVerificationCode,
  };
};
