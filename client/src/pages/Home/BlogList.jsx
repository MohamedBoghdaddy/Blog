import  { useEffect, useState } from "react";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch the latest blogs from your backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs"); // Adjust API path
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blog-list">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-preview">
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <a href={`/blog/${blog._id}`}>Read more</a>
          </div>
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
