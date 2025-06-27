"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";

import { useForgotPasswordHook } from "@/hooks/auth/forgotPassword";

const VerifyEmailPage = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();
  const { verifyEmail, resendOtp, loading } = useForgotPasswordHook();

  // State for verification code input
  const [code, setCode] = useState<string>("");

  // Function to handle OTP input change
  const handleOtpChange = (e: any) => {
    setCode(e.value || "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length === 4) {
      try {
        const result = await verifyEmail(userEmail, code);
        if (result.status === 200) {
          router.push(`/forgot-password/${userEmail}/reset`);
        }
      } catch (error) {
        // Error is already handled in the hook with toast
        console.error("Verification error:", error);
      }
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    try {
      await resendOtp(userEmail);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Resend error:", error);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
          التحقق من البريد الإلكتروني
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          تم إرسال رمز تحقق مكون من 4 أرقام إلى
          <span className="text-primary-600 block font-medium">
            {userEmail}
          </span>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <label
            htmlFor="code"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            أدخل رمز التحقق
          </label>
          <div dir="ltr" className="container_input_otp flex justify-center">
            <InputOtp
              value={code}
              onChange={handleOtpChange}
              length={4}
              variant="filled"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading || code.length !== 4}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--main-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 disabled:bg-gray-300"
          >
            {loading ? "جاري التحقق..." : "تحقق"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading}
            className="text-sm font-medium text-[var(--main-color)] transition-[0.3s] disabled:text-gray-400"
          >
            إعادة إرسال الرمز
          </button>

          <Link
            href="/login"
            className="text-sm font-medium text-[var(--main-font-color)] transition-[0.3s] hover:text-[var(--main-color)] disabled:text-gray-400"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </form>
    </>
  );
};

export default VerifyEmailPage;
