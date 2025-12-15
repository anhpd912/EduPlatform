"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

export default function AttendancePage() {
  const [step, setStep] = useState(1); // 1: Classes, 2: Dates, 3: Attendance
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const classes = [
    {
      id: 1,
      name: "Toán 10A1",
      subject: "Toán học",
      studentCount: 35,
      schedule: "Thứ 2, 4, 6 - 07:00-08:30",
      room: "A101",
      teacher: "Nguyễn Văn A",
    },
    {
      id: 2,
      name: "Toán 11B1",
      subject: "Toán học",
      studentCount: 30,
      schedule: "Thứ 3, 5, 7 - 09:00-10:30",
      room: "B201",
      teacher: "Nguyễn Văn A",
    },
    {
      id: 3,
      name: "Toán 10A2",
      subject: "Toán học",
      studentCount: 32,
      schedule: "Thứ 2, 4 - 13:30-15:00",
      room: "A102",
      teacher: "Nguyễn Văn A",
    },
  ];

  const availableDates = [
    { date: "2025-01-03", time: "12:40 PM", status: "Completed" },
    { date: "2025-01-10", time: "12:40 PM", status: "Completed" },
    { date: "2025-12-15", time: "12:40 PM", status: "Ongoing" },
    { date: "2025-12-20", time: "12:40 PM", status: "Scheduled" },
  ];

  useEffect(() => {
    if (step === 3 && selectedClass && selectedDate) {
      setLoading(true);
      setTimeout(() => {
        const mockStudents = [];
        for (let i = 1; i <= selectedClass.studentCount; i++) {
          mockStudents.push({
            id: i,
            name: `Anubhav Dubey ${i}`,
            studentId: `TIPSGRM101${2220 + i}`,
          });
        }
        setStudents(mockStudents);
        
        const initialAttendance = {};
        mockStudents.forEach((student) => {
          initialAttendance[student.id] = "absent";
        });
        setAttendance(initialAttendance);
        setLoading(false);
      }, 500);
    }
  }, [step, selectedClass, selectedDate]);

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedClass(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedDate(null);
    }
  };

  const handleAttendanceToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleSubmit = () => {
    alert("Đã lưu điểm danh thành công!");
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Step 1: Select Class
  if (step === 1) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.Header}>
          <h1>Điểm danh</h1>
        </div>

        <div className={styles.ClassGrid}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              className={styles.ClassCard}
              onClick={() => handleClassSelect(cls)}
            >
              <div className={styles.ClassHeader}>
                <div>
                  <h3>{cls.name}</h3>
                  <p className={styles.Subject}>{cls.subject}</p>
                </div>
                <div className={styles.StudentCount}>
                  <PeopleIcon fontSize="small" />
                  {cls.studentCount}
                </div>
              </div>

              <div className={styles.ClassInfo}>
                <div className={styles.InfoRow}>
                  <PersonIcon fontSize="small" />
                  <strong>Giáo viên:</strong> {cls.teacher}
                </div>
                <div className={styles.InfoRow}>
                  <ScheduleIcon fontSize="small" />
                  <strong>Lịch học:</strong> {cls.schedule}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Select Date
  if (step === 2) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.Header}>
          <button className={styles.BackButton} onClick={handleBack}>
            <ArrowBackIcon fontSize="small" />
            Quay lại
          </button>
          <h1>{selectedClass.name}</h1>
        </div>

        <div className={styles.DateGrid}>
          {availableDates.map((dateInfo, index) => (
            <div
              key={index}
              className={styles.DateCard}
              onClick={() => handleDateSelect(dateInfo)}
            >
              <div className={styles.DateHeader}>
                <CalendarTodayIcon />
                <h3>{new Date(dateInfo.date).toLocaleDateString("vi-VN")}</h3>
              </div>
              <p className={styles.DateTime}>{dateInfo.time}</p>
              <span
                className={`${styles.StatusBadge} ${
                  styles[dateInfo.status.toLowerCase()]
                }`}
              >
                {dateInfo.status === "Completed"
                  ? "Đã hoàn thành"
                  : dateInfo.status === "Ongoing"
                  ? "Đang diễn ra"
                  : "Sắp tới"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Attendance Table
  return (
    <div className={styles.ModalOverlay}>
      <div className={styles.ModalContent}>
        <div className={styles.ModalHeader}>
          <button className={styles.CloseButton} onClick={handleBack}>
            <CloseIcon />
          </button>
          <div className={styles.ModalTitle}>
            <h2>Attendance Report</h2>
            <h3>{selectedClass.name} - {selectedClass.subject}</h3>
          </div>
          <button className={styles.SubmitButton} onClick={handleSubmit}>
            Submit Attendance
          </button>
        </div>

        <div className={styles.SessionInfo}>
          <span className={styles.InfoBadge}>
            Batch 3CO - JVY
          </span>
          <span className={styles.InfoItem}>
            <ScheduleIcon fontSize="small" />
            {selectedDate.time}
          </span>
          <span className={styles.InfoItem}>
            <CalendarTodayIcon fontSize="small" />
            {new Date(selectedDate.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className={styles.StatusCompleted}>
            Status: {selectedDate.status}
          </span>
        </div>

        <div className={styles.TableContainer}>
          <table className={styles.AttendanceTable}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>
                    <span
                      className={`${styles.AttendanceStatus} ${
                        attendance[student.id] === "present"
                          ? styles.Present
                          : styles.Absent
                      }`}
                      onClick={() => handleAttendanceToggle(student.id)}
                    >
                      {attendance[student.id] === "present"
                        ? "Present"
                        : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
