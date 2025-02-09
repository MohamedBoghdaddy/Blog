import mongoose from "mongoose";

const ForumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);
export default ForumThread;
