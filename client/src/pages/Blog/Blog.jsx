import { useState, useEffect } from "react";
import axios from "axios"; // This is for fetching blog data

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.example.com/blogs"); // Change to your API
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="blog-post">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}

export default Blog;
