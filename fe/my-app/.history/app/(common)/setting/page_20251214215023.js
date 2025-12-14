"use client";

import { useState } from "react";
import NavBar from "@/shared/components/ui/Navbar/navbar";
import ChangePassword from "./components/ChangePassword";
import DeviceLogin from "./components/DeviceLogin";
import NotificationSettings from "./components/NotificationSettings";
import styles from "./page.module.css";

const MENU_ITEMS = [
  {
    id: "password",
    icon: "🔒",
    title: "Đổi mật khẩu",
    description: "Cập nhật mật khẩu để bảo vệ tài khoản của bạn",
  },
  {
    id: "devices",
    icon: "📱",
    title: "Thiết bị đã đăng nhập",
    description: "Quản lý các thiết bị đang truy cập tài khoản của bạn",
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Cài đặt thông báo",
    description: "Tùy chỉnh cách bạn nhận thông báo",
  },
];

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState("password");

  const renderContent = () => {
    switch (activeTab) {
      case "password":
        return <ChangePassword />;
      case "devices":
        return <DeviceLogin />;
      case "notifications":
        return <NotificationSettings />;
      default:
        return <ChangePassword />;
    }
  };

  const activeMenuItem = MENU_ITEMS.find((item) => item.id === activeTab);

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

          <div className={styles.SettingsLayout}>
            {/* Sidebar Menu */}
            <aside className={styles.SettingsSidebar}>
              <nav className={styles.SettingsMenu}>
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.MenuItem} ${
                      activeTab === item.id ? styles.MenuItemActive : ""
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className={styles.MenuIcon}>{item.icon}</span>
                    <span className={styles.MenuTitle}>{item.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <div className={styles.SettingsContent}>
              <div className={styles.SettingsSection}>
                <div className={styles.SectionHeader}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span className={styles.SectionIcon}>
                        {activeMenuItem?.icon}
                      </span>
                      <h2>{activeMenuItem?.title}</h2>
                    </div>
                    <p>{activeMenuItem?.description}</p>
                  </div>
                </div>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
