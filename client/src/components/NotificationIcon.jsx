import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${currentUser._id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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

  return (
    <div className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4">
      <h2 className="text-lg font-semibold">Notifications ({unreadCount})</h2>
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
    </div>
  );
};

export default Notification;
