// frontend/src/api/notificationApi.js
//
// Notifications ab backend mein save hoti hain, isliye history
// yahan se fetch hoti hai aur read/unread status bhi yahin se
// save hota hai (sirf local state nahi).


const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = `${API_URL}/api/notifications`;

// ======================================
// GET NOTIFICATIONS
// ======================================
export const fetchNotifications = async (userId) => {
  const response = await fetch(`${BASE_URL}?userId=${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Failed to fetch notifications"
    );
  }

  return data;
};

// ======================================
// MARK ONE AS READ
// ======================================
export const markNotificationRead = async (notificationId) => {
  const response = await fetch(`${BASE_URL}/${notificationId}/read`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Failed to mark notification as read"
    );
  }

  return data;
};

// ======================================
// MARK ALL AS READ
// ======================================
export const markAllNotificationsRead = async (userId) => {
  const response = await fetch(`${BASE_URL}/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "Failed to mark all notifications as read"
    );
  }

  return data;
};
