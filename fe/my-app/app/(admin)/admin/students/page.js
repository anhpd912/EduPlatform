"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "0901234567",
          class: "Math 10A1",
          status: "active",
        },
        {
          id: 2,
          name: "Emily Johnson",
          email: "emily.j@example.com",
          phone: "0907654321",
          class: "Math 10A2",
          status: "active",
        },
        {
          id: 3,
          name: "Michael Brown",
          email: "m.brown@example.com",
          phone: "0909876543",
          class: "Math 11B1",
          status: "inactive",
        },
        {
          id: 4,
          name: "Sarah Davis",
          email: "sarah.d@example.com",
          phone: "0908765432",
          class: "Math 10A1",
          status: "active",
        },
        {
          id: 5,
          name: "David Wilson",
          email: "d.wilson@example.com",
          phone: "0907788990",
          class: "Math 11B1",
          status: "active",
        },
        {
          id: 6,
          name: "Lisa Anderson",
          email: "lisa.a@example.com",
          phone: "0906655443",
          class: "Math 10A2",
          status: "active",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = ["all", ...new Set(students.map((s) => s.class))];

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
        <h1>{t.students}</h1>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          {t.addStudent}
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
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={styles.FilterSelect}
        >
          <option value="all">
            {t.all} {t.classes}
          </option>
          {classes.slice(1).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.StudentGrid}>
        {filteredStudents.length === 0 ? (
          <div className={styles.EmptyState}>{t.noDataFound}</div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className={styles.StudentCard}>
              <div className={styles.StudentHeader}>
                <div className={styles.StudentAvatar}>
                  <PersonIcon style={{ fontSize: 32 }} />
                </div>
                <div className={styles.StudentInfo}>
                  <h3>{student.name}</h3>
                  <span
                    className={`${styles.StatusBadge} ${
                      student.status === "active"
                        ? styles.Active
                        : styles.Inactive
                    }`}
                  >
                    {student.status === "active" ? t.active : t.inactive}
                  </span>
                </div>
              </div>

              <div className={styles.StudentDetails}>
                <div className={styles.DetailRow}>
                  <EmailIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.email}</span>
                </div>
                <div className={styles.DetailRow}>
                  <PhoneIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.phone}</span>
                </div>
                <div className={styles.DetailRow}>
                  <ClassIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.class}</span>
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
