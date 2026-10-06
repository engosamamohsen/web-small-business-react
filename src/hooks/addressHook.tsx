// get ALL expense

import { $api } from "@/client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAsync, useAsyncRetry } from "react-use";
import { transformSelectData } from "@/lib/global";

export const useGovernorate = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const { data } = await $api.get(`v1/city`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "id",
      valueKey: "name",
    });
    return transformData;
  }, []);
  return {
    loading,
    value,
    retry,
  };
};

export const useCities = (governorateId?: number) => {
  const { value, loading } = useAsync(async () => {
    if (!governorateId) {
      return [];
    }
    const { data } = await $api.get(`v1/city/${governorateId}/cities`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "city_id",
      valueKey: "name",
    });
    return transformData;
  }, [governorateId]);
  return {
    loading,
    value,
  };
};
export const useGetAddress = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const { data } = await $api.get(`v1/customer-addresses/view`);
    return data?.data;
  }, []);
  return {
    loading,
    value,
    retry,
  };
};

export const useBranchesWithCity = (cityId?: number) => {
  const { value, loading } = useAsync(async () => {
    if (!cityId) {
      return [];
    }
    const { data } = await $api.get(`/v1/branches/by-city/${cityId}`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "id",
      valueKey: "address",
    });

    return transformData;
  }, [cityId]);
  return {
    loading,
    value,
  };
};

export const useAddress = () => {
  const [loading, setLoading] = useState(false);

  // create a new expense
  const createAddress = async (inputs: any) => {
    try {
      setLoading(true);

      const data = await $api.post(
        `/v1/customer-address`,
        transformCreateAddressInputs({ ...inputs }),
      );
      toast.success(`تمت إضافة العنوان الخاص بك`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (err: any) {
      toast.error(
        `  فشل اضافة العنوان الخاص بك : ${err?.response?.data?.message}`,
        {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        },
      );
      return err?.response;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAddress,
    loading,
  };
};

/** A saved address as GET v1/customer-addresses/view returns it (default first). */
export type SavedAddress = {
  id: number;
  is_default?: boolean;
  /** governorate */
  city_id: number;
  city_name: string;
  /** city / area */
  area_id: number;
  area_name: string;
  branch_id: number;
  branch_name: string;
  street: string;
  building: string;
  floor: number;
  flat: number;
  phone: string;
  special_sign: string;
  name?: string | null;
  email?: string | null;
  shipping_fees?: number;
};

const toastOptions = { position: "top-right" as const, autoClose: 2500, rtl: true };

/** Edit, delete, and choose the default address (My account → Addresses). */
export const useAddressBook = () => {
  const [loading, setLoading] = useState(false);

  const run = async (call: () => Promise<any>, ok: string, fail: string) => {
    try {
      setLoading(true);
      const response = await call();
      toast.success(ok, toastOptions);
      return response;
    } catch (err: any) {
      toast.error(`${fail}${err?.response?.data?.message ? ` : ${err.response.data.message}` : ""}`, toastOptions);
      return err?.response;
    } finally {
      setLoading(false);
    }
  };

  // The edit endpoint names the governorate city_id and the city area_id (like the list).
  const updateAddress = (id: number, inputs: any) =>
    run(
      () =>
        $api.put(`v1/customer-address/edit/${id}`, {
          city_id: inputs?.governorate?.value,
          area_id: inputs?.city?.value,
          street: inputs?.street,
          building: inputs?.building || null,
          floor: inputs?.floor || null,
          flat: inputs?.flat || null,
          phone: inputs?.phone,
          special_sign: inputs?.special_Sign || null,
          name: inputs?.name,
          email: inputs?.email || null,
        }),
      "تم تعديل العنوان",
      "تعذر تعديل العنوان",
    );

  const deleteAddress = (id: number) =>
    run(() => $api.delete(`v1/customer-address/delete/${id}`), "تم حذف العنوان", "تعذر حذف العنوان");

  const makeDefault = (id: number) =>
    run(() => $api.post(`v1/customer-address/default/${id}`), "أصبح هذا عنوانك الافتراضي", "تعذر تعيين العنوان الافتراضي");

  return { updateAddress, deleteAddress, makeDefault, loading };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (inputs: any) => {
    try {
      setLoading(true);

      const data = await $api.post(`v1/basket/buy`, {
        address_id: inputs.address?.id,
        shipping: inputs.shippingFees ?? 0,
        notes: inputs.desc,
        branch_id: inputs.branch_id?.value ?? null,
        payment_method: Number(inputs.paymentMethod || 1),
      });
      toast.success(data?.data?.message || `تمت إضافة الطلب بنجاح`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (err: any) {
      toast.error(`  فشل اضافة الطلب : ${err?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return err?.response;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
  };
};
const transformCreateAddressInputs = (inputs: any) => {
  return {
    name: inputs?.name,
    phone: inputs?.phone,
    email: inputs?.email || null,
    area_id: inputs?.governorate?.value,
    city_id: inputs?.city?.value,
    shipping: 0,
    street: inputs?.street,
    // Optional details; the server picks the branch that serves the city.
    special_sign: inputs?.special_Sign || null,
    floor: inputs?.floor || null,
    building: inputs?.building || null,
    flat: inputs?.flat || null,
  };
};
