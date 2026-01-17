"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BookIcon from "@mui/icons-material/Book";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassService } from "@/shared/services/api/Class/ClassService";
import { ClassStudentService } from "@/shared/services/api/ClassStudent/ClassStudentService";

export default function StudentClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      const response = await ClassService.getByStudent();
      console.log("My classes response:", response);

      // Extract array from response
      let classesData = [];
      if (response?.data) {
        if (Array.isArray(response.data)) {
          classesData = response.data;
        } else if (Array.isArray(response.data.content)) {
          classesData = response.data.content;
        }
      }
      setClasses(classesData);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      setJoinError(t.classCodeRequired || "Please enter a class code");
      return;
    }

    try {
      setJoining(true);
      setJoinError("");
      await ClassStudentService.joinByClassCode({
        classCode: classCode.trim(),
      });
      setShowJoinModal(false);
      setClassCode("");
      // Refresh classes list
      fetchMyClasses();
    } catch (err) {
      console.error("Error joining class:", err);
      setJoinError(
        err.response?.data?.message ||
          t.errorJoiningClass ||
          "Error joining class. Please check the code and try again."
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.LoadingContainer}>
          <AutorenewIcon className={styles.Spinner} />
          <p>{t.loading || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      {/* Header */}
      <div className={styles.Header}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <ClassIcon style={{ fontSize: 28 }} />
          </div>
          <div>
            <h1>{t.myClasses || "My Classes"}</h1>
            <p className={styles.HeaderSubtitle}>
              {classes.length} {t.classesJoined || "classes joined"}
            </p>
          </div>
        </div>
        <button
          className={styles.JoinButton}
          onClick={() => setShowJoinModal(true)}
        >
          <AddIcon />
          {t.joinClass || "Join Class"}
        </button>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className={styles.EmptyState}>
          <ClassIcon style={{ fontSize: 64, color: "#cbd5e1" }} />
          <h3>{t.noClassesYet || "No classes yet"}</h3>
          <p>
            {t.joinClassToStart ||
              "Join a class using a class code to get started"}
          </p>
          <button
            className={styles.JoinButton}
            onClick={() => setShowJoinModal(true)}
          >
            <AddIcon />
            {t.joinClass || "Join Class"}
          </button>
        </div>
      ) : (
        <div className={styles.ClassGrid}>
          {classes.map((cls) => (
            <div key={cls.id} className={styles.ClassCard}>
              <div className={styles.ClassHeader}>
                <div className={styles.ClassAvatar}>
                  {cls.name?.substring(0, 2).toUpperCase() || "CL"}
                </div>
                <div className={styles.ClassHeaderInfo}>
                  <h3>{cls.name}</h3>
                  <p className={styles.ClassCode}>
                    {t.code || "Code"}: {cls.classCode || cls.code || "N/A"}
                  </p>
                </div>
              </div>

              <div className={styles.ClassInfo}>
                <div className={styles.InfoRow}>
                  <PersonIcon fontSize="small" />
                  <span>
                    {t.homeRoomTeacher || "Homeroom Teacher"}:{" "}
                    {cls.homeroomTeacherName || t.notAssigned || "Not assigned"}
                  </span>
                </div>
                {cls.description && (
                  <div className={styles.InfoRow}>
                    <DescriptionIcon fontSize="small" />
                    <span>{cls.description}</span>
                  </div>
                )}
                <div className={styles.InfoRow}>
                  <BookIcon fontSize="small" />
                  <span>
                    {cls.classSubjects?.length || 0} {t.subjects || "subjects"}
                  </span>
                </div>
              </div>

              <div className={styles.ClassActions}>
                <Link
                  href={`/student/classes/${cls.id}`}
                  className={styles.ViewButton}
                >
                  <VisibilityIcon fontSize="small" />
                  {t.viewDetails || "View Details"}
                </Link>
                <Link
                  href={`/student/classes/${cls.id}/schedule`}
                  className={styles.ScheduleButton}
                >
                  <CalendarMonthIcon fontSize="small" />
                  {t.schedule || "Schedule"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div
          className={styles.ModalOverlay}
          onClick={() => setShowJoinModal(false)}
        >
          <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.ModalHeader}>
              <h2>{t.joinClass || "Join Class"}</h2>
              <button
                className={styles.CloseButton}
                onClick={() => setShowJoinModal(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleJoinClass} className={styles.ModalBody}>
              <p className={styles.ModalDescription}>
                {t.enterClassCodeToJoin ||
                  "Enter the class code provided by your teacher to join the class."}
              </p>

              <div className={styles.FormGroup}>
                <label>{t.classCode || "Class Code"}</label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => {
                    setClassCode(e.target.value.toUpperCase());
                    setJoinError("");
                  }}
                  placeholder={t.enterClassCode || "Enter class code"}
                  className={joinError ? styles.InputError : ""}
                  autoFocus
                />
                {joinError && (
                  <span className={styles.ErrorText}>{joinError}</span>
                )}
              </div>

              <div className={styles.ModalActions}>
                <button
                  type="button"
                  className={styles.CancelButton}
                  onClick={() => setShowJoinModal(false)}
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className={styles.SubmitButton}
                  disabled={joining}
                >
                  {joining ? (
                    <>
                      <AutorenewIcon className={styles.SpinnerSmall} />
                      {t.joining || "Joining..."}
                    </>
                  ) : (
                    <>
                      <AddIcon />
                      {t.joinClass || "Join Class"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
