import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// WebSocket connection (Choose one)
const socket = io("http://localhost:4000", { transports: ["websocket"] });

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }

    // Listen for real-time notifications
    socket.on("receiveNotification", (notification) => {
      if (notification.user === currentUser._id) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        showToast(notification.message);
      }
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [currentUser]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/read-all`);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Show toast notification
  const showToast = (message) => {
    toast.info(message, { position: "top-right", autoClose: 5000 });
  };

  return (
    <div className="relative">
      <button
        className="p-2 relative focus:outline-none"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 z-50">
          <h2 className="text-lg font-semibold">
            Notifications ({unreadCount})
          </h2>
          <div className="mt-4 space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-2 border rounded ${
                    notif.read ? "bg-gray-200" : "bg-blue-100"
                  }`}
                >
                  <p>{notif.message}</p>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No new notifications</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mark All as Read
            </button>
          )}
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Notification;
