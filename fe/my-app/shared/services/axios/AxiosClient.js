import { authStore, logoutAction } from "@/store/authStore";
import axios, { interceptors } from "axios";
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
        const response = await privateApi.post("/auth/refresh", {});
        const newToken = response.accessToken;
        const refreshToken = response.refreshToken;
        authStore.setToken(newToken);
        localStorage.setItem("jwt_token", newToken);
        localStorage.setItem("refresh_token", refreshToken);
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logoutAction();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  }
);
const pulicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
pulicApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { privateApi, pulicApi };
