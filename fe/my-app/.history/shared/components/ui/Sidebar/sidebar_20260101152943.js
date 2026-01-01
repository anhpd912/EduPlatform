"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";
import {
  Dashboard,
  People,
  School,
  Book,
  Assignment,
  Settings,
  BarChart,
  Menu,
  Close,
  Class,
  CalendarMonth,
  CheckCircle,
  PersonSearch,
  MenuBook,
} from "@mui/icons-material";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useSnapshot(authStore);

  // Admin menu items
  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: <Dashboard />,
      href: "/admin/dashboard",
    },
    {
      title: "Students",
      icon: <People />,
      href: "/admin/students",
    },
    {
      title: "Teachers",
      icon: <School />,
      href: "/admin/teachers",
    },
    {
      title: "Classes",
      icon: <Class />,
      href: "/admin/classes",
    },
    {
      title: "Users",
      icon: <People />,
      href: "/admin/users",
    },
    {
      title: "Reports",
      icon: <BarChart />,
      href: "/admin/reports",
    },
  ];

  // Student menu items
  const studentMenuItems = [
    {
      title: "Dashboard",
      icon: <Dashboard />,
      href: "/student/dashboard",
    },
    {
      title: "My Classes",
      icon: <Class />,
      href: "/student/classes",
    },
    {
      title: "Assignment",
      icon: <Assignment />,
      href: "/student/assignments",
    },
    {
      title: "Calendar",
      icon: <CalendarMonth />,
      href: "/student/calendar",
    },
    {
      title: "Attendance Status",
      icon: <CheckCircle />,
      href: "/student/attendance",
    },
  ];

  // Teacher menu items
  const teacherMenuItems = [
    {
      title: "Dashboard",
      icon: <Dashboard />,
      href: "/teacher/dashboard",
    },
    {
      title: "My Classes",
      icon: <Class />,
      href: "/teacher/classes",
    },
    {
      title: "Calendar",
      icon: <CalendarMonth />,
      href: "/teacher/calendar",
    },
    {
      title: "Students",
      icon: <PersonSearch />,
      href: "/teacher/students",
    },
    {
      title: "Assignments",
      icon: <Assignment />,
      href: "/teacher/assignments",
    },
    {
      title: "Attendance",
      icon: <CheckCircle />,
      href: "/teacher/attendance",
    },
  ];

  // Get menu items and title based on role
  const getMenuConfig = () => {
    switch (role) {
      case "ADMIN":
        return { items: adminMenuItems, title: "Admin Panel" };
      case "STUDENT":
        return { items: studentMenuItems, title: "Student Portal" };
      case "TEACHER":
        return { items: teacherMenuItems, title: "Teacher Portal" };
      default:
        return { items: [], title: "Menu" };
    }
  };

  const { items: menuItems, title: sidebarTitle } = getMenuConfig();

  // Don't render sidebar if no role or no menu items
  if (!role || menuItems.length === 0) {
    return null;
  }

  return (
    <>
      <button
        className={styles.ToggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <Close /> : <Menu />}
      </button>

      {isOpen && (
        <div className={styles.Overlay} onClick={() => setIsOpen(false)} />
      )}

      <aside className={`${styles.Sidebar} ${isOpen ? styles.Open : ""}`}>
        <div className={styles.SidebarHeader}>
          <h3>{sidebarTitle}</h3>
        </div>
        <nav className={styles.SidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.SidebarItem} ${
                pathname === item.href ? styles.Active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.Icon}>{item.icon}</span>
              <span className={styles.Title}>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
