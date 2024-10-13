import  { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FeaturedBlogs.css"; // Optional: Style for the featured section

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  useEffect(() => {
    // Fetch featured blogs from your backend
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs/featured");
        setFeaturedBlogs(response.data);
      } catch (error) {
        console.error("Error fetching featured blogs", error);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  return (
    <div className="featured-blogs">
      <h2>Featured Blogs</h2>
      <div className="featured-grid">
        {featuredBlogs.map((blog) => (
          <div key={blog._id} className="featured-blog">
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <a href={`/blog/${blog._id}`}>Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBlogs;
