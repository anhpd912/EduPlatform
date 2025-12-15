"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuizIcon from "@mui/icons-material/Quiz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "Bài tập chương 1: Hàm số và Đồ thị",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Toán học - Lớp 10A1",
          date: "3-01-2023",
          time: "12:30 AM - 01:40 PM",
          questions: 50,
          passingPercentage: 70,
        },
        {
          id: 2,
          title: "Kiểm tra giữa kỳ: Phương trình",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Toán học - Lớp 10A1",
          date: "5-01-2023",
          time: "09:00 AM - 10:30 AM",
          questions: 40,
          passingPercentage: 80,
        },
        {
          id: 3,
          title: "Bài tập về nhà: Lượng giác",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Toán học - Lớp 11B1",
          date: "8-01-2023",
          time: "02:00 PM - 03:30 PM",
          questions: 30,
          passingPercentage: 60,
        },
        {
          id: 4,
          title: "Đề thi cuối kỳ: Tổng hợp",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Toán học - Lớp 10A2",
          date: "10-01-2023",
          time: "08:00 AM - 10:00 AM",
          questions: 60,
          passingPercentage: 75,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAssignments = assignments.filter(
    (assignment) => filter === "all" || assignment.status === filter
  );

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Đang tải danh sách bài tập...</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <h1>Bài tập</h1>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          Tạo bài tập
        </button>
      </div>

      <div className={styles.TabsContainer}>
        <button
          className={`${styles.Tab} ${filter === "all" ? styles.ActiveTab : ""}`}
          onClick={() => setFilter("all")}
        >
          Bài tập đã lên lịch
        </button>
        <button
          className={`${styles.Tab} ${filter === "bank" ? styles.ActiveTab : ""}`}
          onClick={() => setFilter("bank")}
        >
          Ngân hàng câu hỏi
        </button>
        <button
          className={`${styles.Tab} ${filter === "history" ? styles.ActiveTab : ""}`}
          onClick={() => setFilter("history")}
        >
          Lịch sử
        </button>
      </div>

      <div className={styles.SearchBar}>
        <SearchIcon className={styles.SearchIcon} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className={styles.SearchInput}
        />
      </div>

      <div className={styles.AssignmentGrid}>
        {assignments.map((assignment) => (
          <div key={assignment.id} className={styles.AssignmentCard}>
            <h3 className={styles.AssignmentTitle}>{assignment.title}</h3>
            
            <div className={styles.CourseInfo}>
              <p className={styles.CourseName}>Khóa học: {assignment.course}</p>
              <p className={styles.SubjectName}>Môn học: {assignment.subject}</p>
            </div>

            <div className={styles.AssignmentDetails}>
              <div className={styles.DetailRow}>
                <CalendarTodayIcon fontSize="small" className={styles.DetailIcon} />
                <span>{assignment.date}</span>
                <AccessTimeIcon fontSize="small" className={styles.DetailIcon} style={{ marginLeft: '16px' }} />
                <span>{assignment.time}</span>
              </div>
            </div>

            <div className={styles.QuestionsInfo}>
              <QuizIcon fontSize="small" className={styles.DetailIcon} />
              <span>Số câu hỏi: {assignment.questions}</span>
            </div>

            <div className={styles.PassingSection}>
              <div className={styles.PassingHeader}>
                <span className={styles.PassingLabel}>Điểm đạt</span>
                <span className={styles.PassingValue}>{assignment.passingPercentage}%</span>
              </div>
              <div className={styles.ProgressBar}>
                <div
                  className={styles.ProgressFill}
                  style={{ width: `${assignment.passingPercentage}%` }}
                ></div>
              </div>
            </div>

            <button className={styles.ViewButton}>
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
