import { Menu } from 'lucide-react';

export default function ProfileHeader({ user, setSidebarOpen }) {
  return (
    <>
      {/* Menú hamburguesa para móviles */}
      <div className="md:hidden top-0 z-10 sticky flex items-center bg-white px-4 py-3 border-gray-200 border-b">
        <button
          onClick={() => setSidebarOpen(true)}
          className="hover:bg-gray-100 p-2 rounded-md focus:outline-none text-gray-500 hover:text-gray-900"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="ml-2 font-medium text-gray-900 text-xl">Mi Perfil</h2>
      </div>

      <div className="px-4 sm:px-6 py-4">
        <h2 className="mb-2 font-bold text-gray-900 text-3xl break-words">Perfil de {user?.name}</h2>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>
    </>
  );
} 