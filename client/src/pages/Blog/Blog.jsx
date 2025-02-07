import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Blog = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchComments();
    } else {
      fetchBlogs();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blogs");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      await axios.post(`/api/blogs/${id}/like`);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, {
        text: newComment,
        user: currentUser.username,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!id) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="space-y-4 mt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600">
                  {post.content.substring(0, 150)}...
                </p>
                <a
                  href={`/blog/${post._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    );
  }

  if (!blog) return <p className="text-center mt-10">Loading blog...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-gray-600">By {blog.author}</p>
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="w-full my-4 rounded"
      />
      <p className="text-lg">{blog.content}</p>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          👍 Like ({likes})
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Comments</h2>
        {currentUser && (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Post Comment
            </button>
          </div>
        )}
        <div className="space-y-4 mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border p-4 rounded shadow">
              <p className="font-semibold">{comment.user}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
