"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0901234567",
          class: "10A1",
          enrollmentDate: "2024-09-01",
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@example.com",
          phone: "0907654321",
          class: "10A2",
          enrollmentDate: "2024-09-01",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p>Quản lý thông tin học sinh trong hệ thống</p>
        </div>
        <button className={styles.AddButton}>+ Thêm học sinh</button>
      </div>

      <div className={styles.SearchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc lớp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.SearchInput}
        />
      </div>

      <div className={styles.TableContainer}>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Lớp</th>
              <th>Ngày nhập học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.EmptyState}>
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
                    <PhoneIcon fontSize="small" /> {student.phone}
                  </td>
                  <td>
                    <span className={styles.ClassBadge}>{student.class}</span>
                  </td>
                  <td>
                    {new Date(student.enrollmentDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td>
                    <div className={styles.ActionButtons}>
                      <button className={styles.EditButton} title="Chỉnh sửa">
                        <EditIcon fontSize="small" />
                      </button>
                      <button className={styles.DeleteButton} title="Xóa">
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
