"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Link from "@/components/common/Link";
import { loginWithGoogle } from "@/firebase/firebase-hooks";
import Image from "@/components/common/Image";
import { SettingsType } from "@/lib/types";
import { useRouter } from "@/lib/navigation";
import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
} from "./loginFormSchema";
import { useAuthHook } from "@/hooks/auth/apiAuth";
import Cookies from "js-cookie";
import { useEffect } from "react";
import CircleLogo from "@/global/CircleLogo";


export default function LoginForm({
  initSettings,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onSuccess,
  onNeedVerify,
}: {
  initSettings: SettingsType;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
  onSuccess?: () => void;
  /** Called when server returns 403 (email not verified) — dialog mode */
  onNeedVerify?: (email: string) => void;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema),
  });
  const { loading, login } = useAuthHook();
  const [googleLoading, setGoogleLoading] = useState(false);
  const onSubmit = async (inputs: any) => {
    await login(inputs, onSuccess, onNeedVerify);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // In dialog mode, call onSuccess to let the parent handle post-login flow
      // (e.g. close dialog, run pending action). In standalone page mode, go home.
      const action = onSuccess
        ? () => onSuccess()
        : () => router.push("/");
      await loginWithGoogle({ action });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Only auto-redirect if NOT in dialog mode (no onSuccess callback).
  // In dialog mode the parent handles post-login navigation.
  useEffect(() => {
    if (!onSuccess && Cookies.get("app_token")) {
      router.push("/");
    }
  }, [router, onSuccess]);
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
            <span> مرحبًا بك في </span>
            <div className="text-[15px] font-semibold text-[var(--main-color)]">
              {initSettings?.name ? initSettings?.name : ""}
            </div>
          </div>
          يرجى تسجيل الدخول لإجراء الطلب
        </div>
      </div>
      <div className="flex flex-col items-stretch justify-center gap-4">
        <Button
          type="button"
          loading={googleLoading}
          disabled={googleLoading || loading}
          onClick={handleGoogleLogin}
          className="mx-auto flex h-12 w-full flex-row-reverse items-center justify-center gap-2 rounded-full bg-orange-700 text-center text-white !shadow-none !outline-none disabled:opacity-70"
          icon={
            !googleLoading ? (
              <Image
                src="/icons8-google.svg"
                alt="أيقونة التسجيل عبر جوجل"
                width={28}
                height={28}
                className="mr-[6px]"
              />
            ) : undefined
          }
        >
          {googleLoading ? "جارٍ تسجيل الدخول..." : "Sign In with Google"}
        </Button>
        <h6 className="text-center text-[18px] font-semibold text-black">أو</h6>
      </div>
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

        <div>
          <label
            htmlFor="password"
            className="mb-3 block text-sm font-medium text-black"
          >
            كلمة المرور
          </label>
          <div className="mt-1">
            <Password
              id="password"
              {...register("password")}
              name="password"
              onChange={(e) =>
                setValue("password", e.target.value && e.target.value)
              }
              inputRef={register("password").ref}
              ptOptions={{ mergeSections: true, mergeProps: true }}
              toggleMask
              feedback={false}
              className="password flex w-full items-center justify-stretch rounded-md border border-gray-500"
              inputClassName="w-full px-2 py-3 min-w-full"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          label="تسجيل الدخول"
          className="w-full bg-[var(--main-color)] px-3 py-4 text-white"
          loading={loading}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 text-sm text-black">
          {onSwitchToRegister ? (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[var(--main-color)] hover:underline"
            >
              أنشاء حساب جديد
            </button>
          ) : (
            <Link href="/auth/register" className="text-[var(--main-color)]">
              أنشاء حساب جديد
            </Link>
          )}
        </div>
        <div className="text-sm text-black">
          {onSwitchToForgotPassword ? (
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-[var(--second-color)] hover:underline"
            >
              نسيت كلمة المرور ؟
            </button>
          ) : (
            <Link href="/auth/forgot-password" className="text-[var(--second-color)]">
              نسيت كلمة المرور ؟
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
