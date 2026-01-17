"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MdArrowBack,
  MdPeople,
  MdCalendarToday,
  MdSubject,
  MdAccessTime,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSchool,
  MdAutorenew,
  MdInfo,
} from "react-icons/md";
import ClassService from "@/shared/services/api/Class/ClassService";
import { ClassStudentService } from "@/shared/services/api/ClassStudent/ClassStudentService";
import { ClassSubjectService } from "@/shared/services/api/ClassSubject/ClassSubjectService";
import styles from "./page.module.css";

// Helper to extract array from API response
const extractArray = (response) => {
  if (!response) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
};

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id;

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [classRes, studentsRes, subjectsRes] = await Promise.all([
        ClassService.getClassById(classId),
        ClassStudentService.getActiveStudentsByClassId(classId),
        ClassSubjectService.getByClassId(classId),
      ]);

      setClassInfo(classRes.data || null);
      setStudents(extractArray(studentsRes));
      setSubjects(extractArray(subjectsRes));
    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Không thể tải thông tin lớp học");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchClassData();
    }
  }, [classId, fetchClassData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.LoadingContainer}>
          <MdAutorenew className={styles.Spinner} />
          <p>Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  if (error || !classInfo) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.ErrorContainer}>
          <MdInfo style={{ fontSize: 48, color: "#ef4444" }} />
          <h3>{error || "Không tìm thấy lớp học"}</h3>
          <button onClick={() => router.back()} className={styles.BackButton}>
            <MdArrowBack /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      {/* Header */}
      <div className={styles.Header}>
        <button onClick={() => router.back()} className={styles.BackLink}>
          <MdArrowBack /> Quay lại danh sách lớp
        </button>
      </div>

      {/* Class Info Card */}
      <div className={styles.ClassInfoCard}>
        <div className={styles.ClassAvatar}>
          {classInfo.name?.charAt(0)?.toUpperCase() || "C"}
        </div>
        <div className={styles.ClassMainInfo}>
          <h1>{classInfo.name}</h1>
          <p className={styles.ClassCode}>Mã lớp: {classInfo.classCode}</p>
          <div className={styles.ClassMeta}>
            <span>
              <MdCalendarToday />
              {formatDate(classInfo.startDate)} -{" "}
              {formatDate(classInfo.endDate)}
            </span>
            <span>
              <MdPeople />
              {students.length} học sinh
            </span>
            <span>
              <MdSubject />
              {subjects.length} môn học
            </span>
          </div>
        </div>
        <Link
          href={`/student/classes/${classId}/schedule`}
          className={styles.ScheduleLink}
        >
          <MdAccessTime /> Xem lịch học
        </Link>
      </div>

      {/* Tabs */}
      <div className={styles.TabsContainer}>
        <button
          className={`${styles.Tab} ${
            activeTab === "info" ? styles.ActiveTab : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          <MdInfo /> Thông tin
        </button>
        <button
          className={`${styles.Tab} ${
            activeTab === "students" ? styles.ActiveTab : ""
          }`}
          onClick={() => setActiveTab("students")}
        >
          <MdPeople /> Học sinh ({students.length})
        </button>
        <button
          className={`${styles.Tab} ${
            activeTab === "subjects" ? styles.ActiveTab : ""
          }`}
          onClick={() => setActiveTab("subjects")}
        >
          <MdSubject /> Môn học ({subjects.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.TabContent}>
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className={styles.InfoTab}>
            <div className={styles.InfoSection}>
              <h3>Thông tin lớp học</h3>
              <div className={styles.InfoGrid}>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Tên lớp</span>
                  <span className={styles.InfoValue}>{classInfo.name}</span>
                </div>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Mã lớp</span>
                  <span className={styles.InfoValue}>
                    {classInfo.classCode}
                  </span>
                </div>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Ngày bắt đầu</span>
                  <span className={styles.InfoValue}>
                    {formatDate(classInfo.startDate)}
                  </span>
                </div>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Ngày kết thúc</span>
                  <span className={styles.InfoValue}>
                    {formatDate(classInfo.endDate)}
                  </span>
                </div>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Số học sinh</span>
                  <span className={styles.InfoValue}>{students.length}</span>
                </div>
                <div className={styles.InfoItem}>
                  <span className={styles.InfoLabel}>Số môn học</span>
                  <span className={styles.InfoValue}>{subjects.length}</span>
                </div>
              </div>
            </div>

            {classInfo.description && (
              <div className={styles.InfoSection}>
                <h3>Mô tả</h3>
                <p className={styles.Description}>{classInfo.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className={styles.StudentsTab}>
            {students.length === 0 ? (
              <div className={styles.EmptyState}>
                <MdPeople style={{ fontSize: 48, color: "#cbd5e1" }} />
                <h3>Chưa có học sinh</h3>
                <p>Lớp học này chưa có học sinh nào</p>
              </div>
            ) : (
              <div className={styles.StudentGrid}>
                {students.map((student, index) => (
                  <div
                    key={student.studentId || index}
                    className={styles.StudentCard}
                  >
                    <div className={styles.StudentAvatar}>
                      {student.studentName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div className={styles.StudentInfo}>
                      <h4>{student.studentName || "N/A"}</h4>
                      {student.studentEmail && (
                        <p className={styles.StudentMeta}>
                          <MdEmail />
                          {student.studentEmail}
                        </p>
                      )}
                      {student.parentPhone && (
                        <p className={styles.StudentMeta}>
                          <MdPhone />
                          {student.parentPhone} ({student.parentName})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <div className={styles.SubjectsTab}>
            {subjects.length === 0 ? (
              <div className={styles.EmptyState}>
                <MdSubject style={{ fontSize: 48, color: "#cbd5e1" }} />
                <h3>Chưa có môn học</h3>
                <p>Lớp học này chưa được phân công môn học nào</p>
              </div>
            ) : (
              <div className={styles.SubjectGrid}>
                {subjects.map((subject, index) => (
                  <div key={subject.id || index} className={styles.SubjectCard}>
                    <div className={styles.SubjectIcon}>
                      <MdSchool />
                    </div>
                    <div className={styles.SubjectInfo}>
                      <h4>
                        {subject.subject?.name || subject.subjectName || "N/A"}
                      </h4>
                      {(subject.teacher?.fullName || subject.teacherName) && (
                        <p className={styles.TeacherInfo}>
                          <MdPerson />
                          {subject.teacher?.fullName || subject.teacherName}
                        </p>
                      )}
                      {subject.subject?.description && (
                        <p className={styles.SubjectDesc}>
                          {subject.subject.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
