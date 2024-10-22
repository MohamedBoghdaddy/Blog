import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NavBar from "./pages/Home/Navbar";
import Footer from "./pages/Home/Footer";
// import NotFound from "./pages/NotFound/NotFound"; // Create a NotFound page component for undefined routes
import Blog from "./pages/Blog/Blog";
export default function App() {
  return (
    <BrowserRouter>
      {/* NavBar is common across all routes */}
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />

        {/* Add more routes here as needed */}
        {/* Example: <Route path="/about" element={<About />} /> */}

        {/* Catch-all route for undefined paths */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      {/* Footer is common across all routes */}
      <Footer />
    </BrowserRouter>
  );
}
