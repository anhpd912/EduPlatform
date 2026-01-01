"use client";

import { useState } from "react";
import styles from "./AddClassModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import ClassIcon from "@mui/icons-material/Class";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AddClassModal({ onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = t.classNameRequired || "Class name is required";
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
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Error creating class:", err);
      alert(t.errorCreatingClass || "Error creating class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <ClassIcon />
            <div>
              <h2>{t.addClass || "Add Class"}</h2>
              <p>{t.createNewClass || "Create a new class"}</p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGroup}>
            <label>
              {t.className || "Class Name"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.enterClassName || "Enter class name"}
              className={errors.name ? styles.InputError : ""}
              autoFocus
            />
            {errors.name && (
              <span className={styles.ErrorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.FormGroup}>
            <label>{t.description || "Description"}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                t.enterDescription || "Enter class description (optional)"
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
              {loading ? t.creating || "Creating..." : t.create || "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
