import Notification from "../models/NotificationModel.js";

/**
 * Create a new notification and emit via WebSockets
 */
export const createNotification = async (
  io,
  userId,
  senderId,
  type,
  message,
  link
) => {
  try {
    const notification = new Notification({
      user: userId,
      sender: senderId,
      type,
      message,
      link,
    });

    await notification.save();

    // Emit notification in real-time via WebSocket
    io.emit("receiveNotification", notification);

    return notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
  }
};

/**
 * Fetch notifications for the authenticated user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to mark as read" });
    }

    notification.read = true;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ message: "Error updating notification", error });
  }
};

/**
 * Mark all notifications as read for the authenticated user
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Error updating notifications:", error);
    res.status(500).json({ message: "Error updating notifications", error });
  }
};
