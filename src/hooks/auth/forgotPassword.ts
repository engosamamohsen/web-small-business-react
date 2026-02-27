"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { $api } from "@/client";
import { useRouter } from "@/lib/navigation";
import Cookies from "js-cookie";

export interface ResetPasswordData {
  new_password: string;
  new_password_confirmation: string;
  /** Confirmed email from the OTP verify step */
  email: string;
  /** The OTP code the user entered */
  otp: string;
}

export const useForgotPasswordHook = () => {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  /**
   * Send OTP to user email.
   * Endpoint: POST v1/send-otp
   */
  const sendOtp = async (data: { email: string }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      // if (import.meta.env.DEV) {
      //   formData.append("debug", "true");
      // }

      await $api.post("v1/send-otp", formData);

      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني", {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال رمز التحقق",
        { position: "top-right", autoClose: 2000, rtl: true },
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend OTP — same endpoint.
   */
  const resendOtp = async (email: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      // if (import.meta.env.DEV) {
      //   formData.append("debug", "true");
      // }

      await $api.post("v1/send-otp", formData);

      toast.success("تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني", {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إعادة إرسال رمز التحقق",
        { position: "top-right", autoClose: 2000, rtl: true },
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password.
   * Endpoint: POST v1/reset-password
   * Body: { new_password, new_password_confirmation, email, otp }
   */
  const resetPassword = async (data: ResetPasswordData) => {
    setResetLoading(true);
    // Read the temporary token saved after OTP verification
    const resetToken = Cookies.get("reset_auth_token");
    try {
      const { data: response } = await $api.post(
        "v1/reset-password",
        {
          new_password: data.new_password,
          new_password_confirmation: data.new_password_confirmation,
          email: data.email,
          otp: data.otp,
        },
        {
          // Use the verify-step api_token for authorization
          headers: resetToken
            ? { Authorization: `Token ${resetToken}` }
            : undefined,
        },
      );

      if (response?.status === true || response?.status === 200) {
        toast.success("تم تغيير كلمة المرور بنجاح", {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        });
        // Clean up the temporary reset token
        Cookies.remove("reset_auth_token", { path: "/" });
        return true;
      } else {
        toast.error(response?.message || "فشل تغيير كلمة المرور", {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        });
        return false;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور",
        { position: "top-right", autoClose: 2000, rtl: true },
      );
      return false;
    } finally {
      setResetLoading(false);
    }
  };

  return {
    loading,
    resetLoading,
    sendOtp,
    resendOtp,
    resetPassword,
  };
};
