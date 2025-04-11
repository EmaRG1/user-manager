import { Home, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function NavigationLinks() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex-1 px-4 py-4 overflow-y-auto">
      <Link
        to="/dashboard"
        className={`group flex items-center px-2 py-2 rounded-md font-medium text-base leading-6 ${
          isActive("/dashboard") 
            ? "bg-gray-100 text-gray-900" 
            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
        }`}
      >
        <Home className="mr-3 w-6 h-6 text-gray-500" />
        Panel Principal
      </Link>
      <Link
        to="/profile"
        className={`group flex items-center mt-1 px-2 py-2 rounded-md font-medium text-base leading-6 ${
          isActive("/profile") 
            ? "bg-gray-100 text-gray-900" 
            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
        }`}
      >
        <User className="mr-3 w-6 h-6 text-gray-500" />
        Mi Perfil
      </Link>
    </nav>
  );
} 