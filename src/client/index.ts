import axios from "axios";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import { getApiUrl } from "@/lib/config";

// No baseURL at creation time — resolved dynamically per request so the same
// built bundle works on every tenant subdomain.
const $api = axios.create();

$api.interceptors.request.use((config) => {
  NProgress.start();
  // Resolve baseURL from the current window.location on every request.
  if (!config.baseURL) {
    config.baseURL = getApiUrl();
  }
  const token = Cookies.get("app_token");
  if (token) config.headers.Authorization = "Token " + token;
  return config;
});

$api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

export { $api };
