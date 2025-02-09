import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "./pages/Home/Navbar";
import Footer from "./pages/Home/Footer";
import NotificationIcon from "./components/NotificationIcon";
import { AuthProvider } from "./context/AuthContext";
import DashboardProvider from "./context/DashboardContext";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signInSuccess } from "./redux/user/userSlice";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";

// Lazy loading for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const Login = lazy(() => import("./pages/Login&Register/Login"));
const Signup = lazy(() => import("./pages/Login&Register/Signup"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Forum = lazy(() => import("./pages/Forum/forum"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

// WebSocket URL
const SOCKET_URL = "http://localhost:5000";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-login if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(signInSuccess(JSON.parse(storedUser)));
    }

    // WebSocket connection
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("receiveNotification", (notification) => {
      toast.info(`📢 ${notification.message}`, { autoClose: 5000 });
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [dispatch]);

  return (
    <AuthProvider>
      <DashboardProvider>
        <Router>
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <NotificationIcon />
            <Suspense
              fallback={<div className="text-center my-10">Loading...</div>}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog/:id" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </DashboardProvider>
    </AuthProvider>
  );
};

export default App;
