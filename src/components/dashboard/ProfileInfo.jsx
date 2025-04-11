import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileInfo({ user }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Información Personal</h2>
          <p className="text-gray-500 text-sm">Tus datos personales</p>
        </div>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/profile')}
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <p className="font-medium text-gray-500 text-sm">Nombre</p>
          <p className="mt-1 text-gray-900 text-sm break-words">{user.name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500 text-sm">Correo Electrónico</p>
          <p className="mt-1 text-gray-900 text-sm break-words">{user.email}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500 text-sm">Rol</p>
          <p className="mt-1 text-gray-900 text-sm">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
        </div>
      </div>
    </div>
  );
} 