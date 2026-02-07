/**
 * ForgotPasswordVerify Component - React Island
 * 
 * Handles OTP verification for forgot password flow.
 * Redirects to reset password page on successful verification.
 */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { fetchHook } from '@/lib/fetch-hook';

interface ForgotPasswordVerifyProps {
  email: string;
}

export default function ForgotPasswordVerify({ email }: ForgotPasswordVerifyProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newCode = [...code];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = code.join('');
    
    if (otpCode.length !== 4) {
      toast.error('الرجاء إدخال رمز التحقق المكون من 4 أرقام');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: `verify-otp?email=${encodeURIComponent(email)}&otp=${otpCode}`,
        init: { method: 'POST' },
      });

      if (response.ok && response.data?.token) {
        Cookies.set('verify_token', response.data.token, {
          expires: 1,
          path: '/',
        });
        toast.success('تم التحقق من البريد الإلكتروني بنجاح!');
        // Redirect to reset password page
        window.location.href = `/forgot-password/${encodeURIComponent(email)}/reset`;
      } else {
        toast.error(response.error || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetchHook({
        url: 'send-otp',
        init: { 
          method: 'POST', 
          body: JSON.stringify({ email }) 
        },
      });

      if (response.ok) {
        toast.success('تم إعادة إرسال رمز التحقق');
      } else {
        toast.error(response.error || 'حدث خطأ أثناء إعادة إرسال الرمز');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          أدخل رمز التحقق
        </label>
        <div dir="ltr" className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-14 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-[var(--main-color)] focus:outline-none"
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || code.join('').length !== 4}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:bg-gray-300 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? 'جاري التحقق...' : 'تحقق'}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleResendCode}
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
    </form>
  );
}
