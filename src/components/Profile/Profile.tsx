/**
 * Profile Component - React Island
 */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User, Mail, Phone, Edit } from 'lucide-react';
import { fetchHook } from '@/lib/fetch-hook';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('app_token');

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return; }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    const response = await fetchHook<{ data: UserData }>({ url: 'v1/profile', token });
    if (response.ok && response.data) setUser(response.data.data || response.data);
    setIsLoading(false);
  };

  if (isLoading) return <div className="flex min-h-[300px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--second-font-color)]">معلومات الحساب</h2>
        <a href="/profile/edit" className="flex items-center gap-1 text-[var(--main-color)] hover:underline"><Edit className="h-4 w-4" /> تعديل</a>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3"><User className="h-5 w-5 text-gray-400" /><div><span className="text-sm text-gray-500">الاسم</span><p className="font-medium">{user?.name || '-'}</p></div></div>
        <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-gray-400" /><div><span className="text-sm text-gray-500">البريد</span><p className="font-medium">{user?.email || '-'}</p></div></div>
        <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-gray-400" /><div><span className="text-sm text-gray-500">الهاتف</span><p className="font-medium">{user?.phone || '-'}</p></div></div>
      </div>
      <div className="mt-8 border-t pt-6"><a href="/order" className="block w-full rounded-lg border border-[var(--main-color)] py-3 text-center font-medium text-[var(--main-color)] hover:bg-orange-50">عرض طلباتي</a></div>
    </div>
  );
}
