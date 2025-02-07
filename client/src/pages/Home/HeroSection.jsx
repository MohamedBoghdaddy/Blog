import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Innovation.", "Style.", "Technology.", "Trends."];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prevWord) => (prevWord + 1) % words.length);
    }, 2500); // Change every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#1A1A2E] via-[#121212] to-[#0F0F0F] text-white">
      {/* Overlay effect */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 px-6">
        <h1 className="text-6xl font-bold tracking-wide">
          Explore <span className="text-[#E94560]">Elite Insights</span>
        </h1>

        <p className="text-2xl mt-4 text-gray-300">
          Your premium gateway to{" "}
          <span className="text-[#E94560] transition-opacity duration-500">
            {words[currentWord]}
          </span>
        </p>

        {/* Call to Action */}
        <div className="mt-8 space-x-4">
          <button className="px-8 py-3 bg-[#E94560] text-white text-lg font-semibold rounded-full hover:bg-[#D63050] transition-all duration-300 transform hover:scale-105 shadow-md">
            Explore Now
          </button>
          <button className="px-8 py-3 bg-transparent border border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
