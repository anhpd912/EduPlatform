"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./StudentEditModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { StudentService } from "@/shared/services/api/Student/StudentService";
import { toast } from "react-toastify";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentEditModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { language } = useLanguage();
  const t = translations[language];
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    enrollmentDate: "",
    parentName: "",
    parentPhone: "",
    isActive: true,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form when student changes
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        username: student.username || "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || "",
        gender:
          student.gender !== null && student.gender !== undefined
            ? String(student.gender)
            : "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split("T")[0]
          : "",
        address: student.address || "",
        enrollmentDate: student.enrollmentDate
          ? student.enrollmentDate.split("T")[0]
          : "",
        parentName: student.parentName || "",
        parentPhone: student.parentPhone || "",
        isActive: student.isActive ?? true,
      });
      setAvatarPreview(student.avatarUrl || null);
      setAvatarFile(null);
    }
  }, [student]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.imageSizeError || "Image size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t.imageTypeError || "Please select a valid image file");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Build studentData object
      const studentData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          studentData[key] = formData[key];
        }
      });

      // If no new image selected, keep the existing avatar URL
      if (!avatarFile && student.avatarUrl) {
        studentData.avatarUrl = student.avatarUrl;
      }

      // Append studentData as JSON string
      submitData.append("student-data", JSON.stringify(studentData));

      // Append avatar file if a new one was selected
      if (avatarFile) {
        submitData.append("image", avatarFile);
      } else {
        // If avatar was removed
        if (!avatarPreview) {
          submitData.append("image", "");
        }
        // If avatarPreview exists, it means no change to the image
        if (avatarPreview) {
          submitData.append("image", "KEEP_EXISTING");
        }
      }

      await StudentService.updateStudent(student.id, submitData);
      toast.success(t.studentUpdatedSuccess || "Student updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(
        error.response?.data?.message ||
          t.studentUpdateError ||
          "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className={styles.ModalOverlay} onClick={handleBackdropClick}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <h2>{t.editStudent || "Edit Student"}</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.ModalBody}>
          <form onSubmit={handleSubmit}>
            {/* Avatar Upload Section */}
            <div className={styles.AvatarSection}>
              <div className={styles.AvatarUpload}>
                <div className={styles.AvatarPreview}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" />
                  ) : (
                    <PersonIcon style={{ fontSize: 48 }} />
                  )}
                </div>
                <div className={styles.AvatarActions}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className={styles.UploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUploadIcon fontSize="small" />
                    {avatarPreview
                      ? t.changeImage || "Change Image"
                      : t.uploadImage || "Upload Image"}
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      className={styles.RemoveButton}
                      onClick={handleRemoveImage}
                    >
                      <DeleteIcon fontSize="small" />
                      {t.remove || "Remove"}
                    </button>
                  )}
                </div>
                <span className={styles.AvatarHint}>
                  {t.imageHint || "JPG, PNG or GIF. Max 5MB"}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className={styles.FormGrid}>
              <div className={styles.FormGroup}>
                <label>{t.fullName || "Full Name"} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder={t.enterFullName || "Enter full name"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.username || "Username"}</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  placeholder={t.enterUsername || "Enter username"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.email || "Email"} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t.enterEmail || "Enter email"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.phoneNumber || "Phone Number"}</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t.enterPhoneNumber || "Enter phone number"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.gender || "Gender"}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">{t.selectGender || "Select Gender"}</option>
                  <option value="true">{t.male || "Male"}</option>
                  <option value="false">{t.female || "Female"}</option>
                </select>
              </div>

              <div className={styles.FormGroup}>
                <label>{t.dateOfBirth || "Date of Birth"}</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.enrollmentDate || "Enrollment Date"}</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.parentName || "Parent Name"}</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder={t.enterParentName || "Enter parent name"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.parentPhone || "Parent Phone"}</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  placeholder={t.enterParentPhone || "Enter parent phone"}
                />
              </div>

              <div className={styles.FormGroup}>
                <label>{t.status || "Status"}</label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleChange}
                >
                  <option value={true}>{t.active || "Active"}</option>
                  <option value={false}>{t.inactive || "Inactive"}</option>
                </select>
              </div>

              <div className={styles.FormGroupFull}>
                <label>{t.address || "Address"}</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t.enterAddress || "Enter address"}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.ModalFooter}>
              <button
                type="button"
                className={styles.SecondaryButton}
                onClick={onClose}
                disabled={loading}
              >
                {t.cancel || "Cancel"}
              </button>
              <button
                type="submit"
                className={styles.PrimaryButton}
                disabled={loading}
              >
                {loading
                  ? t.saving || "Saving..."
                  : t.saveChanges || "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
