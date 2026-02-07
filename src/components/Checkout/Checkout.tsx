/**
 * Checkout Component - React Island
 * 
 * Multi-step checkout form:
 * - Address selection/creation
 * - Order summary
 * - Payment method
 * - Order confirmation
 */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { fetchHook } from '@/lib/fetch-hook';
import { cn } from '@/utils/utils';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city_name?: string;
  governorate_name?: string;
  is_default?: boolean;
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get('app_token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    const response = await fetchHook<{ data: Address[] }>({
      url: 'v1/addresses',
      token,
    });
    if (response.ok && response.data) {
      const addrs = response.data.data || response.data;
      setAddresses(Array.isArray(addrs) ? addrs : []);
      const defaultAddr = addrs.find((a: Address) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    }
    setIsLoading(false);
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error('يرجى اختيار عنوان التوصيل');
      return;
    }

    setIsSubmitting(true);
    const response = await fetchHook({
      url: 'v1/orders',
      init: {
        method: 'POST',
        body: JSON.stringify({ address_id: selectedAddress }),
      },
      token,
    });

    if (response.ok) {
      toast.success('تم إرسال الطلب بنجاح');
      window.location.href = '/order';
    } else {
      toast.error(response.error || 'حدث خطأ في إرسال الطلب');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Steps Indicator */}
      <div className="mb-8 flex justify-center gap-4">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium',
              step >= s
                ? 'bg-[var(--main-color)] text-white'
                : 'bg-gray-200 text-gray-500'
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 1: Address Selection */}
      {step === 1 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-bold text-[var(--second-font-color)]">
            اختر عنوان التوصيل
          </h2>
          
          {addresses.length === 0 ? (
            <div className="text-center">
              <p className="mb-4 text-gray-500">لا توجد عناوين محفوظة</p>
              <button className="text-[var(--main-color)] hover:underline">
                إضافة عنوان جديد
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={cn(
                    'block cursor-pointer rounded-lg border p-4 transition-colors',
                    selectedAddress === address.id
                      ? 'border-[var(--main-color)] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={() => setSelectedAddress(address.id)}
                    className="sr-only"
                  />
                  <div className="font-medium">{address.name}</div>
                  <div className="text-sm text-gray-500">{address.phone}</div>
                  <div className="text-sm text-gray-500">
                    {address.street}
                    {address.city_name && `, ${address.city_name}`}
                    {address.governorate_name && ` - ${address.governorate_name}`}
                  </div>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!selectedAddress}
            className="mt-6 w-full rounded-lg bg-[var(--main-color)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-bold text-[var(--second-font-color)]">
            تأكيد الطلب
          </h2>
          
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium">عنوان التوصيل</h3>
            {addresses.find((a) => a.id === selectedAddress) && (
              <div className="text-sm text-gray-600">
                {addresses.find((a) => a.id === selectedAddress)?.street}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-gray-200 py-3 font-medium hover:bg-gray-50"
            >
              رجوع
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
