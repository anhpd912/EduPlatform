"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassService } from "@/shared/services/api/Class/ClassService";
import ClassList from "./components/ClassList";
import ClassDetail from "./components/ClassDetail";
import AddScheduleModal from "./components/AddScheduleModal";
import AddSubjectModal from "./components/AddSubjectModal";
import AddClassModal from "./components/AddClassModal";

export default function TeacherClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ClassService.getMyClass();
      // Extract classes from paginated response: response.data.data.content
      const classesData =
        response.data?.data?.content || response.data?.content || [];
      setClasses(classesData);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(t.errorLoadingClasses || "Error loading classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = (classData) => {
    setSelectedClass(classData);
    setShowDetail(true);
  };

  const handleEditClass = (classData) => {
    // TODO: Implement edit functionality
    console.log("Edit class:", classData);
  };

  const handleDeleteClass = async (classData) => {
    if (
      window.confirm(
        t.confirmDeleteClass ||
          `Are you sure you want to delete "${classData.name}"?`
      )
    ) {
      try {
        await ClassService.deleteClass(classData.id);
        setClasses(classes.filter((c) => c.id !== classData.id));
      } catch (err) {
        console.error("Error deleting class:", err);
        alert(t.errorDeletingClass || "Error deleting class");
      }
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedClass(null);
  };

  const handleAddSchedule = (classData) => {
    setSelectedClassForModal(classData);
    setShowScheduleModal(true);
  };

  const handleAddSubject = (classData) => {
    setSelectedClassForModal(classData);
    setShowSubjectModal(true);
  };

  const handleSaveSchedule = async (scheduleData) => {
    // TODO: Call API to save schedule
    console.log("Save schedule:", scheduleData);
    // After saving, refresh classes to get updated data
    await fetchClasses();
  };

  const handleSaveSubject = async (subjectData) => {
    // TODO: Call API to save subject
    console.log("Save subject:", subjectData);
    // After saving, refresh classes to get updated data
    await fetchClasses();
  };

  const handleSaveClass = async (classData) => {
    try {
      await ClassService.createClass(classData);
      // After saving, refresh classes to get updated data
      await fetchClasses();
    } catch (err) {
      console.error("Error creating class:", err);
      throw err;
    }
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
          <div>
            <h1>{t.myClasses || "My Classes"}</h1>
            <p className={styles.HeaderSubtitle}>
              {t.manageYourClasses ||
                "Manage your classes and track student progress"}
            </p>
          </div>
        </div>
        <button className={styles.AddButton} onClick={() => setShowAddClassModal(true)}>
          <AddIcon fontSize="small" />
          {t.addClass}
        </button>
      </div>

      {error && (
        <div className={styles.ErrorBanner}>
          <p>{error}</p>
          <button onClick={fetchClasses}>{t.retry || "Retry"}</button>
        </div>
      )}

      <ClassList
        classes={classes}
        onViewClass={handleViewClass}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
        onAddSchedule={handleAddSchedule}
        onAddSubject={handleAddSubject}
      />

      {showDetail && selectedClass && (
        <ClassDetail classData={selectedClass} onClose={handleCloseDetail} />
      )}

      {showScheduleModal && selectedClassForModal && (
        <AddScheduleModal
          classData={selectedClassForModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedClassForModal(null);
          }}
          onSave={handleSaveSchedule}
        />
      )}

      {showSubjectModal && selectedClassForModal && (
        <AddSubjectModal
          classData={selectedClassForModal}
          onClose={() => {
            setShowSubjectModal(false);
            setSelectedClassForModal(null);
          }}
          onSave={handleSaveSubject}
        />
      )}

      {showAddClassModal && (
        <AddClassModal
          onClose={() => setShowAddClassModal(false)}
          onSave={handleSaveClass}
        />
      )}
    </div>
  );
}
