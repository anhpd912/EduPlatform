import { publicApi, privateApi } from "../../axios/AxiosClient";
export const AuthService = {
  login: (data) => {
    return publicApi.post("/auth/login", data);
  },
  logout: () => {
    return privateApi.post("/auth/logout");
  },
  refreshToken: () => {
    return privateApi.post("/auth/refresh");
  },
  register: (data) => {
    const formData = new FormData();
    formData.append("user-data", JSON.stringify(data));
    return publicApi.post("/users/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  resetPassword: (data) => {
    return publicApi.get("/auth/reset-password", { params: data });
  },
  changePassword: (data) => {
    return publicApi.post("/auth/reset-password", data);
  },
  getDeviceLogins: () => {
    return privateApi.get("/auth/devices");
  },
};
