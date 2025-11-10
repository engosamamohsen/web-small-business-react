"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CartItemType } from "@/types/types";
import { useCheckout, useGetAddress } from "@/hooks/addressHook";
import { InputTextarea } from "primereact/inputtextarea";

import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
} from "./formSchema";
import AddressList from "./AddressList";
import DialogAddressForm from "./DialogAddressForm";
// import PaymentMethodsList from "./PaymentMethodsList";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useCartServices } from "@/hooks/cart/cart";
import PageLoader from "../PageLoader/PageLoader";
import { usePaymentMethods } from "@/hooks/payment/Payments";

export default function CheckoutPage() {
  const { loading: cartLoading, data: cartResponse } = useCartServices();
  const items = cartResponse?.cart_items || [];

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const { loading: addressLoading, value: address, retry } = useGetAddress();
  const { data: paymentMethods, loading: paymentLoading } = usePaymentMethods();

  // Auto-select VISA payment method (paymentId: 2) when payment methods are loaded
  useEffect(() => {
    if (paymentMethods?.length) {
      // Find VISA payment method (paymentId: 2)
      const visaMethod = paymentMethods.find(
        (method) => method.paymentId === 2,
      );
      if (visaMethod) {
        setValue("paymentMethod", visaMethod);
      }
    }
  }, [paymentMethods, setValue]);

  const { createOrder } = useCheckout();
  const onSubmit = async (inputs: any) => {
    setLoading(true);
    const res = await createOrder(inputs);
    if (res?.status === 200) {
      router.push("/order");
    }
    setLoading(false);
  };
  if (cartLoading) {
    return <PageLoader text={"جاري تحميل عربة التسوق"} />;
  }
  if (!items?.length) {
    return <EmptyCart />;
  }

  const total = cartResponse?.total_price || 0;
  const shippingFees = watch("address").shipping_fees || 0;
  return (
    <>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">إتمام الشراء</h1>
        <div className="flex w-full flex-col-reverse gap-8 lg:flex-row">
          <div className="w-full flex-1">
            {addressLoading ? (
              <AddressSkeleton />
            ) : (
              <BillingForm
                address={address}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                watch={watch}
                setValue={setValue}
                setError={setError}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                loading={loading}
                paymentMethods={paymentMethods}
                paymentLoading={paymentLoading}
              />
            )}
          </div>
          <OrderSummary
            items={items}
            total={total}
            shippingFees={shippingFees}
          />
        </div>
      </div>
      {showDialog && (
        <DialogAddressForm
          showDialog={showDialog}
          retryAddress={retry}
          setShowDialog={setShowDialog}
        />
      )}
    </>
  );
}

// --------------------- Sub Components ---------------------

const EmptyCart = () => (
  <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
    <h2 className="mb-4 text-2xl font-bold">عربة التسوق فارغة</h2>
    <Link
      href="/"
      className="font-semibold text-orange-500 hover:text-orange-600"
    >
      العودة للتسوق
    </Link>
  </div>
);

const AddressSkeleton = () => (
  <div className="mb-6 rounded-lg bg-white py-6">
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 rounded bg-gray-200"></div>
      <div className="flex items-center gap-4">
        <div className="h-12 w-40 rounded bg-gray-200"></div>
        <div className="h-10 w-full rounded bg-gray-200"></div>
      </div>
      <div className="h-[200px] w-full rounded bg-gray-200"></div>
      <div className="h-32 w-full rounded bg-gray-200"></div>
      <div className="h-12 w-full rounded bg-gray-200"></div>
    </div>
  </div>
);

type BillingFormProps = {
  address: any;
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
  watch: any;
  setValue: any;
  setError: any;
  register: any;
  errors: any;
  handleSubmit: any;
  onSubmit: (inputs: any) => void;
  loading: boolean;
  paymentMethods?: any[];
  paymentLoading?: boolean;
};

