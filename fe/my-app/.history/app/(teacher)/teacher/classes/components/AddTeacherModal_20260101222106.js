"use client";

import { useState } from "react";
import styles from "./AddTeacherModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AddTeacherModal({ classData, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError(t.usernameRequired || "Username is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave({
        classId: classData.id,
        username: username.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Error adding teacher:", err);
      setError(err.response?.data?.message || t.errorAddingTeacher || "Error adding teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <PersonAddIcon />
            <div>
              <h2>{t.addTeacher || "Add Teacher"}</h2>
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
              {t.teacherUsername || "Teacher Username"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder={t.enterTeacherUsername || "Enter teacher username"}
              className={error ? styles.InputError : ""}
              autoFocus
            />
            {error && <span className={styles.ErrorText}>{error}</span>}
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
              disabled={loading}
            >
              {loading ? t.adding || "Adding..." : t.add || "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
