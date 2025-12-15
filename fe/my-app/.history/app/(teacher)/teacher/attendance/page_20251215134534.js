"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SaveIcon from "@mui/icons-material/Save";

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10A1");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  const classes = ["10A1", "11B1"];

  useEffect(() => {
    setTimeout(() => {
      setStudents([
        { id: 1, name: "Nguyễn Văn A", studentId: "HS001" },
        { id: 2, name: "Trần Thị B", studentId: "HS002" },
        { id: 3, name: "Lê Văn C", studentId: "HS003" },
        { id: 4, name: "Phạm Thị D", studentId: "HS004" },
        { id: 5, name: "Hoàng Văn E", studentId: "HS005" },
      ]);
      setAttendance({
        1: "present",
        2: "present",
        3: "absent",
        4: "present",
        5: "present",
      });
      setLoading(false);
    }, 500);
  }, [selectedClass, selectedDate]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    alert("Đã lưu điểm danh thành công!");
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status === "present"
  ).length;
  const absentCount = Object.values(attendance).filter(
    (status) => status === "absent"
  ).length;

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải dữ liệu điểm danh...</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div>
          <h1>
            <CheckCircleIcon /> Điểm danh
          </h1>
          <p>Ghi nhận sự tham gia của học sinh</p>
        </div>
        <button className={styles.SaveButton} onClick={handleSave}>
          <SaveIcon fontSize="small" /> Lưu điểm danh
        </button>
      </div>

      <div className={styles.FilterSection}>
        <div className={styles.FilterGroup}>
          <label>
            <ClassIcon fontSize="small" /> Lớp học:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={styles.Select}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.FilterGroup}>
          <label>
            <CalendarTodayIcon fontSize="small" /> Ngày:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.DateInput}
          />
        </div>
      </div>

      <div className={styles.Stats}>
        <div className={styles.StatCard} style={{ background: "#e8f5e9" }}>
          <CheckCircleIcon style={{ color: "#2e7d32" }} />
          <div>
            <p>Có mặt</p>
            <h3>{presentCount}</h3>
          </div>
        </div>
        <div className={styles.StatCard} style={{ background: "#ffebee" }}>
          <CancelIcon style={{ color: "#d32f2f" }} />
          <div>
            <p>Vắng mặt</p>
            <h3>{absentCount}</h3>
          </div>
        </div>
        <div className={styles.StatCard} style={{ background: "#e3f2fd" }}>
          <span style={{ fontSize: "32px" }}>👥</span>
          <div>
            <p>Tổng số</p>
            <h3>{students.length}</h3>
          </div>
        </div>
      </div>

      <div className={styles.AttendanceList}>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HS</th>
              <th>Họ và tên</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.studentId}</td>
                <td className={styles.StudentName}>{student.name}</td>
                <td>
                  <div className={styles.AttendanceButtons}>
                    <button
                      className={`${styles.AttendanceButton} ${
                        attendance[student.id] === "present"
                          ? styles.PresentActive
                          : ""
                      }`}
                      onClick={() =>
                        handleAttendanceChange(student.id, "present")
                      }
                    >
                      <CheckCircleIcon fontSize="small" /> Có mặt
                    </button>
                    <button
                      className={`${styles.AttendanceButton} ${
                        attendance[student.id] === "absent"
                          ? styles.AbsentActive
                          : ""
                      }`}
                      onClick={() =>
                        handleAttendanceChange(student.id, "absent")
                      }
                    >
                      <CancelIcon fontSize="small" /> Vắng
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
