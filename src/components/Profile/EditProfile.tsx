/**
 * EditProfile Component - React Island
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { fetchHook } from '@/lib/fetch-hook';

interface FormData { name: string; phone: string; }

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('app_token');
  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return; }
    fetchHook<{ data: FormData }>({ url: 'v1/profile', token }).then(res => {
      if (res.ok && res.data) { setValue('name', res.data.data?.name || ''); setValue('phone', res.data.data?.phone || ''); }
    });
  }, [token, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const response = await fetchHook({ url: 'v1/profile', init: { method: 'PUT', body: JSON.stringify(data) }, token });
    if (response.ok) { toast.success('تم تحديث الملف الشخصي'); window.location.href = '/profile'; }
    else toast.error(response.error || 'حدث خطأ');
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className="mb-1 block text-sm font-medium">الاسم</label><input {...register('name')} className="w-full rounded-lg border px-4 py-3" /></div>
        <div><label className="mb-1 block text-sm font-medium">الهاتف</label><input {...register('phone')} className="w-full rounded-lg border px-4 py-3" dir="ltr" /></div>
        <div className="flex gap-4">
          <a href="/profile" className="flex-1 rounded-lg border py-3 text-center hover:bg-gray-50">إلغاء</a>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 text-white disabled:opacity-50">
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}حفظ
          </button>
        </div>
      </form>
    </div>
  );
}
