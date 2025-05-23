import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaEnvelope } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Illustration */}
      <div className="max-w-md mb-8">
        <img 
          src="https://cdn.dribbble.com/users/1175431/screenshots/6188233/media/ad42057889c385dd8f84b8330f69269b.gif" 
          alt="404 Error" 
          className="w-full h-auto"
        />
      </div>

      {/* Error Content */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Oops! Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Try going back to the homepage or use the search below.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link 
            to="/" 
            className="flex items-center justify-center px-6 py-3 bg-[#22874b] hover:bg-[#4190a1] text-white rounded-lg transition-colors shadow-md"
          >
            <FaHome className="mr-2" />
            Return Home
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center justify-center px-6 py-3 border border-[#22874b] text-[#22874b] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FaEnvelope className="mr-2" />
            Contact Support
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search our site..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#22874b] text-white p-2 rounded-full hover:bg-[#22874b] transition-colors">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <Link to="/privacy" className="hover:text-[#4d8b99] hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/terms" className="hover:text-[#4d8c9b] hover:underline">Terms of Service</Link>
        <span>•</span>
        <Link to="/sitemap" className="hover:text-[#49828f] hover:underline">Sitemap</Link>
      </div>
    </div>
  );
};

export default ErrorPage;