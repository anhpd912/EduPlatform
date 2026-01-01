"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Notifications,
  CheckCircle,
  Close,
  School,
  Info,
  Warning,
  DoneAll,
  Delete,
  FilterList,
} from "@mui/icons-material";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { NotificationService } from "@/shared/services/api/Notification/NotificationService";
import { ClassTeacherService } from "@/shared/services/api/ClassTeacher/ClassTeacherService";

export default function NotificationsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await NotificationService.getMyNotifications(page, 20);
      const data = response.data?.content || [];
      
      if (page === 0) {
        setNotifications(data);
      } else {
        setNotifications((prev) => [...prev, ...data]);
      }
      
      setHasMore(data.length === 20);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(t.errorLoadingNotifications || "Error loading notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
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

  const handleAcceptInvitation = async (notification) => {
    try {
      setLoadingAction(notification.id);
      const { classId, teacherId } = notification.data || {};
      if (classId && teacherId) {
        await ClassTeacherService.acceptInvitation(classId, teacherId);
      }
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
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeclineInvitation = async (notification) => {
    try {
      setLoadingAction(notification.id);
      const { classId, teacherId } = notification.data || {};
      if (classId && teacherId) {
        await ClassTeacherService.rejectInvitation(classId, teacherId);
      }
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
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm(t.confirmDeleteNotification || "Delete this notification?")) {
      return;
    }
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CLASS_INVITATION":
        return <School className={styles.TypeIcon} />;
      case "WARNING":
        return <Warning className={`${styles.TypeIcon} ${styles.WarningIcon}`} />;
      case "SYSTEM":
      default:
        return <Info className={`${styles.TypeIcon} ${styles.InfoIcon}`} />;
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
    if (diffDays < 7) return `${diffDays} ${t.daysAgo || "days ago"}`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div className={styles.HeaderLeft}>
          <Notifications className={styles.HeaderIcon} />
          <div>
            <h1>{t.notifications || "Notifications"}</h1>
            <p className={styles.Subtitle}>
              {unreadCount > 0
                ? `${unreadCount} ${t.unreadNotifications || "unread notifications"}`
                : t.allCaughtUp || "You're all caught up!"}
            </p>
          </div>
        </div>
        <div className={styles.HeaderActions}>
          {unreadCount > 0 && (
            <button className={styles.MarkAllButton} onClick={handleMarkAllAsRead}>
              <DoneAll fontSize="small" />
              {t.markAllRead || "Mark all as read"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.FilterBar}>
        <div className={styles.FilterTabs}>
          <button
            className={`${styles.FilterTab} ${filter === "all" ? styles.Active : ""}`}
            onClick={() => setFilter("all")}
          >
            {t.all || "All"}
          </button>
          <button
            className={`${styles.FilterTab} ${filter === "unread" ? styles.Active : ""}`}
            onClick={() => setFilter("unread")}
          >
            {t.unread || "Unread"}
            {unreadCount > 0 && (
              <span className={styles.FilterBadge}>{unreadCount}</span>
            )}
          </button>
          <button
            className={`${styles.FilterTab} ${filter === "read" ? styles.Active : ""}`}
            onClick={() => setFilter("read")}
          >
            {t.read || "Read"}
          </button>
        </div>
      </div>

      <div className={styles.NotificationsList}>
        {loading && page === 0 ? (
          <div className={styles.Loading}>
            <div className={styles.Spinner}></div>
            <p>{t.loading || "Loading..."}</p>
          </div>
        ) : error ? (
          <div className={styles.Error}>
            <p>{error}</p>
            <button onClick={() => fetchNotifications()}>
              {t.retry || "Retry"}
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className={styles.Empty}>
            <Notifications className={styles.EmptyIcon} />
            <h3>{t.noNotifications || "No notifications"}</h3>
            <p>
              {filter === "unread"
                ? t.noUnreadNotifications || "No unread notifications"
                : t.noNotificationsYet || "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.NotificationCard} ${
                  !notification.read ? styles.Unread : ""
                }`}
              >
                <div className={styles.NotificationIcon}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className={styles.NotificationContent}>
                  <div className={styles.NotificationHeader}>
                    <h4 className={styles.NotificationTitle}>
                      {notification.title}
                    </h4>
                    <span className={styles.NotificationTime}>
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className={styles.NotificationMessage}>
                    {notification.message}
                  </p>

                  {notification.type === "CLASS_INVITATION" &&
                    !notification.read &&
                    !notification.responded && (
                      <div className={styles.InvitationActions}>
                        <button
                          className={styles.AcceptButton}
                          onClick={() => handleAcceptInvitation(notification)}
                          disabled={loadingAction === notification.id}
                        >
                          <CheckCircle fontSize="small" />
                          {loadingAction === notification.id
                            ? t.processing || "Processing..."
                            : t.accept || "Accept"}
                        </button>
                        <button
                          className={styles.DeclineButton}
                          onClick={() => handleDeclineInvitation(notification)}
                          disabled={loadingAction === notification.id}
                        >
                          <Close fontSize="small" />
                          {t.decline || "Decline"}
                        </button>
                      </div>
                    )}

                  {notification.responded && (
                    <span className={styles.RespondedBadge}>
                      <CheckCircle fontSize="small" />
                      {t.responded || "Responded"}
                    </span>
                  )}
                </div>
                <div className={styles.NotificationActions}>
                  {!notification.read && (
                    <button
                      className={styles.ActionButton}
                      onClick={() => handleMarkAsRead(notification.id)}
                      title={t.markAsRead || "Mark as read"}
                    >
                      <CheckCircle fontSize="small" />
                    </button>
                  )}
                  <button
                    className={styles.ActionButton}
                    onClick={() => handleDeleteNotification(notification.id)}
                    title={t.delete || "Delete"}
                  >
                    <Delete fontSize="small" />
                  </button>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className={styles.LoadMore}>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                >
                  {loading
                    ? t.loading || "Loading..."
                    : t.loadMore || "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
