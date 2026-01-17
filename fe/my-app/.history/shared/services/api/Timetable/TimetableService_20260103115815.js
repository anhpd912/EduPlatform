import { privateApi } from "../../axios/AxiosClient";

export const TimetableService = {
  // Get all timetables with pagination
  getAll: (page = 1) => {
    return privateApi.get(`/timetables/getAll?page=${page}`);
  },

  // Get timetable by ID
  getById: (id) => {
    return privateApi.get(`/timetables/get/${id}`);
  },

  // Get timetables by class ID
  getByClassId: (classId) => {
    return privateApi.get(`/timetables/getByClass/${classId}`);
  },

  // Get timetables by teacher ID
  getByTeacherId: (teacherId) => {
    return privateApi.get(`/timetables/getByTeacher/${teacherId}`);
  },

  // Get timetables by subject ID
  getBySubjectId: (subjectId) => {
    return privateApi.get(`/timetables/getBySubject/${subjectId}`);
  },

  // Get timetables by class ID and day of week
  getByClassIdAndDayOfWeek: (classId, dayOfWeek) => {
    return privateApi.get(
      `/timetables/getByClassAndDay?classId=${classId}&dayOfWeek=${dayOfWeek}`
    );
  },

  // Get timetables by teacher ID and day of week
  getByTeacherIdAndDayOfWeek: (teacherId, dayOfWeek) => {
    return privateApi.get(
      `/timetables/getByTeacherAndDay?teacherId=${teacherId}&dayOfWeek=${dayOfWeek}`
    );
  },

  // Create a new timetable
  // request: { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room, note }
  create: (request) => {
    return privateApi.post("/timetables/create", request);
  },

  // Update a timetable
  update: (id, request) => {
    return privateApi.put(`/timetables/update/${id}`, request);
  },

  // Delete a timetable
  delete: (id) => {
    return privateApi.delete(`/timetables/delete/${id}`);
  },
};
