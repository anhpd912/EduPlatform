import { CalendarMonth, Group, LocalLibrary } from "@mui/icons-material";
import Card from "./card";
import styles from "./feature.module.css";
export default function FeatureGrid() {
  return (
    <div className={styles.FeatureGrid}>
      <Card
        icon={<CalendarMonth color="#2a6debff" />}
        title="Class Routine"
        description="Automated class scheduling with section-wise division and teacher allocation"
      />
      <Card
        icon={<LocalLibrary color="#2a6debff" />}
        title="Exam Schedule"
        description="Organized exam schedules with dates, timings, and venue information"
      />
      <Card
        icon={<Group color="#2a6debff" />}
        title="Multi-Role Access"
        description="Separate dashboards for students, teachers, and administrators"
      />
    </div>
  );
}
