const HeroSection = () => {
  return (
    <div className="hero-section relative w-full h-screen flex justify-center items-center text-black text-center overflow-hidden">
      <h1 className="text-5xl mt-20 font-bold">Welcome to Our Blog</h1>
      <p className="text-xl mb-8">
        Stay updated with the latest news and articles.
      </p>
      <button className="btn-dark bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
        Get Started
      </button>
    </div>
  );
};

export default HeroSection;
