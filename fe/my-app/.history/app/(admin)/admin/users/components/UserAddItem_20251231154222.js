"use client";

import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./user-add.module.css";
import { toast } from "react-toastify";
import { UserService } from "@/shared/services/api/User/UserService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserAddItem({ onClose, onSuccess }) {
  const { language } = useLanguage();
  const t = translations[language];
  const fileInputRef = useRef(null);

  // Step state: 1 = Basic Info, 2 = Parent Info (for Student only)
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    gender: true,
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    role: "", // TEACHER or STUDENT
    isActive: true,
  });

  // Parent info for Student role
  const [parentData, setParentData] = useState({
    parentName: "",
    parentPhone: "",
  });

  // Teacher info for Teacher role
  const [teacherData, setTeacherData] = useState({
    expertise: "",
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

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
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

  const validateStep1 = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.role
    ) {
      toast.error(t.fillAllRequiredFields || "Please fill all required fields");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error(
        t.passwordMinLength || "Password must be at least 8 characters"
      );
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    // Both STUDENT and TEACHER go to step 2
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Append basic form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Append parent data if Student
      if (formData.role === "STUDENT") {
        if (parentData.parentName) {
          submitData.append("parentName", parentData.parentName);
        }
        if (parentData.parentPhone) {
          submitData.append("parentPhone", parentData.parentPhone);
        }
      }

      // Append teacher data if Teacher
      if (formData.role === "TEACHER") {
        if (teacherData.expertise) {
          submitData.append("expertise", teacherData.expertise);
        }
      }

      // Append avatar file
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

  const renderStep1 = () => (
    <>
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
            minLength={8}
          />
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="fullName">{t.fullName || "Full Name"} *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="phoneNumber">
            {t.phoneNumber || "Phone Number"} *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
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
          <label htmlFor="gender">{t.gender || "Gender"} *</label>
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
          <label htmlFor="role">{t.role || "Role"} *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">{t.selectRole || "Select Role"}</option>
            <option value="TEACHER">{t.teacher || "Teacher"}</option>
            <option value="STUDENT">{t.student || "Student"}</option>
          </select>
        </div>

        <div className={styles.FormGroupFull}>
          <label htmlFor="address">{t.address || "Address"} *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
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
          type="button"
          onClick={handleNextStep}
          className={styles.PrimaryButton}
          disabled={loading || !formData.role}
        >
          {t.next || "Next"}
          <ArrowForwardIcon fontSize="small" style={{ marginLeft: 4 }} />
        </button>
      </div>
    </>
  );

  const renderStep2 = () => {
    if (formData.role === "STUDENT") {
      return (
        <>
          <div className={styles.StepHeader}>
            <h3>{t.parentInformation || "Parent Information"}</h3>
            <p className={styles.StepDescription}>
              {t.parentInfoDescription ||
                "Please provide parent/guardian contact information for the student."}
            </p>
          </div>

          <div className={styles.FormGrid}>
            <div className={styles.FormGroup}>
              <label htmlFor="parentName">
                {t.parentName || "Parent Name"}
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={parentData.parentName}
                onChange={handleParentChange}
                placeholder={t.enterParentName || "Enter parent name"}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="parentPhone">
                {t.parentPhone || "Parent Phone"}
              </label>
              <input
                type="tel"
                id="parentPhone"
                name="parentPhone"
                value={parentData.parentPhone}
                onChange={handleParentChange}
                placeholder={t.enterParentPhone || "Enter parent phone"}
              />
            </div>
          </div>

          <div className={styles.ModalFooter}>
            <button
              type="button"
              onClick={handlePrevStep}
              className={styles.SecondaryButton}
              disabled={loading}
            >
              <ArrowBackIcon fontSize="small" style={{ marginRight: 4 }} />
              {t.back || "Back"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.PrimaryButton}
              disabled={loading}
            >
              {loading
                ? t.creating || "Creating..."
                : t.createUser || "Create User"}
            </button>
          </div>
        </>
      );
    }

    // TEACHER role
    return (
      <>
        <div className={styles.StepHeader}>
          <h3>{t.teacherInformation || "Teacher Information"}</h3>
          <p className={styles.StepDescription}>
            {t.teacherInfoDescription ||
              "Please provide the teacher's area of expertise."}
          </p>
        </div>

        <div className={styles.FormGrid}>
          <div className={styles.FormGroupFull}>
            <label htmlFor="expertise">{t.expertise || "Expertise"}</label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              value={teacherData.expertise}
              onChange={handleTeacherChange}
              placeholder={
                t.enterExpertise ||
                "Enter area of expertise (e.g., Mathematics, Physics)"
              }
            />
          </div>
        </div>

        <div className={styles.ModalFooter}>
          <button
            type="button"
            onClick={handlePrevStep}
            className={styles.SecondaryButton}
            disabled={loading}
          >
            <ArrowBackIcon fontSize="small" style={{ marginRight: 4 }} />
            {t.back || "Back"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.PrimaryButton}
            disabled={loading}
          >
            {loading
              ? t.creating || "Creating..."
              : t.createUser || "Create User"}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.ModalOverlay} onClick={handleBackdropClick}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <h2>
            {t.addUser || "Add New User"}
            {currentStep === 2 && ` - ${t.step || "Step"} 2/2`}
          </h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Step Indicator */}
        {formData.role && (
          <div className={styles.StepIndicator}>
            <div
              className={`${styles.Step} ${
                currentStep >= 1 ? styles.StepActive : ""
              }`}
            >
              <span className={styles.StepNumber}>1</span>
              <span className={styles.StepLabel}>
                {t.basicInfo || "Basic Info"}
              </span>
            </div>
            <div className={styles.StepLine}></div>
            <div
              className={`${styles.Step} ${
                currentStep >= 2 ? styles.StepActive : ""
              }`}
            >
              <span className={styles.StepNumber}>2</span>
              <span className={styles.StepLabel}>
                {formData.role === "STUDENT"
                  ? t.parentInfo || "Parent Info"
                  : t.teacherInfo || "Teacher Info"}
              </span>
            </div>
          </div>
        )}

        <div className={styles.ModalBody}>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
}
