"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Mathematics 10",
          code: "10A1",
          teacher: "Robert Johnson",
          schedule: "Mon, Wed, Fri - 07:00-08:30",
          room: "A101",
          status: "ongoing",
        },
        {
          id: 2,
          name: "English Literature 10",
          code: "10A1",
          teacher: "Jennifer Smith",
          schedule: "Tue, Thu, Sat - 09:00-10:30",
          room: "A102",
          status: "ongoing",
        },
        {
          id: 3,
          name: "Physics 10",
          code: "10A1",
          teacher: "William Brown",
          schedule: "Mon, Tue, Thu - 13:00-14:30",
          room: "B201",
          status: "ongoing",
        },
        {
          id: 4,
          name: "Chemistry 10",
          code: "10A1",
          teacher: "Mary Davis",
          schedule: "Wed, Fri - 15:00-16:30",
          room: "B202",
          status: "starting",
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
        icon: <PlayCircleIcon fontSize="small" />,
        className: styles.starting,
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
          <h1>{t.myClasses}</h1>
        </div>
      </div>

      <div className={styles.ClassGrid}>
        {classes.map((cls) => (
          <div key={cls.id} className={styles.ClassCard}>
            <div className={styles.ClassHeader}>
              <div>
                <h3>{cls.name}</h3>
                <p className={styles.Subject}>{cls.code}</p>
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
                <strong>{t.room}:</strong> {cls.room}
              </div>
            </div>

            <div className={styles.ClassActions}>
              <button className={styles.ViewButton}>
                <VisibilityIcon fontSize="small" />
                {t.viewDetails}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
