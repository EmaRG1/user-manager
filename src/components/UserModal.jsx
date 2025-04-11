import Modal from './Modal';
import useFormValidation from '../hooks/useFormValidation';

export default function UserModal({ isOpen, onClose, onSave, user }) {
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
  };

  const validationRules = {
    name: {
      required: 'El nombre es obligatorio'
    },
    email: {
      required: 'El correo es obligatorio',
      pattern: {
        regex: /\S+@\S+\.\S+/,
        message: 'El correo no es válido'
      }
    },
    password: {
      custom: (value) => {
        // Validar contraseña solo para usuarios nuevos
        if (!user && !value.trim()) {
          return 'La contraseña es obligatoria';
        } else if (!user && value.length < 6) {
          return 'La contraseña debe tener al menos 6 caracteres';
        }
        return null;
      }
    }
  };

  const handleFormSubmit = (formData) => {
    onSave({
      ...formData,
      id: user?.id || Date.now()
    });
  };

  const { 
    formData, 
    errors, 
    handleChange, 
    handleSubmit, 
    handleBlur 
  } = useFormValidation(
    initialValues,
    validationRules,
    handleFormSubmit,
    { userId: user?.id }
  );

  return (
    <Modal
      title={user ? "Editar Usuario" : "Crear Nuevo Usuario"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">

          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700 text-sm">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Nombre completo"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder={user ? "Dejar en blanco para no cambiar" : "Contraseña"}
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
            {!user && (
              <p className="mt-1 text-gray-500 text-xs">Mínimo 6 caracteres</p>
            )}
          </div>
        
          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-gray-700 text-sm">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-white text-sm"
          >
            {user ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 