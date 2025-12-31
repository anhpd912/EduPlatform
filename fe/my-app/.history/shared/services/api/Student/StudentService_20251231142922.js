import { privateApi, publicApi } from "../../axios/AxiosClient";

export const StudentService = {
  getAllStudents: () => {
    return privateApi.get("/students");
  },
  getStudentById: (id) => {
    return privateApi.get(`/students/${id}`);
  },
  createStudent: (studentData) => {
    return privateApi.post("/students", studentData);
  },
  updateStudent: (id, studentData) => {
    return privateApi.put(`/students/${id}`, studentData);
  },
  deleteStudent: (id) => {
    return privateApi.delete(`/students/${id}`);
  },
  getPublicStudentInfo: (id) => {
    return publicApi.get(`/public/students/${id}`);
  },
};
