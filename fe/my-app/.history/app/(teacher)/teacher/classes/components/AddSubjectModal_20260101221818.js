"use client";

import { useState } from "react";
import styles from "./AddSubjectModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AddSubjectModal({ classData, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    subjectName: "",
    teacherName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subjectData = {
        ...formData,
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
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <MenuBookIcon />
            <div>
              <h2>{t.addSubject || "Add Subject"}</h2>
              <p>{classData.name}</p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGroup}>
            <label>{t.subjectName || "Subject Name"} *</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder={t.enterSubjectName || "Enter subject name"}
              required
            />
          </div>

          <div className={styles.FormGroup}>
            <label>{t.teacherName || "Teacher Name"}</label>
            <input
              type="text"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
              placeholder={t.enterTeacherName || "Enter teacher name"}
            />
          </div>

          <div className={styles.FormGroup}>
            <label>{t.description || "Description"}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t.enterDescription || "Enter description (optional)"}
              rows={3}
            />
          </div>

          <div className={styles.FormActions}>
            <button
              type="button"
              className={styles.CancelButton}
              onClick={onClose}
            >
              {t.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className={styles.SaveButton}
              disabled={loading || !formData.subjectName}
            >
              {loading ? t.saving || "Saving..." : t.save || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
