import { InputText } from "primereact/inputtext";
import React from "react";
import SelectInput from "../SelectInput/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import {
  addressFormSchema,
  AddressFormSchemaDefaultValues,
  AddressFormSchemaType,
} from "./addressFormSchema";
import { useForm } from "react-hook-form";
import { CircleX } from "lucide-react";
import { useAddress, useGovernorate } from "@/hooks/addressHook";
import { useUpdateEffect } from "react-use";

function DialogAddressForm({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean;
  setShowDialog: any;
}) {
  const { value: governorates } = useGovernorate();
  const {
    handleSubmit,
    setValue,
    watch,
    register,

    setError,
    formState: { errors },
  } = useForm<AddressFormSchemaType>({
    mode: "all",
    defaultValues: AddressFormSchemaDefaultValues,
    resolver: zodResolver(addressFormSchema),
  });
  const citiesValueFromGovernorate =
    watch("governorate")?.cities?.length > 0
      ? watch("governorate")?.cities
      : [];
  useUpdateEffect(() => {
    if (watch("governorate")?.length == 0) {
      setValue("city", "");
    }
  }, [watch("governorate")]);

  console.log("watch", watch());
  const { createAddress, loading } = useAddress();
  const onSubmit = async (inputs: any) => {
    console.log(inputs);
    await createAddress(inputs);
  };
  return (
    <>
      {" "}
      <Dialog
        visible={showDialog}
        modal
        className="mx-4 flex w-full items-center justify-center shadow-none"
        onHide={() => {
          if (!showDialog) return;
          setShowDialog(false);
        }}
        content={({ hide }) => (
          <div className="relative flex h-fit min-h-[880px] w-full max-w-[550px] flex-col items-center justify-center gap-2 rounded-md bg-[var(--main-background)] p-6 py-10 max-sm:min-h-[880px]">
            <div className="absolute top-1 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]">
              <div className="flex w-full items-center gap-1">
                <h4 className="text-[15px] font-semibold text-[var(--main-color)]">
                  اضف العنوان الخاص بيك
                </h4>
              </div>
              <Button
                icon={<CircleX />}
                rounded
                text
                onClick={(e) => hide(e)}
                className="w-fit text-[var(--second-font-color)] !shadow-none !outline-none"
              />
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <>
                  {" "}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        الاسم
                      </label>
                      <InputText
                        type="text"
                        required
                        placeholder="ادخل الاسم"
                        {...register("name")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        رقم الهاتف (واتساب){" "}
                      </label>
                      <InputText
                        type="tel"
                        required
                        placeholder="ادخل رقم الهاتف"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <InputText
                      type="email"
                      required
                      placeholder="ادخل البريد الالكتروني"
                      className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      العنوان
                    </label>
                    <InputText
                      type="text"
                      required
                      placeholder="ادخل العنوان"
                      className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        المحافظة{" "}
                      </label>
                      <SelectInput
                        name="governorate"
                        options={governorates?.length > 0 ? governorates : []}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        value={watch("governorate") || ""}
                        setValue={setValue}
                        optionLabel="name"
                        placeholder="اختر المحافظة"
                        setError={setError}
                      />{" "}
                      {errors.governorate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.governorate.message as any}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        المدينة او المنطقه{" "}
                      </label>
                      <SelectInput
                        name="city"
                        optionLabel="name"
                        disabled={
                          citiesValueFromGovernorate?.length === 0
                            ? false
                            : true
                        }
                        options={
                          citiesValueFromGovernorate?.length > 0
                            ? citiesValueFromGovernorate
                            : []
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        value={watch("city") || ""}
                        setValue={setValue}
                        placeholder="اختر المدينة او المنطقه"
                        setError={setError}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city.message as any}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        الشارع{" "}
                      </label>
                      <InputText
                        type="text"
                        required
                        placeholder="ادخل الشارع"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("street")}
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        علامة خاصة
                      </label>
                      <InputText
                        type="text"
                        required
                        placeholder="ادخل علامة خاصة"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("special_Sign")}
                      />
                      {errors.special_Sign && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.special_Sign.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        رقم المبنى
                      </label>
                      <InputText
                        type="number"
                        required
                        placeholder="ادخل رقم المبنى"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("building")}
                      />
                      {errors.building && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.building.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        رقم الدور
                      </label>
                      <InputText
                        type="number"
                        required
                        placeholder="ادخل رقم الدور"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("floor")}
                      />
                      {errors.floor && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.floor.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      رقم الشقة
                    </label>
                    <InputText
                      type="number"
                      required
                      placeholder="ادخل رقم الشقة"
                      className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                      {...register("flat")}
                    />
                    {errors.flat && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.flat.message}
                      </p>
                    )}
                  </div>
                </>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  تأكيد الطلب
                </button>
              </form>
            </div>
          </div>
        )}
      ></Dialog>
    </>
  );
}

export default DialogAddressForm;
