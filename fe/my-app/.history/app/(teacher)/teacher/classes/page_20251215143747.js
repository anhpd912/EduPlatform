"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function TeacherClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Mathematics 10A1",
          subject: "Mathematics",
          studentCount: 35,
          schedule: "Mon, Wed, Fri - 07:00-08:30",
          room: "A101",
          status: "ongoing",
          teacher: "John Smith",
        },
        {
          id: 2,
          name: "Mathematics 11B1",
          subject: "Mathematics",
          studentCount: 30,
          schedule: "Tue, Thu, Sat - 09:00-10:30",
          room: "B201",
          status: "starting",
          teacher: "John Smith",
        },
        {
          id: 3,
          name: "Mathematics 10A2",
          subject: "Mathematics",
          studentCount: 32,
          schedule: "Mon, Wed - 13:30-15:00",
          room: "A102",
          status: "notStarted",
          teacher: "John Smith",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      ongoing: {
        text: t.ongoing,
        icon: <PlayCircleIcon fontSize="small" />,
        className: styles.ongoing,
      },
      starting: {
        text: t.starting,
        icon: <AccessTimeIcon fontSize="small" />,
        className: styles.starting,
      },
      notStarted: {
        text: t.notStarted,
        icon: <PauseCircleIcon fontSize="small" />,
        className: styles.notStarted,
      },
    };

    const config = statusConfig[status];
    return (
      <div className={`${styles.StatusBadge} ${config.className}`}>
        {config.icon}
        {config.text}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <ClassIcon style={{ fontSize: 28 }} />
          </div>
          <h1>{t.classes}</h1>
        </div>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          {t.addClass}
        </button>
      </div>

      <div className={styles.ClassGrid}>
        {classes.map((cls) => (
          <div key={cls.id} className={styles.ClassCard}>
            <div className={styles.ClassHeader}>
              <div>
                <h3>{cls.name}</h3>
                <p className={styles.Subject}>{cls.subject}</p>
              </div>
              <div className={styles.StudentCount}>
                <PeopleIcon fontSize="small" />
                {cls.studentCount}
              </div>
            </div>

            {getStatusBadge(cls.status)}

            <div className={styles.ClassInfo}>
              <div className={styles.InfoRow}>
                <PersonIcon fontSize="small" />
                <strong>{t.teacher}:</strong> {cls.teacher}
              </div>
              <div className={styles.InfoRow}>
                <ScheduleIcon fontSize="small" />
                <strong>{t.schedule}:</strong> {cls.schedule}
              </div>
              <div className={styles.InfoRow}>
                <RoomIcon fontSize="small" />
                <strong>Room:</strong> {cls.room}
              </div>
            </div>

            <div className={styles.ClassActions}>
              <button className={styles.ViewButton}>
                <VisibilityIcon fontSize="small" />
                {t.viewDetails}
              </button>
              <button className={styles.EditButton}>
                <EditIcon fontSize="small" />
              </button>
              <button className={styles.DeleteButton}>
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
