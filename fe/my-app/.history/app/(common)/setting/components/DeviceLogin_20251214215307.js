"use client";

import { useState, useEffect } from "react";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import styles from "./device-login.module.css";

export default function DeviceLogin() {
  const currentDevice = useDeviceInfo();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching device login history from API
    // In production, replace this with actual API call
    const fetchDevices = async () => {
      try {
        // Simulated data - replace with actual API call
        // const response = await DeviceService.getLoginHistory();

        const mockDevices = [
          {
            id: 1,
            deviceType: "Máy tính",
            browser: "Chrome 120",
            os: "Windows 11",
            location: "Hà Nội, Việt Nam",
            ipAddress: "123.456.789.012",
            lastActive: new Date().toISOString(),
            isCurrent: true,
          },
          {
            id: 2,
            deviceType: "Điện thoại",
            browser: "Safari",
            os: "iOS 17",
            location: "Hồ Chí Minh, Việt Nam",
            ipAddress: "098.765.432.101",
            lastActive: new Date(Date.now() - 86400000).toISOString(),
            isCurrent: false,
          },
          {
            id: 3,
            deviceType: "Máy tính",
            browser: "Firefox 119",
            os: "MacOS Sonoma",
            location: "Đà Nẵng, Việt Nam",
            ipAddress: "111.222.333.444",
            lastActive: new Date(Date.now() - 172800000).toISOString(),
            isCurrent: false,
          },
        ];

        setDevices(mockDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleLogoutDevice = async (deviceId) => {
    if (!confirm("Bạn có chắc muốn đăng xuất khỏi thiết bị này?")) {
      return;
    }

    try {
      // Replace with actual API call
      // await DeviceService.logoutDevice(deviceId);

      setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      alert("Đã đăng xuất khỏi thiết bị thành công!");
    } catch (error) {
      console.error("Error logging out device:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "Điện thoại":
        return "📱";
      case "Tablet":
        return "📲";
      case "Máy tính":
      default:
        return "💻";
    }
  };

  if (loading) {
    return (
      <div className={styles.Loading}>
        <div className={styles.Spinner}></div>
        <p>Đang tải thông tin thiết bị...</p>
      </div>
    );
  }

  return (
    <div className={styles.DeviceLoginContainer}>
      {currentDevice && (
        <div className={styles.CurrentDeviceInfo}>
          <p className={styles.InfoLabel}>Thiết bị hiện tại của bạn:</p>
          <p className={styles.InfoValue}>{currentDevice.friendlyName}</p>
          {currentDevice.browser && (
            <p className={styles.InfoDetail}>
              Trình duyệt: {currentDevice.browser}
            </p>
          )}
          {currentDevice.ipAddress && (
            <p className={styles.InfoDetail}>
              IP: {currentDevice.ipAddress}
            </p>
          )}
          {currentDevice.location && (
            <p className={styles.InfoDetail}>
              📍 Vị trí: {currentDevice.location}
            </p>
          )}
        </div>
      )}

      <div className={styles.DeviceList}>
        {devices.length === 0 ? (
          <p className={styles.EmptyState}>
            Không có thiết bị nào đã đăng nhập
          </p>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className={`${styles.DeviceCard} ${
                device.isCurrent ? styles.CurrentDevice : ""
              }`}
            >
              <div className={styles.DeviceIcon}>
                {getDeviceIcon(device.deviceType)}
              </div>
              <div className={styles.DeviceInfo}>
                <div className={styles.DeviceHeader}>
                  <h3>
                    {device.deviceType} - {device.os}
                  </h3>
                  {device.isCurrent && (
                    <span className={styles.CurrentBadge}>Hiện tại</span>
                  )}
                </div>
                <p className={styles.DeviceBrowser}>{device.browser}</p>
                <p className={styles.DeviceLocation}>📍 {device.location}</p>
                <p className={styles.DeviceIP}>IP: {device.ipAddress}</p>
                <p className={styles.DeviceLastActive}>
                  Hoạt động: {formatLastActive(device.lastActive)}
                </p>
              </div>
              {!device.isCurrent && (
                <button
                  className={styles.LogoutButton}
                  onClick={() => handleLogoutDevice(device.id)}
                >
                  Đăng xuất
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.SecurityNote}>
        <p>
          ℹ️ <strong>Lưu ý bảo mật:</strong> Nếu bạn thấy thiết bị lạ, hãy đăng
          xuất ngay và đổi mật khẩu.
        </p>
      </div>
    </div>
  );
}
