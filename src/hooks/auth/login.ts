import { $api } from "@/client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const addUserToDatabase = async (data: any, action: () => void) => {
  try {
    const { data: response }: any = await $api.post(
      "register-social",
      transformUserData(data),
    );
    if (response?.data?.status !== 200) {
      toast.error(` فشل تسجيل الدخول : ${response?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw new Error(response?.message);
    } else {
      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }); // Expires in 1 day

      toast.success("تم تسجيل الدخول بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });

      if (action) {
        action();
      }
    }
  } catch (err: any) {
    console.log(err.response?.data?.message);

    toast.error(` فشل تسجيل الدخول : ${err?.response?.data?.message}`, {
      position: "top-right",
      autoClose: 2000,
      rtl: true,
    });
  }
};

function transformUserData(data: any) {
  const formData = new FormData();
  formData.append("register_type", "2");
  formData.append("social_id", data?.uid);
  if (data?.displayName) {
    formData.append("name", data?.displayName);
  }
  if (data?.email) {
    formData.append("email", data?.email);
  }
  if (data?.photoURL) {
    formData.append("image", data?.photoURL);
  }
  return formData;
}

import { useState } from "react";

export const useLoginHook = () => {
  const [loading, setLoading] = useState(false);
  const routes = useRouter();

  /**
   * On Share Project action
   */
  const login = async (inputs: any) => {
    try {
      setLoading(true);

      const { data: response } = await $api.post(
        `login-user`,
        transformInput(inputs),
      );

      toast.success("تم تسجيل الدخول بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });

      console.log("🔐 Setting cookie with token:", response?.data?.api_token ? "***" + response.data.api_token.slice(-8) : "null");
      console.log("🌍 Environment:", process.env.NODE_ENV);
      console.log("🔒 Secure flag:", process.env.NODE_ENV === "production");

      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }); // Expires in 1 day

      // Verify cookie was set
      const verifyToken = Cookies.get("app_token");
      console.log("✅ Cookie set successfully:", !!verifyToken);
      if (verifyToken) {
        console.log("✅ Verified token:", "***" + verifyToken.slice(-8));
      } else {
        console.error("❌ Cookie was NOT set!");
      }

      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        routes.replace("/");
        routes.refresh();
      }
    } catch (error: any) {
      toast.error(` فشل تسجيل الدخول : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (inputs: any) => {
    try {
      setLoading(true);

      const { data: response } = await $api.post(
        `register-user`,
        transformRegisterInput(inputs),
      );
      routes.push(`/verify/${response?.data?.email}`);
    } catch (error: any) {
      toast.error(` فشل التسجيل : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    register,
  };
};

const transformInput = (inputs: any) => {
  const formData = new FormData();
  formData.append("type", "1");
  formData.append("email", inputs?.email);
  formData.append("password", inputs?.password);

  return formData;
};

const transformRegisterInput = (inputs: any) => {
  const formData = new FormData();
  formData.append("name", inputs?.name);
  formData.append("email", inputs?.email);
  formData.append("password", inputs?.password);
  formData.append("password_confirmation", inputs?.confirmPassword);
  formData.append("register_type", "1");
  formData.append("phone", inputs?.phone);

  return formData;
};
