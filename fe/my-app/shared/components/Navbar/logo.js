import SchoolIcon from "@mui/icons-material/School";
import styles from "./logo.module.css";
export default function Logo() {
  return (
    <div className={styles.Logo}>
      <div className={styles.LogoIcon}>
        <SchoolIcon color="#6f60f8ff" fontSize="40" />
      </div>
      <span className={styles.LogoText}>EduPlatform</span>
    </div>
  );
}
