"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { SubjectService } from "@/shared/services/api/Subject/SubjectService";
import AddSubjectModal from "./components/AddSubjectModal";

export default function TeacherSubjectsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SubjectService.getMySubjects();
      const subjectsData =
        response.data?.data?.content || response.data?.data || response.data || [];
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError(t.errorLoadingSubjects || "Error loading subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubject = async (subjectData) => {
    try {
      if (editingSubject) {
        await SubjectService.updateSubject(editingSubject.id, subjectData);
      } else {
        await SubjectService.createSubject(subjectData);
      }
      await fetchSubjects();
      setShowAddModal(false);
      setEditingSubject(null);
    } catch (err) {
      console.error("Error saving subject:", err);
      throw err;
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowAddModal(true);
  };

  const handleDeleteSubject = async (subject) => {
    if (
      window.confirm(
        t.confirmDeleteSubject ||
          `Are you sure you want to delete "${subject.subjectName}"?`
      )
    ) {
      try {
        await SubjectService.deleteSubject(subject.id);
        setSubjects(subjects.filter((s) => s.id !== subject.id));
      } catch (err) {
        console.error("Error deleting subject:", err);
        alert(t.errorDeletingSubject || "Error deleting subject");
      }
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <MenuBookIcon style={{ fontSize: 28 }} />
          </div>
          <div>
            <h1>{t.subjects || "Subjects"}</h1>
            <p className={styles.HeaderSubtitle}>
              {t.manageYourSubjects || "Manage your teaching subjects"}
            </p>
          </div>
        </div>
        <button
          className={styles.AddButton}
          onClick={() => {
            setEditingSubject(null);
            setShowAddModal(true);
          }}
        >
          <AddIcon fontSize="small" />
          {t.addSubject || "Add Subject"}
        </button>
      </div>

      {error && (
        <div className={styles.ErrorBanner}>
          <p>{error}</p>
          <button onClick={fetchSubjects}>{t.retry || "Retry"}</button>
        </div>
      )}

      <div className={styles.SearchBar}>
        <SearchIcon className={styles.SearchIcon} />
        <input
          type="text"
          placeholder={t.searchSubjects || "Search subjects..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.SearchInput}
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <div className={styles.EmptyState}>
          <MenuBookIcon style={{ fontSize: 64, color: "#cbd5e1" }} />
          <p>{t.noSubjectsFound || "No subjects found"}</p>
          <button
            className={styles.AddButtonSecondary}
            onClick={() => setShowAddModal(true)}
          >
            <AddIcon fontSize="small" />
            {t.createFirstSubject || "Create your first subject"}
          </button>
        </div>
      ) : (
        <div className={styles.SubjectGrid}>
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className={styles.SubjectCard}>
              <div className={styles.CardHeader}>
                <div className={styles.SubjectIcon}>
                  <MenuBookIcon />
                </div>
                <div className={styles.SubjectInfo}>
                  <h3>{subject.subjectName}</h3>
                  <span className={styles.SubjectCode}>{subject.subjectCode}</span>
                </div>
              </div>
              {subject.description && (
                <p className={styles.SubjectDescription}>{subject.description}</p>
              )}
              <div className={styles.CardActions}>
                <button
                  className={styles.ActionButton}
                  onClick={() => handleEditSubject(subject)}
                  title={t.edit || "Edit"}
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className={`${styles.ActionButton} ${styles.DeleteButton}`}
                  onClick={() => handleDeleteSubject(subject)}
                  title={t.delete || "Delete"}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddSubjectModal
          subject={editingSubject}
          onClose={() => {
            setShowAddModal(false);
            setEditingSubject(null);
          }}
          onSave={handleSaveSubject}
        />
      )}
    </div>
  );
}
