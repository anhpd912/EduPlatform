import Image from "next/image";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import styles from "./user-item.module.css";

export default function UserItem({ user, onView, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className={styles.UserRow}>
      <td>
        <Image
          src={user.avatarUrl || "https://placehold.co/40"}
          alt={user.username}
          width={40}
          height={40}
          className={styles.Avatar}
        />
      </td>
      <td className={styles.Username}>{user.username}</td>
      <td>{user.fullName || "N/A"}</td>
      <td className={styles.Email}>{user.email}</td>
      <td>{user.phoneNumber || "N/A"}</td>
      <td>
        <span className={styles.Gender}>{user.gender ? "Male" : "Female"}</span>
      </td>
      <td>{formatDate(user.dateOfBirth)}</td>
      <td>
        <span
          className={`${styles.Status} ${
            user.isActive ? styles.Active : styles.Inactive
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <span className={styles.Provider}>{user.authProvider || "LOCAL"}</span>
      </td>
      <td>
        <div className={styles.Actions}>
          <button
            onClick={() => onView(user)}
            className={`${styles.ActionBtn} ${styles.ViewBtn}`}
            title="View Details"
          >
            <Visibility fontSize="small" />
          </button>
          <button
            onClick={() => onEdit(user)}
            className={`${styles.ActionBtn} ${styles.EditBtn}`}
            title="Edit User"
          >
            <Edit fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className={`${styles.ActionBtn} ${styles.DeleteBtn}`}
            title="Delete User"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      </td>
    </tr>
  );
}
