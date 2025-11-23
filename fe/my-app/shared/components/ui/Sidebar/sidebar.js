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
} from "@mui/icons-material";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useSnapshot(authStore);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Dashboard />,
      href: "/admin/dashboard",
    },
    {
      title: "Users",
      icon: <People />,
      href: "/admin/users",
    },
    {
      title: "Teachers",
      icon: <School />,
      href: "/admin/teachers",
    },
    {
      title: "Students",
      icon: <People />,
      href: "/admin/students",
    },
    {
      title: "Courses",
      icon: <Book />,
      href: "/admin/courses",
    },
    {
      title: "Assignments",
      icon: <Assignment />,
      href: "/admin/assignments",
    },
    {
      title: "Reports",
      icon: <BarChart />,
      href: "/admin/reports",
    },
  ];

  return (
    <>
      {role === "ADMIN" && (
        <button
          className={styles.ToggleButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <Close /> : <Menu />}
        </button>
      )}
      {isOpen && (
        <div className={styles.Overlay} onClick={() => setIsOpen(false)} />
      )}

      <aside className={`${styles.Sidebar} ${isOpen ? styles.Open : ""}`}>
        <div className={styles.SidebarHeader}>
          <h3>Admin Panel</h3>
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
