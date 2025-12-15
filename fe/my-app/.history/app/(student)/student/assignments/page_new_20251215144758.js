"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function StudentAssignmentsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "Chapter 1: Functions and Graphs",
          class: "Mathematics 10",
          dueDate: "2025-12-20",
          status: "pending",
          submittedDate: null,
        },
        {
          id: 2,
          title: "Midterm Exam",
          class: "Mathematics 10",
          dueDate: "2025-12-25",
          status: "pending",
          submittedDate: null,
        },
        {
          id: 3,
          title: "Homework: Equations",
          class: "Mathematics 10",
          dueDate: "2025-12-18",
          status: "submitted",
          submittedDate: "2025-12-17",
        },
        {
          id: 4,
          title: "Essay: Literature Analysis",
          class: "English 10",
          dueDate: "2025-12-22",
          status: "pending",
          submittedDate: null,
        },
        {
          id: 5,
          title: "Lab Report: Physics Experiment",
          class: "Physics 10",
          dueDate: "2025-12-19",
          status: "submitted",
          submittedDate: "2025-12-18",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAssignments = assignments.filter(
    (assignment) => filter === "all" || assignment.status === filter
  );

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
        <h1>{t.myAssignments}</h1>
      </div>

      <div className={styles.TabsContainer}>
        <button
          className={`${styles.Tab} ${
            filter === "all" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("all")}
        >
          {t.all}
        </button>
        <button
          className={`${styles.Tab} ${
            filter === "pending" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          {t.pending}
        </button>
        <button
          className={`${styles.Tab} ${
            filter === "submitted" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("submitted")}
        >
          {t.submitted}
        </button>
      </div>

      <div className={styles.AssignmentGrid}>
        {filteredAssignments.length === 0 ? (
          <div className={styles.EmptyState}>{t.noDataFound}</div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className={styles.AssignmentCard}>
              <div className={styles.AssignmentHeader}>
                <h3 className={styles.AssignmentTitle}>{assignment.title}</h3>
                {assignment.status === "submitted" ? (
                  <CheckCircleIcon className={styles.SubmittedIcon} />
                ) : (
                  <PendingIcon className={styles.PendingIcon} />
                )}
              </div>

              <div className={styles.ClassInfo}>
                <ClassIcon fontSize="small" className={styles.DetailIcon} />
                <span>{assignment.class}</span>
              </div>

              <div className={styles.DueDateInfo}>
                <CalendarTodayIcon
                  fontSize="small"
                  className={styles.DetailIcon}
                />
                <div>
                  <p className={styles.DueDateLabel}>{t.dueDate}:</p>
                  <p className={styles.DueDateValue}>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {assignment.status === "submitted" && assignment.submittedDate && (
                <div className={styles.SubmittedInfo}>
                  <CheckCircleIcon fontSize="small" />
                  <span>
                    {t.submittedOn}:{" "}
                    {new Date(assignment.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <button
                className={
                  assignment.status === "submitted"
                    ? styles.ViewButton
                    : styles.SubmitButton
                }
              >
                {assignment.status === "submitted" ? (
                  <>
                    <CheckCircleIcon fontSize="small" />
                    {t.viewDetails}
                  </>
                ) : (
                  <>
                    <UploadFileIcon fontSize="small" />
                    {t.submit}
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
