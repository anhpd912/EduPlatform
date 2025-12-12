import NavBar from "@/shared/components/ui/Navbar/navbar";
import ProfileView from "@/shared/components/ui/Profile/profile";
import styles from "./page.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.PageContainer}>
      <nav>
        <NavBar />
      </nav>
      <main className={styles.MainContent}>
        <ProfileView />
      </main>
    </div>
  );
}
