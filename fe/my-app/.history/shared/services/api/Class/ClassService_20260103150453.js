import { privateApi } from "../../axios/AxiosClient";

export const ClassService = {
  getAllClasses: () => {
    return privateApi.get("/class/getAll");
  },
  getMyClass: () => {
    return privateApi.get("/class/myClasses");
  },
  getClassById: (classId) => {
    return privateApi.get(`/class/get/${classId}`);
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

export default ClassService;
