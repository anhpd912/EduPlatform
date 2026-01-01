"use client";

import { useState } from "react";
import styles from "./ClassDetail.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SubjectIcon from "@mui/icons-material/Subject";
import QuizIcon from "@mui/icons-material/Quiz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function ClassDetail({ classData, onClose }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState("overview");

  if (!classData) return null;

  const tabs = [
    { id: "overview", label: t.overview || "Overview" },
    { id: "students", label: t.students || "Students" },
    { id: "subjects", label: t.subjects || "Subjects" },
    { id: "assignments", label: t.assignments || "Assignments" },
    { id: "exams", label: t.exams || "Exams" },
    { id: "attendance", label: t.attendance || "Attendance" },
    { id: "timetable", label: t.timetable || "Timetable" },
    { id: "progress", label: t.progress || "Progress" },
  ];

  const renderOverview = () => (
    <div className={styles.OverviewContent}>
      <div className={styles.InfoSection}>
        <h4>{t.classInformation || "Class Information"}</h4>
        <div className={styles.InfoGrid}>
          <div className={styles.InfoItem}>
            <label>{t.className || "Class Name"}</label>
            <span>{classData.name}</span>
          </div>
          <div className={styles.InfoItem}>
            <label>{t.description || "Description"}</label>
            <span>{classData.description || "-"}</span>
          </div>
          <div className={styles.InfoItem}>
            <label>{t.homeroomTeacher || "Homeroom Teacher"}</label>
            <span>{classData.homeroomTeacherName || "-"}</span>
          </div>
        </div>
      </div>

      <div className={styles.StatsSection}>
        <h4>{t.statistics || "Statistics"}</h4>
        <div className={styles.StatsGrid}>
          <div className={styles.StatCard}>
            <PeopleIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.classEnrollments?.length || 0}
              </span>
              <span className={styles.StatLabel}>
                {t.students || "Students"}
              </span>
            </div>
          </div>
          <div className={styles.StatCard}>
            <SubjectIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.classSubjects?.length || 0}
              </span>
              <span className={styles.StatLabel}>
                {t.subjects || "Subjects"}
              </span>
            </div>
          </div>
          <div className={styles.StatCard}>
            <AssignmentIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.assignments?.length || 0}
              </span>
              <span className={styles.StatLabel}>
                {t.assignments || "Assignments"}
              </span>
            </div>
          </div>
          <div className={styles.StatCard}>
            <QuizIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.exams?.length || 0}
              </span>
              <span className={styles.StatLabel}>{t.exams || "Exams"}</span>
            </div>
          </div>
          <div className={styles.StatCard}>
            <EventNoteIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.attendanceSessions?.length || 0}
              </span>
              <span className={styles.StatLabel}>
                {t.attendanceSessions || "Attendance Sessions"}
              </span>
            </div>
          </div>
          <div className={styles.StatCard}>
            <ScheduleIcon />
            <div className={styles.StatInfo}>
              <span className={styles.StatValue}>
                {classData.timetables?.length || 0}
              </span>
              <span className={styles.StatLabel}>
                {t.schedules || "Schedules"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className={styles.TabContent}>
      {classData.classEnrollments?.length > 0 ? (
        <div className={styles.TableContainer}>
          <table className={styles.DataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.studentName || "Student Name"}</th>
                <th>{t.enrollmentDate || "Enrollment Date"}</th>
                <th>{t.status || "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {classData.classEnrollments.map((enrollment, index) => (
                <tr key={enrollment.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {enrollment.studentName ||
                      enrollment.student?.fullName ||
                      "-"}
                  </td>
                  <td>
                    {enrollment.enrollmentDate
                      ? new Date(enrollment.enrollmentDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`${styles.StatusBadge} ${
                        enrollment.status === "ACTIVE"
                          ? styles.Active
                          : styles.Inactive
                      }`}
                    >
                      {enrollment.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <PeopleIcon />
          <p>{t.noStudentsEnrolled || "No students enrolled in this class"}</p>
        </div>
      )}
    </div>
  );

  const renderSubjects = () => (
    <div className={styles.TabContent}>
      {classData.classSubjects?.length > 0 ? (
        <div className={styles.SubjectGrid}>
          {classData.classSubjects.map((subject, index) => (
            <div key={subject.id || index} className={styles.SubjectCard}>
              <SubjectIcon />
              <div className={styles.SubjectInfo}>
                <h5>{subject.subjectName || subject.subject?.name || "-"}</h5>
                <p>{subject.teacherName || subject.teacher?.fullName || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <SubjectIcon />
          <p>{t.noSubjects || "No subjects assigned to this class"}</p>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className={styles.TabContent}>
      {classData.assignments?.length > 0 ? (
        <div className={styles.TableContainer}>
          <table className={styles.DataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.title || "Title"}</th>
                <th>{t.subject || "Subject"}</th>
                <th>{t.dueDate || "Due Date"}</th>
                <th>{t.status || "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {classData.assignments.map((assignment, index) => (
                <tr key={assignment.id || index}>
                  <td>{index + 1}</td>
                  <td>{assignment.title || "-"}</td>
                  <td>
                    {assignment.subjectName || assignment.subject?.name || "-"}
                  </td>
                  <td>
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`${styles.StatusBadge} ${
                        assignment.status === "COMPLETED"
                          ? styles.Completed
                          : assignment.status === "ONGOING"
                          ? styles.Ongoing
                          : styles.Pending
                      }`}
                    >
                      {assignment.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <AssignmentIcon />
          <p>{t.noAssignments || "No assignments for this class"}</p>
        </div>
      )}
    </div>
  );

  const renderExams = () => (
    <div className={styles.TabContent}>
      {classData.exams?.length > 0 ? (
        <div className={styles.TableContainer}>
          <table className={styles.DataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.examName || "Exam Name"}</th>
                <th>{t.subject || "Subject"}</th>
                <th>{t.date || "Date"}</th>
                <th>{t.duration || "Duration"}</th>
              </tr>
            </thead>
            <tbody>
              {classData.exams.map((exam, index) => (
                <tr key={exam.id || index}>
                  <td>{index + 1}</td>
                  <td>{exam.name || exam.title || "-"}</td>
                  <td>{exam.subjectName || exam.subject?.name || "-"}</td>
                  <td>
                    {exam.examDate
                      ? new Date(exam.examDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{exam.duration ? `${exam.duration} min` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <QuizIcon />
          <p>{t.noExams || "No exams scheduled for this class"}</p>
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className={styles.TabContent}>
      {classData.attendanceSessions?.length > 0 ? (
        <div className={styles.TableContainer}>
          <table className={styles.DataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.date || "Date"}</th>
                <th>{t.subject || "Subject"}</th>
                <th>{t.present || "Present"}</th>
                <th>{t.absent || "Absent"}</th>
              </tr>
            </thead>
            <tbody>
              {classData.attendanceSessions.map((session, index) => (
                <tr key={session.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {session.date
                      ? new Date(session.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{session.subjectName || session.subject?.name || "-"}</td>
                  <td className={styles.PresentCount}>
                    {session.presentCount || 0}
                  </td>
                  <td className={styles.AbsentCount}>
                    {session.absentCount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <EventNoteIcon />
          <p>{t.noAttendanceRecords || "No attendance records"}</p>
        </div>
      )}
    </div>
  );

  const renderTimetable = () => (
    <div className={styles.TabContent}>
      {classData.timetables?.length > 0 ? (
        <div className={styles.TimetableGrid}>
          {classData.timetables.map((schedule, index) => (
            <div key={schedule.id || index} className={styles.TimetableCard}>
              <div className={styles.TimetableDay}>
                {schedule.dayOfWeek || schedule.day || "-"}
              </div>
              <div className={styles.TimetableInfo}>
                <p className={styles.TimetableSubject}>
                  {schedule.subjectName || schedule.subject?.name || "-"}
                </p>
                <p className={styles.TimetableTime}>
                  {schedule.startTime} - {schedule.endTime}
                </p>
                <p className={styles.TimetableRoom}>
                  {schedule.room || schedule.location || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <ScheduleIcon />
          <p>{t.noTimetable || "No timetable available"}</p>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className={styles.TabContent}>
      {classData.studentProgresses?.length > 0 ? (
        <div className={styles.TableContainer}>
          <table className={styles.DataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.studentName || "Student Name"}</th>
                <th>{t.overallProgress || "Overall Progress"}</th>
                <th>{t.assignmentsCompleted || "Assignments Completed"}</th>
                <th>{t.averageScore || "Average Score"}</th>
              </tr>
            </thead>
            <tbody>
              {classData.studentProgresses.map((progress, index) => (
                <tr key={progress.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {progress.studentName || progress.student?.fullName || "-"}
                  </td>
                  <td>
                    <div className={styles.ProgressBar}>
                      <div
                        className={styles.ProgressFill}
                        style={{ width: `${progress.overallProgress || 0}%` }}
                      />
                      <span>{progress.overallProgress || 0}%</span>
                    </div>
                  </td>
                  <td>{progress.completedAssignments || 0}</td>
                  <td>
                    <span
                      className={`${styles.ScoreBadge} ${
                        (progress.averageScore || 0) >= 80
                          ? styles.HighScore
                          : (progress.averageScore || 0) >= 60
                          ? styles.MediumScore
                          : styles.LowScore
                      }`}
                    >
                      {progress.averageScore?.toFixed(1) || "0.0"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.EmptyState}>
          <TrendingUpIcon />
          <p>{t.noProgressData || "No progress data available"}</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "students":
        return renderStudents();
      case "subjects":
        return renderSubjects();
      case "assignments":
        return renderAssignments();
      case "exams":
        return renderExams();
      case "attendance":
        return renderAttendance();
      case "timetable":
        return renderTimetable();
      case "progress":
        return renderProgress();
      default:
        return renderOverview();
    }
  };

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <h2>{classData.name}</h2>
            {classData.description && (
              <p className={styles.HeaderDescription}>
                {classData.description}
              </p>
            )}
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.TabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.Tab} ${
                activeTab === tab.id ? styles.ActiveTab : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.ModalBody}>{renderTabContent()}</div>
      </div>
    </div>
  );
}
