import { axiosClient } from "../../axios/AxiosClient";
export const AuthService = {
  login: (data) => {
    return axiosClient.post("/auth/login", data);
  },
  register: (data) => {
    return axiosClient.post("/auth/register", data);
  },
  logout: () => {
    return axiosClient.post("/auth/logout");
  },
};
