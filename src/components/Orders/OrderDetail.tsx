/**
 * OrderDetail Component - React Island
 */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchHook } from '@/lib/fetch-hook';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  items: OrderItem[];
  address?: { street: string };
  created_at: string;
}

export default function OrderDetail({ orderId }: { orderId?: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('app_token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (!orderId) return;
    fetchHook<{ data: Order }>({ url: `v1/orders/${orderId}`, token }).then(
      (res) => {
        if (res.ok) {
          const data = res.data as unknown;
          const orderData = (data as { data?: Order })?.data ?? (data as Order);
          setOrder(orderData);
        }
        setIsLoading(false);
      }
    );
  }, [token, orderId]);

  if (isLoading)
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
      </div>
    );
  if (!order)
    return <div className="text-center text-gray-500">الطلب غير موجود</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 font-bold">تفاصيل الطلب</h3>
        <div className="divide-y">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-4 py-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
              </div>
              <p className="font-bold text-[var(--main-color)]">
                {item.price * item.quantity} ج.م
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 text-left">
          <span className="text-gray-500">الإجمالي:</span>
          <span className="mr-2 text-xl font-bold text-[var(--main-color)]">
            {order.total} ج.م
          </span>
        </div>
      </div>
      {order.address && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 font-bold">عنوان التوصيل</h3>
          <p className="text-gray-600">{order.address.street}</p>
        </div>
      )}
    </div>
  );
}
