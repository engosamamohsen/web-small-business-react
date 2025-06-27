"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "primereact/button";
import { Password } from "primereact/password";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  resetPasswordDefaultValues,
  ResetPasswordSchemaType,
} from "../formSchema";

import { useForgotPasswordHook } from "@/hooks/auth/forgotPassword";

export default function ResetPasswordForm({
  userEmail,
}: {
  userEmail: string;
}) {
  const router = useRouter();

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
  const { resetLoading, resetPassword } = useForgotPasswordHook();

  // Reset password form submission
  const onResetSubmit = async (data: ResetPasswordSchemaType) => {
    const success = await resetPassword(data);
    if (success) {
      // Success message is shown in the hook
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={handleSubmitReset(onResetSubmit)}
      className="my-8 w-[350px] max-w-full space-y-6"
      dir="rtl"
    >
      <div className="text-center">
        <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
          يمكنك الآن إعادة تعيين كلمة المرور{" "}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="text-primary-600 block font-medium">
            {userEmail}
          </span>
        </p>
      </div>
      <div className="space-y-6">
        {/* OTP and password fields */}
        <div className="space-y-4">
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
            disabled={resetLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--main-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 disabled:bg-gray-300"
            loading={resetLoading}
            label={
              resetLoading
                ? "جاري إعادة تعيين كلمة المرور..."
                : "إعادة تعيين كلمة المرور"
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--main-font-color)] transition-[0.3s] hover:text-[var(--main-color)] disabled:text-gray-400"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </form>
  );
}
