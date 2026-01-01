"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore, logoutAction } from "@/store/authStore";
import {
  AccountCircle,
  Logout,
  Settings,
  Person,
  Language,
  Chat,
  Notifications,
  CheckCircle,
  Close,
  School,
  Info,
  Warning,
} from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { NotificationService } from "@/shared/services/api/Notification/NotificationService";
import { ClassTeacherService } from "@/shared/services/api/ClassTeacher/ClassTeacherService";

export default function NavBar() {
  const { isAuthenticated } = useSnapshot(authStore);
  const { username } = useSnapshot(authStore);
  const { refreshToken } = useSnapshot(authStore);
  const { role } = useSnapshot(authStore);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogOut = () => {
    logoutAction();
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingNotifications(true);
      const response = await NotificationService.getMyNotifications(0, 10);
      const data = response.data?.content || [];
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await NotificationService.getUnreadCount();
      // Response structure: { message, data: number, statusCode }
      // Axios interceptor returns response.data, so response = { message, data, statusCode }
      const count = response?.data ?? 0;
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
      // Fallback: use local count from notifications
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      // Refresh notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Only update unread count from local notifications if API fails
  // Remove this useEffect to prevent overwriting API count
  // useEffect(() => {
  //   const unread = notifications.filter((n) => !n.read).length;
  //   setUnreadCount(unread);
  // }, [notifications]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    // Find the notification first
    const notification = notifications.find((n) => n.id === notificationId);
    // Skip if already read
    if (!notification || notification.read) return;

    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleAcceptInvitation = async (notification) => {
    try {
      // Update ClassTeacher status to JOINED
      const { classId, teacherId } = notification.data || {};
      if (classId && teacherId) {
        await ClassTeacherService.acceptInvitation(classId, teacherId);
      }
      // Mark notification as read
      await NotificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true, responded: true } : n
        )
      );
      alert(t.invitationAccepted || "Invitation accepted successfully!");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      alert(
        err.response?.data?.message ||
          t.errorAcceptingInvitation ||
          "Error accepting invitation"
      );
    }
  };

  const handleDeclineInvitation = async (notification) => {
    try {
      // Update ClassTeacher status to REJECTED
      const { classId, teacherId } = notification.data || {};
      if (classId && teacherId) {
        await ClassTeacherService.rejectInvitation(classId, teacherId);
      }
      // Mark notification as read
      await NotificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true, responded: true } : n
        )
      );
    } catch (err) {
      console.error("Error declining invitation:", err);
      alert(
        err.response?.data?.message ||
          t.errorDecliningInvitation ||
          "Error declining invitation"
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CLASS_INVITATION":
        return <School className={styles.NotificationTypeIcon} />;
      case "WARNING":
        return (
          <Warning
            className={styles.NotificationTypeIcon}
            style={{ color: "#f59e0b" }}
          />
        );
      case "SYSTEM":
      default:
        return (
          <Info
            className={styles.NotificationTypeIcon}
            style={{ color: "#3b82f6" }}
          />
        );
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.justNow || "Just now";
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo || "minutes ago"}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo || "hours ago"}`;
    return `${diffDays} ${t.daysAgo || "days ago"}`;
  };

  useEffect(() => {
    // Debugging logs
    console.log("NavBar - isAuthenticated:", isAuthenticated);
    console.log("NavBar - username:", username);
    console.log("NavBar - role:", role);
    console.log("NavBar - refreshToken:", refreshToken);
  }, [isAuthenticated, username, role, refreshToken]);

  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        <button className={styles.LanguageToggle} onClick={toggleLanguage}>
          <Language fontSize="small" />
          <span>{language === "en" ? "EN" : "VI"}</span>
        </button>
        {isAuthenticated ? (
          <div className={styles.UserSection}>
            {/* Notifications */}
            <div className={styles.NotificationWrapper} ref={notificationRef}>
              <button
                className={styles.NotificationIcon}
                onClick={() => setShowNotifications(!showNotifications)}
                title={t.notifications || "Notifications"}
              >
                <Notifications fontSize="medium" />
                {unreadCount > 0 && (
                  <span className={styles.NotificationBadge}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={styles.NotificationDropdown}>
                  <div className={styles.NotificationHeader}>
                    <h4>{t.notifications || "Notifications"}</h4>
                    {unreadCount > 0 && (
                      <button
                        className={styles.MarkAllRead}
                        onClick={handleMarkAllAsRead}
                      >
                        {t.markAllRead || "Mark all as read"}
                      </button>
                    )}
                  </div>

                  <div className={styles.NotificationList}>
                    {loadingNotifications ? (
                      <div className={styles.NotificationLoading}>
                        {t.loading || "Loading..."}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className={styles.NotificationEmpty}>
                        <Notifications />
                        <p>{t.noNotifications || "No notifications"}</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`${styles.NotificationItem} ${
                            !notification.read ? styles.Unread : ""
                          }`}
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification.id);
                            }
                          }}
                          style={{ cursor: notification.read ? "default" : "pointer" }}
                        >
                          <div className={styles.NotificationIconWrapper}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className={styles.NotificationContent}>
                            <p className={styles.NotificationTitle}>
                              {notification.title}
                            </p>
                            <p className={styles.NotificationMessage}>
                              {notification.message}
                            </p>
                            <span className={styles.NotificationTime}>
                              {formatTimeAgo(notification.createdAt)}
                            </span>

                            {notification.type === "CLASS_INVITATION" &&
                              !notification.read &&
                              !notification.responded && (
                                <div className={styles.InvitationActions}>
                                  <button
                                    className={styles.AcceptButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptInvitation(notification);
                                    }}
                                  >
                                    <CheckCircle fontSize="small" />
                                    {t.accept || "Accept"}
                                  </button>
                                  <button
                                    className={styles.DeclineButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeclineInvitation(notification);
                                    }}
                                  >
                                    <Close fontSize="small" />
                                    {t.decline || "Decline"}
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    href="/notifications"
                    className={styles.ViewAllNotifications}
                    onClick={() => setShowNotifications(false)}
                  >
                    {t.viewAllNotifications || "View all notifications"}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/chat"
              className={styles.ChatIcon}
              title={t.chat || "Chat"}
            >
              <Chat fontSize="medium" />
            </Link>
            <div className={styles.UserProfile}>
              <span className={styles.UserName}>{username.toUpperCase()}</span>
              <AccountCircle color="primary" fontSize="large" />
              <div className={styles.DropdownMenu}>
                <Link href="/profile" className={styles.DropdownItem}>
                  <Person fontSize="small" />
                  <span>{t.profile}</span>
                </Link>
                <Link href="/setting" className={styles.DropdownItem}>
                  <Settings fontSize="small" />
                  <span>{t.settings}</span>
                </Link>
                <div className={styles.Divider}></div>
                <Link
                  href="/login"
                  onClick={handleLogOut}
                  className={styles.DropdownItem}
                >
                  <Logout fontSize="small" />
                  <span>{t.logout}</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <NavItem href="/login" isLogin={true}>
              {t.login}
            </NavItem>
            <NavItem href="/register" isRegister={true}>
              {t.register}
            </NavItem>
          </>
        )}
      </ul>
    </div>
  );
}
