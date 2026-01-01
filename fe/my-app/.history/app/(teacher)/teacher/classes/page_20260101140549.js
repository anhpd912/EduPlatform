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

export default function TeacherClassesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ClassService.getMyClass();
      setClasses(response.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(t.errorLoadingClasses || "Error loading classes");
      // Fallback to mock data for development
      setClasses([
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Mathematics 10A1",
          description: "Advanced Mathematics class for grade 10",
          homeroomTeacherId: "550e8400-e29b-41d4-a716-446655440010",
          homeroomTeacherName: "John Smith",
          studentProgresses: [
            {
              id: "1",
              studentName: "Alice Johnson",
              overallProgress: 85,
              completedAssignments: 12,
              averageScore: 88.5,
            },
            {
              id: "2",
              studentName: "Bob Wilson",
              overallProgress: 72,
              completedAssignments: 10,
              averageScore: 75.0,
            },
          ],
          attendanceSessions: [
            {
              id: "1",
              date: "2025-12-20",
              subjectName: "Mathematics",
              presentCount: 32,
              absentCount: 3,
            },
            {
              id: "2",
              date: "2025-12-18",
              subjectName: "Mathematics",
              presentCount: 34,
              absentCount: 1,
            },
          ],
          assignments: [
            {
              id: "1",
              title: "Algebra Practice",
              subjectName: "Mathematics",
              dueDate: "2025-12-25",
              status: "ONGOING",
            },
            {
              id: "2",
              title: "Geometry Quiz",
              subjectName: "Mathematics",
              dueDate: "2025-12-30",
              status: "PENDING",
            },
          ],
          classEnrollments: [
            {
              id: "1",
              studentName: "Alice Johnson",
              enrollmentDate: "2025-09-01",
              status: "ACTIVE",
            },
            {
              id: "2",
              studentName: "Bob Wilson",
              enrollmentDate: "2025-09-01",
              status: "ACTIVE",
            },
            {
              id: "3",
              studentName: "Carol Davis",
              enrollmentDate: "2025-09-01",
              status: "ACTIVE",
            },
          ],
          classSubjects: [
            { id: "1", subjectName: "Mathematics", teacherName: "John Smith" },
            { id: "2", subjectName: "Physics", teacherName: "Jane Doe" },
          ],
          exams: [
            {
              id: "1",
              name: "Midterm Exam",
              subjectName: "Mathematics",
              examDate: "2025-12-28",
              duration: 90,
            },
          ],
          timetables: [
            {
              id: "1",
              dayOfWeek: "Monday",
              subjectName: "Mathematics",
              startTime: "08:00",
              endTime: "09:30",
              room: "A101",
            },
            {
              id: "2",
              dayOfWeek: "Wednesday",
              subjectName: "Mathematics",
              startTime: "08:00",
              endTime: "09:30",
              room: "A101",
            },
            {
              id: "3",
              dayOfWeek: "Friday",
              subjectName: "Physics",
              startTime: "10:00",
              endTime: "11:30",
              room: "B202",
            },
          ],
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Physics 11B1",
          description: "Physics fundamentals for grade 11",
          homeroomTeacherId: "550e8400-e29b-41d4-a716-446655440010",
          homeroomTeacherName: "John Smith",
          studentProgresses: [],
          attendanceSessions: [],
          assignments: [
            {
              id: "3",
              title: "Newton's Laws",
              subjectName: "Physics",
              dueDate: "2025-12-27",
              status: "PENDING",
            },
          ],
          classEnrollments: [
            {
              id: "4",
              studentName: "David Brown",
              enrollmentDate: "2025-09-01",
              status: "ACTIVE",
            },
            {
              id: "5",
              studentName: "Eva Martinez",
              enrollmentDate: "2025-09-01",
              status: "ACTIVE",
            },
          ],
          classSubjects: [
            { id: "3", subjectName: "Physics", teacherName: "John Smith" },
          ],
          exams: [],
          timetables: [
            {
              id: "4",
              dayOfWeek: "Tuesday",
              subjectName: "Physics",
              startTime: "09:00",
              endTime: "10:30",
              room: "B201",
            },
            {
              id: "5",
              dayOfWeek: "Thursday",
              subjectName: "Physics",
              startTime: "09:00",
              endTime: "10:30",
              room: "B201",
            },
          ],
        },
      ]);
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
        <button className={styles.AddButton}>
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
      />

      {showDetail && selectedClass && (
        <ClassDetail classData={selectedClass} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
