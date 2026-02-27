"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "./schemas";
import { useForgotPasswordHook } from "@/hooks/auth/forgotPassword";
import Link from "@/components/common/Link";

interface ResetPasswordFormProps {
    /** Email confirmed during OTP verification */
    email?: string;
    /** The OTP code the user entered (sent as body param to api) */
    otp?: string;
    /** Called after successful reset (dialog mode: go back to login) */
    onSuccess?: () => void;
    /** Back to login (dialog mode) */
    onSwitchToLogin?: () => void;
}

export default function ResetPasswordForm({
    email: propEmail,
    otp: propOtp,
    onSuccess,
    onSwitchToLogin,
}: ResetPasswordFormProps) {
    // On the standalone page, read email from URL if not passed as prop
    let email = propEmail || "";
    let otp = propOtp || "";
    if (!email && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        email = decodeURIComponent(params.get("email") || "");
        otp = params.get("otp") || "";
    }

    const {
        handleSubmit,
        setValue,
        register,
        formState: { errors },
    } = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const { resetLoading, resetPassword } = useForgotPasswordHook();

    const onSubmit = async (data: ResetPasswordSchemaType) => {
        const success = await resetPassword({ ...data, email, otp });
        if (success && onSuccess) {
            onSuccess();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-8 w-[350px] max-w-full space-y-6"
            dir="rtl"
        >
            {/* Header */}
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
                <div className="mb-4 mt-4 flex w-full flex-col items-center justify-center gap-3 text-black">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--main-color)] text-white">
                        <i className="pi pi-lock text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-black">إعادة تعيين كلمة المرور</h2>
                    <p className="text-sm text-gray-500">أدخل كلمة المرور الجديدة</p>
                </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
                <label htmlFor="new_password" className="block text-sm font-medium text-black">
                    كلمة المرور الجديدة
                </label>
                <Password
                    id="new_password"
                    {...register("new_password")}
                    name="new_password"
                    onChange={(e) => setValue("new_password", e.target.value)}
                    inputRef={register("new_password").ref}
                    toggleMask
                    feedback={false}
                    ptOptions={{ mergeSections: true, mergeProps: true }}
                    className="password flex w-full items-center justify-stretch rounded-md border border-gray-400"
                    inputClassName="w-full px-2 py-3 min-w-full"
                />
                {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
                )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
                <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-black">
                    تأكيد كلمة المرور الجديدة
                </label>
                <Password
                    id="new_password_confirmation"
                    {...register("new_password_confirmation")}
                    name="new_password_confirmation"
                    onChange={(e) => setValue("new_password_confirmation", e.target.value)}
                    inputRef={register("new_password_confirmation").ref}
                    toggleMask
                    feedback={false}
                    ptOptions={{ mergeSections: true, mergeProps: true }}
                    className="password flex w-full items-center justify-stretch rounded-md border border-gray-400"
                    inputClassName="w-full px-2 py-3 min-w-full"
                />
                {errors.new_password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.new_password_confirmation.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <Button
                type="submit"
                label="تغيير كلمة المرور"
                className="w-full bg-[var(--main-color)] py-4 text-white"
                loading={resetLoading}
                disabled={resetLoading}
            />

            {/* Back to login */}
            <div className="text-center text-sm text-gray-500">
                {onSwitchToLogin ? (
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="font-medium text-[var(--second-color)] hover:underline"
                    >
                        العودة إلى تسجيل الدخول
                    </button>
                ) : (
                    <Link href="/auth/login" className="font-medium text-[var(--second-color)] hover:underline">
                        العودة إلى تسجيل الدخول
                    </Link>
                )}
            </div>
        </form>
    );
}
