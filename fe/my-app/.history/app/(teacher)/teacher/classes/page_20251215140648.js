"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Toán 10A1",
          subject: "Toán học",
          studentCount: 35,
          schedule: "Thứ 2, 4, 6 - 07:00-08:30",
          room: "A101",
          status: "ongoing",
          teacher: "Nguyễn Văn A",
        },
        {
          id: 2,
          name: "Toán 11B1",
          subject: "Toán học",
          studentCount: 30,
          schedule: "Thứ 3, 5, 7 - 09:00-10:30",
          room: "B201",
          status: "starting",
          teacher: "Nguyễn Văn A",
        },
        {
          id: 3,
          name: "Toán 10A2",
          subject: "Toán học",
          studentCount: 32,
          schedule: "Thứ 2, 4 - 13:30-15:00",
          room: "A102",
          status: "notStarted",
          teacher: "Nguyễn Văn A",
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
  const getStatusBadge = (status) => {
    const statusConfig = {
      ongoing: {
        text: "Đang diễn ra",
        icon: <PlayCircleIcon fontSize="small" />,
        className: styles.ongoing,
      },
      starting: {
        text: "Sắp bắt đầu",
        icon: <AccessTimeIcon fontSize="small" />,
        className: styles.starting,
      },
      notStarted: {
        text: "Chưa bắt đầu",
        icon: <PauseCircleIcon fontSize="small" />,
        className: styles.notStarted,
      },
    };

    const config = statusConfig[status];
    return (
      <div className={`${styles.StatusBadge} ${config.className}`}>
        {config.icon}
        {config.text}
      </div>
    );
  };

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <ClassIcon style={{ fontSize: 28 }} />
          </div>
          <h1>Lớp học của tôi</h1>
        </div>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          Thêm lớp học
        </button>
      </div>

      <div className={styles.ClassGrid}>
        {classes.map((cls) => (
          <div key={cls.id} className={styles.ClassCard}>
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

            {getStatusBadge(cls.status)}

            <div className={styles.ClassInfo}>
              <div className={styles.InfoRow}>
                <PersonIcon fontSize="small" />
                <strong>Giáo viên:</strong> {cls.teacher}
              </div>
              <div className={styles.InfoRow}>
                <ScheduleIcon fontSize="small" />
                <strong>Lịch học:</strong> {cls.schedule}
              </div>
              <div className={styles.InfoRow}>
                <RoomIcon fontSize="small" />
                <strong>Phòng:</strong> {cls.room}
              </div>
            </div>

            <div className={styles.ClassActions}>
              <button className={styles.ViewButton}>
                <VisibilityIcon fontSize="small" />
                Xem chi tiết
              </button>
              <button className={styles.EditButton}>
                <EditIcon fontSize="small" />
              </button>
              <button className={styles.DeleteButton}>
                <DeleteIcon fontSize="small" />
              </button>
            </div