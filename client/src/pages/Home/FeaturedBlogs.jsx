import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="featured-blogs my-10">
      <h2 className="text-3xl font-bold mb-4">Featured Blogs</h2>
      <div className="featured-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="featured-blog bg-white shadow-lg rounded-lg p-4"
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
        ))}
      </div>
    </div>
  );
};

export default FeaturedBlogs;
