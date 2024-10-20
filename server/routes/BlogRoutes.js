import express from "express";
import multer from "multer";
import {
  uploadBlog,
  downloadBlog,
  softDeleteBlog,
  previewBlog,
  listBlogInWorkspace,
  restoreBlog,
  updateBlogMetadata,
  updateBlogTags,
  searchBlogs,
} from "../controller/blogController.js";
import { auth } from "../Middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", auth, upload.single("document"), uploadBlog);
router.put("/:id/soft-delete", auth, softDeleteBlog);
router.put("/:id/restore", auth, restoreBlog);
router.get("/:workspaceId/blogs", auth, listBlogInWorkspace);
router.get("/download/:id", auth, downloadBlog);
router.get("/preview/:id", auth, previewBlog);
router.put("/:id/metadata", auth, updateBlogMetadata);
router.put("/:id/tags", auth, updateBlogTags);
router.get("/search", auth, searchBlogs);

export default router;
