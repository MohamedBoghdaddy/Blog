import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Footer description */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h4 className="text-xl font-bold mb-4">
            DMS - Document Management System
          </h4>
          <p className="text-sm max-w-md leading-6">
            Manage and organize your critical documents with ease. Our DMS
            offers secure, fast, and reliable solutions to store, access, and
            share your documents. From secure storage to seamless collaboration,
            we provide everything you need to stay organized and efficient.
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-6 justify-center md:justify-start">
            <a
              href="https://www.facebook.com/yourcompany"
              className="text-white hover:text-blue-500"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/yourcompany"
              className="text-white hover:text-pink-500"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/yourcompany"
              className="text-white hover:text-blue-700"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="text-center md:text-left">
          <h4 className="text-xl font-bold mb-4">Subscribe to Our Updates</h4>
          <form className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md text-black w-full md:w-auto"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors"
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
