import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Footer Branding */}
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-bold text-[#E94560] mb-4">Elite Blog</h4>
          <p className="text-sm max-w-md leading-6 text-gray-300">
            A premium blog experience where elegance meets insightful content.
            Join us in exploring the latest trends in technology, fashion, and
            innovation.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6 mt-6 md:mt-0">
          <a
            href="https://www.facebook.com"
            className="text-white hover:text-[#E94560] transition"
          >
            <FontAwesomeIcon icon={faFacebookF} size="lg" />
          </a>
          <a
            href="https://www.instagram.com"
            className="text-white hover:text-[#E94560] transition"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://www.linkedin.com"
            className="text-white hover:text-[#E94560] transition"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>

        {/* Newsletter */}
        <div className="mt-6 md:mt-0 text-center">
          <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
          <form className="flex flex-col md:flex-row items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md text-gray-900 w-full md:w-64 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#E94560] text-white px-6 py-3 rounded-md ml-2 hover:bg-[#D63050] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
