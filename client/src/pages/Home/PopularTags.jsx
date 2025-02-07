import { useEffect, useState } from "react";
import axios from "axios";

const PopularTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        if (Array.isArray(response.data)) {
          setTags(response.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="container mx-auto my-12 px-6">
      <h3 className="text-3xl font-bold text-center text-[#E94560] mb-6">
        Trending Topics
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <a
              key={tag._id}
              href={`/blogs/tag/${tag.name}`}
              className="bg-[#E94560] text-white rounded-full px-5 py-2 text-lg font-semibold hover:bg-[#D63050] transition"
            >
              #{tag.name}
            </a>
          ))
        ) : (
          <p className="text-gray-400">No tags available.</p>
        )}
      </div>
    </div>
  );
};

export default PopularTags;
