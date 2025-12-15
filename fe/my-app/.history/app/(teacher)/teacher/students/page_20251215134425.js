"use client";

import { useState, useEffect } from "react";
import styles from "../../(admin)/admin/students/page.module.css";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import ClassIcon from "@mui/icons-material/Class";
import GradeIcon from "@mui/icons-material/Grade";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          class: "10A1",
          avgScore: 8.5,
          attendance: "95%",
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@example.com",
          class: "10A1",
          avgScore: 9.0,
          attendance: "100%",
        },
        {
          id: 3,
          name: "Lê Văn C",
          email: "levanc@example.com",
          class: "11B1",
          avgScore: 7.5,
          attendance: "90%",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = ["all", ...new Set(students.map((s) => s.class))];

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải danh sách học sinh...</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div>
          <h1>
            <SchoolIcon /> Danh sách học sinh
          </h1>
          <p>Quản lý học sinh trong các lớp bạn dạy</p>
        </div>
      </div>

      <div className={styles.SearchBar} style={{ display: "flex", gap: "12px" }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.SearchInput}
          style={{ flex: 1 }}
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={styles.SearchInput}
          style={{ width: "200px" }}
        >
          <option value="all">Tất cả lớp</option>
          {classes.slice(1).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.TableContainer}>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Lớp</th>
              <th>Điểm TB</th>
              <th>Tỷ lệ tham gia</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.EmptyState}>
                  Không tìm thấy học sinh nào
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td className={styles.StudentName}>
                    <SchoolIcon fontSize="small" />
                    {student.name}
                  </td>
                  <td>
                    <EmailIcon fontSize="small" /> {student.email}
                  </td>
                  <td>
                    <span className={styles.ClassBadge}>{student.class}</span>
                  </td>
                  <td>
                    <GradeIcon fontSize="small" /> {student.avgScore}
                  </td>
                  <td>{student.attendance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
