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
import { SettingsType } from "@/lib/types";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useLoginHook } from "@/hooks/auth/login";

const registerSchema = z
  .object({
    name: z.string().min(2, "يجب أن يكون الاسم مكونًا من حرفين على الأقل"),
    email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
    phone: z.string().min(11, "يجب أن يكون رقم الهاتف مكونًا من 11 رقمًا"),
    password: z
      .string()
      .min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
    confirmPassword: z
      .string()
      .min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({
  initSettings,
}: {
  initSettings: SettingsType;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    // watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { loading, register: registerUser } = useLoginHook();
  const onSubmit = async (inputs: any) => {
    await registerUser(inputs);
  };

  const token = Cookies.get("app_token");
  if (token) {
    router.push("/");
  }
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
            <h4 className="text-[15px] font-semibold text-[var(--main-color)]">
              {initSettings?.name ? initSettings?.name : ""}
            </h4>
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
            htmlFor="name"
            className="mb-3 block text-sm font-medium text-black"
          >
            الاسم الكامل
          </label>
          <div className="mt-1">
            <InputText
              id="name"
              {...register("name")}
              className="w-full rounded-md border border-gray-400 px-2 py-3"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

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
              className="w-full rounded-md border border-gray-400 px-2 py-3"
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
            htmlFor="phone"
            className="mb-3 block text-sm font-medium text-black"
          >
            رقم الهاتف
          </label>
          <div className="mt-1">
            <InputText
              id="phone"
              type="text"
              {...register("phone")}
              className="w-full rounded-md border border-gray-400 px-2 py-3"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
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
              className="password flex w-full items-center justify-stretch"
              inputClassName="w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-3 block text-sm font-medium text-black"
          >
            تأكيد كلمة المرور
          </label>
          <div className="mt-1">
            <Password
              id="confirmPassword"
              {...register("confirmPassword")}
              name="confirmPassword"
              inputRef={register("confirmPassword").ref}
              toggleMask
              onChange={(e) => setValue("confirmPassword", e.target.value)}
              feedback={false}
              className="password w-full"
              inputClassName="w-full px-2 py-3 rounded-md border border-gray-400 min-w-full rounded-md border border-gray-400"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
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
        <div className="flex w-full justify-center gap-1 text-sm text-black">
          <span> هل لديك حساب بالفعل ؟</span>
          <Link href="/login" className="text-[var(--main-color)]">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </form>
  );
}
