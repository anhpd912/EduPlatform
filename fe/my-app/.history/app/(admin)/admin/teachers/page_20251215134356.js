"use client";

import { useState, useEffect } from "react";
import styles from "../students/page.module.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setTeachers([
        {
          id: 1,
          name: "Nguyễn Văn C",
          email: "nguyenvanc@example.com",
          phone: "0912345678",
          subject: "Toán",
          classCount: 3,
          hireDate: "2020-08-15",
        },
        {
          id: 2,
          name: "Trần Thị D",
          email: "tranthid@example.com",
          phone: "0923456789",
          subject: "Văn",
          classCount: 2,
          hireDate: "2021-09-01",
        },
        {
          id: 3,
          name: "Lê Văn E",
          email: "levane@example.com",
          phone: "0934567890",
          subject: "Tiếng Anh",
          classCount: 4,
          hireDate: "2019-06-10",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải danh sách giáo viên...</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div>
          <h1>
            <PersonIcon /> Danh sách giáo viên
          </h1>
          <p>Quản lý thông tin giáo viên trong hệ thống</p>
        </div>
        <button className={styles.AddButton}>+ Thêm giáo viên</button>
      </div>

      <div className={styles.SearchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc môn dạy..."
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
              <th>Môn dạy</th>
              <th>Số lớp</th>
              <th>Ngày vào làm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.EmptyState}>
                  Không tìm thấy giáo viên nào
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td className={styles.StudentName}>
                    <PersonIcon fontSize="small" />
                    {teacher.name}
                  </td>
                  <td>
                    <EmailIcon fontSize="small" /> {teacher.email}
                  </td>
                  <td>
                    <PhoneIcon fontSize="small" /> {teacher.phone}
                  </td>
                  <td>
                    <span className={styles.ClassBadge}>{teacher.subject}</span>
                  </td>
                  <td>
                    <ClassIcon fontSize="small" /> {teacher.classCount} lớp
                  </td>
                  <td>
                    {new Date(teacher.hireDate).toLocaleDateString("vi-VN")}
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
