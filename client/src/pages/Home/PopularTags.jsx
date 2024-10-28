import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="popular-tags my-10">
      <h3 className="text-2xl font-semibold mb-4">Popular Tags</h3>
      <div className="tags-list flex flex-wrap justify-center">
        {tags.map((tag) => (
          <a
            key={tag._id}
            href={`/blogs/tag/${tag.name}`}
            className="tag bg-blue-500 text-white rounded-full px-4 py-2 mx-2 mb-2 transition duration-300 hover:bg-blue-600"
          >
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
