import { privateApi, publicApi } from "../../axios/AxiosClient";

const multipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const UserService = {
  getUsers: (params) => {
    return privateApi.get("/users/getAll", { params });
  },
  getUserById: (id) => {
    return privateApi.get(`/users/${id}`);
  },
  createUser: (data) => {
    return privateApi.post("/users/create", data, multipartConfig);
  },
  getProfile: () => {
    return privateApi.get("/users/myProfile");
  },
  updateProfile: (id, data) => {
    return privateApi.put(`/users/update/${id}`, data, multipartConfig);
  },
  completeRegistration: (data) => {
    return publicApi.post(`/users/complete-register`, data);
  },
};
