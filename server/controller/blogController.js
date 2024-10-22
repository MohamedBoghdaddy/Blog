import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import Blog from "../models/BlogModel.js";
import Workspace from "../models/WorkspaceModel.js";

// Fix __dirname issue in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
  },
});

const upload = multer({ storage: storage });

export const uploadBlog = async (req, res) => {
  const { workspaceId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  if (!workspaceId) {
    return res.status(400).json({ message: "Workspace ID is required." });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const file = req.file;
    const filePath = file.path;

    const newBlog = new Blog({
      name: file.originalname,
      type: file.mimetype,
      url: filePath,
      owner: req.user.id,
      workspace: workspaceId,
    });

    await newBlog.save();

    return res.status(200).json({
      message: "Blog uploaded successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error uploading blog:", error);
    return res.status(500).json({ message: "Blog upload failed", error });
  }
};

export const softDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.owner || blog.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this Blog",
      });
    }

    blog.deleted = true;
    await blog.save();

    return res.status(200).json({
      message: "Blog moved to recycle bin successfully",
      blog,
    });
  } catch (error) {
    console.error("Error soft deleting blog:", error);
    return res.status(500).json({ message: "Blog deletion failed", error });
  }
};

export const restoreBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.owner || blog.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to restore this Blog",
      });
    }

    blog.deleted = false;
    await blog.save();

    return res
      .status(200)
      .json({ message: "Blog restored successfully", blog });
  } catch (error) {
    console.error("Error restoring blog:", error);
    return res.status(500).json({ message: "Blog restoration failed", error });
  }
};

export const downloadBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.deleted) {
      return res
        .status(404)
        .json({ message: "Blog not found or has been deleted" });
    }

    if (blog.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to access this Blog",
      });
    }

    if (!fs.existsSync(blog.url)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    return res.download(blog.url, blog.name);
  } catch (error) {
    console.error("Error downloading blog:", error);
    return res.status(500).json({ message: "Blog download failed", error });
  }
};

// New: List Blogs in Workspace
export const listBlogInWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { sortBy = "createdAt", order = "asc", filter = {} } = req.query;

    if (!workspaceId || !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing workspace ID." });
    }

    const blogs = await Blog.find({ workspace: workspaceId, ...filter })
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .exec();

    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found for this workspace." });
    }

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error listing blogs:", error);
    return res.status(500).json({ message: "Error listing blogs", error });
  }
};

// New: Search Blogs
export const searchBlogs = async (req, res) => {
  try {
    const { metadata, tags, name } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name.trim(), $options: "i" };
    }

    if (metadata) {
      filter.metadata = { $regex: metadata.trim(), $options: "i" };
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    const blogs = await Blog.find(filter);

    if (!blogs.length) {
      return res.status(200).json({ message: "No blogs found", blogs: [] });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error searching blogs:", error);
    res.status(500).json({ message: "Error searching blogs", error });
  }
};
