import { privateApi } from "../../axios/AxiosClient";

// ClassTeacher status enum
export const ClassTeacherStatus = {
  PENDING: "PENDING",
  JOINED: "JOINED",
  REJECTED: "REJECTED",
};

export const ClassTeacherService = {
  // Get all class teachers with pagination
  getAll: (page = 1) => {
    return privateApi.get(`/class-teachers/getAll?page=${page}`);
  },

  // Get class teacher by composite key (classId, teacherId)
  getById: (classId, teacherId) => {
    return privateApi.get(
      `/class-teachers/get?classId=${classId}&teacherId=${teacherId}`
    );
  },

  // Get all teachers for a class
  getByClassId: (classId) => {
    return privateApi.get(`/class-teachers/getByClass/${classId}`);
  },

  // Get all classes for a teacher
  getByTeacherId: (teacherId) => {
    return privateApi.get(`/class-teachers/getByTeacher/${teacherId}`);
  },

  // Add a teacher to a class
  // request: { classId: UUID, username: String }
  create: (request) => {
    return privateApi.post("/class-teachers/create", request);
  },

  // Update a class teacher assignment
  update: (classId, teacherId, updateData) => {
    return privateApi.put(
      `/class-teachers/update?classId=${classId}&teacherId=${teacherId}`,
      updateData
    );
  },

  // Remove a teacher from a class
  delete: (classId, teacherId) => {
    return privateApi.delete(
      `/class-teachers/delete?classId=${classId}&teacherId=${teacherId}`
    );
  },

  // Accept class invitation - update status to JOINED
  acceptInvitation: (classId, teacherId) => {
    return privateApi.put(
      `/class-teachers/update?classId=${classId}&teacherId=${teacherId}`,
      { status: ClassTeacherStatus.JOINED }
    );
  },

  // Reject class invitation - update status to REJECTED
  rejectInvitation: (classId, teacherId) => {
    return privateApi.put(
      `/class-teachers/update?classId=${classId}&teacherId=${teacherId}`,
      { status: ClassTeacherStatus.REJECTED }
    );
  },
};
