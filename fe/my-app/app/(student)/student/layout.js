"use client";
import NavBar from "@/shared/components/ui/Navbar/navbar";
import { RequiredAuth } from "@/shared/components/ui/RequiredAuth/requiredauth";
import Sidebar from "@/shared/components/ui/Sidebar/sidebar";
import styles from "./layout.module.css";
export default function StudentLayout({ children }) {
  return (
    <RequiredAuth allowedRoles={["STUDENT"]}>
      <div className={styles.LayoutContainer}>
        <nav>
          <NavBar />
        </nav>
        <div className={styles.ContentWrapper}>
          <Sidebar />
          <main className={styles.MainContent}>{children}</main>
        </div>
      </div>
    </RequiredAuth>
  );
}
