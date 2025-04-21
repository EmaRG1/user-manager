import { Plus, Edit, Trash2 } from 'lucide-react';

export default function UsersTable({ users, redirectToUserProfile, handleAddUser, handleDeleteUser }) {
  return (
    <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Todos los Usuarios</h2>
          <p className="text-gray-500 text-sm">Lista de todos los usuarios en el sistema</p>
        </div>
        <button 
          onClick={handleAddUser} 
          className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
        >
          <Plus className="mr-2 w-5 h-5" />
          Añadir Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="divide-y divide-gray-200 min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Correo</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-4 font-medium text-gray-900 text-sm whitespace-nowrap">
                  <button 
                    className="text-left hover:underline" 
                    onClick={() => redirectToUserProfile(user)}
                  >
                    {user.name}
                  </button>
                </td>
                <td className="px-4 py-4 text-gray-500 text-sm whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-4 text-gray-500 text-sm whitespace-nowrap">
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </td>
                <td className="px-4 py-4 font-medium text-sm whitespace-nowrap">
                  <button 
                    className="mr-3 text-gray-600 hover:text-gray-900"
                    onClick={() => redirectToUserProfile(user)}
                    aria-label="Editar usuario"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteUser(user.id)}
                    aria-label="Eliminar usuario"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 