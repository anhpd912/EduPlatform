import { privateApi, publicApi } from "../../axios/AxiosClient";

export const UserService = {
  getUsers: (params) => {
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
  updateProfile: (id, data) => {
    return privateApi.put(`/users/update/${id}`, data);
  },
  completeRegistration: (data) => {
    return publicApi.post(`/users/complete-register`, data);
  },
};
