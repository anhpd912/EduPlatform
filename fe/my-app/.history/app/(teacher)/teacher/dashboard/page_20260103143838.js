"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassService } from "@/shared/services/api/Class/ClassService";
import { TimetableService } from "@/shared/services/api/Timetable/TimetableService";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

// Icons
import ClassIcon from "@mui/icons-material/Class";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export default function TeacherDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const snap = useSnapshot(authStore);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todayLessons: 0,
    weeklyLessons: 0,
  });
  const [myClasses, setMyClasses] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    if (snap.userId) {
      fetchDashboardData();
    } else {
      // If no userId yet, still stop loading after a delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [snap.userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching teacher dashboard data for userId:", snap.userId);

      const [classesRes, timetableRes] = await Promise.all([
        ClassService.getMyClass(),
        TimetableService.getByTeacherId(snap.userId),
      ]);

      console.log("Classes response:", classesRes);
      console.log("Timetable response:", timetableRes);

      const classes = classesRes?.data || [];
      const timetables = timetableRes?.data || [];

      // Calculate stats
      let totalStudents = 0;
      if (Array.isArray(classes)) {
        classes.forEach((cls) => {
          totalStudents += cls.studentCount || 0;
        });
        setMyClasses(classes.slice(0, 5));
      }

      // Get today's schedule
      const today = new Date();
      const jsDayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ...
      // Convert to backend format: 1=Monday, ..., 7=Sunday
      const backendDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek;

      const todayTimetables = Array.isArray(timetables)
        ? timetables.filter((tt) => {
            // Check if today falls within the timetable's date range
            const fromDate = parseLocalDate(tt.fromDate);
            const toDate = parseLocalDate(tt.toDate);
            const todayDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );

            return (
              tt.dayOfWeek === backendDayOfWeek &&
              todayDate >= fromDate &&
              todayDate <= toDate
            );
          })
        : [];

      // Sort by start time
      todayTimetables.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setTodaySchedule(todayTimetables);

      // Count weekly lessons
      const weeklyLessons = Array.isArray(timetables) ? timetables.length : 0;

      setStats({
        totalClasses: Array.isArray(classes) ? classes.length : 0,
        totalStudents,
        todayLessons: todayTimetables.length,
        weeklyLessons,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse date without timezone issues
  const parseLocalDate = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const getClassInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5); // HH:mm
  };

  const getScheduleColor = (index) => {
    const colors = ["blue", "green", "purple", "orange"];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.Loading}>
          <AutorenewIcon />
          <p>{t.loading || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      {/* Header */}
      <div className={styles.Header}>
        <h1>{t.teacherDashboard || "Teacher Dashboard"}</h1>
        <p>
          {t.welcomeTeacher || "Welcome back!"}{" "}
          {t.hereIsYourSchedule || "Here's your schedule for today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.StatsGrid}>
        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.blue}`}>
            <ClassIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.myClasses || "My Classes"}</h3>
            <p className={styles.StatValue}>{stats.totalClasses}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.assigned || "Assigned"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.green}`}>
            <SchoolIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.totalStudents || "Total Students"}</h3>
            <p className={styles.StatValue}>{stats.totalStudents}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.acrossClasses || "Across classes"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.purple}`}>
            <AccessTimeIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.todayLessons || "Today's Lessons"}</h3>
            <p className={styles.StatValue}>{stats.todayLessons}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.scheduled || "Scheduled"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.orange}`}>
            <CalendarMonthIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.weeklySchedule || "Weekly Schedule"}</h3>
            <p className={styles.StatValue}>{stats.weeklyLessons}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.lessons || "Lessons"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.ContentGrid}>
        {/* Today's Schedule */}
        <div className={styles.Card}>
          <div className={styles.CardHeader}>
            <h2>{t.todaySchedule || "Today's Schedule"}</h2>
            <Link href="/teacher/calendar" className={styles.ViewAllLink}>
              {t.viewCalendar || "View Calendar"}
            </Link>
          </div>
          {todaySchedule.length === 0 ? (
            <div className={styles.EmptyState}>
              <EventNoteIcon />
              <p>{t.noLessonsToday || "No lessons scheduled for today"}</p>
            </div>
          ) : (
            <div className={styles.ScheduleList}>
              {todaySchedule.map((schedule, index) => (
                <div key={schedule.id} className={styles.ScheduleItem}>
                  <div className={styles.ScheduleTime}>
                    <div className={styles.Time}>
                      {formatTime(schedule.startTime)} -{" "}
                      {formatTime(schedule.endTime)}
                    </div>
                    <div className={styles.Duration}>
                      {calculateDuration(schedule.startTime, schedule.endTime)}
                    </div>
                  </div>
                  <div
                    className={`${styles.ScheduleDivider} ${
                      styles[getScheduleColor(index)]
                    }`}
                  ></div>
                  <div className={styles.ScheduleInfo}>
                    <h4>{schedule.subjectName}</h4>
                    <p>{schedule.className}</p>
                  </div>
                  {schedule.room && (
                    <div className={styles.ScheduleRoom}>{schedule.room}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.Card}>
          <div className={styles.CardHeader}>
            <h2>{t.quickActions || "Quick Actions"}</h2>
          </div>
          <div className={styles.QuickActions}>
            <Link href="/teacher/classes" className={styles.ActionButton}>
              <ClassIcon />
              <span>{t.viewClasses || "View Classes"}</span>
            </Link>
            <Link href="/teacher/calendar" className={styles.ActionButton}>
              <CalendarMonthIcon />
              <span>{t.manageSchedule || "Manage Schedule"}</span>
            </Link>
            <Link href="/teacher/attendance" className={styles.ActionButton}>
              <FactCheckIcon />
              <span>{t.takeAttendance || "Take Attendance"}</span>
            </Link>
            <Link href="/teacher/assignments" className={styles.ActionButton}>
              <AssignmentIcon />
              <span>{t.assignments || "Assignments"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className={styles.Card}>
        <div className={styles.CardHeader}>
          <h2>{t.myClasses || "My Classes"}</h2>
          <Link href="/teacher/classes" className={styles.ViewAllLink}>
            {t.viewAll || "View All"}
          </Link>
        </div>
        {myClasses.length === 0 ? (
          <div className={styles.EmptyState}>
            <ClassIcon />
            <p>{t.noClassesAssigned || "No classes assigned yet"}</p>
          </div>
        ) : (
          <div className={styles.ClassList}>
            {myClasses.map((cls) => (
              <Link
                key={cls.id}
                href={`/teacher/classes/${cls.id}`}
                className={styles.ClassItem}
              >
                <div className={styles.ClassAvatar}>
                  {getClassInitials(cls.name)}
                </div>
                <div className={styles.ClassInfo}>
                  <h4>{cls.name}</h4>
                  <p>
                    {cls.isHomeRoomTeacher
                      ? t.homeRoomTeacher || "Homeroom Teacher"
                      : t.subjectTeacher || "Subject Teacher"}
                  </p>
                </div>
                <div className={styles.ClassStats}>
                  <span>
                    <PeopleIcon fontSize="small" /> {cls.studentCount || 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate duration
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "";
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}
