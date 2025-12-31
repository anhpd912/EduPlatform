import { privateApi, publicApi } from "../../axios/AxiosClient";

export const StudentService = {
  getAllStudents: (params) => {
    return privateApi.get("/student/getAll", { params: params });
  },
  getStudentById: (id) => {
    return privateApi.get(`/student/${id}`);
  },
  createStudent: (studentData) => {
    // Don't set Content-Type manually for FormData - browser will set it automatically with boundary
    return privateApi.post("/student", studentData);
  },
  updateStudent: (id, studentData) => {
    // Don't set Content-Type manually for FormData - browser will set it automatically with boundary
    return privateApi.put(`/student/${id}`, studentData);
  },
  deleteStudent: (id) => {
    return privateApi.delete(`/student/${id}`);
  },
  getPublicStudentInfo: (id) => {
    return publicApi.get(`/public/student/${id}`);
  },
};
