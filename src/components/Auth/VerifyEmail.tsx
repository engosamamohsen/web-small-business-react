/**
 * VerifyEmail Component - React Island
 *
 * OTP verification for email confirmation after registration
 * Matches Next.js behavior with 4-digit OTP and proper API endpoints
 */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { fetchHook } from '@/lib/fetch-hook';

interface VerifyEmailProps {
  email: string;
}

export default function VerifyEmail({ email }: VerifyEmailProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      toast.error('يرجى إدخال الرمز كاملاً');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData to match Next.js behavior
      const formData = new FormData();
      formData.append('email', email);
      formData.append('code', code);

      const response = await fetchHook({
        url: 'verify-user',
        init: {
          method: 'POST',
          body: formData,
          headers: {},
        },
      });

      if (response.ok) {
        toast.success('تم التحقق من البريد الإلكتروني بنجاح!');

        // Set token if available in response
        if (response.data?.data?.api_token) {
          Cookies.set('app_token', response.data.data.api_token, {
            expires: 1,
            path: '/',
          });
        }

        // Redirect to home page
        window.location.href = '/';
      } else {
        toast.error(response.error || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Create FormData to match Next.js behavior
      const formData = new FormData();
      formData.append('email', email);

      const response = await fetchHook({
        url: 'resend-verification-code',
        init: {
          method: 'POST',
          body: formData,
          headers: {},
        },
      });

      if (response.ok) {
        toast.success('تم إرسال رمز التحقق مرة أخرى!');
      } else {
        toast.error(response.error || 'حدث خطأ في إعادة الإرسال');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          أدخل رمز التحقق
        </label>
        {/* OTP Input - 4 digits */}
        <div
          className="container_input_otp flex justify-center gap-3"
          dir="ltr"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-14 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-[var(--main-color)] focus:outline-none"
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isLoading || otp.join('').length !== 4}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:bg-gray-300 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? 'جاري التحقق...' : 'تحقق'}
      </button>

      {/* Resend & Back to Login */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={handleResend}
          disabled={isResending || isLoading}
          className="font-medium text-[var(--main-color)] transition-colors hover:opacity-80 disabled:text-gray-400"
        >
          {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
        </button>

        <a
          href="/login"
          className="font-medium text-gray-600 transition-colors hover:text-[var(--main-color)]"
        >
          العودة لتسجيل الدخول
        </a>
      </div>
    </div>
  );
}
