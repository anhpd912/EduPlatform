import { privateApi, publicApi } from "../../axios/AxiosClient";

export const UserService = {
  getUsers: (params) => {
    return privateApi.get("/users/getAll", { params });
  },
  getUserById: (id) => {
    return privateApi.get(`/users/${id}`);
  },
  createUser: (data) => {
    // Don't set Content-Type manually for FormData - browser will set it automatically with boundary
    return privateApi.post("/users/create", data);
  },
  getProfile: () => {
    return privateApi.get("/users/myProfile");
  },
  updateProfile: (id, data) => {
    // Don't set Content-Type manually for FormData - browser will set it automatically with boundary
    return privateApi.put(`/users/update/${id}`, data);
  },
  completeRegistration: (data) => {
    return publicApi.post(`/users/complete-register`, data);
  },
};
