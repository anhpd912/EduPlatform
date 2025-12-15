"use client";

import { useState, useEffect } from "react";
import styles from "../students/page.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function TeachersPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setTeachers([
        {
          id: 1,
          name: "Robert Johnson",
          email: "r.johnson@example.com",
          phone: "0912345678",
          subject: "Mathematics",
          classCount: 3,
          status: "active",
        },
        {
          id: 2,
          name: "Jennifer Smith",
          email: "j.smith@example.com",
          phone: "0923456789",
          subject: "English",
          classCount: 2,
          status: "active",
        },
        {
          id: 3,
          name: "William Brown",
          email: "w.brown@example.com",
          phone: "0934567890",
          subject: "Physics",
          classCount: 4,
          status: "active",
        },
        {
          id: 4,
          name: "Mary Davis",
          email: "m.davis@example.com",
          phone: "0945678901",
          subject: "Chemistry",
          classCount: 2,
          status: "inactive",
        },
        {
          id: 5,
          name: "James Wilson",
          email: "j.wilson@example.com",
          phone: "0956789012",
          subject: "Mathematics",
          classCount: 3,
          status: "active",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ["all", ...new Set(teachers.map((t) => t.subject))];

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
        <h1>{t.teachers}</h1>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          {t.addTeacher}
        </button>
      </div>

      <div className={styles.FilterBar}>
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
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={styles.FilterSelect}
        >
          <option value="all">
            {t.all} {t.subject}
          </option>
          {subjects.slice(1).map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.StudentGrid}>
        {filteredTeachers.length === 0 ? (
          <div className={styles.EmptyState}>{t.noDataFound}</div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className={styles.StudentCard}>
              <div className={styles.StudentHeader}>
                <div className={styles.StudentAvatar}>
                  <PersonIcon style={{ fontSize: 32 }} />
                </div>
                <div className={styles.StudentInfo}>
                  <h3>{teacher.name}</h3>
                  <span
                    className={`${styles.StatusBadge} ${
                      teacher.status === "active"
                        ? styles.Active
                        : styles.Inactive
                    }`}
                  >
                    {teacher.status === "active" ? t.active : t.inactive}
                  </span>
                </div>
              </div>

              <div className={styles.StudentDetails}>
                <div className={styles.DetailRow}>
                  <EmailIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{teacher.email}</span>
                </div>
                <div className={styles.DetailRow}>
                  <PhoneIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{teacher.phone}</span>
                </div>
                <div className={styles.DetailRow}>
                  <ClassIcon fontSize="small" className={styles.DetailIcon} />
                  <span>
                    {teacher.subject} - {teacher.classCount} {t.classCount}
                  </span>
                </div>
              </div>

              <button className={styles.ViewButton}>{t.viewDetails}</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