const BillingForm = ({
  address,
  setShowDialog,
  watch,
  setValue,
  setError,
  register,
  errors,
  handleSubmit,
  onSubmit,
  loading,
  // paymentMethods,
  // paymentLoading,
}: BillingFormProps) => (
  <div className="mb-6 rounded-lg bg-white px-4 py-6">
    <h2 className="mb-4 text-xl font-bold">معلومات الفاتورة</h2>
    <div className="mb-5 mt-10 flex items-center justify-between">
      <h3 className="mb-2 font-medium">
        {address?.length ? "العناوين المحفوظة" : "لا يوجد عناوين محفوظة"}
      </h3>
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="text-nowrap rounded-md bg-[var(--second-color)] px-3 py-4 text-[var(--main-background)]"
      >
        اضافة عنوان جديد
      </button>
    </div>

    {!address?.length ? (
      <h3 className="text-md flex h-[200px] items-center justify-center bg-slate-50 text-center font-bold text-red-600">
        لم يتم إضافة عنوان، من فضلك قم بإضافة عنوان لاستكمال الطلب
      </h3>
    ) : (
      <AddressList
        addresses={address}
        selectedAddressId={watch("address")?.id || null}
        onSelectAddress={(selectedAddress) => {
          setValue("address", selectedAddress);
          setError("address", { type: "manual", message: "" });
        }}
      />
    )}

    {/* {paymentLoading ? (
      <div className="mt-6 animate-pulse space-y-4">
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-16 rounded bg-gray-200"></div>
          <div className="h-16 rounded bg-gray-200"></div>
          <div className="h-16 rounded bg-gray-200"></div>
        </div>
      </div>
    ) : (
      <PaymentMethodsList
        paymentMethods={paymentMethods}
        selectedPaymentId={watch("paymentMethod")?.paymentId || null}
        onSelectPaymentMethod={(selectedPayment) => {
          setValue("paymentMethod", selectedPayment);
          setError("paymentMethod", { type: "manual", message: "" });
        }}
      />
    )} */}

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          ملاحظات إضافية
        </label>
        <InputTextarea
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
          {...register("desc")}
        />
        {errors.desc && (
          <p className="mt-1 text-sm text-red-600">{errors.desc.message}</p>
        )}
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">
            {errors.address.message?.toString()}
          </p>
        )}
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">
            {errors.paymentMethod.message?.toString()}
          </p>
        )}
      </div>

      <Button
        type="submit"
        loading={loading}
        className="flex w-full items-center justify-center gap-4 rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
      >
        تأكيد الطلب
      </Button>
    </form>
  </div>
);

type OrderSummaryProps = {
  items: CartItemType[];
  total: number;
  shippingFees: number;
};

const OrderSummary = ({ items, total, shippingFees }: OrderSummaryProps) => (
  <div className="h-fit w-full flex-1 rounded-lg bg-gray-100 p-6">
    <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
    <div className="max-h-[500px] space-y-4 overflow-y-auto bg-gray-50 px-10 pb-10">
      {items.map((item) => (
        <div
          key={item.cart_item_id}
          className="flex items-center gap-4 border-t border-gray-200 py-4 max-sm:items-start"
        >
          <div className="flex flex-1 items-start justify-start gap-4 max-sm:flex-col">
            {" "}
            <div className="relative h-20 w-20">
              <Image
                src={item.product_image}
                alt={item.product_name || ""}
                fill
                className="rounded object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.product_name}</h3>
              <p className="mt-2 text-end text-sm text-gray-800">
                {item.qty} ×{" "}
                {(
                  item.item_total -
                  (item.variations?.reduce(
                    (sum, variation) =>
                      sum +
                      variation.choices.reduce(
                        (choiceSum, choice) => choiceSum + choice.price,
                        0,
                      ),
                    0,
                  ) || 0)
                ).toFixed(1)}{" "}
                ج.م
              </p>
              {item.product_note && (
                <p className="mt-1 text-xs text-gray-500">
                  <span className="font-medium">ملاحظة:</span>{" "}
                  {item.product_note}
                </p>
              )}
              {item.variations && item.variations.length > 0 && (
                <div className="mt-1">
                  {item.variations.map((variation) => (
                    <div
                      key={variation.main_variation_id}
                      className="flex items-center justify-between gap-1 text-xs text-gray-500"
                    >
                      <span className="font-medium">
                        {variation.main_variation_name}:{" "}
                      </span>
                      {variation.choices.map((choice, idx) => (
                        <React.Fragment key={choice.id}>
                          {idx > 0 && <span>, </span>}
                          <bdi>
                            {choice.name} ({choice.price} ج.م+)
                          </bdi>
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-1 flex items-center justify-between text-sm text-gray-800">
                <span className="">إجمالي المنتج</span>
                <>{item.item_total.toFixed(2)} ج.م</>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-md space-y-2 border-t pt-4 font-bold">
      <div className="flex justify-between text-sm">
        <span>إجمالي المنتجات</span>
        <span>{total.toFixed(2)} ج.م</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>رسوم الشحن</span>
        <span>{shippingFees.toFixed(2)} ج.م</span>
      </div>
      <div className="text-md flex justify-between border-t pt-2">
        <span>الإجمالي النهائي</span>
        <span>{(total + shippingFees).toFixed(2)} ج.م</span>
      </div>
    </div>
  </div>
);
