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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

export default function StudentDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const snap = useSnapshot(authStore);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    todayLessons: 0,
    weeklyLessons: 0,
    classmates: 0,
  });
  const [myClass, setMyClass] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper to extract array from response
  const extractArray = (res) => {
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.content)) return res.data.content;
    return [];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching student dashboard data...");

      // Get student's class
      const classesRes = await ClassService.getMyClass();
      console.log("Student classes response:", classesRes);

      const classes = extractArray(classesRes);
      console.log("Parsed classes:", classes);

      if (classes.length > 0) {
        const studentClass = classes[0]; // Student usually has one class
        setMyClass(studentClass);
        console.log("Student class:", studentClass);

        // Get timetables for the class
        const timetableRes = await TimetableService.getByClassId(
          studentClass.id
        );
        console.log("Timetable response:", timetableRes);
        const timetables = extractArray(timetableRes);
        console.log("Parsed timetables:", timetables);

        // Get unique subjects from timetables
        const uniqueSubjects = [];
        const subjectIds = new Set();
        timetables.forEach((tt) => {
          if (!subjectIds.has(tt.subjectId)) {
            subjectIds.add(tt.subjectId);
            uniqueSubjects.push({
              id: tt.subjectId,
              name: tt.subjectName,
              teacherName: tt.teacherName,
            });
          }
        });
        setSubjects(uniqueSubjects);

        // Get today's schedule
        const today = new Date();
        const jsDayOfWeek = today.getDay();
        const backendDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek;

        const todayTimetables = timetables.filter((tt) => {
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

        todayTimetables.sort((a, b) => a.startTime.localeCompare(b.startTime));
        setTodaySchedule(todayTimetables);

        setStats({
          totalSubjects: uniqueSubjects.length,
          todayLessons: todayTimetables.length,
          weeklyLessons: Array.isArray(timetables) ? timetables.length : 0,
          classmates: studentClass.studentCount || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseLocalDate = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  const getScheduleColor = (index) => {
    const colors = ["blue", "green", "purple", "orange"];
    return colors[index % colors.length];
  };

  const calculateDuration = (startTime, endTime) => {
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
        <h1>{t.studentDashboard || "Student Dashboard"}</h1>
        <p>
          {t.welcomeStudent || "Welcome back!"}{" "}
          {t.hereIsYourSchedule || "Here's your schedule for today."}
        </p>
      </div>

      {/* Class Info Card */}
      {myClass && (
        <div className={styles.ClassInfoCard}>
          <h3>{myClass.name}</h3>
          <p>
            {t.homeRoomTeacher || "Homeroom Teacher"}:{" "}
            {myClass.homeRoomTeacherName || t.notAssigned || "Not assigned"}
          </p>
          <div className={styles.ClassInfoDetails}>
            <div className={styles.ClassInfoItem}>
              <PersonIcon />
              <span>
                {myClass.studentCount || 0} {t.classmates || "Classmates"}
              </span>
            </div>
            <div className={styles.ClassInfoItem}>
              <MenuBookIcon />
              <span>
                {stats.totalSubjects} {t.subjects || "Subjects"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.StatsGrid}>
        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.blue}`}>
            <MenuBookIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.subjects || "Subjects"}</h3>
            <p className={styles.StatValue}>{stats.totalSubjects}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.enrolled || "Enrolled"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.green}`}>
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
          <div className={`${styles.StatIcon} ${styles.purple}`}>
            <CalendarMonthIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.weeklyLessons || "Weekly Lessons"}</h3>
            <p className={styles.StatValue}>{stats.weeklyLessons}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.total || "Total"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.orange}`}>
            <SchoolIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.classmates || "Classmates"}</h3>
            <p className={styles.StatValue}>{stats.classmates}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.inClass || "In class"}
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
            <Link href="/student/classes" className={styles.ViewAllLink}>
              {t.viewAll || "View All"}
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
                    <p>{schedule.teacherName}</p>
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
            <Link href="/student/classes" className={styles.ActionButton}>
              <ClassIcon />
              <span>{t.viewClass || "View My Class"}</span>
            </Link>
            <Link href="/student/assignments" className={styles.ActionButton}>
              <AssignmentIcon />
              <span>{t.viewAssignments || "View Assignments"}</span>
            </Link>
            <Link href="/chat" className={styles.ActionButton}>
              <PersonIcon />
              <span>{t.messageTeacher || "Message Teacher"}</span>
            </Link>
            <Link href="/notifications" className={styles.ActionButton}>
              <EventNoteIcon />
              <span>{t.notifications || "Notifications"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className={styles.Card}>
        <div className={styles.CardHeader}>
          <h2>{t.mySubjects || "My Subjects"}</h2>
        </div>
        {subjects.length === 0 ? (
          <div className={styles.EmptyState}>
            <MenuBookIcon />
            <p>{t.noSubjectsYet || "No subjects assigned yet"}</p>
          </div>
        ) : (
          <div className={styles.SubjectsGrid}>
            {subjects.map((subject) => (
              <div key={subject.id} className={styles.SubjectCard}>
                <div className={styles.SubjectIcon}>
                  <MenuBookIcon />
                </div>
                <div className={styles.SubjectInfo}>
                  <h4>{subject.name}</h4>
                  <p>{subject.teacherName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
