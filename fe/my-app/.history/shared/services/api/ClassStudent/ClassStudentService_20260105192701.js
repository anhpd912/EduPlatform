import { privateApi } from "../../axios/AxiosClient";

export default const ClassStudentService = {
  // Get all class students with pagination
  getAll: (page = 1) => {
    return privateApi.get(`/class-students/getAll?page=${page}`);
  },

  // Get class student by classId and studentId
  getById: (classId, studentId) => {
    return privateApi.get(
      `/class-students/get?classId=${classId}&studentId=${studentId}`
    );
  },

  // Get all students in a class
  getByClassId: (classId) => {
    return privateApi.get(`/class-students/getByClass/${classId}`);
  },

  // Get all classes of a student
  getByStudentId: (studentId) => {
    return privateApi.get(`/class-students/getByStudent/${studentId}`);
  },

  // Get active students in a class
  getActiveStudentsByClassId: (classId) => {
    return privateApi.get(`/class-students/getActiveByClass/${classId}`);
  },

  // Create a new class student (Admin/Teacher)
  // request: { classId, username }
  create: (request) => {
    return privateApi.post("/class-students/create", request);
  },

  // Student joins a class by class code
  // request: { classCode }
  joinByClassCode: (request) => {
    return privateApi.post("/class-students/join", request);
  },

  // Update class student (Admin/Teacher)
  // request: { status, ... }
  update: (classId, studentId, request) => {
    return privateApi.put(
      `/class-students/update?classId=${classId}&studentId=${studentId}`,
      request
    );
  },

  // Delete class student (Admin/Teacher)
  delete: (classId, studentId) => {
    return privateApi.delete(
      `/class-students/delete?classId=${classId}&studentId=${studentId}`
    );
  },
};
