import { useEffect, useState } from "react";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]); // Ensure it's an array

  useEffect(() => {
    // Fetch the latest blogs from your backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs"); // Adjust API path
        setBlogs(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching blogs", error);
        setBlogs([]); // Set blogs to an empty array on error
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blog-list my-10">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-preview bg-white shadow-md rounded-lg p-4 mb-6"
          >
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-700">{blog.excerpt}</p>
            <a
              href={`/blog/${blog._id}`}
              className="text-blue-500 hover:underline"
            >
              Read more
            </a>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
