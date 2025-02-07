import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Forum = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get("/api/forum");
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const handleCreateThread = async () => {
    if (!newThread.trim()) return;
    try {
      const response = await axios.post("/api/forum", {
        text: newThread,
        user: currentUser.username,
      });
      setThreads([response.data, ...threads]);
      setNewThread("");
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forum Discussions</h1>
      {currentUser && (
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Start a new discussion..."
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
          />
          <button
            onClick={handleCreateThread}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Post Thread
          </button>
        </div>
      )}
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread._id} className="border p-4 rounded shadow">
            <p className="font-semibold">{thread.user}</p>
            <p>{thread.text}</p>
            <Link
              to={`/forum/${thread._id}`}
              className="text-blue-500 hover:underline"
            >
              View Discussion
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
