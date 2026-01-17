"use client";

import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookIcon from "@mui/icons-material/Book";
import DescriptionIcon from "@mui/icons-material/Description";
import styles from "./ClassItem.module.css";

export default function ClassItem({ classData, translations }) {
  const t = translations;

  return (
    <div className={styles.ClassCard}>
      <div className={styles.ClassHeader}>
        <div className={styles.ClassAvatar}>
          {classData.name?.substring(0, 2).toUpperCase() || "CL"}
        </div>
        <div className={styles.ClassHeaderInfo}>
          <h3>{classData.name}</h3>
          <p className={styles.ClassCode}>
            {t.code || "Code"}: {classData.classCode || classData.code || "N/A"}
          </p>
        </div>
      </div>

      <div className={styles.ClassInfo}>
        <div className={styles.InfoRow}>
          <PersonIcon fontSize="small" />
          <span>
            {t.homeRoomTeacher || "Homeroom Teacher"}:{" "}
            {classData.homeroomTeacherName || t.notAssigned || "Not assigned"}
          </span>
        </div>
        {classData.description && (
          <div className={styles.InfoRow}>
            <DescriptionIcon fontSize="small" />
            <span>{classData.description}</span>
          </div>
        )}
        <div className={styles.InfoRow}>
          <BookIcon fontSize="small" />
          <span>
            {classData.classSubjects?.length || 0} {t.subjects || "subjects"}
          </span>
        </div>
      </div>

      <div className={styles.ClassActions}>
        <Link
          href={`/student/classes/${classData.id}`}
          className={styles.ViewButton}
        >
          <VisibilityIcon fontSize="small" />
          {t.viewDetails || "View Details"}
        </Link>
        <Link
          href={`/student/classes/${classData.id}/schedule`}
          className={styles.ScheduleButton}
        >
          <CalendarMonthIcon fontSize="small" />
          {t.schedule || "Schedule"}
        </Link>
      </div>
    </div>
  );
}
