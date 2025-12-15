"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function ClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Mathematics 10A1",
          teacher: "Robert Johnson",
          studentCount: 35,
          subject: "Mathematics",
          schedule: "Mon, Wed, Fri - 07:00-08:30",
          room: "A101",
          status: "ongoing",
        },
        {
          id: 2,
          name: "English 10A2",
          teacher: "Jennifer Smith",
          studentCount: 32,
          subject: "English Literature",
          schedule: "Tue, Thu, Sat - 09:00-10:30",
          room: "A102",
          status: "ongoing",
        },
        {
          id: 3,
          name: "Physics 11B1",
          teacher: "William Brown",
          studentCount: 30,
          subject: "Physics",
          schedule: "Mon, Tue, Thu - 13:00-14:30",
          room: "B201",
          status: "starting",
        },
        {
          id: 4,
          name: "Chemistry 10A1",
          teacher: "Mary Davis",
          studentCount: 28,
          subject: "Chemistry",
          schedule: "Wed, Fri - 15:00-16:30",
          room: "B202",
          status: "notStarted",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className={styles.SearchBar}>
        <SearchIcon className={styles.SearchIcon} />
        <input
          type="text"
          placeholder={`${t.search}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.SearchInput}
        />
      </div>

      <div className={styles.ClassGrid}>
        {filteredClasses.length === 0 ? (
          <div className={styles.EmptyState}>{t.noDataFound}</div>
        ) : (
          filteredClasses.map((cls) => (
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
          ))
        )}
      </div>
    </div>
  );
}
