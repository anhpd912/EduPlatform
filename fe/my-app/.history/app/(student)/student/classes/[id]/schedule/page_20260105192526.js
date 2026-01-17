"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdCalendarToday,
  MdAccessTime,
  MdAutorenew,
  MdInfo,
  MdSchool,
  MdPerson,
  MdRoom,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import ClassService from "@/shared/services/api/Class/ClassService";
import { TimetableService } from "@/shared/services/api/Timetable/TimetableService";
import styles from "./page.module.css";

// Helper to extract array from API response
const extractArray = (response) => {
  if (!response) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
};

// Days of week mapping (Java DayOfWeek: 1=Monday to 7=Sunday)
const daysOfWeek = [
  { id: 1, name: "Thứ 2", short: "T2" },
  { id: 2, name: "Thứ 3", short: "T3" },
  { id: 3, name: "Thứ 4", short: "T4" },
  { id: 4, name: "Thứ 5", short: "T5" },
  { id: 5, name: "Thứ 6", short: "T6" },
  { id: 6, name: "Thứ 7", short: "T7" },
  { id: 7, name: "Chủ nhật", short: "CN" },
];

// Time slots for schedule display
const timeSlots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export default function ClassSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id;

  const [classInfo, setClassInfo] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));
  const [viewMode, setViewMode] = useState("week"); // "week" or "list"

  function getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(monday);
      newDate.setDate(monday.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [classRes, scheduleRes] = await Promise.all([
        ClassService.getClassById(classId),
        TimetableService.getByClassId(classId),
      ]);

      setClassInfo(classRes.data || null);
      setSchedules(extractArray(scheduleRes));
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError("Không thể tải thời khóa biểu");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchData();
    }
  }, [classId, fetchData]);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const goToToday = () => {
    setCurrentWeek(getWeekDates(new Date()));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const getSchedulesForDay = (dayOfWeek, date) => {
    return schedules
      .filter((s) => {
        // Check if dayOfWeek matches
        if (s.dayOfWeek !== dayOfWeek) return false;
        
        // Check if the date is within fromDate and toDate range
        if (s.fromDate && s.toDate) {
          const currentDate = new Date(date);
          currentDate.setHours(0, 0, 0, 0);
          
          const fromDate = new Date(s.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          
          const toDate = new Date(s.toDate);
          toDate.setHours(23, 59, 59, 999);
          
          return currentDate >= fromDate && currentDate <= toDate;
        }
        
        return true; // If no date range, show anyway
      })
      .sort((a, b) => a.startTime?.localeCompare(b.startTime));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getScheduleColor = (index) => {
    const colors = [
      { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
      { bg: "#dcfce7", border: "#22c55e", text: "#166534" },
      { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
      { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
      { bg: "#e0e7ff", border: "#6366f1", text: "#3730a3" },
      { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.LoadingContainer}>
          <MdAutorenew className={styles.Spinner} />
          <p>Đang tải thời khóa biểu...</p>
        </div>
      </div>
    );
  }

  if (error || !classInfo) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.ErrorContainer}>
          <MdInfo style={{ fontSize: 48, color: "#ef4444" }} />
          <h3>{error || "Không tìm thấy lớp học"}</h3>
          <button onClick={() => router.back()} className={styles.BackButton}>
            <MdArrowBack /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      {/* Header */}
      <div className={styles.Header}>
        <button onClick={() => router.back()} className={styles.BackLink}>
          <MdArrowBack /> Quay lại
        </button>
        <div className={styles.HeaderInfo}>
          <h1>
            <MdCalendarToday /> Thời khóa biểu - {classInfo.name}
          </h1>
          <p>Mã lớp: {classInfo.classCode}</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.Controls}>
        <div className={styles.WeekNavigation}>
          <button onClick={() => navigateWeek(-1)} className={styles.NavButton}>
            <MdChevronLeft />
          </button>
          <span className={styles.WeekLabel}>
            {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
          </span>
          <button onClick={() => navigateWeek(1)} className={styles.NavButton}>
            <MdChevronRight />
          </button>
        </div>
        <div className={styles.ControlButtons}>
          <button onClick={goToToday} className={styles.TodayButton}>
            Hôm nay
          </button>
          <div className={styles.ViewToggle}>
            <button
              className={`${styles.ToggleBtn} ${
                viewMode === "week" ? styles.Active : ""
              }`}
              onClick={() => setViewMode("week")}
            >
              Tuần
            </button>
            <button
              className={`${styles.ToggleBtn} ${
                viewMode === "list" ? styles.Active : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className={styles.WeekView}>
          <div className={styles.WeekGrid}>
            {daysOfWeek.map((day, index) => {
              const date = currentWeek[index];
              const daySchedules = getSchedulesForDay(day.id, date);
              const todayClass = isToday(date) ? styles.Today : "";

              return (
                <div
                  key={day.id}
                  className={`${styles.DayColumn} ${todayClass}`}
                >
                  <div className={styles.DayHeader}>
                    <span className={styles.DayName}>{day.name}</span>
                    <span className={styles.DayDate}>{formatDate(date)}</span>
                  </div>
                  <div className={styles.DayContent}>
                    {daySchedules.length === 0 ? (
                      <div className={styles.NoSchedule}>
                        <span>Không có lịch</span>
                      </div>
                    ) : (
                      daySchedules.map((schedule, idx) => {
                        const color = getScheduleColor(idx);
                        return (
                          <div
                            key={schedule.id}
                            className={styles.ScheduleCard}
                            style={{
                              backgroundColor: color.bg,
                              borderLeftColor: color.border,
                            }}
                          >
                            <div
                              className={styles.ScheduleTime}
                              style={{ color: color.text }}
                            >
                              <MdAccessTime />
                              {formatTime(schedule.startTime)} -{" "}
                              {formatTime(schedule.endTime)}
                            </div>
                            <h4
                              className={styles.SubjectName}
                              style={{ color: color.text }}
                            >
                              {schedule.subject?.name ||
                                schedule.subjectName ||
                                "Môn học"}
                            </h4>
                            {(schedule.teacher?.fullName ||
                              schedule.teacherName) && (
                              <p className={styles.TeacherName}>
                                <MdPerson />
                                {schedule.teacher?.fullName ||
                                  schedule.teacherName}
                              </p>
                            )}
                            {schedule.room && (
                              <p className={styles.RoomName}>
                                <MdRoom />
                                {schedule.room}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className={styles.ListView}>
          {schedules.length === 0 ? (
            <div className={styles.EmptyState}>
              <MdCalendarToday style={{ fontSize: 48, color: "#cbd5e1" }} />
              <h3>Chưa có thời khóa biểu</h3>
              <p>Lớp học này chưa được sắp xếp lịch học</p>
            </div>
          ) : (
            daysOfWeek.map((day) => {
              const daySchedules = getSchedulesForDay(day.id);
              if (daySchedules.length === 0) return null;

              return (
                <div key={day.id} className={styles.ListDaySection}>
                  <h3 className={styles.ListDayTitle}>{day.name}</h3>
                  <div className={styles.ListSchedules}>
                    {daySchedules.map((schedule, idx) => {
                      const color = getScheduleColor(idx);
                      return (
                        <div
                          key={schedule.id}
                          className={styles.ListScheduleCard}
                          style={{ borderLeftColor: color.border }}
                        >
                          <div className={styles.ListTime}>
                            <MdAccessTime />
                            <span>
                              {formatTime(schedule.startTime)} -{" "}
                              {formatTime(schedule.endTime)}
                            </span>
                          </div>
                          <div className={styles.ListDetails}>
                            <h4>
                              <MdSchool />
                              {schedule.subject?.name ||
                                schedule.subjectName ||
                                "Môn học"}
                            </h4>
                            <div className={styles.ListMeta}>
                              {(schedule.teacher?.fullName ||
                                schedule.teacherName) && (
                                <span>
                                  <MdPerson />
                                  {schedule.teacher?.fullName ||
                                    schedule.teacherName}
                                </span>
                              )}
                              {schedule.room && (
                                <span>
                                  <MdRoom />
                                  {schedule.room}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
