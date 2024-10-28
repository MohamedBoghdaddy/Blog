import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NavBar from "./pages/Home/Navbar";
import Footer from "./pages/Home/Footer";
// Uncomment and create a NotFound page component for undefined routes
// import NotFound from "./pages/NotFound/NotFound";
import Blog from "./pages/Blog/Blog";
import Login from "./pages/Login&Register/Login.jsx"; // Ensure correct path to Login component
import Register from "./pages/Login&Register/signup.jsx"; // Ensure correct path to Register component

export default function App() {
  return (
    <BrowserRouter>
      {/* NavBar is common across all routes */}
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} /> {/* Add Login route */}
        <Route path="/signup" element={<Register />} />{" "}
        {/* Add Register route */}
        {/* Add more routes here as needed */}
        {/* Example: <Route path="/about" element={<About />} /> */}
        {/* Catch-all route for undefined paths */}
        {/* Uncomment the following line to use the NotFound page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      {/* Footer is common across all routes */}
      <Footer />
    </BrowserRouter>
  );
}
