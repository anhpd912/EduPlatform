"use client";

import { useState, useEffect } from "react";
import styles from "../../(admin)/admin/classes/page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function StudentClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Toán 10",
          code: "10A1",
          teacher: "Nguyễn Văn C",
          schedule: "Thứ 2, 4, 6 (7:00-8:30)",
          room: "A101",
        },
        {
          id: 2,
          name: "Văn 10",
          code: "10A1",
          teacher: "Trần Thị D",
          schedule: "Thứ 3, 5, 7 (9:00-10:30)",
          room: "A102",
        },
        {
          id: 3,
          name: "Tiếng Anh 10",
          code: "10A1",
          teacher: "Lê Văn E",
          schedule: "Thứ 2, 3, 5 (13:00-14:30)",
          room: "B201",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

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
        <div>
          <h1>
            <ClassIcon /> Lớp học của tôi
          </h1>
          <p>Các lớp học bạn đang tham gia</p>
        </div>
      </div>

      <div className={styles.ClassGrid}>
        {classes.map((cls) => (
          <div key={cls.id} className={styles.ClassCard}>
            <div className={styles.ClassHeader}>
              <div>
                <h3>
                  <ClassIcon /> {cls.name}
                </h3>
                <p className={styles.Subject}>{cls.code}</p>
              </div>
            </div>

            <div className={styles.ClassInfo}>
              <div className={styles.InfoRow}>
                <PersonIcon fontSize="small" />
                <span>
                  <strong>Giáo viên:</strong> {cls.teacher}
                </span>
              </div>
              <div className={styles.InfoRow}>
                <EventIcon fontSize="small" />
                <span>
                  <strong>Lịch học:</strong> {cls.schedule}
                </span>
              </div>
              <div className={styles.InfoRow}>
                <span>🏫</span>
                <span>
                  <strong>Phòng:</strong> {cls.room}
                </span>
              </div>
            </div>

            <div className={styles.ClassActions}>
              <button className={styles.ViewButton}>
                <VisibilityIcon fontSize="small" /> Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
