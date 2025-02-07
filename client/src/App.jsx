import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./pages/Home/Navbar";
import Footer from "./pages/Home/Footer";
import NotificationIcon from "./components/NotificationIcon";
import { AuthProvider } from "./context/AuthContext";
import DashboardProvider from "./context/DashboardContext";

// Lazy loading for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const Login = lazy(() => import("./pages/Login&Register/Login"));
const Signup = lazy(() => import("./pages/Login&Register/Signup"));
const Profile = lazy(() => import("./pages/profile/Profile")); // Fixed typo
const Forum = lazy(() => import("./pages/Forum/forum"));

const App = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Router>
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
            <Navbar />
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
