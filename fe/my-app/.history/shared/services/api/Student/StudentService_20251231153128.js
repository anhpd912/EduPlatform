import { privateApi, publicApi } from "../../axios/AxiosClient";

const multipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const StudentService = {
  getAllStudents: (params) => {
    return privateApi.get("/student/getAll", { params: params });
  },
  getStudentById: (id) => {
    return privateApi.get(`/student/${id}`);
  },
  createStudent: (studentData) => {
    return privateApi.post("/student", studentData, multipartConfig);
  },
  updateStudent: (id, studentData) => {
    return privateApi.put(`/student/${id}`, studentData, multipartConfig);
  },
  deleteStudent: (id) => {
    return privateApi.delete(`/student/${id}`);
  },
  getPublicStudentInfo: (id) => {
    return publicApi.get(`/public/student/${id}`);
  },
};
