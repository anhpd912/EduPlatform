import { authStore, logoutAction } from "@/store/authStore";
import axios, { interceptors } from "axios";
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
publicApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
privateApi.interceptors.request.use(
  (config) => {
    const token = authStore.jwtToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
privateApi.interceptors.response.use(
  (response) => {
    console.log(response);
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorResponseCode = error.response?.data?.statusCode;
    if (errorResponseCode === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await publicApi.post("/auth/refresh", {});
        const newToken = response.accessToken;
        const refreshToken = response.refreshToken;
        authStore.setToken(newToken);
        localStorage.setItem("jwt_token", newToken);
        localStorage.setItem("refresh_token", refreshToken);
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null); // Hủy các request đang chờ

        // 1. Xóa sạch token ở LocalStorage để tránh loop vô tận
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");

        logoutAction();

        window.location.href =
          "/login?message=Session expired. Please log in again.";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  }
);

export { privateApi, publicApi };
