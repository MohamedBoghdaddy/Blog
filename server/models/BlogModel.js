import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    content: { type: String, required: true, trim: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    likes: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    versions: [
      {
        versionNumber: { type: Number, default: 1 },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
        modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexing for optimized search performance
BlogSchema.index({ title: "text", tags: "text" });

// Middleware to handle versioning before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.versions.push({
      versionNumber: this.versions.length + 1,
      content: this.content,
      modifiedBy: this.author,
    });
  }
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
