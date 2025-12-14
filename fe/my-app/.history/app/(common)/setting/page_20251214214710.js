import NavBar from "@/shared/components/ui/Navbar/navbar";
import ChangePassword from "./components/ChangePassword";
import DeviceLogin from "./components/DeviceLogin";
import NotificationSettings from "./components/NotificationSettings";
import styles from "./page.module.css";

export default function SettingPage() {
  return (
    <div className={styles.PageContainer}>
      <nav>
        <NavBar />
      </nav>
      <main className={styles.MainContent}>
        <div className={styles.SettingsContainer}>
          <div className={styles.SettingsHeader}>
            <h1>Cài đặt</h1>
            <p>Quản lý tài khoản và tùy chọn của bạn</p>
          </div>

          {/* Change Password Section */}
          <div className={styles.SettingsSection}>
            <div className={styles.SectionHeader}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={styles.SectionIcon}>🔒</span>
                  <h2>Đổi mật khẩu</h2>
                </div>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              </div>
            </div>
            <ChangePassword />
          </div>

          {/* Device Login Section */}
          <div className={styles.SettingsSection}>
            <div className={styles.SectionHeader}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={styles.SectionIcon}>📱</span>
                  <h2>Thiết bị đã đăng nhập</h2>
                </div>
                <p>Quản lý các thiết bị đang truy cập tài khoản của bạn</p>
              </div>
            </div>
            <DeviceLogin />
          </div>

          {/* Notification Settings Section */}
          <div className={styles.SettingsSection}>
            <div className={styles.SectionHeader}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={styles.SectionIcon}>🔔</span>
                  <h2>Cài đặt thông báo</h2>
                </div>
                <p>Tùy chỉnh cách bạn nhận thông báo</p>
              </div>
            </div>
            <NotificationSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
