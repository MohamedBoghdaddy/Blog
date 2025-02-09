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

// Ensure uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const upload = multer({ storage });

// 📌 Create Blog
export const createBlog = async (req, res) => {
  const { title, content, tags, workspaceId } = req.body;

  if (!title || !content)
    return res.status(400).json({ message: "Title and content are required" });

  try {
    const newBlog = new Blog({
      title,
      content,
      tags,
      author: req.user.id,
      workspace: workspaceId,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// 📌 Upload Blog File
export const uploadBlog = async (req, res) => {
  const { workspaceId } = req.body;

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  if (!workspaceId)
    return res.status(400).json({ message: "Workspace ID is required" });

  try {
    const file = req.file;
    const newBlog = new Blog({
      title: file.originalname,
      content: "",
      type: file.mimetype,
      url: file.path,
      author: req.user.id,
      workspace: workspaceId,
    });

    await newBlog.save();
    res
      .status(200)
      .json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error uploading blog", error });
  }
};

// 📌 Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ deleted: false }).populate(
      "author",
      "username"
    );
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// 📌 Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!blog || blog.deleted)
      return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

// 📌 Update Blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.deleted)
      return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// 📌 Soft Delete Blog (Move to Recycle Bin)
export const softDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.deleted)
      return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    blog.deleted = true;
    await blog.save();
    res.status(200).json({ message: "Blog moved to recycle bin", blog });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

// 📌 Restore Blog
export const restoreBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.deleted)
      return res.status(404).json({ message: "Blog not found" });

    blog.deleted = false;
    await blog.save();
    res.status(200).json({ message: "Blog restored successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error restoring blog", error });
  }
};

// 📌 Download Blog File
export const downloadBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.deleted)
      return res.status(404).json({ message: "Blog not found or deleted" });
    if (!fs.existsSync(blog.url))
      return res.status(404).json({ message: "File not found" });

    res.download(blog.url, blog.title);
  } catch (error) {
    res.status(500).json({ message: "Error downloading blog", error });
  }
};

// 📌 List Blogs in a Workspace
export const listBlogsInWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { sortBy = "createdAt", order = "asc", filter = {} } = req.query;

    const blogs = await Blog.find({ workspace: workspaceId, ...filter }).sort({
      [sortBy]: order === "asc" ? 1 : -1,
    });

    if (!blogs.length)
      return res
        .status(404)
        .json({ message: "No blogs found for this workspace." });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error listing blogs", error });
  }
};

// 📌 Search Blogs
export const searchBlogs = async (req, res) => {
  try {
    const { title, tags, author } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title.trim(), $options: "i" };
    if (author) filter.author = { $regex: author.trim(), $options: "i" };
    if (tags) filter.tags = { $in: tags.split(",").map((tag) => tag.trim()) };

    const blogs = await Blog.find(filter);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error searching blogs", error });
  }
};
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.deleted)
      return res.status(404).json({ message: "Blog not found" });

    const comment = { user: req.user.id, text };
    blog.comments.unshift(comment);
    await blog.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};
/**
 * 🗑️ Soft Delete a Blog (Move to Recycle Bin)
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    blog.deleted = true;
    await blog.save();

    res.status(200).json({ message: "Blog moved to recycle bin", blog });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

/**
 * ❤️ Like or Unlike a Blog
 */
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user.id;

    // Check if user already liked the blog
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ message: alreadyLiked ? "Blog unliked" : "Blog liked", likes: blog.likes.length });
  } catch (error) {
    console.error("❌ Error liking/unliking blog:", error);
    res.status(500).json({ message: "Error liking/unliking blog", error });
  }
};