import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png"; // Adjust path as per your project
import Login from "../Login&Register/Login.jsx"; // Adjust path to Login component
import { useAuthContext } from "../../../context/AuthContext";
import { useLogout } from "../../../hooks/useLogout.js";
import axios from "axios";
import { DashboardContext } from "../../../context/DashboardContext"; // Import the DashboardContext

const NavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state to capture search term
  const { searchPublicWorkspaces } = useContext(DashboardContext); // Fetch search function from context
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const { user, isAuthenticated } = state;
  const { logout } = useLogout();

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchTerm) {
      navigate(`/workspaces?term=${searchTerm}`);
    }
  };

  return (
    <nav className="flex items-center justify-between fixed top-0 w-full h-16 bg-gray-800 text-white z-50 px-6">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Company Logo" className="w-20 h-auto" />
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-400 hover:text-white text-lg">
          HOME
        </Link>
        <Link to="/contact" className="text-gray-400 hover:text-white text-lg">
          Contact Us
        </Link>
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-white text-lg"
          >
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Conditional rendering based on authentication */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLoginModalOpen}
            className="text-white hover:text-gray-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span>Login</span>
          </button>
        )}

        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            className="px-3 py-2 rounded-lg text-black"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Modal for Login */}
      <div className={`modal ${showLoginModal ? "block" : "hidden"}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <Login onLoginSuccess={handleLoginModalClose} />
        </div>
        <button
          className="modal-close"
          onClick={handleLoginModalClose}
        ></button>
      </div>
    </nav>
  );
};

export default NavBar;
