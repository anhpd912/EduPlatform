import { authStore, loginAction, logoutAction } from "@/store/authStore";
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
        // Nếu đang refresh, thêm request vào queue và chờ
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return privateApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Gọi API làm mới token
      try {
        const res = await publicApi.post("/auth/refresh", {});
        console.log(res);

        const newToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;

        loginAction(
          newToken,
          refreshToken,
          res.data.userResponse.username,
          res.data.userResponse.roles[0].name
        );

        console.log("New Token:", newToken);

        // Process queue với token mới
        processQueue(null, newToken);

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.log("Error:", err);

        logoutAction();
        window.location.href =
          "/login?message=Session expired. Please log in again.";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { privateApi, publicApi };
