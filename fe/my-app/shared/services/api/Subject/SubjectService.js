import { privateApi } from "../../axios/AxiosClient";

export const SubjectService = {
  getAllSubjects: () => {
    return privateApi.get("/subjects/getAll");
  },
  getSubjectById: (subjectId) => {
    return privateApi.get(`/subjects/${subjectId}`);
  },
  createSubject: (subjectData) => {
    return privateApi.post("/subjects/create", subjectData);
  },
  updateSubject: (subjectId, subjectData) => {
    return privateApi.put(`/subjects/update/${subjectId}`, subjectData);
  },
  deleteSubject: (subjectId) => {
    return privateApi.delete(`/subjects/delete/${subjectId}`);
  },
};
