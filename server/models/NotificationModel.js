import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who triggered the notification
  type: {
    type: String,
    enum: ["like", "comment", "mention", "reply"],
    required: true,
  },
  message: { type: String, required: true },
  link: { type: String }, // Redirect URL
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
