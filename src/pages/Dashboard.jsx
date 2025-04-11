import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';
import Sidebar from '../components/sidebar/Sidebar';
import useSidebarState from '../hooks/useSidebarState';

export default function Dashboard() {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useSidebarState();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content - con margen izquierdo para el sidebar en desktop */}
      <main className="md:ml-64">
        {/* Menú hamburguesa para móviles */}
        <div className="md:hidden top-0 z-10 sticky flex items-center bg-white px-4 py-3 border-gray-200 border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-gray-100 p-2 rounded-md focus:outline-none text-gray-500 hover:text-gray-900"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="ml-2 font-medium text-gray-900 text-xl">Gestión de Usuarios</h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="max-w-7xl">
            {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
} 