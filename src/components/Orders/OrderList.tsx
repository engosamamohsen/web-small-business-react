/**
 * OrderList Component - React Island
 */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchHook } from '@/lib/fetch-hook';

interface Order { id: string; order_number: string; status: string; total: number; created_at: string; }
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'قيد الانتظار', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  processing: { label: 'جاري التجهيز', color: 'text-blue-600 bg-blue-50', icon: Package },
  shipped: { label: 'تم الشحن', color: 'text-purple-600 bg-purple-50', icon: Package },
  delivered: { label: 'تم التوصيل', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('app_token');

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return; }
    fetchHook<{ data: Order[] }>({ url: 'v1/orders', token }).then(res => {
      if (res.ok) setOrders(res.data?.data || []);
      setIsLoading(false);
    });
  }, [token]);

  if (isLoading) return <div className="flex min-h-[300px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" /></div>;
  if (!orders.length) return <div className="flex min-h-[300px] flex-col items-center justify-center"><Package className="mb-4 h-16 w-16 text-gray-300" /><p className="text-gray-500">لا توجد طلبات</p></div>;

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const status = statusMap[order.status] || statusMap.pending;
        const Icon = status.icon;
        return (
          <a key={order.id} href={`/order/${order.id}`} className="block rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">طلب #{order.order_number}</p><p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p></div>
              <div className="text-left"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${status.color}`}><Icon className="h-4 w-4" />{status.label}</span><p className="mt-1 font-bold text-[var(--main-color)]">{order.total} ج.م</p></div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
