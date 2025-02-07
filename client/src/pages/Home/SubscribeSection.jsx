import { useState } from "react";
import axios from "axios";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/subscribe", { email });
      setMessage("✅ Subscription successful!");
      setEmail(""); // Clear input field after success
    } catch {
      setMessage("⚠️ Error subscribing. Please try again.");
    }
  };

  return (
    <section className="bg-[#121212] py-16 text-white">
      <div className="container mx-auto text-center px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-4 text-[#E94560]">
          Stay Ahead of the Curve
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
          Subscribe to our newsletter and get the latest trends delivered
          straight to your inbox.
        </p>

        {/* Subscription Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 w-full md:w-96 bg-white text-black rounded-full focus:outline-none shadow-md"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-[#E94560] text-white font-semibold text-lg rounded-full hover:bg-[#D63050] transition-all duration-300 transform hover:scale-105 shadow-md ml-2"
          >
            Subscribe
          </button>
        </form>

        {/* Feedback Message */}
        {message && <p className="mt-4 text-lg">{message}</p>}
      </div>
    </section>
  );
};

export default SubscribeSection;
