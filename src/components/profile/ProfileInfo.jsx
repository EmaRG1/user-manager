import { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import { usersService } from '../../services';
import { useToast } from '../../context/ToastContext';
import useFormValidation from '../../hooks/common/useFormValidation';

export default function ProfileInfo({ user, role, updateUser }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const { showToast } = useToast();

  const initialValues = {
    name: user?.name || '',
    email: user?.email || ''
  };

  const validationRules = {
    name: {
      required: 'El nombre es obligatorio'
    },
    email: {
      required: 'El correo electrónico es obligatorio',
      pattern: {
        regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'El correo electrónico no es válido'
      }
    }
  };

  // Guardar cambios en el perfil
  const handleSaveProfile = async (formData) => {
    if (!user || !user.id) return;
    
    setIsSavingProfile(true);
    try {
      // Actualizar perfil utilizando el servicio
      const updatedUser = await usersService.update(user.id, formData);
      
      // Actualizar el contexto de autenticación
      updateUser(updatedUser);
      
      // Desactivar modo edición
      setIsEditingProfile(false);
      showToast('Perfil actualizado con éxito', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      // Mostrar mensaje específico si el email ya existe
      if (error.message && error.message.includes('Ya existe un usuario con este correo')) {
        showToast('Ya existe un usuario con este correo electrónico', 'error');
      } else {
        showToast(`Error: ${error.message || 'Error desconocido'}`, 'error');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const { 
    formData, 
    errors, 
    handleChange, 
    handleBlur,
    handleSubmit,
    setFormData,
    setErrors
  } = useFormValidation(
    initialValues,
    validationRules,
    handleSaveProfile,
    { userId: user?.id }
  );

  // Actualizar formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user, setFormData]);

  return (
    <div className="bg-white shadow p-6 rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Información Personal</h2>
          <p className="text-gray-500 text-sm">Información básica de perfil</p>
        </div>
        {isEditingProfile ? (
          <div className="flex space-x-2">
            <button 
              className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
              onClick={handleSubmit}
              disabled={isSavingProfile}
            >
              <Save className="mr-2 w-5 h-5" />
              Guardar
            </button>
            <button 
              className="flex items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={() => {
                setIsEditingProfile(false);
                setFormData({
                  name: user.name || '',
                  email: user.email || ''
                });
                setErrors({});
              }}
              disabled={isSavingProfile}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button 
            className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
            onClick={() => setIsEditingProfile(true)}
          >
            <Edit className="mr-2 w-5 h-5" />
            Editar
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Nombre</label>
          {isEditingProfile ? (
            <div>
          <input 
            type="text" 
                name="name"
                className={`p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
                value={formData.name} 
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSavingProfile}
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
          ) : (
            <p className="bg-gray-50 p-2 border border-gray-100 rounded-md w-full">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Correo Electrónico</label>
          {isEditingProfile ? (
            <div>
          <input 
            type="email" 
                name="email"
                className={`p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
                value={formData.email} 
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSavingProfile}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
          ) : (
            <p className="bg-gray-50 p-2 border border-gray-100 rounded-md w-full">{user.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Rol</label>
          <p className="bg-gray-50 p-2 border border-gray-100 rounded-md w-full">
            {role === 'admin' ? 'Administrador' : 'Usuario'}
          </p>
        </div>
      </div>
    </div>
  );
} 