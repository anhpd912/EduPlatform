"use client";

import styles from "./ClassItem.module.css";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SubjectIcon from "@mui/icons-material/Subject";
import QuizIcon from "@mui/icons-material/Quiz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function ClassItem({
  classData,
  onView,
  onEdit,
  onDelete,
  onAddSchedule,
  onAddSubject,
}) {
  const { language } = useLanguage();
  const t = translations[language];

  const studentCount = classData.classEnrollments?.length || 0;
  const assignmentCount = classData.assignments?.length || 0;
  const subjectCount = classData.classSubjects?.length || 0;
  const examCount = classData.exams?.length || 0;
  const timetableCount = classData.timetables?.length || 0;

  return (
    <div className={styles.ClassCard}>
      <div className={styles.ClassHeader}>
        <div className={styles.ClassInfo}>
          <h3 className={styles.ClassName}>{classData.name}</h3>
          {classData.description && (
            <p className={styles.Description}>{classData.description}</p>
          )}
        </div>
        <div className={styles.StudentBadge}>
          <PeopleIcon fontSize="small" />
          <span>{studentCount}</span>
        </div>
      </div>

      {classData.homeroomTeacherName && (
        <div className={styles.TeacherInfo}>
          <PersonIcon fontSize="small" />
          <span>
            <strong>{t.homeroomTeacher || "Homeroom Teacher"}:</strong>{" "}
            {classData.homeroomTeacherName}
          </span>
        </div>
      )}

      <div className={styles.StatsGrid}>
        <div className={styles.StatItem}>
          <SubjectIcon fontSize="small" />
          <span>{subjectCount}</span>
          <label>{t.subjects || "Subjects"}</label>
        </div>
        <div className={styles.StatItem}>
          <AssignmentIcon fontSize="small" />
          <span>{assignmentCount}</span>
          <label>{t.assignments || "Assignments"}</label>
        </div>
        <div className={styles.StatItem}>
          <QuizIcon fontSize="small" />
          <span>{examCount}</span>
          <label>{t.exams || "Exams"}</label>
        </div>
        <div className={styles.StatItem}>
          <ScheduleIcon fontSize="small" />
          <span>{timetableCount}</span>
          <label>{t.schedules || "Schedules"}</label>
        </div>
      </div>

      <div className={styles.ClassActions}>
        <button className={styles.ViewButton} onClick={() => onView(classData)}>
          <VisibilityIcon fontSize="small" />
          {t.viewDetails || "View Details"}
        </button>
        <button className={styles.EditButton} onClick={() => onEdit(classData)}>
          <EditIcon fontSize="small" />
        </button>
        <button
          className={styles.DeleteButton}
          onClick={() => onDelete(classData)}
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}
