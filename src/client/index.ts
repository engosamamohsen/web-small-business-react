import axios from "axios";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import { getApiUrl } from "@/lib/config";

// No baseURL at creation time — resolved dynamically per request so the same
// built bundle works on every tenant subdomain.
const $api = axios.create();

$api.interceptors.request.use((config) => {
  NProgress.start();
  if (!config.baseURL) {
    config.baseURL = getApiUrl();
  }
  const token = Cookies.get("app_token");
  if (token) config.headers.Authorization = "Token " + token;

  console.log(
    `%c[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    "color: #4f9cf9; font-weight: bold",
  );

  return config;
});

$api.interceptors.response.use(
  (response) => {
    NProgress.done();
    console.log(
      `%c[API] ${response.status} ${response.config.baseURL}${response.config.url}`,
      "color: #22c55e; font-weight: bold",
      response.data,
    );
    return response;
  },
  (error) => {
    NProgress.done();
    console.error(
      `%c[API] ERROR ${error?.response?.status ?? "network"} ${error?.config?.baseURL}${error?.config?.url}`,
      "color: #ef4444; font-weight: bold",
      error?.response?.data ?? error?.message,
    );
    return Promise.reject(error);
  },
);

export { $api };
