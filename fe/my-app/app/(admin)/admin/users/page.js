import UserList from "./components/UserList";
import styles from "./page.module.css";

export default function UsersPage() {
  return (
    <div className={styles.PageContainer}>
      <UserList />
    </div>
  );
}
