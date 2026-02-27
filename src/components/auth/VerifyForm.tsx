"use client";

import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useVerifyEmail } from "@/hooks/auth/verifyEmail";

type Mode = "register" | "reset";

interface VerifyFormProps {
    /** Email to verify (passed as prop inside dialog, or read from URL on standalone page) */
    email?: string;
    mode?: Mode;
    /**
     * Dialog mode: called after OTP is confirmed with (email, otp).
     * When provided, routing is skipped — the parent dialog handles navigation.
     */
    onVerified?: (email: string, otp: string) => void;
    /** Back to login (dialog only) */
    onSwitchToLogin?: () => void;
}

export default function VerifyForm({
    email: propEmail,
    mode: propMode,
    onVerified,
    onSwitchToLogin,
}: VerifyFormProps) {
    const [email, setEmail] = useState(propEmail || "");
    const [mode, setMode] = useState<Mode>(propMode || "register");
    const [code, setCode] = useState("");
    const { loading, verifyEmail, resendVerificationCode } = useVerifyEmail();

    // Read email & mode from URL search params (standalone page usage only)
    useEffect(() => {
        // Only read from URL if no props were provided (i.e. not inside a dialog)
        if (!propEmail && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const urlEmail = params.get("email");
            const urlMode = params.get("mode") as Mode | null;
            if (urlEmail) setEmail(decodeURIComponent(urlEmail));
            if (urlMode === "reset" || urlMode === "register") setMode(urlMode);
        }
    }, [propEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || code.length < 4) return;

        if (onVerified) {
            // Dialog mode: verify the OTP, then hand off email+otp to parent
            await verifyEmail(email, code, mode, onVerified);
        } else {
            // Standalone page mode: hook handles routing internally
            await verifyEmail(email, code, mode);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        await resendVerificationCode(email);
    };

    const title =
        mode === "reset" ? "التحقق لاستعادة كلمة المرور" : "التحقق من البريد الإلكتروني";
    const subtitle =
        mode === "reset"
            ? "أدخل رمز التحقق المرسل إلى بريدك لإعادة تعيين كلمة المرور"
            : "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني";

    return (
        <form
            onSubmit={handleSubmit}
            className="my-8 w-[350px] max-w-full space-y-6"
            dir="rtl"
        >
            {/* Header */}
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
                <div className="mb-4 mt-4 flex w-full flex-col items-center justify-center gap-3 text-black">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--main-color)] text-white">
                        <i className="pi pi-envelope text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-black">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                    {email && (
                        <p className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-[var(--main-color)]">
                            {email}
                        </p>
                    )}
                </div>
            </div>

            {/* OTP input */}
            <div className="space-y-2">
                <label htmlFor="otp-code" className="block text-sm font-medium text-black">
                    رمز التحقق
                </label>
                <InputText
                    id="otp-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="أدخل رمز التحقق"
                    maxLength={10}
                    className="w-full rounded-md border border-gray-400 px-3 py-3 text-center text-lg tracking-widest"
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                label={loading ? "جارٍ التحقق..." : "تأكيد الرمز"}
                className="w-full bg-[var(--main-color)] py-4 text-white"
                loading={loading}
                disabled={loading || code.length < 4}
            />

            {/* Resend */}
            <div className="text-center text-sm text-gray-500">
                لم تستلم الرمز؟{" "}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="font-medium text-[var(--main-color)] hover:underline disabled:opacity-50"
                >
                    إعادة الإرسال
                </button>
            </div>

            {/* Back to login (dialog only) */}
            {onSwitchToLogin && (
                <div className="text-center text-sm text-gray-500">
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="font-medium text-[var(--second-color)] hover:underline"
                    >
                        العودة إلى تسجيل الدخول
                    </button>
                </div>
            )}
        </form>
    );
}
