import { pulicApi, privateApi } from "../../axios/AxiosClient";
export const AuthService = {
  login: (data) => {
    return pulicApi.post("/auth/login", data);
  },
  logout: () => {
    return privateApi.post("/auth/logout");
  },
  refreshToken: () => {
    return privateApi.post("/auth/refresh");
  },
  register: (data) => {
    return pulicApi.post("/users/create", data);
  },
  resetPassword: (data) => {
    return pulicApi.get("/auth/reset-password", { params: data });
  },
  changePassword: (data) => {
    return pulicApi.post("/auth/reset-password", data);
  },
};
