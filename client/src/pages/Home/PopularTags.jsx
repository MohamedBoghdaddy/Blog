import { useEffect, useState } from "react";

import axios from "axios";
import "../styles/PopularTags.css"; // Optional: Style for the tags section

const PopularTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch popular tags from your backend
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="popular-tags">
      <h3>Popular Tags</h3>
      <div className="tags-list">
        {tags.map((tag) => (
          <a key={tag._id} href={`/blogs/tag/${tag.name}`} className="tag">
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
