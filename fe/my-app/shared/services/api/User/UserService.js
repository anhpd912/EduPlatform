import { privateApi, publicApi } from "../../axios/AxiosClient";

export const UserService = {
  getUsers: () => {
    return privateApi.get("/users/getAll");
  },
  getUserById: (id) => {
    return privateApi.get(`/users/${id}`);
  },
  createUser: (data) => {
    return privateApi.post("/users/create", data);
  },
  getProfile: () => {
    return privateApi.get("/users/myProfile");
  },
  completeRegistration: (data) => {
    return publicApi.post(`/users/complete-register`, data);
  },
};
