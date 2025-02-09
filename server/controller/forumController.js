import ForumThread from "../models/ForumModel.js";

// Create a new forum thread
export const createThread = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const newThread = new ForumThread({
      title,
      content,
      tags,
      author: req.user.id,
    });
    await newThread.save();
    res.status(201).json(newThread);
  } catch (error) {
    res.status(500).json({ message: "Error creating thread", error });
  }
};

// Fetch all forum threads
export const getAllThreads = async (req, res) => {
  try {
    const threads = await ForumThread.find({ deleted: false }).populate(
      "author",
      "username"
    );
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching threads", error });
  }
};

// Fetch a single thread
export const getThreadById = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!thread || thread.deleted)
      return res.status(404).json({ message: "Thread not found" });

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Error fetching thread", error });
  }
};

// Delete a thread (soft delete)
export const deleteThread = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    if (!thread || thread.deleted)
      return res.status(404).json({ message: "Thread not found" });

    if (thread.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this thread" });
    }

    thread.deleted = true;
    await thread.save();

    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting thread", error });
  }
};

// Add a comment to a thread
export const addCommentToThread = async (req, res) => {
  const { text } = req.body;
  try {
    const thread = await ForumThread.findById(req.params.id);
    if (!thread || thread.deleted)
      return res.status(404).json({ message: "Thread not found" });

    const comment = { user: req.user.id, text };
    thread.comments.unshift(comment);
    await thread.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Search forum threads by keyword
export const searchThreads = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          title: { $regex: req.query.q, $options: "i" },
        }
      : {};

    const threads = await ForumThread.find({ ...keyword, deleted: false });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Error searching threads", error });
  }
};
