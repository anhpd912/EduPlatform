"use client";

import { useEffect } from "react";
import styles from "./StudentDetailModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import UpdateIcon from "@mui/icons-material/Update";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentDetailModal({ student, isOpen, onClose }) {
  const { language } = useLanguage();
  const t = translations[language];

  // Close modal on Escape key press
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

  if (!isOpen || !student) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t.notAvailable || "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderText = (gender) => {
    if (gender === null || gender === undefined) return t.notAvailable || "N/A";
    return gender ? t.male || "Male" : t.female || "Female";
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.ModalOverlay} onClick={handleBackdropClick}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <h2>{t.studentDetails || "Student Details"}</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.ModalBody}>
          {/* Profile Section */}
          <div className={styles.ProfileSection}>
            <div className={styles.AvatarContainer}>
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  className={styles.Avatar}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={styles.AvatarFallback}
                style={{ display: student.avatarUrl ? "none" : "flex" }}
              >
                <PersonIcon style={{ fontSize: 64 }} />
              </div>
            </div>
            <div className={styles.ProfileInfo}>
              <h3 className={styles.FullName}>{student.fullName}</h3>
              <span className={styles.Username}>@{student.username}</span>
              <span
                className={`${styles.StatusBadge} ${
                  student.isActive ? styles.Active : styles.Inactive
                }`}
              >
                {student.isActive ? (
                  <>
                    <CheckCircleIcon fontSize="small" />
                    {t.active}
                  </>
                ) : (
                  <>
                    <CancelIcon fontSize="small" />
                    {t.inactive}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className={styles.DetailsGrid}>
            {/* Basic Information */}
            <div className={styles.DetailSection}>
              <h4 className={styles.SectionTitle}>
                {t.basicInformation || "Basic Information"}
              </h4>
              <div className={styles.DetailItem}>
                <BadgeIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>{t.id || "ID"}</span>
                  <span className={styles.DetailValue}>{student.id}</span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <EmailIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.email || "Email"}
                  </span>
                  <span className={styles.DetailValue}>{student.email}</span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <PhoneIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.phoneNumber || "Phone Number"}
                  </span>
                  <span className={styles.DetailValue}>
                    {student.phoneNumber || t.notAvailable || "N/A"}
                  </span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <WcIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.gender || "Gender"}
                  </span>
                  <span className={styles.DetailValue}>
                    {getGenderText(student.gender)}
                  </span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <CalendarTodayIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.dateOfBirth || "Date of Birth"}
                  </span>
                  <span className={styles.DetailValue}>
                    {formatDate(student.dateOfBirth)}
                  </span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <LocationOnIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.address || "Address"}
                  </span>
                  <span className={styles.DetailValue}>
                    {student.address || t.notAvailable || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className={styles.DetailSection}>
              <h4 className={styles.SectionTitle}>
                {t.academicInformation || "Academic Information"}
              </h4>
              <div className={styles.DetailItem}>
                <SchoolIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.dateOfEnrollment || "Date of Enrollment"}
                  </span>
                  <span className={styles.DetailValue}>
                    {formatDate(student.dateOfEnrollment)}
                  </span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <UpdateIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.createdDate || "Created Date"}
                  </span>
                  <span className={styles.DetailValue}>
                    {formatDate(student.createdDate)}
                  </span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <UpdateIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.updatedDate || "Updated Date"}
                  </span>
                  <span className={styles.DetailValue}>
                    {formatDate(student.updatedDate)}
                  </span>
                </div>
              </div>

              {/* Roles */}
              {student.roles && student.roles.length > 0 && (
                <div className={styles.RolesContainer}>
                  <span className={styles.DetailLabel}>
                    {t.roles || "Roles"}
                  </span>
                  <div className={styles.RolesList}>
                    {student.roles.map((role, index) => (
                      <span key={index} className={styles.RoleBadge}>
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className={styles.StatsSection}>
            <h4 className={styles.SectionTitle}>
              {t.statistics || "Statistics"}
            </h4>
            <div className={styles.StatsGrid}>
              <div className={styles.StatCard}>
                <span className={styles.StatValue}>
                  {student.classEnrollments?.length || 0}
                </span>
                <span className={styles.StatLabel}>
                  {t.enrolledClasses || "Enrolled Classes"}
                </span>
              </div>
              <div className={styles.StatCard}>
                <span className={styles.StatValue}>
                  {student.assignmentSubmissions?.length || 0}
                </span>
                <span className={styles.StatLabel}>
                  {t.submissions || "Submissions"}
                </span>
              </div>
              <div className={styles.StatCard}>
                <span className={styles.StatValue}>
                  {student.examResults?.length || 0}
                </span>
                <span className={styles.StatLabel}>
                  {t.examResults || "Exam Results"}
                </span>
              </div>
              <div className={styles.StatCard}>
                <span className={styles.StatValue}>
                  {student.attendanceRecords?.length || 0}
                </span>
                <span className={styles.StatLabel}>
                  {t.attendanceRecords || "Attendance"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ModalFooter}>
          <button className={styles.SecondaryButton} onClick={onClose}>
            {t.close || "Close"}
          </button>
          <button className={styles.PrimaryButton}>
            {t.editStudent || "Edit Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
