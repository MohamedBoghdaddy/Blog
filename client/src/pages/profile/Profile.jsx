import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", profileData.username);
      formData.append("email", profileData.email);
      if (newProfilePicture) {
        formData.append("profilePicture", newProfilePicture);
      }

      const response = await axios.put(
        `/api/users/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Profile updated successfully!");
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      {message && <p className="text-green-500">{message}</p>}
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={profileData.username}
            onChange={(e) =>
              setProfileData({ ...profileData, username: e.target.value })
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Profile Picture</span>
          <input
            type="file"
            className="w-full p-2"
            onChange={(e) => setNewProfilePicture(e.target.files[0])}
          />
          {profileData.profilePicture && (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full mt-2"
            />
          )}
        </label>
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
