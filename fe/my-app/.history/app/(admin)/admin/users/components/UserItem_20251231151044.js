"use client";

import styles from "./user-item.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserItem({ user, onViewDetails, onEdit }) {
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
    return gender ? t.male || "Male" : t.female || "Female";
  };

  return (
    <div className={styles.UserCard}>
      <div className={styles.UserHeader}>
        <div className={styles.UserAvatar}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className={styles.AvatarImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={styles.AvatarFallback}
            style={{ display: user.avatarUrl ? "none" : "flex" }}
          >
            <PersonIcon style={{ fontSize: 32 }} />
          </div>
        </div>
        <div className={styles.UserInfo}>
          <h3>{user.fullName || user.username}</h3>
          <span className={styles.Username}>@{user.username}</span>
          <span
            className={`${styles.StatusBadge} ${
              user.isActive ? styles.Active : styles.Inactive
            }`}
          >
            {user.isActive ? t.active : t.inactive}
          </span>
        </div>
      </div>

      <div className={styles.UserDetails}>
        <div className={styles.DetailRow}>
          <EmailIcon fontSize="small" className={styles.DetailIcon} />
          <span className={styles.DetailText}>{user.email}</span>
        </div>
        <div className={styles.DetailRow}>
          <PhoneIcon fontSize="small" className={styles.DetailIcon} />
          <span>{user.phoneNumber || t.notAvailable || "N/A"}</span>
        </div>
        <div className={styles.DetailRow}>
          <CalendarTodayIcon fontSize="small" className={styles.DetailIcon} />
          <span>
            {t.dateOfBirth || "DOB"}: {formatDate(user.dateOfBirth)}
          </span>
        </div>
      </div>

      <div className={styles.UserMeta}>
        <span className={styles.MetaItem}>
          {t.gender || "Gender"}: {getGenderText(user.gender)}
        </span>
        {user.roles && user.roles.length > 0 && (
          <span className={styles.MetaItem}>
            {user.roles.map((role) => role.name).join(", ")}
          </span>
        )}
        {user.updatedDate && (
          <span className={styles.MetaItem}>
            {t.updated || "Updated"}: {formatDate(user.updatedDate)}
          </span>
        )}
      </div>

      <div className={styles.ActionButtons}>
        <button
          className={styles.ViewButton}
          onClick={() => onViewDetails && onViewDetails(user)}
        >
          {t.viewDetails || "View Details"}
        </button>
        <button
          className={styles.EditButton}
          onClick={() => onEdit && onEdit(user)}
        >
          <EditIcon fontSize="small" />
          {t.edit || "Edit"}
        </button>
      </div>
    </div>
  );
}
