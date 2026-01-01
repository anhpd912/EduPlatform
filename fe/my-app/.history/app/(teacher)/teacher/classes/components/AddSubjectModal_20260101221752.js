"use client";

import { useState, useEffect } from "react";
import styles from "./AddSubjectModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { SubjectService } from "@/shared/services/api/Subject/SubjectService";

export default function AddSubjectModal({ classData, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [formData, setFormData] = useState({
    subjectId: "",
    teacherUsername: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await SubjectService.getAllSubjects();
      const subjectsData = response?.data?.content || [];
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subjectId) {
      newErrors.subjectId = t.subjectRequired || "Please select a subject";
    }
    if (!formData.teacherUsername || formData.teacherUsername.trim() === "") {
      newErrors.teacherUsername = t.teacherUsernameRequired || "Teacher username is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const subjectData = {
        subjectId: formData.subjectId,
        teacherUsername: formData.teacherUsername.trim(),
        classId: classData.id,
      };
      await onSave(subjectData);
      onClose();
    } catch (err) {
      console.error("Error saving subject:", err);
      alert(t.errorSavingSubject || "Error saving subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <MenuBookIcon />
            <div>
              <h2>{t.addSubjectToClass || "Add Subject to Class"}</h2>
              <p>{classData.name}</p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGroup}>
            <label>
              {t.selectSubject || "Select Subject"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            {loadingSubjects ? (
              <div className={styles.LoadingSelect}>
                {t.loadingSubjects || "Loading subjects..."}
              </div>
            ) : (
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className={errors.subjectId ? styles.InputError : ""}
              >
                <option value="">
                  {t.selectSubjectPlaceholder || "-- Select a subject --"}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            )}
            {errors.subjectId && (
              <span className={styles.ErrorText}>{errors.subjectId}</span>
            )}
          </div>

          <div className={styles.FormGroup}>
            <label>
              {t.teacherUsername || "Teacher Username"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            <input
              type="text"
              name="teacherUsername"
              value={formData.teacherUsername}
              onChange={handleChange}
              placeholder={t.enterTeacherUsername || "Enter teacher username"}
              className={errors.teacherUsername ? styles.InputError : ""}
            />
            {errors.teacherUsername && (
              <span className={styles.ErrorText}>{errors.teacherUsername}</span>
            )}
          </div>

          <div className={styles.FormActions}>
            <button
              type="button"
              className={styles.CancelButton}
              onClick={onClose}
              disabled={loading}
            >
              {t.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className={styles.SaveButton}
              disabled={loading || loadingSubjects}
            >
              {loading ? t.saving || "Saving..." : t.save || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
