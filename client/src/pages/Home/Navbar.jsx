import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.jpeg"; // Adjust path as per your project
import Login from "../Login&Register/Login.jsx"; // Adjust path to Login component
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useLogout } from "../../hooks/useLogout.js";
import { DashboardContext } from "../../context/DashboardContext.jsx"; // Import the DashboardContext

const NavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search term
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user, isAuthenticated } = state;
  const { searchBlogs } = useContext(DashboardContext); // Fetch search function from context

  // Open login modal
  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  // Close login modal
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  // Handle logout
  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchTerm) {
      searchBlogs(searchTerm); // Call the searchBlogs function from context
      navigate(`/Blogs?term=${searchTerm}`); // Optionally navigate to a page showing the results
    }
  };

  // Handle Nav Collapse for mobile toggle
  const handleNavCollapse = () => {
    // Logic to collapse the nav (could be a toggle for a mobile view)
    setShowLoginModal(false); // Just an example, adjust as per your logic
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
        {isAuthenticated && user ? (
          <div
            className="nav-link"
            role="button"
            tabIndex="0"
            onClick={handleLogout}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLogout();
              }
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </div>
        ) : (
          <div
            className="nav-link"
            role="button"
            tabIndex="0"
            onClick={() => {
              handleLoginModalOpen();
              handleNavCollapse();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLoginModalOpen();
                handleNavCollapse();
              }
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="d-flex" role="search">
          <input
            className="form-control me-2 px-3 py-2 rounded-lg text-black"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-outline-success ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
            type="submit"
          >
            Search
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
