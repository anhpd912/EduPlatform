"use client";

import { useState, useEffect } from "react";
import styles from "../../(admin)/admin/classes/page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "10A1",
          subject: "Toán",
          studentCount: 35,
          schedule: "Thứ 2, 4, 6 (7:00-8:30)",
          room: "A101",
          assignmentCount: 5,
        },
        {
          id: 2,
          name: "11B1",
          subject: "Toán",
          studentCount: 30,
          schedule: "Thứ 3, 5, 7 (9:00-10:30)",
          room: "B201",
          assignmentCount: 3,
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
          <p>Quản lý các lớp học bạn đang giảng dạy</p>
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
                <p className={styles.Subject}>{cls.subject}</p>
              </div>
              <div className={styles.StudentCount}>
                <PeopleIcon fontSize="small" />
                <span>{cls.studentCount}</span>
              </div>
            </div>

            <div className={styles.ClassInfo}>
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
              <div className={styles.InfoRow}>
                <AssignmentIcon fontSize="small" />
                <span>
                  <strong>Bài tập:</strong> {cls.assignmentCount} bài
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
