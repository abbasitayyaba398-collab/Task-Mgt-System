// backend/controllers/notificationController.js
//
// Ab notifications sirf live emit nahi hoti — pehle DB mein save
// (create) hoti hain, phir socket ke through us employee/admin ke
// personal room mein emit ki jaati hain. Isse:
//   1) History save rehti hai (login ke baad bhi purani
//      notifications bell mein dikhti hain).
//   2) Live/real-time update bhi waisi hi milti hai jaisi pehle
//      milti thi (koi UI change nahi).

const Notification = require("../models/Notification");
const Employee = require("../models/Employee");
const { getIO } = require("../socket");

const emitToUser = (userId, event, payload) => {
  const io = getIO();
  if (io && userId) io.to(`user_${userId}`).emit(event, payload);
};

// ======================================
// CREATE + SAVE + EMIT (internal helper)
// todoController isko import kar ke call karta hai jab task
// assign hota hai, status change hota hai, ya comment add hota hai.
// ======================================
const createNotification = async ({ recipientId, message, type, todoId }) => {
  if (!recipientId) return null;

  try {
    const notification = await Notification.create({
      recipient: recipientId,
      message,
      type,
      todo: todoId || undefined,
    });

    // Live update — bina refresh kiye bell par turant dikhane ke liye.
    emitToUser(recipientId, "notification:new", notification);

    return notification;
  } catch (error) {
    console.log("Failed to save notification:", error.message);
    return null;
  }
};

// ======================================
// Status change / comment jaise events par task se juray sab
// "stakeholders" ko notify karta hai: assigned employees + tamam
// admins.
//
// `excludeActor` (default true): jisne khud action kiya usay
// notification list se hata deta hai — jaise comment karne wale
// ko apne hi comment ki notification nahi chahiye.
//
// Status change ke liye ye false pass kiya jata hai, kyunki
// actor (jaise admin khud) ko bhi apni history save honi chahiye,
// sirf ek temporary local message nahi jo refresh par gayab ho
// jaye.
// ======================================
const notifyStakeholders = async ({
  todo,
  actorId,
  message,
  type,
  excludeActor = true,
}) => {
  try {
    const assigneeIds = (todo.assignedTo || []).map((emp) =>
      String(emp?._id || emp)
    );

    const admins = await Employee.find({ role: "admin" }).select("_id");
    const adminIds = admins.map((admin) => String(admin._id));

    const recipientIds = new Set([...assigneeIds, ...adminIds]);

    if (actorId && excludeActor) recipientIds.delete(String(actorId));

    await Promise.all(
      [...recipientIds].map((recipientId) =>
        createNotification({ recipientId, message, type, todoId: todo._id })
      )
    );
  } catch (error) {
    console.log("Failed to notify stakeholders:", error.message);
  }
};

// ======================================
// GET NOTIFICATIONS
// GET /api/notifications?userId=...
// Logged-in user (admin ya employee) ki poori notification
// history laata hai, sabse nayi sabse upar.
// ======================================
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ======================================
// MARK ONE AS READ
// PATCH /api/notifications/:id/read
// ======================================
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// ======================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// body: { userId }
// ======================================
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  // todoController ke liye internal helpers
  createNotification,
  notifyStakeholders,
};