import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  searchBlogs,
} from "../controller/blogController.js";
import { auth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createBlog);
router.get("/", getAllBlogs);
router.get("/search", searchBlogs);
router.get("/:id", getBlogById);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);
router.post("/:id/like", auth, likeBlog);
router.post("/:id/comments", auth, addComment);

export default router;
