"use client";
import NavBar from "@/shared/components/ui/Navbar/navbar";
import Sidebar from "@/shared/components/ui/Sidebar/sidebar";
import styles from "./layout.module.css";
import { RequiredAuth } from "@/shared/components/ui/RequiredAuth/requiredauth";

export default function CommonLayout({ children }) {
  return (
    <RequiredAuth>
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
