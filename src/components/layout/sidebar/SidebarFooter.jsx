import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function SidebarFooter() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-shrink-0 bg-white p-4 border-gray-200 border-t">
      <div className="flex items-center mb-4">
        <div className="flex justify-center items-center bg-gray-900 rounded-full w-8 h-8 text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-2 overflow-hidden">
          <p className="font-medium text-gray-900 text-sm truncate">{user?.name}</p>
          <p className="text-gray-500 text-xs">{role === 'admin' ? 'Administrador' : 'Usuario'}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center bg-white hover:bg-gray-50 py-2 rounded-md w-full text-gray-700"
      >
        <LogOut className="mr-2 w-4 h-4" />
        <span className="text-sm">Cerrar Sesión</span>
      </button>
    </div>
  );
} 