// get ALL expense

import { $api } from "@/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAsyncRetry } from "react-use";

export const useGovernorate = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const data = await $api.get(`/governorates`);
    function convertIdToValue(data: any) {
      return data.map((item: any) => ({
        value: item.id,
        name: item.name,
        cities:
          item.cities?.map((city: any) => ({
            value: city.id,
            name: city.name,
            regions:
              city?.regions?.map((region: any) => ({
                value: region.id,
                name: region.name,
              })) || [],
          })) || [],
      }));
    }
    const targetData =
      data?.data?.data?.length > 0 ? convertIdToValue(data?.data?.data) : [];
    console.log("targetData", targetData);
    return targetData;
  }, []);
  return {
    loading,
    value,
    retry,
  };
};

export const useAddress = () => {
  const routes = useRouter();
  const [loading, setLoading] = useState(false);

  // create a new expense
  const createAddress = async (inputs: any) => {
    try {
      setLoading(true);

      const data = await $api.post(
        `/customers/create_update_address`,
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
      if (err?.response?.status === 403) {
        Cookies.remove("app_token");
        routes.push("/login");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAddress,
    loading,
  };
};

const transformCreateAddressInputs = (inputs: any) => {
  console.log("transformCreateAddressInputs", inputs);
  return {
    name: inputs?.name,
    phone: inputs?.phone,
    email: inputs?.email,
    address: inputs?.address,
    governorate_id: inputs?.governorate?.value,
    city_id: inputs?.city?.value,
    shipping: 0,
    street: inputs?.street,
    special_sign: inputs?.special_Sign,
    floor: inputs?.floor,
    building: inputs?.building,
    flat: inputs?.flat,
  };
};
