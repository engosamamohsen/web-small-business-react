/**
 * ForgotPasswordForm Component - React Island
 *
 * Handles the initial step of forgot password flow:
 * - Enter email
 * - Send OTP to email
 * - Redirect to verification page
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { fetchHook } from '@/lib/fetch-hook';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'البريد الإلكتروني غير صالح' }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: 'send-otp',
        init: { method: 'POST', body: JSON.stringify({ email: data.email }) },
      });

      if (response.ok) {
        toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
        // Redirect to verification page
        window.location.href = `/forgot-password/${encodeURIComponent(data.email)}`;
      } else {
        toast.error(response.error || 'حدث خطأ أثناء إرسال رمز التحقق');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--main-color)] focus:outline-none"
          dir="ltr"
          placeholder="example@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
      </button>
    </form>
  );
}
