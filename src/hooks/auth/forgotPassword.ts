"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { $api } from "@/client";
import { ResetPasswordSchemaType } from "@/components/auth/schemas";
import Cookies from "js-cookie";
import { useRouter } from "@/lib/navigation";

export const useForgotPasswordHook = () => {
  // All React hooks at the top level
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();
  const sendOtp = async (data: { email: string }) => {
    setLoading(true);
    try {
      const { data: response } = await $api.post("/send-otp", data);
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      console.log(response);
      setCurrentEmail(data.email);
      setShowResetForm(true); // Show reset form after successfully sending OTP
      return true;
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال رمز التحقق",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email?: string) => {
    setLoading(true);
    try {
      const { data: response } = await $api.post("/send-otp", {
        email: email || currentEmail,
      });
      toast.success("تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني");
      console.log(response);
      return true;
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "حدث خطأ أثناء إعادة إرسال رمز التحقق");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordSchemaType) => {
    setResetLoading(true);
    try {
      const { data: response } = await $api.post("/reset-password", {
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
        token: Cookies.get("verify_token"),
      });
      if (response.status === 200) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        Cookies.remove("verify_token");
        router.push("/auth/login");
        return true;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور",
      );
      return false;
    } finally {
      setResetLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      setLoading(true);

      const { data: response } = await $api.post(
        `verify-otp?email=${email}&otp=${code}`,
      );
      console.log(response);
      Cookies.set("verify_token", response?.token, {
        expires: 1,
        path: "/",
      }); // Expires in 1 day
      toast.success("تم التحقق من البريد الإلكتروني بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });

      return response;
    } catch (error: any) {
      toast.error(
        `فشل التحقق: ${error?.response?.data?.message || "حدث خطأ ما"}`,
        {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        },
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    resetLoading,
    sendOtp,
    resendOtp,
    resetPassword,
    currentEmail,
    showResetForm,
    setShowResetForm,
    verifyEmail,
  };
};
