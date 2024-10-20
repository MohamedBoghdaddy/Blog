import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  // Version tracking for content
  versions: [
    {
      versionNumber: Number,
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      metadata: String, // Add metadata versioning
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  tags: [String],
  // Access control for blog collaboration
  accessControl: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      permissions: { type: String, enum: ["read", "write", "admin"] },
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to handle versioning
BlogSchema.pre("save", function (next) {
  if (
    this.isModified("url") ||
    this.isModified("name") ||
    this.isModified("metadata")
  ) {
    // Push version history for the blog content
    this.versions.push({
      versionNumber: this.version,
      content: this.url, // Track the URL of the document
      timestamp: new Date(),
      modifiedBy: this.owner, // Track who modified the blog
      metadata: this.metadata || "", // Track metadata if it was changed
    });
    this.version += 1; // Auto-increment version number
  }
  next();
});

// Ensure we don't redefine the model if it already exists
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
