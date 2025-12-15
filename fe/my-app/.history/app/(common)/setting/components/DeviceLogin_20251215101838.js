"use client";

import { useState, useEffect } from "react";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import styles from "./device-login.module.css";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';

export default function DeviceLogin() {
  const currentDevice = useDeviceInfo();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await AuthService.getDeviceLogins();
        const deviceList = response.data.map((device) => ({
          id: device.token, // Use token as unique id
          token: device.token,
          ipAddress: device.ipAddress,
          location: device.location || "Không xác định",
          deviceInfo: device.deviceInfo || "Không xác định",
          isCurrent: device.ipAddress === currentDevice?.ipAddress,
        }));
        setDevices(deviceList);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [currentDevice?.ipAddress]);

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

  const getDeviceIcon = (deviceInfo) => {
    if (!deviceInfo) return <ComputerIcon />;
    const infoLower = deviceInfo.toLowerCase();
    if (
      infoLower.includes("điện thoại") ||
      infoLower.includes("mobile") ||
      infoLower.includes("phone")
    ) {
      return <PhoneAndroidIcon />;
    }
    if (infoLower.includes("tablet") || infoLower.includes("ipad")) {
      return <TabletIcon />;
    }
    return <ComputerIcon />;
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

          {currentDevice.ipAddress && (
            <p className={styles.InfoDetail}>IP: {currentDevice.ipAddress}</p>
          )}
          {currentDevice.location && (
            <p className={styles.InfoDetail}>
              <LocationOnIcon fontSize="small" /> Vị trí: {currentDevice.location}
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
                {getDeviceIcon(device.deviceInfo)}
              </div>
              <div className={styles.DeviceInfo}>
                <div className={styles.DeviceHeader}>
                  <h3>{device.deviceInfo}</h3>
                  {device.isCurrent && (
                    <span className={styles.CurrentBadge}>Hiện tại</span>
                  )}
                </div>
                <p className={styles.DeviceLocation}>
                  <LocationOnIcon fontSize="small" /> {device.location}
                </p>
                <p className={styles.DeviceIP}>IP: {device.ipAddress}</p>
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
          <InfoIcon fontSize="small" /> <strong>Lưu ý bảo mật:</strong> Nếu bạn thấy thiết bị lạ, hãy đăng
          xuất ngay và đổi mật khẩu.
        </p>
      </div>
    </div>
  );
}
