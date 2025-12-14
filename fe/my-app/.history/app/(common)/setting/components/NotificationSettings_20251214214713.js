"use client";

import { useState } from "react";
import styles from "./notification-settings.module.css";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    assignments: true,
    messages: true,
    promotions: false,
    weeklyDigest: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // Replace with actual API call
      // await SettingsService.updateNotifications(notifications);
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.NotificationContainer}>
      <div className={styles.SettingGroup}>
        <h3>Thông báo chung</h3>
        
        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Thông báo qua Email</label>
            <p>Nhận thông báo quan trọng qua email</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>

        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Thông báo đẩy</label>
            <p>Nhận thông báo đẩy trên trình duyệt</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.SettingGroup}>
        <h3>Thông báo nội dung</h3>
        
        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Cập nhật khóa học</label>
            <p>Thông báo khi có bài giảng mới hoặc thay đổi</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.courseUpdates}
              onChange={() => handleToggle("courseUpdates")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>

        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Bài tập & Kiểm tra</label>
            <p>Nhắc nhở về hạn nộp bài và kết quả</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.assignments}
              onChange={() => handleToggle("assignments")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>

        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Tin nhắn</label>
            <p>Thông báo khi có tin nhắn mới</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.messages}
              onChange={() => handleToggle("messages")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.SettingGroup}>
        <h3>Khác</h3>
        
        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Khuyến mãi & Ưu đãi</label>
            <p>Nhận thông tin về các chương trình khuyến mãi</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.promotions}
              onChange={() => handleToggle("promotions")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>

        <div className={styles.SettingItem}>
          <div className={styles.SettingInfo}>
            <label>Tóm tắt hàng tuần</label>
            <p>Nhận email tổng hợp hoạt động hàng tuần</p>
          </div>
          <label className={styles.Switch}>
            <input
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={() => handleToggle("weeklyDigest")}
            />
            <span className={styles.Slider}></span>
          </label>
        </div>
      </div>

      {saved && (
        <div className={styles.SuccessMessage}>
          ✓ Đã lưu cài đặt thành công!
        </div>
      )}

      <button
        className={styles.SaveButton}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Đang lưu..." : "Lưu cài đặt"}
      </button>
    </div>
  );
}
