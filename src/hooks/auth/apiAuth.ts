import { $api } from "@/client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "@/lib/navigation";
import { useState } from "react";

// ─── Social login (Google) ────────────────────────────────────────────────────

export const addUserToDatabase = async (data: any, action: () => void) => {
  try {
    const { data: response }: any = await $api.post(
      "v1/register-social",
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
      console.log("user is loggin");
      console.log("user", response?.data);
      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

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

// ─── Email / password auth hook ───────────────────────────────────────────────

export const useAuthHook = () => {
  const [loading, setLoading] = useState(false);
  const routes = useRouter();

  /**
   * Login with email + password.
   * HTTP 403 → email not verified → redirect to /auth/verify
   */
  const login = async (
    inputs: any,
    onSuccess?: () => void,
    onNeedVerify?: (email: string) => void,
  ) => {
    try {
      setLoading(true);

      const { data: response } = await $api.post(
        `v1/login-user`,
        transformInput(inputs),
      );

      // Save token
      Cookies.set("app_token", response?.data?.api_token, {
        expires: 1,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      toast.success("تم تسجيل الدخول بنجاح!", {
        position: "top-right",
        autoClose: 1500,
        rtl: true,
      });

      if (onSuccess) {
        onSuccess();
      } else if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        routes.replace("/");
        routes.refresh();
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      // 403 = email not verified
      if (status === 403) {
        toast.warn("يرجى التحقق من بريدك الإلكتروني أولاً", {
          position: "top-right",
          autoClose: 3000,
          rtl: true,
        });
        if (onNeedVerify) {
          // Dialog mode: parent handles navigation
          onNeedVerify(inputs?.email || "");
        } else {
          // Standalone page mode: navigate via URL
          const email = encodeURIComponent(inputs?.email || "");
          routes.push(`/auth/verify?email=${email}&mode=register`);
        }
        return;
      }

      toast.error(` فشل تسجيل الدخول : ${message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user.
   * On success → redirect to /auth/verify?email=…
   */
  const register = async (
    inputs: any,
    onSuccess?: () => void,
    onNeedVerify?: (email: string) => void,
  ) => {
    try {
      setLoading(true);

      const { data: response } = await $api.post(
        `v1/register-user`,
        transformRegisterInput(inputs),
      );

      if (response?.status === true || response?.status === 200) {
        toast.success("تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني.", {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        });
        if (onNeedVerify) {
          // Dialog mode: parent handles navigation
          onNeedVerify(inputs?.email || "");
        } else {
          // Standalone page mode
          const email = encodeURIComponent(inputs?.email || "");
          routes.push(`/auth/verify?email=${email}&mode=register`);
        }
      } else {
        toast.error(response?.message || "فشل التسجيل", {
          position: "top-right",
          autoClose: 2000,
          rtl: true,
        });
      }
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
    register: register as (
      inputs: any,
      onSuccess?: () => void,
      onNeedVerify?: (email: string) => void,
    ) => Promise<void>,
  };
};

// Keep backward-compatible alias
export const useLoginHook = useAuthHook;

// ─── Input transformers ───────────────────────────────────────────────────────

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
  // Debug flag — development only
  if (import.meta.env.DEV) {
    formData.append("debug", "true");
  }
  return formData;
};
