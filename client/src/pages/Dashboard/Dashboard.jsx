import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBlogs = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blogs/user/${currentUser._id}`);
      setUserBlogs(response.data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchUserBlogs();
    }
  }, [currentUser, fetchUserBlogs]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setUserBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome, {currentUser?.username}</p>

      {loading ? (
        <p>Loading your blogs...</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Your Blogs</h2>
          <Link
            to="/create-blog"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block"
          >
            + New Blog
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {userBlogs.length > 0 ? (
              userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="border p-4 rounded shadow relative"
                >
                  <h3 className="text-lg font-semibold">{blog.title}</h3>
                  <p className="text-gray-600">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="text-green-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No blogs found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
