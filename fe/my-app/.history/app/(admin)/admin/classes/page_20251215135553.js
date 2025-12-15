"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "10A1",
          teacher: "Nguyễn Văn C",
          studentCount: 35,
          subject: "Toán",
          schedule: "Thứ 2, 4, 6",
          room: "A101",
        },
        {
          id: 2,
          name: "10A2",
          teacher: "Trần Thị D",
          studentCount: 32,
          subject: "Văn",
          schedule: "Thứ 3, 5, 7",
          room: "A102",
        },
        {
          id: 3,
          name: "11B1",
          teacher: "Lê Văn E",
          studentCount: 30,
          subject: "Tiếng Anh",
          schedule: "Thứ 2, 3, 5",
          room: "B201",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải danh sách lớp...</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <ClassIcon fontSize="large" />
          </div>
          <div>
            <h1>Danh sách lớp học</h1>
            <p>Quản lý và theo dõi các lớp học trong hệ thống</p>
          </div>
        </div>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          Thêm lớp học
        </button>
      </div>

      <div className={styles.SearchBar}>
        <div className={styles.SearchWrapper}>
          <SearchIcon className={styles.SearchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên lớp, giáo viên, môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>
      </div>

      <div className={styles.ClassGrid}>
        {filteredClasses.length === 0 ? (
          <div className={styles.EmptyState}>Không tìm thấy lớp học nào</div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className={styles.ClassCard}>
              <div className={styles.ClassHeader}>
                <div>
                  <h3>
                    <ClassIcon /> {cls.name}
                  </h3>
                  <p className={styles.Subject}>{cls.subject}</p>
                </div>
                <div className={styles.StudentCount}>
                  <PeopleIcon fontSize="small" />
                  <span>{cls.studentCount}</span>
                </div>
              </div>

              <div className={styles.ClassInfo}>
                <div className={styles.InfoRow}>
                  <PersonIcon fontSize="small" className={styles.InfoIcon} />
                  <span>
                    <strong>Giáo viên:</strong> {cls.teacher}
                  </span>
                </div>
                <div className={styles.InfoRow}>
                  <ScheduleIcon fontSize="small" className={styles.InfoIcon} />
                  <span>
                    <strong>Lịch học:</strong> {cls.schedule}
                  </span>
                </div>
                <div className={styles.InfoRow}>
                  <RoomIcon fontSize="small" className={styles.InfoIcon} />
                  <span>
                    <strong>Phòng:</strong> {cls.room}
                  </span>
                </div>
              </div>

              <div className={styles.ClassActions}>
                <button className={styles.ViewButton} title="Xem chi tiết">
                  <VisibilityIcon fontSize="small" /> Xem chi tiết
                </button>
                <button className={styles.EditButton} title="Chỉnh sửa">
                  <EditIcon fontSize="small" />
                </button>
                <button className={styles.DeleteButton} title="Xóa">
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
