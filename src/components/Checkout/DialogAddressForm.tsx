import { InputText } from "primereact/inputtext";
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
import {
  useAddress,
  useAddressBook,
  useCities,
  useGovernorate,
  type SavedAddress,
} from "@/hooks/addressHook";
import { $api } from "@/client";
import { useUpdateEffect } from "react-use";
import { useEffect } from "react";

function DialogAddressForm({
  showDialog,
  setShowDialog,
  retryAddress,
  address,
}: {
  showDialog: boolean;
  setShowDialog: any;
  retryAddress: () => void;
  /** Edit this saved address instead of adding a new one. */
  address?: SavedAddress | null;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AddressFormSchemaType>({
    mode: "all",
    defaultValues: AddressFormSchemaDefaultValues,
    resolver: zodResolver(addressFormSchema),
  });
  const { loading: governoratesLoading, value: governorates } =
    useGovernorate();
  const { loading: citiesLoading, value: cities } = useCities(
    watch("governorate")?.value || "",
  );
  useUpdateEffect(() => {
    if (!watch("governorate")?.value) {
      setValue("city", "");
    }
  }, [watch("governorate")]);

  // Opening the dialog fills the form with the address being edited (or clears it).
  useEffect(() => {
    if (!showDialog) return;
    if (!address) {
      reset(AddressFormSchemaDefaultValues);
      // A new address starts with the customer's own name, phone and email.
      let cancelled = false;
      $api
        .post("v1/get-profile")
        .then(({ data }) => {
          const profile = data?.data;
          if (cancelled || !profile) return;
          if (!getValues("name") && profile.name)
            setValue("name", String(profile.name));
          if (!getValues("phone") && profile.phone)
            setValue("phone", String(profile.phone));
          if (!getValues("email") && profile.email)
            setValue("email", String(profile.email));
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
    reset({
      ...AddressFormSchemaDefaultValues,
      name: address.name || "",
      email: address.email || "",
      phone: address.phone || "",
      governorate: { value: address.city_id, name: address.city_name } as any,
      city: { value: address.area_id, name: address.area_name } as any,
      street: address.street || "",
      special_Sign: address.special_sign || "",
      building: address.building ? String(address.building) : "",
      floor: address.floor ? String(address.floor) : "",
      flat: address.flat ? String(address.flat) : "",
    });
  }, [showDialog, address, reset]);

  const { createAddress, loading: creating } = useAddress();
  const { updateAddress, loading: updating } = useAddressBook();
  const loading = creating || updating;
  const onSubmit = async (inputs: any) => {
    const data = address
      ? await updateAddress(address.id, inputs)
      : await createAddress(inputs);
    if (data?.status === 201 || (address && data?.status === 200)) {
      setShowDialog(false);
      retryAddress();
    }
  };
  return (
    <>
      <Dialog
        visible={showDialog}
        modal
        className="mx-4 flex w-full items-center justify-center shadow-none"
        onHide={() => {
          if (!showDialog) return;
          setShowDialog(false);
        }}
        content={({ hide }) => (
          <div className="h-full w-fit overflow-y-auto rounded-md max-md:max-h-[700px] max-sm:max-h-[550px]">
            <div className="relative flex h-fit w-full max-w-[550px] flex-col items-center justify-start gap-2 overflow-y-auto rounded-md bg-[var(--main-background)] p-6 py-10">
              <div className="absolute top-1 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]">
                <div className="flex w-full items-center gap-1">
                  <h4 className="text-[15px] font-semibold text-[var(--main-color)]">
                    {address ? "تعديل العنوان" : "عنوان التوصيل"}
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

              <div className="flex h-full w-full flex-col items-center justify-start gap-4">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="address-name"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          الاسم <span className="text-red-500">*</span>
                        </label>
                        <InputText
                          id="address-name"
                          type="text"
                          autoComplete="name"
                          placeholder="ادخل الاسم"
                          className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="address-phone"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          رقم الهاتف (واتساب){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <InputText
                          id="address-phone"
                          type="tel"
                          inputMode="tel"
                          dir="ltr"
                          autoComplete="tel"
                          placeholder="01XXXXXXXXX"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          المحافظة <span className="text-red-500">*</span>
                        </label>
                        <SelectInput
                          name="governorate"
                          optionLabel="name"
                          loading={governoratesLoading}
                          options={governorates || []}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          value={watch("governorate") || ""}
                          setValue={setValue}
                          placeholder="اختر المحافظة"
                          setError={setError}
                        />
                        {errors.governorate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.governorate.message as any}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          المدينة / المنطقة{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <SelectInput
                          name="city"
                          optionLabel="name"
                          disabled={!watch("governorate")?.value}
                          loading={citiesLoading}
                          options={cities || []}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          value={watch("city") || ""}
                          setValue={setValue}
                          placeholder="اختر المدينة أو المنطقة"
                          setError={setError}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city.message as any}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="address-street"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        العنوان (الشارع والمنطقة){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        id="address-street"
                        type="text"
                        autoComplete="street-address"
                        placeholder="مثال: 12 شارع التحرير، الدقي"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("street")}
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="address-building"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          رقم / اسم المبنى{" "}
                          <span className="text-xs font-normal text-gray-400">
                            (اختياري)
                          </span>
                        </label>
                        <InputText
                          id="address-building"
                          type="text"
                          placeholder="المبنى"
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
                        <label
                          htmlFor="address-floor"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          الدور{" "}
                          <span className="text-xs font-normal text-gray-400">
                            (اختياري)
                          </span>
                        </label>
                        <InputText
                          id="address-floor"
                          type="text"
                          inputMode="numeric"
                          placeholder="الدور"
                          className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          {...register("floor")}
                        />
                        {errors.floor && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.floor.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="address-flat"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          الشقة{" "}
                          <span className="text-xs font-normal text-gray-400">
                            (اختياري)
                          </span>
                        </label>
                        <InputText
                          id="address-flat"
                          type="text"
                          inputMode="numeric"
                          placeholder="الشقة"
                          className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          {...register("flat")}
                        />
                        {errors.flat && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.flat.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="address-special_Sign"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        علامة مميزة{" "}
                        <span className="text-xs font-normal text-gray-400">
                          (اختياري)
                        </span>
                      </label>
                      <InputText
                        id="address-special_Sign"
                        type="text"
                        placeholder="مثال: بجوار البنك"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("special_Sign")}
                      />
                      {errors.special_Sign && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.special_Sign.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="address-email"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        البريد الإلكتروني{" "}
                        <span className="text-xs font-normal text-gray-400">
                          (اختياري)
                        </span>
                      </label>
                      <InputText
                        id="address-email"
                        type="email"
                        dir="ltr"
                        autoComplete="email"
                        placeholder="ادخل البريد الإلكتروني"
                        className="w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    تأكيد العنوان
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      ></Dialog>
    </>
  );
}

export default DialogAddressForm;
