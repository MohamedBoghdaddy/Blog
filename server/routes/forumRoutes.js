import express from "express";
import {
  createThread,
  getAllThreads,
  getThreadById,
  deleteThread,
  addCommentToThread,
  searchThreads,
} from "../controller/forumController.js";
import { auth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createThread);
router.get("/", getAllThreads);
router.get("/search", searchThreads);
router.get("/:id", getThreadById);
router.delete("/:id", auth, deleteThread);
router.post("/:id/comments", auth, addCommentToThread);

export default router;
