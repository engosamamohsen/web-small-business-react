/**
 * Cart Component - React Island
 * 
 * Shopping cart with:
 * - Item listing
 * - Quantity controls
 * - Remove functionality
 * - Total calculation
 */
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { cartCountAtom } from '@/stores/cart';
import { fetchHook } from '@/lib/fetch-hook';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variations?: Record<string, string>;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCartCount] = useAtom(cartCountAtom);
  const token = Cookies.get('app_token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    setIsLoading(true);
    const response = await fetchHook<{ data: CartItem[] }>({
      url: 'v1/basket',
      token,
    });
    if (response.ok && response.data) {
      const cartItems = response.data.data || response.data;
      setItems(Array.isArray(cartItems) ? cartItems : []);
    }
    setIsLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const response = await fetchHook({
      url: `v1/basket/${itemId}`,
      init: {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQuantity }),
      },
      token,
    });

    if (response.ok) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      toast.error('حدث خطأ في تحديث الكمية');
    }
  };

  const removeItem = async (itemId: string) => {
    const response = await fetchHook({
      url: `v1/basket/${itemId}`,
      init: { method: 'DELETE' },
      token,
    });

    if (response.ok) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setCartCount((prev) => Math.max(0, prev - 1));
      toast.success('تم حذف المنتج');
    } else {
      toast.error('حدث خطأ في الحذف');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-medium text-gray-600">السلة فارغة</h2>
        <p className="mb-4 text-gray-400">لم تضف أي منتجات بعد</p>
        <a
          href="/"
          className="rounded-lg bg-[var(--main-color)] px-6 py-3 text-white hover:opacity-90"
        >
          تصفح المنتجات
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="divide-y divide-gray-100 rounded-lg bg-white shadow">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded object-cover"
                />
              )}
              <div className="flex flex-1 flex-col">
                <h3 className="font-medium text-[var(--second-font-color)]">
                  {item.name}
                </h3>
                {item.variations && Object.keys(item.variations).length > 0 && (
                  <p className="text-sm text-gray-500">
                    {Object.values(item.variations).join(' / ')}
                  </p>
                )}
                <p className="mt-auto font-bold text-[var(--main-color)]">
                  {item.price} ج.م
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-bold text-[var(--second-font-color)]">
            ملخص الطلب
          </h3>
          <div className="mb-4 flex justify-between border-b pb-4">
            <span>الإجمالي</span>
            <span className="font-bold text-[var(--main-color)]">{total} ج.م</span>
          </div>
          <a
            href="/checkout"
            className="block w-full rounded-lg bg-[var(--main-color)] py-3 text-center font-medium text-white hover:opacity-90"
          >
            إتمام الطلب
          </a>
        </div>
      </div>
    </div>
  );
}
