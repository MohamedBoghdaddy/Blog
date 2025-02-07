import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchAndSort = ({ setSearchTerm, setSortOption }) => {
  const [searchInput, setSearchInput] = useState("");
  const [sortSelection, setSortSelection] = useState("newest");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchTerm(searchInput);
      navigate(`/blogs?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortSelection(newSort);
    setSortOption(newSort);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow">
      <form onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="search" className="sr-only">
          Search Blogs
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search Blogs..."
          className="p-2 border rounded w-full md:w-72"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="mt-2 md:mt-0">
        <label htmlFor="sort" className="mr-2 text-gray-700 dark:text-gray-300">
          Sort by:
        </label>
        <select
          id="sort"
          className="p-2 border rounded"
          value={sortSelection}
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
};

SearchAndSort.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default SearchAndSort;
