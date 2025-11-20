import SchoolIcon from "@mui/icons-material/School";
import styles from "./logo.module.css";

export default function Logo() {
  return (
    <div className={styles.Logo}>
      <div className={styles.LogoIcon}>
        <SchoolIcon sx={{ color: "#6f60f8", fontSize: 40 }} />
      </div>
      <span className={styles.LogoText}>EduPlatform</span>
    </div>
  );
}
