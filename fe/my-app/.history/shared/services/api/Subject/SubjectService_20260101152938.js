import { privateApi } from "../../axios/AxiosClient";

export const SubjectService = {
  getMySubjects: () => {
    return privateApi.get("/subject/mySubjects");
  },
  getAllSubjects: () => {
    return privateApi.get("/subject/getAll");
  },
  getSubjectById: (subjectId) => {
    return privateApi.get(`/subject/${subjectId}`);
  },
  createSubject: (subjectData) => {
    return privateApi.post("/subject/create", subjectData);
  },
  updateSubject: (subjectId, subjectData) => {
    return privateApi.put(`/subject/update/${subjectId}`, subjectData);
  },
  deleteSubject: (subjectId) => {
    return privateApi.delete(`/subject/delete/${subjectId}`);
  },
};
