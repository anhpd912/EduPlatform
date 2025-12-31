"use client";

import { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./user-edit.module.css";
import { toast } from "react-toastify";
import { UserService } from "@/shared/services/api/User/UserService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserEditItem({ user, onClose, onSuccess }) {
  const { language } = useLanguage();
  const t = translations[language];
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    gender: true,
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        gender: user.gender ?? true,
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.imageTooLarge || "Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(t.invalidImageType || "Please select a valid image file");
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Build userData object
      const userData = { ...formData };

      // If no new image selected, keep the existing avatar URL
      if (!avatarFile && user.avatarUrl) {
        userData.avatarUrl = user.avatarUrl;
      }

      // Append userData as JSON string
      submitData.append("user-data", JSON.stringify(userData));

      // Append avatar file only if a new one is selected
      if (avatarFile) {
        submitData.append("image", avatarFile);
      } else {
        submitData.append(
          "image",
          avatarPreview ? "KEEP_EXISTING" : "DELETE_EXISTING"
        );
      }

      await UserService.updateProfile(user.id, submitData);
      toast.success(t.userUpdatedSuccess || "User updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t.failedToUpdateUser ||
          "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ModalOverlay} onClick={handleBackdropClick}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <h2>{t.editUser || "Edit User"}</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.ModalBody}>
          {/* Avatar Upload Section */}
          <div className={styles.AvatarSection}>
            <div className={styles.AvatarUpload}>
              <div className={styles.AvatarPreview}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" />
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
                  {t.changeImage || "Change Image"}
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
                {t.imageHint || "JPG, PNG or GIF. Max 5MB."}
              </span>
            </div>
          </div>

          <div className={styles.FormGrid}>
            <div className={styles.FormGroup}>
              <label htmlFor="username">{t.username || "Username"}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="email">{t.email || "Email"}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="fullName">{t.fullName || "Full Name"}</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="phoneNumber">
                {t.phoneNumber || "Phone Number"}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="dateOfBirth">
                {t.dateOfBirth || "Date of Birth"}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="gender">{t.gender || "Gender"}</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }))
                }
              >
                <option value="true">{t.male || "Male"}</option>
                <option value="false">{t.female || "Female"}</option>
              </select>
            </div>

            <div className={styles.FormGroupFull}>
              <label htmlFor="address">{t.address || "Address"}</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.ModalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.SecondaryButton}
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
                ? t.updating || "Updating..."
                : t.updateUser || "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
