"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import Link from "next/link";
import Image from "next/image";
import { SettingsType } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
  resetPasswordSchema,
  resetPasswordDefaultValues,
  ResetPasswordSchemaType,
} from "./formSchema";
import { useState } from "react";

import "../verify/[user_email]/style.css";
import { useForgotPasswordHook } from "@/hooks/auth/forgotPassword";

export default function ForgotPasswordForm({
  initSettings,
}: {
  initSettings: SettingsType;
}) {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState<string>("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchemaType>({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema),
  });

  // Reset password form
  const {
    handleSubmit: handleSubmitReset,
    register: registerReset,
    setValue,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordSchemaType>({
    mode: "all",
    defaultValues: resetPasswordDefaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    loading,
    resetLoading,
    sendOtp,
    resendOtp,
    resetPassword,
    showResetForm,
  } = useForgotPasswordHook();

  // send otp to user email
  const onSubmit = async (inputs: FormSchemaType) => {
    const success = await sendOtp(inputs);
    if (success) {
      setValue("email", inputs.email);
      setEmailSent(true);
      router.push(`/forgot-password/${inputs.email}`);
    }
  };

  // Reset password form submission
  const onResetSubmit = async (data: ResetPasswordSchemaType) => {
    const success = await resetPassword(data);
    if (success) {
      // Success message is shown in the hook
      router.push("/login");
    }
  };

  const handleOtpChange = (e: any) => {
    console.log(e.value);
    setCode(e.value);
  };

  const handleResendCode = async () => {
    await resendOtp();
  };

  return (
    <form
      onSubmit={
        !emailSent
          ? handleSubmit(onSubmit)
          : showResetForm
            ? handleSubmitReset(onResetSubmit)
            : handleSubmitReset(onResetSubmit)
      }
      className="my-8 w-[350px] max-w-full space-y-6"
      dir="rtl"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
        {initSettings?.logo && (
          <Image
            src={initSettings?.logo}
            alt="logo app"
            width={80}
            height={80}
            className="mr-[6px]"
          />
        )}
        <div className="mb-4 mt-8 flex w-full flex-col items-center justify-center gap-3 text-black">
          <div className="flex w-full items-center justify-center gap-1">
            <span> استعادة كلمة المرور </span>
            <div className="text-[15px] font-semibold text-[var(--main-color)]">
              {initSettings?.name ? initSettings?.name : ""}
            </div>
          </div>
          {!emailSent
            ? "أدخل بريدك الإلكتروني لاستلام رمز التحقق"
            : "أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني"}
        </div>
      </div>

      {!emailSent ? (
        <>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-sm font-medium text-black"
              >
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <InputText
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full rounded-md border border-gray-500 px-2 py-3"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              label="إرسال رمز التحقق"
              className="w-full bg-[var(--main-color)] px-3 py-4 text-white"
              loading={loading}
            />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* OTP and password fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                رمز التحقق
              </label>
              <div
                dir="ltr"
                className="container_input_otp flex justify-center"
              >
                <InputOtp
                  id="otp"
                  value={code}
                  onChange={(e: any) => {
                    console.log("OTP value:", e.value);
                    handleOtpChange(e);
                    setValue("otp", e?.value ?? "");
                  }}
                  length={4}
                  variant="filled"
                />
              </div>
              {resetErrors.otp && (
                <p className="mt-1 text-sm text-red-600">
                  {resetErrors.otp.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                كلمة المرور الجديدة
              </label>

              <Password
                id="new_password"
                {...registerReset("new_password")}
                name="new_password"
                onChange={(e) =>
                  setValue("new_password", e.target.value && e.target.value)
                }
                inputRef={registerReset("new_password").ref}
                ptOptions={{ mergeSections: true, mergeProps: true }}
                toggleMask
                feedback={false}
                className="password flex w-full items-center justify-stretch"
                inputClassName="w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
              />
              {resetErrors.new_password && (
                <p className="mt-1 text-sm text-red-600">
                  {resetErrors.new_password.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="new_password_confirmation"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                تأكيد كلمة المرور
              </label>

              <Password
                id="new_password_confirmation"
                {...registerReset("new_password_confirmation")}
                name="new_password_confirmation"
                onChange={(e) =>
                  setValue(
                    "new_password_confirmation",
                    e.target.value && e.target.value,
                  )
                }
                inputRef={registerReset("new_password_confirmation").ref}
                ptOptions={{ mergeSections: true, mergeProps: true }}
                toggleMask
                feedback={false}
                className="password flex w-full items-center justify-stretch"
                inputClassName="w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
              />
              {resetErrors.new_password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {resetErrors.new_password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={resetLoading || code.length !== 4}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--main-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 disabled:bg-gray-300"
              loading={resetLoading}
              label={
                resetLoading
                  ? "جاري إعادة تعيين كلمة المرور..."
                  : "إعادة تعيين كلمة المرور"
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm font-medium text-[var(--main-font-color)] transition-[0.3s] hover:text-[var(--main-color)] disabled:text-gray-400"
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
        </div>
      )}

      {!emailSent && (
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1 text-sm text-black">
            <span>لديك حساب بالفعل؟</span>
            <Link href="/login" className="text-[var(--main-color)]">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
