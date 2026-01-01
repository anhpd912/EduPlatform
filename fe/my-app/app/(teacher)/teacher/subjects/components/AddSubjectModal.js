"use client";

import { useState, useEffect } from "react";
import styles from "./AddSubjectModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AddSubjectModal({ subject, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];
  const isEditing = !!subject;

  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setFormData({
        subjectCode: subject.subjectCode || "",
        subjectName: subject.subjectName || "",
        description: subject.description || "",
      });
    }
  }, [subject]);

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

    if (!formData.subjectCode || formData.subjectCode.trim() === "") {
      newErrors.subjectCode =
        t.subjectCodeRequired || "Subject code is required";
    }

    if (!formData.subjectName || formData.subjectName.trim() === "") {
      newErrors.subjectName =
        t.subjectNameRequired || "Subject name is required";
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
      await onSave({
        subjectCode: formData.subjectCode.trim(),
        subjectName: formData.subjectName.trim(),
        description: formData.description.trim(),
      });
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
              <h2>
                {isEditing
                  ? t.editSubject || "Edit Subject"
                  : t.addSubject || "Add Subject"}
              </h2>
              <p>
                {isEditing
                  ? t.updateSubjectInfo || "Update subject information"
                  : t.createNewSubject || "Create a new subject"}
              </p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGroup}>
            <label>
              {t.subjectCode || "Subject Code"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            <input
              type="text"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleChange}
              placeholder={
                t.enterSubjectCode || "Enter subject code (e.g., MATH101)"
              }
              className={errors.subjectCode ? styles.InputError : ""}
              autoFocus
            />
            {errors.subjectCode && (
              <span className={styles.ErrorText}>{errors.subjectCode}</span>
            )}
          </div>

          <div className={styles.FormGroup}>
            <label>
              {t.subjectName || "Subject Name"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder={t.enterSubjectName || "Enter subject name"}
              className={errors.subjectName ? styles.InputError : ""}
            />
            {errors.subjectName && (
              <span className={styles.ErrorText}>{errors.subjectName}</span>
            )}
          </div>

          <div className={styles.FormGroup}>
            <label>{t.description || "Description"}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                t.enterSubjectDescription ||
                "Enter subject description (optional)"
              }
              rows={4}
            />
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
              className={styles.SubmitButton}
              disabled={loading}
            >
              {loading
                ? t.saving || "Saving..."
                : isEditing
                ? t.update || "Update"
                : t.create || "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
