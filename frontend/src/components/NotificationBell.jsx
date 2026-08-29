// frontend/src/components/NotificationBell.jsx
//
// Bell icon jo top-bar me Logout button ke sath lagta hai.
// `notifications` prop App.jsx se aata hai, jo backend se
// (DB se) history fetch karta hai — isliye refresh/login ke
// baad bhi purani notifications yahan dikhti rehti hain.
// frontend/src/components/NotificationBell.jsx
//
// Bell icon jo top-bar me Logout button ke sath lagta hai.
// `notifications` prop App.jsx se aata hai, jo backend se
// (DB se) history fetch karta hai — isliye refresh/login ke
// baad bhi purani notifications yahan dikhti rehti hain.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

function formatTimeAgo(value) {
  if (!value) return "";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function NotificationBell({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkRead(notification._id);
    }

    setIsOpen(false);

    const todoId =
      notification.todo?._id || notification.todo;

    if (todoId) {
      navigate(`/tasks/view/${todoId}`);
    }
  };

  // ==========================
  // View All
  // Dropdown band karke poore "Notifications" page
  // par le jata hai (saari notifications, full list).
  // ==========================
  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="notification-bell-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="notification-bell-btn"
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <strong>Notifications</strong>

            <div className="notification-header-actions">
              <button
                type="button"
                className="notification-header-link-btn"
                onClick={onMarkAllRead}
              >
                Mark all as read
              </button>

              <button
                type="button"
                className="notification-header-link-btn"
                onClick={handleViewAll}
              >
                View All
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    notification.isRead ? "" : "notification-item-unread"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  <small className="notification-time">
                    {formatTimeAgo(notification.createdAt)}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;