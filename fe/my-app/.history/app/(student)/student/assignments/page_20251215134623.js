"use client";

import { useState, useEffect } from "react";
import styles from "../../(teacher)/teacher/assignments/page.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "Bài tập chương 1: Hàm số",
          class: "Toán 10",
          dueDate: "2025-12-20",
          status: "pending",
          submittedDate: null,
        },
        {
          id: 2,
          title: "Kiểm tra giữa kỳ",
          class: "Toán 10",
          dueDate: "2025-12-25",
          status: "pending",
          submittedDate: null,
        },
        {
          id: 3,
          title: "Bài tập về nhà: Phương trình",
          class: "Toán 10",
          dueDate: "2025-12-18",
          status: "submitted",
          submittedDate: "2025-12-17",
        },
        {
          id: 4,
          title: "Bài luận: Đất nước",
          class: "Văn 10",
          dueDate: "2025-12-22",
          status: "pending",
          submittedDate: null,
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
            <AssignmentIcon /> Bài tập của tôi
          </h1>
          <p>Theo dõi và nộp bài tập được giao</p>
        </div>
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
            filter === "pending" ? styles.Active : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          Chưa nộp
        </button>
        <button
          className={`${styles.FilterButton} ${
            filter === "submitted" ? styles.Active : ""
          }`}
          onClick={() => setFilter("submitted")}
        >
          Đã nộp
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
                  {assignment.status === "pending" ? (
                    <span className={styles.StatusActive}>
                      <PendingIcon fontSize="small" /> Chưa nộp
                    </span>
                  ) : (
                    <span className={styles.StatusCompleted}>
                      <CheckCircleIcon fontSize="small" /> Đã nộp
                    </span>
                  )}
                </div>
              </div>

              {assignment.submittedDate && (
                <div
                  style={{
                    marginBottom: "12px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Đã nộp vào:{" "}
                  {new Date(assignment.submittedDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </div>
              )}

              <div className={styles.AssignmentActions}>
                {assignment.status === "pending" ? (
                  <button className={styles.ViewButton}>
                    <UploadFileIcon fontSize="small" /> Nộp bài
                  </button>
                ) : (
                  <button className={styles.ViewButton}>Xem bài đã nộp</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
