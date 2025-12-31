import { Visibility, Edit, Delete } from "@mui/icons-material";
import styles from "./user-list.module.css";

export default function UserTableRow({ user, onView, onEdit, onDelete }) {
  return (
    <tr className={styles.TableRow}>
      <td>
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt={user.username}
          className={styles.TableAvatar}
        />
      </td>
      <td>
        <span className={styles.Username}>{user.username}</span>
      </td>
      <td>{user.username || "-"}</td>
      <td>{user.email}</td>
      <td>{user.phoneNumber || "-"}</td>
      <td>{user.gender ? "Male" : "Female"}</td>
      <td>
        {user.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString()
          : "-"}
      </td>
      <td>
        <span
          className={`${styles.StatusBadge} ${
            user.isActive ? styles.Active : styles.Inactive
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <span className={styles.AuthProvider}>
          {user.authProvider || "LOCAL"}
        </span>
      </td>
      <td>
        <div className={styles.ActionButtons}>
          <button
            className={styles.ActionBtn}
            onClick={() => onView(user)}
            title="View"
          >
            <Visibility fontSize="small" />
          </button>
          <button
            className={styles.ActionBtn}
            onClick={() => onEdit(user)}
            title="Edit"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className={styles.ActionBtn}
            onClick={() => onDelete(user.id)}
            title="Delete"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      </td>
    </tr>
  );
}
