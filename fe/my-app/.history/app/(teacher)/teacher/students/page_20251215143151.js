"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ClassIcon from "@mui/icons-material/Class";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

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
          phone: "0123456789",
          class: "Toán 10A1",
          status: "active",
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@example.com",
          phone: "0123456790",
          class: "Toán 10A1",
          status: "active",
        },
        {
          id: 3,
          name: "Lê Văn C",
          email: "levanc@example.com",
          phone: "0123456791",
          class: "Toán 11B1",
          status: "inactive",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          email: "phamthid@example.com",
          phone: "0123456792",
          class: "Toán 10A1",
          status: "active",
        },
        {
          id: 5,
          name: "Hoàng Văn E",
          email: "hoangvane@example.com",
          phone: "0123456793",
          class: "Toán 11B1",
          status: "active",
        },
        {
          id: 6,
          name: "Vũ Thị F",
          email: "vuthif@example.com",
          phone: "0123456794",
          class: "Toán 10A2",
          status: "active",
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
        <h1>Học sinh</h1>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          Thêm học sinh
        </button>
      </div>

      <div className={styles.FilterBar}>
        <div className={styles.SearchBar}>
          <SearchIcon className={styles.SearchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={styles.FilterSelect}
        >
          <option value="all">Tất cả lớp</option>
          {classes.slice(1).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.StudentGrid}>
        {filteredStudents.length === 0 ? (
          <div className={styles.EmptyState}>Không tìm thấy học sinh nào</div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className={styles.StudentCard}>
              <div className={styles.StudentHeader}>
                <div className={styles.StudentAvatar}>
                  <PersonIcon style={{ fontSize: 32 }} />
                </div>
                <div className={styles.StudentInfo}>
                  <h3>{student.name}</h3>
                  <span
                    className={`${styles.StatusBadge} ${
                      student.status === "active"
                        ? styles.Active
                        : styles.Inactive
                    }`}
                  >
                    {student.status === "active" ? "Đang học" : "Nghỉ học"}
                  </span>
                </div>
              </div>

              <div className={styles.StudentDetails}>
                <div className={styles.DetailRow}>
                  <EmailIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.email}</span>
                </div>
                <div className={styles.DetailRow}>
                  <PhoneIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.phone}</span>
                </div>
                <div className={styles.DetailRow}>
                  <ClassIcon fontSize="small" className={styles.DetailIcon} />
                  <span>{student.class}</span>
                </div>
              </div>

              <button className={styles.ViewButton}>Xem chi tiết</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
