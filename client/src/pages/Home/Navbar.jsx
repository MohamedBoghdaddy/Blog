import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/react.svg"; // Adjust path as per your project
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Login from "../Login&Register/Login.jsx"; // Adjust path to Login component
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useLogout } from "../../hooks/useLogout.js";
import axios from "axios";
import { DashboardContext } from "../../context/DashboardContext.jsx";

export const NavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState(null); // State to store dashboard data
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthContext();
  const { logout } = useLogout();
  const dashboardContext = useContext(DashboardContext); // Get dashboard data from context

  // Fetching data example with axios
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard"); // Example API call
        setDashboardData(response.data); // Store the data
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData(); // Fetch data when the component mounts
  }, []);

  // Function to open login modal
  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  // Function to close login modal
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/workspaces?term=${searchTerm}`);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-300">
            HOME
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300">
            Contact Us
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-white hover:text-gray-300">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Conditional rendering based on authentication */}
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginModalOpen}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Login
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
      </div>

      {/* Display dashboard data from context if available */}
      {dashboardContext && (
        <div className="text-white text-center">
          <p>{`Dashboard Role: ${dashboardContext.role}`}</p>
          <p>{`Welcome, ${dashboardContext.userName}`}</p>
        </div>
      )}

      {/* Display dashboard data fetched from axios */}
      {dashboardData && (
        <div className="text-white text-center mt-4">
          <p>{`Dashboard Info: ${dashboardData.info}`}</p>
        </div>
      )}

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
