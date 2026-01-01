import { privateApi } from "../../axios/AxiosClient";

const BASE_URL = "/api/chat";

export const ClassService = {
  getAllClasses: () => {
    return privateApi.get("/class/getAll");
  },
  getMyClass: () => {
    return privateApi.get("/class/myClasses");
  },
};
