/**
 * ResetPasswordForm Component - React Island
 * 
 * Handles password reset after OTP verification.
 * Uses token stored in cookies from verification step.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { fetchHook } from '@/lib/fetch-hook';

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' }),
    new_password_confirmation: z
      .string()
      .min(1, { message: 'تأكيد كلمة المرور مطلوب' }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: 'كلمات المرور غير متطابقة',
    path: ['new_password_confirmation'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const verifyToken = Cookies.get('verify_token');
    
    if (!verifyToken) {
      toast.error('انتهت صلاحية الجلسة. يرجى إعادة التحقق من البريد الإلكتروني');
      window.location.href = '/forgot-password';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: 'reset-password',
        init: {
          method: 'POST',
          body: JSON.stringify({
            new_password: data.new_password,
            new_password_confirmation: data.new_password_confirmation,
            token: verifyToken,
          }),
        },
      });

      if (response.ok || response.status === 200) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        Cookies.remove('verify_token');
        // Redirect to login after success
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(response.error || 'حدث خطأ أثناء تغيير كلمة المرور');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label
            htmlFor="new_password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              id="new_password"
              type={showPassword ? 'text' : 'password'}
              {...register('new_password')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-[var(--main-color)] focus:outline-none"
              dir="ltr"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.new_password && (
            <p className="mt-1 text-sm text-red-500">{errors.new_password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="new_password_confirmation"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              id="new_password_confirmation"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('new_password_confirmation')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-[var(--main-color)] focus:outline-none"
              dir="ltr"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.new_password_confirmation && (
            <p className="mt-1 text-sm text-red-500">
              {errors.new_password_confirmation.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? 'جاري إعادة تعيين كلمة المرور...' : 'إعادة تعيين كلمة المرور'}
      </button>
    </form>
  );
}
