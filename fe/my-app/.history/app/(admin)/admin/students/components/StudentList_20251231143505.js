"use client";

import styles from "./StudentList.module.css";
import StudentItem from "./StudentItem";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentList({
  students,
  loading,
  onViewDetails,
  emptyMessage,
}) {
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className={styles.EmptyState}>{emptyMessage || t.noDataFound}</div>
    );
  }

  return (
    <div className={styles.StudentGrid}>
      {students.map((student) => (
        <StudentItem
          key={student.id}
          student={student}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
