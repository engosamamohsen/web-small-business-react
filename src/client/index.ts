import axios from "axios";
import Cookies from "js-cookie";
import NProgress from "nprogress";
const url = process.env.NEXT_PUBLIC_API_URL as string;
const axiosInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    // headers: {
    //   platform: 3,
    //   lang: "en",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //   "Content-Type": "multipart/form-data",
    //   "Access-Control-Allow-Headers":
    //     "Origin, Content-Type, X-Auth-Token ,X-Requested-With",
    // },
  });

  instance.interceptors.request.use((config) => {
    NProgress.start();
    const token = Cookies.get("app_token");
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      NProgress.done();
      return response;
    },
    (error) => {
      NProgress.done();
      return Promise.reject(error);
    },
  );

  return instance;
};

export const $api = axiosInstance(url);
