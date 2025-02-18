"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Link from "next/link";
import { loginWithGoogle } from "@/firebase/firebase-hooks";
import Image from "next/image";
import GoogleIcon from "../../../../assets/icons/icons8-google.svg";
import { useAtom } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";
import { useHydrateAtoms } from "jotai/utils";
import { SettingsType } from "@/lib/types";

const loginSchema = z.object({
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function RegisterForm({
  initSettings,
}: {
  initSettings: SettingsType;
}) {
  useHydrateAtoms([[settingsDataAtom, initSettings]], {
    dangerouslyForceHydrate: true,
  });
  const [settingsData] = useAtom(settingsDataAtom);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implement registration logic with Supabase
      console.log("Registration data:", data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-8 w-[350px] max-w-full space-y-6"
      dir="rtl"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
        {settingsData?.logo && (
          <Image
            src={settingsData?.logo}
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
              {settingsData?.name ? settingsData?.name : ""}
            </div>
          </div>
          يرجى تسجيل الدخول لإجراء الطلب
        </div>
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
          label="إنشاء حساب"
          className="w-full bg-[var(--main-color)] py-4 text-white"
        />
      </div>
      <div className="text-center">
        <div className="text-sm text-black">
          ليس لديك حساب ؟
          <Link href="/register" className="text-[var(--main-color)]">
            أنشاء حساب جديد
          </Link>
        </div>
      </div>
      <Button
        type="button"
        onClick={loginWithGoogle}
        className="mx-auto flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-[var(--second-background)] text-center !shadow-none !outline-none"
        icon={
          <Image
            src={GoogleIcon}
            alt="Google Icon"
            width={28}
            height={28}
            className="mr-[6px]"
          />
        }
      />
    </form>
  );
}
