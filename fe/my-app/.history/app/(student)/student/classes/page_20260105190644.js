"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassService } from "@/shared/services/api/Class/ClassService";
import ClassList from "./components/ClassList";
import JoinClassModal from "./components/JoinClassModal";

export default function StudentClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

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

      {/* Classes List */}
      <ClassList
        classes={classes}
        translations={t}
        onJoinClick={() => setShowJoinModal(true)}
      />

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={fetchMyClasses}
        translations={t}
      />
    </div>
  );
}
