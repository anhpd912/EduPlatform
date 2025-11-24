"use client";
import Image from "next/image";
import { Close } from "@mui/icons-material";
import styles from "./user-detail.module.css";

export default function UserDetailItem({ user, onClose }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.Header}>
          <h2>User Details</h2>
          <button onClick={onClose} className={styles.CloseButton}>
            <Close />
          </button>
        </div>

        <div className={styles.Content}>
          <div className={styles.AvatarSection}>
            <Image
              src={user.avatarUrl || "https://via.placeholder.com/150"}
              alt={user.username}
              width={150}
              height={150}
              className={styles.Avatar}
            />
            <div className={styles.StatusBadge}>
              <span
                className={`${styles.Status} ${
                  user.isActive ? styles.Active : styles.Inactive
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className={styles.InfoGrid}>
            <div className={styles.InfoItem}>
              <label>User ID</label>
              <p className={styles.UserId}>{user.id}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Username</label>
              <p>{user.username}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Full Name</label>
              <p>{user.fullName || "N/A"}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Email</label>
              <p className={styles.Email}>{user.email}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Phone Number</label>
              <p>{user.phoneNumber || "N/A"}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Gender</label>
              <p>{user.gender ? "Male" : "Female"}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Date of Birth</label>
              <p>{formatDate(user.dateOfBirth)}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Address</label>
              <p>{user.address || "N/A"}</p>
            </div>

            <div className={styles.InfoItem}>
              <label>Auth Provider</label>
              <p>
                <span className={styles.Provider}>
                  {user.authProvider || "LOCAL"}
                </span>
              </p>
            </div>

            <div className={styles.InfoItem}>
              <label>Roles</label>
              <div className={styles.RolesList}>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <div key={index} className={styles.RoleCard}>
                      <h4>{role.name}</h4>
                      <p>{role.description}</p>
                      {role.permissions && role.permissions.length > 0 && (
                        <div className={styles.Permissions}>
                          <span>Permissions:</span>
                          {role.permissions.map((perm, idx) => (
                            <span key={idx} className={styles.PermissionTag}>
                              {typeof perm === "string"
                                ? perm
                                : perm.name || "N/A"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No roles assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Footer}>
          <button onClick={onClose} className={styles.CloseBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
