"use client";

import Image from "next/image";
import { CartItem } from "@/lib/types";
import Link from "next/link";
import { InputTextarea } from "primereact/inputtextarea";
import {
  formSchema,
  formSchemaDefaultValues,
  FormSchemaType,
} from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectInput from "../SelectInput/SelectInput";
import DialogAddressForm from "./DialogAddressForm";
import { useState } from "react";
import { cn } from "@/utils/utils";

export default function CheckoutPage({
  items,
  address,
}: {
  items: CartItem[];
  address: any[];
}) {
  console.log("address", address);
  const [showDialog, setShowDialog] = useState(false);
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

  const onSubmit = async (inputs: any) => {
    console.log(inputs);
  };

  const total = items?.reduce(
    (acc, item) => acc + (item?.price_after || 0) * (item.count || 1),
    0,
  );

  if (items?.length === 0) {
    return (
      <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">عربة التسوق فارغة</h2>
        <Link
          href="/"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <>
      {" "}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">إتمام الشراء</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 rounded-lg bg-white py-6">
              <h2 className="mb-4 text-xl font-bold">معلومات الفاتورة</h2>
              <div className="mb-4 flex flex-col items-start justify-start gap-2">
                <div className="flex w-full items-center justify-between gap-4 max-sm:flex-col-reverse max-sm:items-stretch max-sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setShowDialog(true)}
                    className="text- text-nowrap rounded-md bg-[var(--second-color)] px-3 py-4 text-[var(--main-background)]"
                  >
                    اضافة عنوان جديد
                  </button>
                  <SelectInput
                    name="address"
                    options={address?.length > 0 ? address : []}
                    placeholder={
                      address?.length > 0
                        ? "اختر عنوان"
                        : " لا يوجد عنوان  قم بإضافة عنوان جديد"
                    }
                    disabled={!address?.length}
                    className={cn(
                      "w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                      !address?.length && "!cursor-not-allowed",
                    )}
                    value={watch("address") || ""}
                    setValue={setValue}
                    setError={setError}
                  />{" "}
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message as string}
                  </p>
                )}
              </div>
              <h3 className="text-md flex h-[200px] items-center justify-center bg-slate-50 text-center font-bold text-red-600">
                لم يتم إضافة عنوان من فضلك قم بإضافة عنوان لاستكمال الطلب{" "}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.desc.message}
                    </p>
                  )}
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
            <div className="rounded-lg bg-gray-100 p-6">
              <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
              <div className="max-h-[500px] space-y-4 overflow-y-auto bg-gray-50 px-10 pb-10">
                {items?.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-t border-gray-200 py-4"
                  >
                    <div className="relative h-20 w-20">
                      <Image
                        src={item.image}
                        alt={item?.name || ""}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item?.name}</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {item.count} × {item.price_after} ج.م
                      </p>
                    </div>
                    <span className="font-semibold">
                      {item.price * (item?.count || 1)} ج.م
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="text-md flex justify-between font-bold">
                  <span>إجمالي المنتجات</span>
                  <span>{total} ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <DialogAddressForm
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      )}
    </>
  );
}
