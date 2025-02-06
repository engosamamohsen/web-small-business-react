"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    notes: "",
  });

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 0),
    0,
  );
  const shipping = 30;
  const tax = 20;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the order submission
    console.log("Order submitted:", { items, formData, total });
    clearCart();
    // Redirect to success page or show confirmation
    alert("تم تقديم طلبك بنجاح!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">إتمام الشراء</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-6 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">معلومات الفاتورة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    الاسم الأول
                  </label>
                  <InputText
                    type="text"
                    name="firstName"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    الاسم الأخير
                  </label>
                  <InputText
                    type="text"
                    name="lastName"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <InputText
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <InputText
                  type="tel"
                  name="phone"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  العنوان
                </label>
                <InputText
                  type="text"
                  name="address"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    المدينة
                  </label>
                  <InputText
                    type="text"
                    name="city"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    المنطقة
                  </label>
                  <InputText
                    type="text"
                    name="region"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ملاحظات إضافية
                </label>
                <InputTextarea
                  name="notes"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
              >
                تأكيد الطلب
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-t border-gray-200 py-4"
                >
                  <div className="relative h-20 w-20">
                    <Image
                      src={item.image}
                      alt={item?.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item?.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {item.price} ج.م
                    </p>
                  </div>
                  <span className="font-semibold">
                    {item.price * item?.quantity} ج.م
                  </span>
                </div>
              ))}

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>إجمالي المنتجات</span>
                  <span>{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>مصاريف الشحن</span>
                  <span>{shipping} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة</span>
                  <span>{tax} ج.م</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>الإجمالي</span>
                    <span>{total} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
