"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
          title: "Hàm số và Đồ thị",
          studentCount: 35,
          schedule: "Thứ 2, 4, 6",
          time: "07:00 - 08:30",
          date: "15 Dec 2025",
          room: "A101",
          assignmentCount: 5,
          status: "ongoing",
          teacher: "Nguyễn Văn C",
        },
        {
          id: 2,
          name: "11B1",
          subject: "Toán",
          title: "Phương trình và Bất phương trình",
          studentCount: 30,
          schedule: "Thứ 3, 5, 7",
          time: "09:00 - 10:30",
          date: "16 Dec 2025",
          room: "B201",
          assignmentCount: 3,
          status: "starting",
          teacher: "Nguyễn Văn C",
        },
        {
          id: 3,
          name: "10A2",
          subject: "Toán",
          title: "Lượng giác và Hình học",
          studentCount: 32,
          schedule: "Thứ 2, 4",
          time: "13:30 - 15:00",
          date: "20 Dec 2025",
          room: "A102",
          assignmentCount: 2,
          status: "notStarted",
          teacher: "Nguyễn Văn C",
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
            <div className={styles.CardContent}>
              <h3 className={styles.ClassTitle}>{cls.title}</h3>

              <div className={styles.ClassMeta}>
                <span className={styles.BatchCode}>
                  <ClassIcon fontSize="small" /> {cls.name} - {cls.subject}
                </span>
              </div>

              <div className={styles.ClassDetails}>
                <div className={styles.DetailItem}>
                  <AccessTimeIcon fontSize="small" />
                  <span>{cls.time}</span>
                </div>
                <div className={styles.DetailItem}>
                  <EventIcon fontSize="small" />
                  <span>{cls.date}</span>
                </div>
              </div>

              <div className={styles.ClassDetails}>
                <div className={styles.DetailItem}>
                  <RoomIcon fontSize="small" />
                  <span>Phòng {cls.room}</span>
                </div>
                <div className={styles.DetailItem}>
                  <PeopleIcon fontSize="small" />
                  <span>{cls.studentCount} học sinh</span>
                </div>
              </div>

              <div className={styles.StatusRow}>
                {cls.status === "ongoing" && (
                  <span className={`${styles.StatusBadge} ${styles.Ongoing}`}>
                    Đang diễn ra
                  </span>
                )}
                {cls.status === "starting" && (
                  <span className={`${styles.StatusBadge} ${styles.Starting}`}>
                    Sắp bắt đầu
                  </span>
                )}
                {cls.status === "notStarted" && (
                  <span
                    className={`${styles.StatusBadge} ${styles.NotStarted}`}
                  >
                    Chưa bắt đầu
                  </span>
                )}
              </div>
            </div>

            <button className={styles.JoinButton}>
              Xem chi tiết
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
