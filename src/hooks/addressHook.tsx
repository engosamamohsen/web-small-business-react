// get ALL expense

import { $api } from "@/client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAsync, useAsyncRetry } from "react-use";
import { transformSelectData } from "@/lib/global";

export const useGovernorate = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const { data } = await $api.get(`/city`);
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
    const { data } = await $api.get(`/city/${governorateId}/cities`);
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
    const { data } = await $api.get(`/customer-addresses/view`);
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
    const { data } = await $api.get(`/branches/by-city/${cityId}`);
    const transformData = transformSelectData({
      data: data.branches,
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
        `/customer-address`,
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

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);

  // create a new expense
  const createOrder = async (inputs: any) => {
    try {
      setLoading(true);

      const data = await $api.post(`/v1/basket/buy`, {
        address_id: inputs.address?.id,
        shipping: 0,
        notes: inputs.desc,
        payment_method: inputs.paymentMethod?.paymentId || 1, // Default to cash (id: 1) if not selected
      });
      toast.success(`تمت إضافة الطلب بنجاح`, {
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
    email: inputs?.email,
    address: inputs?.address,
    area_id: inputs?.governorate?.value,
    city_id: inputs?.city?.value,
    shipping: 0,
    street: inputs?.street,
    special_sign: inputs?.special_Sign,
    floor: inputs?.floor,
    building: inputs?.building,
    flat: inputs?.flat,
    branch_id: inputs?.branch_id?.value,
  };
};
