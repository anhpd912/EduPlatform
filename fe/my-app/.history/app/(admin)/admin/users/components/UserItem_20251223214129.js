import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./user-item.module.css";

export default function UserItem({ user, onView, onEdit, onDelete, t = {} }) {
  return (
    <div className={styles.UserCard}>
      <div className={styles.UserHeader}>
        <div className={styles.UserAvatar}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} />
          ) : (
            <PersonIcon style={{ fontSize: 32 }} />
          )}
        </div>
        <div className={styles.UserInfo}>
          <h3>{user.username}</h3>
          <span
            className={`${styles.StatusBadge} ${
              user.isActive ? styles.Active : styles.Inactive
            }`}
          >
            {user.isActive ? t.active || "Active" : t.inactive || "Inactive"}
          </span>
        </div>
      </div>

      <div className={styles.UserDetails}>
        <div className={styles.DetailRow}>
          <PersonIcon fontSize="small" className={styles.DetailIcon} />
          <span>{user.full_name || "-"}</span>
        </div>
        <div className={styles.DetailRow}>
          <EmailIcon fontSize="small" className={styles.DetailIcon} />
          <span>{user.email}</span>
        </div>
        <div className={styles.DetailRow}>
          <PhoneIcon fontSize="small" className={styles.DetailIcon} />
          <span>{user.phoneNumber || "-"}</span>
        </div>
        <div className={styles.DetailRow}>
          <CakeIcon fontSize="small" className={styles.DetailIcon} />
          <span>
            {user.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>

      <div className={styles.UserActions}>
        <button
          className={styles.ViewButton}
          onClick={() => onView(user)}
          title={t.viewDetails || "View Details"}
        >
          <VisibilityIcon fontSize="small" />
        </button>
        <button
          className={styles.EditButton}
          onClick={() => onEdit(user)}
          title={t.edit || "Edit"}
        >
          <EditIcon fontSize="small" />
        </button>
        <button
          className={styles.DeleteButton}
          onClick={() => onDelete(user.id)}
          title={t.delete || "Delete"}
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}
