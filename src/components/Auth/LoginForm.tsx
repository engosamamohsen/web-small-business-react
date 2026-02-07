/**
 * LoginForm Component - React Island
 *
 * Email/password login with Firebase social login
 * Matches Next.js behavior exactly
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { fetchHook } from '@/lib/fetch-hook';
import { loginWithGoogle } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (Cookies.get('app_token')) {
      window.location.href = '/';
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Create FormData to match Next.js behavior
      const formData = new FormData();
      formData.append('type', '1');
      formData.append('email', data.email);
      formData.append('password', data.password);

      const response = await fetchHook<{ data: { api_token: string } }>({
        url: 'login-user',
        init: {
          method: 'POST',
          body: formData,
          headers: {}, // Remove Content-Type to let browser set multipart boundary
        },
      });

      if (response.ok && response.data?.data?.api_token) {
        Cookies.set('app_token', response.data.data.api_token, {
          expires: 1,
          path: '/',
        });
        toast.success('تم تسجيل الدخول بنجاح!');
        window.location.href = '/';
      } else {
        toast.error(response.error || 'بيانات الدخول غير صحيحة');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle({ action: () => (window.location.href = '/') });
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--main-color)] focus:outline-none"
          placeholder="example@email.com"
          dir="ltr"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-[var(--main-color)] focus:outline-none"
            placeholder="••••••••"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        تسجيل الدخول
      </button>

      {/* Social Login Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">أو</span>
        </div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        تسجيل الدخول بـ Google
      </button>
    </form>
  );
}
