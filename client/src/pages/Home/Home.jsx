import HeroSection from "./HeroSection";
import StorytellingSection from "./BlogList";
import CallToActionSection from "./SubscribeSection";
import "../styles/Home.css";
import WhoWeAre from "./WhoWeAre";

const Home = () => {
  return (
    <div className="full-page">
      <section id="hero-section">
        <HeroSection />
      </section>
      <StorytellingSection />
      <section id="WhoWeAre">
        <WhoWeAre />
      </section>
      {/* <section id="contact">
        <Contact />
      </section> */}
      <CallToActionSection />
    </div>
  );
};

export default Home;
