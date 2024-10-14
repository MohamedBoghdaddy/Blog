import HeroSection from "./HeroSection";
import BlogList from "./BlogList";
import FeaturedBlog from "./FeaturedBlogs"
import PopularTags from "./PopularTags";
import SubscribeSection from "./SubscribeSection";

const Home = () => {
  return (
    <div className="full-page">
      <section id="hero-section">
        <HeroSection />
      </section>
        <BlogList/>
      <section id="WhoWeAre">
        <FeaturedBlog/>
      </section>
      <section id="contact">
        <PopularTags/>
      </section>
        <SubscribeSection/>
    </div>
  );
};

export default Home;