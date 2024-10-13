import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SubscribeSection = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/subscribe", { email });
      setMessage("Subscription successful!");
    } catch (error) {
      setMessage("Error subscribing. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto text-center">
        {/* Call to Action Section */}
        <h2 className="text-3xl font-bold mb-4">Secure Your Documents Today</h2>
        <p className="text-lg mb-6">
          Register and start managing your important documents with ease and
          security.
        </p>
        <button
          onClick={handleRegisterClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          Get Started Now
        </button>
      </div>

      {/* Subscribe Section */}
      <div className="mt-12 container mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Subscribe to Our Newsletter
        </h3>
        <form onSubmit={handleSubscribe} className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg mb-4 w-full max-w-md"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Subscribe
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default SubscribeSection;
