import { privateApi } from "../../axios/AxiosClient";

export const ClassSubjectService = {
  // Get all class subjects with pagination
  getAll: (page = 1) => {
    return privateApi.get(`/class-subjects/getAll?page=${page}`);
  },

  // Get class subject by composite key (classId, subjectId, teacherId)
  getById: (classId, subjectId, teacherId) => {
    return privateApi.get(
      `/class-subjects/get?classId=${classId}&subjectId=${subjectId}&teacherId=${teacherId}`
    );
  },

  // Get all class subjects by class ID
  getByClassId: (classId) => {
    return privateApi.get(`/class-subjects/getByClass/${classId}`);
  },

  // Get all class subjects by subject ID
  getBySubjectId: (subjectId) => {
    return privateApi.get(`/class-subjects/getBySubject/${subjectId}`);
  },

  // Get all class subjects by teacher ID
  getByTeacherId: (teacherId) => {
    return privateApi.get(`/class-subjects/getByTeacher/${teacherId}`);
  },

  // Create a new class subject assignment
  // request: { classId: UUID, subjectId: UUID, teacherId: UUID }
  create: (request) => {
    return privateApi.post("/class-subjects/create", request);
  },

  // Update a class subject assignment
  update: (classId, subjectId, teacherId, updateData) => {
    return privateApi.put(
      `/class-subjects/update?classId=${classId}&subjectId=${subjectId}&teacherId=${teacherId}`,
      updateData
    );
  },

  // Delete a class subject assignment
  delete: (classId, subjectId, teacherId) => {
    return privateApi.delete(
      `/class-subjects/delete?classId=${classId}&subjectId=${subjectId}&teacherId=${teacherId}`
    );
  },
};
