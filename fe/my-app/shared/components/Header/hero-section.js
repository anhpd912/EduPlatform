import { School } from "@mui/icons-material";
import styles from "./hero-section.module.css";
import { Button } from "@mui/material";
import NavItem from "../Navbar/nav-item";

export default function HeroSection() {
  return (
    <div className={styles.HeroSection}>
      <div className={styles.Logo}>
        <School style={{ fontSize: 50 }} htmlColor="#fff" />
      </div>
      <div className={styles.TextContent}>
        <h2 className={styles.Title}>Welcome to EduPlatform</h2>
        <p className={styles.Subtitle}>
          Your gateway to quality online education and learning resources.
        </p>
        <p>
          Efficiently manage class schedules, exam routines, and academic
          planning for students, teachers, and administrators. Access your
          personalized timetable anytime, anywhere.
        </p>
      </div>
      <div className={styles.ButtonGroup}>
        <NavItem href="/signup">Get Started</NavItem>
        <NavItem href="/login" type="Login">
          Sign In
        </NavItem>
      </div>
    </div>
  );
}
