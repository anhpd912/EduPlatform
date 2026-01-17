"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { UserService } from "@/shared/services/api/User/UserService";
import { ClassService } from "@/shared/services/api/Class/ClassService";
import { SubjectService } from "@/shared/services/api/Subject/SubjectService";
import { StudentService } from "@/shared/services/api/Student/StudentService";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, studentsRes, classesRes, subjectsRes] = await Promise.all([
        UserService.getUsers({ size: 1000 }),
        StudentService.getAllStudents({ size: 1000 }),
        ClassService.getAllClasses(),
        SubjectService.getAllSubjects(),
      ]);

      const users = usersRes?.data?.content || usersRes?.data || [];
      const students = studentsRes?.data?.content || studentsRes?.data || [];
      const classes = classesRes?.data || [];
      const subjects = subjectsRes?.data || [];

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalStudents: Array.isArray(students) ? students.length : 0,
        totalClasses: Array.isArray(classes) ? classes.length : 0,
        totalSubjects: Array.isArray(subjects) ? subjects.length : 0,
      });

      // Set recent classes (last 5)
      if (Array.isArray(classes)) {
        setRecentClasses(classes.slice(0, 5));
      }

      // Generate recent activity from data
      generateRecentActivity(users, classes, students);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (users, classes, students) => {
    const activities = [];

    // Add some mock recent activities based on data
    if (Array.isArray(users) && users.length > 0) {
      const recentUser = users[users.length - 1];
      activities.push({
        id: 1,
        type: "user",
        message: `New user registered: ${recentUser.fullName || recentUser.username}`,
        time: "Recently",
      });
    }

    if (Array.isArray(classes) && classes.length > 0) {
      const recentClass = classes[classes.length - 1];
      activities.push({
        id: 2,
        type: "class",
        message: `Class created: ${recentClass.name}`,
        time: "Recently",
      });
    }

    if (Array.isArray(students) && students.length > 0) {
      activities.push({
        id: 3,
        type: "user",
        message: `${students.length} students in system`,
        time: "Total",
      });
    }

    setRecentActivity(activities);
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
        <h1>{t.adminDashboard || "Admin Dashboard"}</h1>
        <p>{t.welcomeBack || "Welcome back! Here's what's happening."}</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.StatsGrid}>
        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.blue}`}>
            <PeopleIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.totalUsers || "Total Users"}</h3>
            <p className={styles.StatValue}>{stats.totalUsers}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.allTime || "All time"}
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
              {t.enrolled || "Enrolled"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.purple}`}>
            <ClassIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.totalClasses || "Total Classes"}</h3>
            <p className={styles.StatValue}>{stats.totalClasses}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.active || "Active"}
            </span>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={`${styles.StatIcon} ${styles.orange}`}>
            <MenuBookIcon />
          </div>
          <div className={styles.StatInfo}>
            <h3>{t.totalSubjects || "Total Subjects"}</h3>
            <p className={styles.StatValue}>{stats.totalSubjects}</p>
            <span className={`${styles.StatChange} ${styles.positive}`}>
              <TrendingUpIcon fontSize="small" />
              {t.available || "Available"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.ContentGrid}>
        {/* Recent Classes */}
        <div className={styles.Card}>
          <div className={styles.CardHeader}>
            <h2>{t.recentClasses || "Recent Classes"}</h2>
            <Link href="/admin/classes" className={styles.ViewAllLink}>
              {t.viewAll || "View All"}
            </Link>
          </div>
          <div className={styles.ClassList}>
            {recentClasses.length === 0 ? (
              <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
                {t.noClassesYet || "No classes yet"}
              </p>
            ) : (
              recentClasses.map((cls) => (
                <div key={cls.id} className={styles.ClassItem}>
                  <div className={styles.ClassAvatar}>
                    {getClassInitials(cls.name)}
                  </div>
                  <div className={styles.ClassInfo}>
                    <h4>{cls.name}</h4>
                    <p>
                      {cls.homeRoomTeacherName || t.noTeacher || "No teacher assigned"}
                    </p>
                  </div>
                  <div className={styles.ClassStats}>
                    <span>
                      {cls.studentCount || 0} {t.students || "students"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.Card}>
          <div className={styles.CardHeader}>
            <h2>{t.quickActions || "Quick Actions"}</h2>
          </div>
          <div className={styles.QuickActions}>
            <Link href="/admin/users" className={styles.ActionButton}>
              <PersonAddIcon />
              <span>{t.manageUsers || "Manage Users"}</span>
            </Link>
            <Link href="/admin/students" className={styles.ActionButton}>
              <SchoolIcon />
              <span>{t.manageStudents || "Manage Students"}</span>
            </Link>
            <Link href="/admin/classes" className={styles.ActionButton}>
              <AddCircleIcon />
              <span>{t.manageClasses || "Manage Classes"}</span>
            </Link>
            <Link href="/admin/reports" className={styles.ActionButton}>
              <CalendarMonthIcon />
              <span>{t.viewReports || "View Reports"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.Card}>
        <div className={styles.CardHeader}>
          <h2>{t.recentActivity || "Recent Activity"}</h2>
        </div>
        <div className={styles.ActivityList}>
          {recentActivity.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
              {t.noRecentActivity || "No recent activity"}
            </p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className={styles.ActivityItem}>
                <div className={`${styles.ActivityIcon} ${styles[activity.type]}`}>
                  {activity.type === "user" && <PeopleIcon />}
                  {activity.type === "class" && <ClassIcon />}
                  {activity.type === "subject" && <MenuBookIcon />}
                  {activity.type === "schedule" && <CalendarMonthIcon />}
                </div>
                <div className={styles.ActivityContent}>
                  <p>{activity.message}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
