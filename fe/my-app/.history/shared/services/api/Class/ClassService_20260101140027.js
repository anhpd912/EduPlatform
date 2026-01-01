import { create } from "domain";
import { privateApi } from "../../axios/AxiosClient";

const BASE_URL = "/api/chat";

export const ClassService = {
  getAllClasses: () => {
    return privateApi.get("/class/getAll");
  },
  getMyClass: () => {
    return privateApi.get("/class/myClasses");
  },
  createClass: (classData) => {
    return privateApi.post("/class/create", classData);
  },
  updateClass: (classId, classData) => {
    return privateApi.put(`/class/update/${classId}`, classData);
  },
  deleteClass: (classId) => {
    return privateApi.delete(`/class/delete/${classId}`);
  },
};
