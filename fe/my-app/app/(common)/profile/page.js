import NavBar from "@/shared/components/ui/Navbar/navbar";
import Sidebar from "@/shared/components/ui/Sidebar/sidebar";
import styles from "./page.module.css";
export default function ProfilePage({ children }) {
  return (
    <div className={styles.LayoutContainer}>
      <nav>
        <NavBar />
      </nav>
      <div className={styles.ContentWrapper}>
        <Sidebar />
        <main className={styles.MainContent}>{children}</main>
      </div>
    </div>
  );
}
