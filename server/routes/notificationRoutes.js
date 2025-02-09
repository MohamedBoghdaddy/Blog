import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controller/notificationController.js";
import { auth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getUserNotifications);
router.put("/:id/read", auth, markNotificationAsRead);
router.put("/read-all", auth, markAllNotificationsAsRead);

export default router;
