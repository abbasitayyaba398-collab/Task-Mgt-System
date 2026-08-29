// frontend/src/components/NotificationsPage.jsx
//
// "View All" button (NotificationBell dropdown) yahan le
// aata hai — poori notification history ek page par, DB se
// aayi hui (App.jsx wahi `notifications` state pass karta hai
// jo bell dropdown ko bhi milti hai).

import { useNavigate } from "react-router-dom";

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

function NotificationsPage({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkRead(notification._id);
    }

    const todoId = notification.todo?._id || notification.todo;

    if (todoId) {
      navigate(`/tasks/view/${todoId}`);
    }
  };

  return (
    <div className="todo-form">
      <div className="notifications-page-header">
        <h2>Notifications</h2>
      </div>

      <div className="notifications-page-list">
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
  );
}

export default NotificationsPage;