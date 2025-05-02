import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/AuthProvider";

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#6366F1]">
              Book Review App
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              to="/books"
              className={`${
                isActive('/books')
                  ? 'text-[#6366F1] border-[#6366F1]'
                  : 'text-gray-500 border-transparent hover:text-[#6366F1]'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Books
            </Link>
            <Link
              to="/reviews"
              className={`${
                isActive('/reviews')
                  ? 'text-[#6366F1] border-[#6366F1]'
                  : 'text-gray-500 border-transparent hover:text-[#6366F1]'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Reviews
            </Link>
            <Link
              to="/favorites"
              className={`${
                isActive('/favorites')
                  ? 'text-[#6366F1] border-[#6366F1]'
                  : 'text-gray-500 border-transparent hover:text-[#6366F1]'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Favorites
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
