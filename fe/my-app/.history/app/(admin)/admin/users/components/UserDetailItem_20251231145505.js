"use client";

import { useEffect } from "react";
import styles from "./user-detail.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import UpdateIcon from "@mui/icons-material/Update";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SecurityIcon from "@mui/icons-material/Security";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserDetailItem({ user, onClose }) {
  const { language } = useLanguage();
  const t = translations[language];

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (user) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [user, onClose]);

  if (!user) return null;

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
          <h2>{t.userDetails || "User Details"}</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.ModalBody}>
          {/* Profile Section */}
          <div className={styles.ProfileSection}>
            <div className={styles.AvatarContainer}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.username}
                  className={styles.Avatar}
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
                <PersonIcon style={{ fontSize: 64 }} />
              </div>
            </div>
            <div className={styles.ProfileInfo}>
              <h3 className={styles.FullName}>
                {user.fullName || user.username}
              </h3>
              <span className={styles.Username}>@{user.username}</span>
              <span
                className={`${styles.StatusBadge} ${
                  user.isActive ? styles.Active : styles.Inactive
                }`}
              >
                {user.isActive ? (
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
                  <span className={styles.DetailValue}>{user.id}</span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <EmailIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.email || "Email"}
                  </span>
                  <span className={styles.DetailValue}>{user.email}</span>
                </div>
              </div>
              <div className={styles.DetailItem}>
                <PhoneIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.phoneNumber || "Phone Number"}
                  </span>
                  <span className={styles.DetailValue}>
                    {user.phoneNumber || t.notAvailable || "N/A"}
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
                    {getGenderText(user.gender)}
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
                    {formatDate(user.dateOfBirth)}
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
                    {user.address || t.notAvailable || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className={styles.DetailSection}>
              <h4 className={styles.SectionTitle}>
                {t.accountInformation || "Account Information"}
              </h4>
              <div className={styles.DetailItem}>
                <SecurityIcon className={styles.DetailIcon} />
                <div className={styles.DetailContent}>
                  <span className={styles.DetailLabel}>
                    {t.authProvider || "Auth Provider"}
                  </span>
                  <span className={styles.DetailValue}>
                    {user.authProvider || "LOCAL"}
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
                    {formatDate(user.createdDate)}
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
                    {formatDate(user.updatedDate)}
                  </span>
                </div>
              </div>

              {/* Roles */}
              {user.roles && user.roles.length > 0 && (
                <div className={styles.RolesContainer}>
                  <span className={styles.DetailLabel}>
                    {t.roles || "Roles"}
                  </span>
                  <div className={styles.RolesList}>
                    {user.roles.map((role, index) => (
                      <span key={index} className={styles.RoleBadge}>
                        {role.name}
                      </span>
                    ))}
                  </div>
                  {user.roles.some(
                    (role) => role.permissions && role.permissions.length > 0
                  ) && (
                    <div className={styles.PermissionsContainer}>
                      <span className={styles.DetailLabel}>
                        {t.permissions || "Permissions"}
                      </span>
                      <div className={styles.PermissionsList}>
                        {user.roles.flatMap((role) =>
                          (role.permissions || []).map((perm, idx) => (
                            <span
                              key={`${role.name}-${idx}`}
                              className={styles.PermissionBadge}
                            >
                              {typeof perm === "string"
                                ? perm
                                : perm.name || "N/A"}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.ModalFooter}>
          <button className={styles.SecondaryButton} onClick={onClose}>
            {t.close || "Close"}
          </button>
          <button className={styles.PrimaryButton}>
            {t.editUser || "Edit User"}
          </button>
        </div>
      </div>
    </div>
  );
}
