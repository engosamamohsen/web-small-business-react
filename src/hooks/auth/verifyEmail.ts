import { $api } from "@/client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@/lib/navigation";
import Cookies from "js-cookie";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Verify OTP code for a given email.
   *
   * @param email     - The email address to verify
   * @param code      - The OTP code entered by the user
   * @param mode      - "register" → save api_token & go home | "reset" → go to reset-password
   * @param onVerified - Optional callback for dialog mode: called with (email, code) instead of routing
   */
  const verifyEmail = async (
    email: string,
    code: string,
    mode: "register" | "reset" = "register",
    onVerified?: (email: string, otp: string) => void,
  ) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", email);

      // Forgot-password flow → verify-otp (field: otp)
      // Register flow        → verify-user (field: code)
      if (mode === "reset") {
        formData.append("otp", code);
      } else {
        formData.append("code", code);
      }

      const endpoint = mode === "reset" ? "v1/verify-otp" : "v1/verify-user";
      const { data: response } = await $api.post(endpoint, formData);

      toast.success("تم التحقق من البريد الإلكتروني بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });

      // Dialog mode — hand off to parent
      if (onVerified) {
        // For reset mode: save api_token temporarily so reset-password API can use it as Authorization header
        if (mode === "reset") {
          const apiToken = response?.data?.api_token;
          if (apiToken) {
            Cookies.set("reset_auth_token", apiToken, {
              expires: 1 / 24, // 1 hour
              path: "/",
              sameSite: "lax",
            });
          }
        }
        onVerified(email, code);
        return response;
      }

      // Standalone page mode — handle routing ourselves
      if (mode === "reset") {
        // Save api_token temporarily so reset-password page can use it as Authorization header
        const apiToken = response?.data?.api_token;
        if (apiToken) {
          Cookies.set("reset_auth_token", apiToken, {
            expires: 1 / 24, // 1 hour
            path: "/",
            sameSite: "lax",
          });
        }
        // Pass email+otp as query params for the standalone reset-password page
        const emailEnc = encodeURIComponent(email);
        const otpEnc = encodeURIComponent(code);
        router.push(`/auth/reset-password?email=${emailEnc}&otp=${otpEnc}`);
      } else {
        // Register mode: save token and go home
        const apiToken = response?.data?.api_token;
        if (apiToken) {
          Cookies.set("app_token", apiToken, {
            expires: 1,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
        if (typeof window !== "undefined") {
          window.location.replace("/");
        } else {
          router.push("/");
        }
      }

      return response;
    } catch (error: any) {
      toast.error(
        `فشل التحقق: ${error?.response?.data?.message || "حدث خطأ ما"}`,
        { position: "top-right", autoClose: 2000, rtl: true },
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend the verification code via v1/send-otp.
   */
  const resendVerificationCode = async (email: string) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", email);

      await $api.post(`v1/send-otp`, formData);

      toast.success("تم إرسال رمز التحقق مرة أخرى!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });
    } catch (error: any) {
      toast.error(
        `فشل إرسال الرمز: ${error?.response?.data?.message || "حدث خطأ ما"}`,
        { position: "top-right", autoClose: 2000, rtl: true },
      );
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
