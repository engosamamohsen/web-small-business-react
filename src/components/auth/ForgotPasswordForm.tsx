"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Link from "@/components/common/Link";
import { SettingsType } from "@/lib/types";
import { useRouter } from "@/lib/navigation";
import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
} from "./schemas";

import { useForgotPasswordHook } from "@/hooks/auth/forgotPassword";
import CircleLogo from "@/global/CircleLogo";

export default function ForgotPasswordForm({
  initSettings,
  onSwitchToLogin,
}: {
  initSettings: SettingsType;
  onSwitchToLogin?: () => void;
}) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchemaType>({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const { loading, sendOtp } = useForgotPasswordHook();

  // send otp to user email
  const onSubmit = async (inputs: FormSchemaType) => {
    const success = await sendOtp(inputs);
    if (success) {
      router.push(`/forgot-password/${inputs.email}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-8 w-[350px] max-w-full space-y-6"
      dir="rtl"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
        {initSettings?.logo && (
          <CircleLogo src={initSettings?.logo} className="mr-2" />

        )}
        <div className="mb-4 mt-8 flex w-full flex-col items-center justify-center gap-3 text-black">
          <div className="flex w-full items-center justify-center gap-1">
            <span> استعادة كلمة المرور </span>
            <div className="text-[15px] font-semibold text-[var(--main-color)]">
              {initSettings?.name ? initSettings?.name : ""}
            </div>
          </div>
          أدخل بريدك الإلكتروني لاستلام رمز التحقق
        </div>
      </div>

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

      <div className="flex items-center justify-center gap-2">
        <div className="flex gap-1 text-sm text-black">
          <span>لديك حساب بالفعل؟</span>
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[var(--main-color)] hover:underline"
            >
              تسجيل الدخول
            </button>
          ) : (
            <Link href="/auth/login" className="text-[var(--main-color)]">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
