import { useState } from 'react';
import Modal from './common/Modal';
import useFormValidation from '../hooks/common/useFormValidation';

export default function UserModal({ isOpen, onClose, onSave, user }) {
  const [emailExistsError, setEmailExistsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (formData) => {
    // Limpiar el error de email duplicado antes de enviar
    setEmailExistsError(null);
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...formData,
        id: user?.id || Date.now()
      });
    } catch (error) {
      // Capturar el error específico de email duplicado
      if (error.message && error.message.includes('Ya existe un usuario con este correo')) {
        setEmailExistsError('Ya existe un usuario con este correo electrónico');
      }
      // Los demás errores los manejará el componente padre
      throw error;
    } finally {
      setIsSubmitting(false);
    }
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

  // Limpiar el error de email duplicado cuando se cierra el modal o cambia el valor del email
  const handleEmailChange = (e) => {
    if (emailExistsError) {
      setEmailExistsError(null);
    }
    handleChange(e);
  };

  return (
    <Modal
      title={user ? "Editar Usuario" : "Crear Nuevo Usuario"}
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) {
          setEmailExistsError(null);
          onClose();
        }
      }}
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
              disabled={isSubmitting}
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
              onChange={handleEmailChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`px-3 py-2 border ${errors.email || emailExistsError ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
            {emailExistsError && !errors.email && (
              <p className="mt-1 text-red-500 text-sm">{emailExistsError}</p>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            onClick={() => {
              setEmailExistsError(null);
              onClose();
            }}
            disabled={isSubmitting}
            className="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white text-sm"
          >
            {isSubmitting ? 'Guardando...' : user ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 