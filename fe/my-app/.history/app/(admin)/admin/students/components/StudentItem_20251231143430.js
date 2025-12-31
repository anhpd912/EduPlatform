"use client";

import styles from "./StudentItem.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentItem({ student, onViewDetails }) {
  const { language } = useLanguage();
  const t = translations[language];

  const formatDate = (dateString) => {
    if (!dateString) return t.notAvailable || "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGenderText = (gender) => {
    if (gender === null || gender === undefined) return t.notAvailable || "N/A";
    return gender ? (t.male || "Male") : (t.female || "Female");
  };

  return (
    <div className={styles.StudentCard}>
      <div className={styles.StudentHeader}>
        <div className={styles.StudentAvatar}>
          {student.avatarUrl ? (
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className={styles.AvatarImage}
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
            <PersonIcon style={{ fontSize: 32 }} />
          </div>
        </div>
        <div className={styles.StudentInfo}>
          <h3>{student.fullName}</h3>
          <span className={styles.Username}>@{student.username}</span>
          <span
            className={`${styles.StatusBadge} ${
              student.isActive ? styles.Active : styles.Inactive
            }`}
          >
            {student.isActive ? t.active : t.inactive}
          </span>
        </div>
      </div>

      <div className={styles.StudentDetails}>
        <div className={styles.DetailRow}>
          <EmailIcon fontSize="small" className={styles.DetailIcon} />
          <span className={styles.DetailText}>{student.email}</span>
        </div>
        <div className={styles.DetailRow}>
          <PhoneIcon fontSize="small" className={styles.DetailIcon} />
          <span>{student.phoneNumber || (t.notAvailable || "N/A")}</span>
        </div>
        <div className={styles.DetailRow}>
          <CalendarTodayIcon fontSize="small" className={styles.DetailIcon} />
          <span>{t.dateOfBirth || "DOB"}: {formatDate(student.dateOfBirth)}</span>
        </div>
      </div>

      <div className={styles.StudentMeta}>
        <span className={styles.MetaItem}>
          {t.gender || "Gender"}: {getGenderText(student.gender)}
        </span>
        {student.updatedDate && (
          <span className={styles.MetaItem}>
            {t.updated || "Updated"}: {formatDate(student.updatedDate)}
          </span>
        )}
      </div>

      <button
        className={styles.ViewButton}
        onClick={() => onViewDetails && onViewDetails(student)}
      >
        {t.viewDetails}
      </button>
    </div>
  );
}
