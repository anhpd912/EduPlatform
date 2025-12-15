"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "Bài tập chương 1: Hàm số",
          class: "10A1",
          dueDate: "2025-12-20",
          status: "active",
          submittedCount: 25,
          totalStudents: 35,
        },
        {
          id: 2,
          title: "Kiểm tra giữa kỳ",
          class: "10A1",
          dueDate: "2025-12-25",
          status: "active",
          submittedCount: 10,
          totalStudents: 35,
        },
        {
          id: 3,
          title: "Bài tập về nhà: Phương trình",
          class: "11B1",
          dueDate: "2025-12-18",
          status: "completed",
          submittedCount: 30,
          totalStudents: 30,
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
        <div>
          <h1>
            <AssignmentIcon /> Quản lý bài tập
          </h1>
          <p>Tạo và theo dõi bài tập cho học sinh</p>
        </div>
        <button className={styles.AddButton}>+ Tạo bài tập mới</button>
      </div>

      <div className={styles.FilterBar}>
        <button
          className={`${styles.FilterButton} ${
            filter === "all" ? styles.Active : ""
          }`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`${styles.FilterButton} ${
            filter === "active" ? styles.Active : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Đang mở
        </button>
        <button
          className={`${styles.FilterButton} ${
            filter === "completed" ? styles.Active : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Đã đóng
        </button>
      </div>

      <div className={styles.AssignmentList}>
        {filteredAssignments.length === 0 ? (
          <div className={styles.EmptyState}>Không có bài tập nào</div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className={styles.AssignmentCard}>
              <div className={styles.AssignmentHeader}>
                <div>
                  <h3>
                    <AssignmentIcon /> {assignment.title}
                  </h3>
                  <div className={styles.AssignmentMeta}>
                    <span className={styles.ClassBadge}>
                      <ClassIcon fontSize="small" /> {assignment.class}
                    </span>
                    <span>
                      <CalendarTodayIcon fontSize="small" />
                      Hạn nộp:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div>
                  {assignment.status === "active" ? (
                    <span className={styles.StatusActive}>
                      <PendingIcon fontSize="small" /> Đang mở
                    </span>
                  ) : (
                    <span className={styles.StatusCompleted}>
                      <CheckCircleIcon fontSize="small" /> Đã đóng
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.SubmissionProgress}>
                <div className={styles.ProgressBar}>
                  <div
                    className={styles.ProgressFill}
                    style={{
                      width: `${
                        (assignment.submittedCount / assignment.totalStudents) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className={styles.ProgressText}>
                  {assignment.submittedCount}/{assignment.totalStudents} học sinh đã nộp
                </span>
              </div>

              <div className={styles.AssignmentActions}>
                <button className={styles.ViewButton}>Xem bài nộp</button>
                <button className={styles.EditButton}>
                  <EditIcon fontSize="small" />
                </button>
                <button className={styles.DeleteButton}>
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
