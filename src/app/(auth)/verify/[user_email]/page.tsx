'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useVerifyEmail } from '@/hooks/auth/verifyEmail';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const VerifyEmailPage = () => {
  const params = useParams();
  const userEmail = decodeURIComponent(params.user_email as string);
  const { verifyEmail, resendVerificationCode, loading } = useVerifyEmail();
  
  // State for verification code inputs
  const [code, setCode] = useState(['', '', '', '']);
  
  // Create refs at the top level as per React hooks rules
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  
  // Create an array of refs that won't change between renders
  const inputRefs = useMemo(() => [
    inputRef1, inputRef2, inputRef3, inputRef4
  ], []);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value.slice(0, 1); // Take only one digit
      setCode(newCode);

      // Auto-focus to next input if current input is filled
      if (value && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  // Handle key press for backspace and navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus previous input
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length === 4) {
      try {
        await verifyEmail(userEmail, fullCode);
      } catch (error) {
        // Error is already handled in the hook with toast
        console.error('Verification error:', error);
      }
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    try {
      await resendVerificationCode(userEmail);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Resend error:', error);
    }
  };

  // Focus first input on component mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, [inputRefs]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">التحقق من البريد الإلكتروني</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            تم إرسال رمز تحقق مكون من 4 أرقام إلى
            <span className="block font-medium text-primary-600">{userEmail}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <label htmlFor="code" className="mb-3 block text-sm font-medium text-gray-700">
              أدخل رمز التحقق
            </label>
            <div className="flex justify-center gap-3 rtl:flex-row-reverse">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={inputRefs[index]}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-lg font-medium shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  maxLength={1}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || code.some((digit) => !digit)}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              {loading ? 'جاري التحقق...' : 'تحقق'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400"
            >
              إعادة إرسال الرمز
            </button>
            
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
