"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Link from "next/link";
import { loginWithGoogle } from "@/firebase/firebase-hooks";
import Image from "next/image";
import GoogleIcon from "../../../../assets/icons/icons8-google.svg";

import { SettingsType } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
} from "./formSchema";
import { useLoginHook } from "@/hooks/auth/login";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function LoginForm({
  initSettings,
}: {
  initSettings: SettingsType;
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
  const { loading, login } = useLoginHook();
  const onSubmit = async (inputs: any) => {
    await login(inputs);
  };

  useEffect(() => {
    const token = Cookies.get("app_token");
    if (token) {
      router.push("/");
    }
  }, [router]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          loading={loading}
          onClick={() => loginWithGoogle({ action: () => router.push("/") })}
          className="mx-auto flex h-12 w-full flex-row-reverse items-center justify-center gap-2 rounded-full bg-orange-700 text-center text-white !shadow-none !outline-none"
          icon={
            <Image
              src={GoogleIcon}
              alt="Google Icon"
              width={28}
              height={28}
              className="mr-[6px]"
            />
          }
        >
          Sign In with Google
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
          <Link href="/register" className="text-[var(--main-color)]">
            أنشاء حساب جديد
          </Link>
        </div>
        <div className="text-sm text-black">
          <Link href="/forgot-password" className="text-[var(--second-color)]">
            نسيت كلمة المرور ؟
          </Link>
        </div>
      </div>
    </form>
  );
}
