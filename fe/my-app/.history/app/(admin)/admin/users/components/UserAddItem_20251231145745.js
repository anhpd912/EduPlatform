"use client";

import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./user-add.module.css";
import { toast } from "react-toastify";
import { UserService } from "@/shared/services/api/User/UserService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserAddItem({ onClose, onSuccess }) {
  const { language } = useLanguage();
  const t = translations[language];
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    gender: true,
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    authProvider: "LOCAL",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
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
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      if (avatarFile) {
        submitData.append("avatar", avatarFile);
      }

      await UserService.createUser(submitData);
      toast.success(t.userCreatedSuccess || "User created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t.failedToCreateUser ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ModalOverlay} onClick={handleBackdropClick}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <h2>{t.addUser || "Add New User"}</h2>
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
                  {t.selectImage || "Select Image"}
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
              <label htmlFor="username">{t.username || "Username"} *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="email">{t.email || "Email"} *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="password">{t.password || "Password"} *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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

            <div className={styles.FormGroup}>
              <label htmlFor="authProvider">
                {t.authProvider || "Auth Provider"}
              </label>
              <select
                id="authProvider"
                name="authProvider"
                value={formData.authProvider}
                onChange={handleChange}
              >
                <option value="LOCAL">LOCAL</option>
                <option value="GOOGLE">GOOGLE</option>
                <option value="FACEBOOK">FACEBOOK</option>
                <option value="GITHUB">GITHUB</option>
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
                ? t.creating || "Creating..."
                : t.createUser || "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
