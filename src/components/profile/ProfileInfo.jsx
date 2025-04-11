import { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import { usersApi } from '../../api/mockApi';
import { useToast } from '../../context/ToastContext';

export default function ProfileInfo({ user, role, updateUser }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });
  const { showToast } = useToast();

  // Inicializar datos del perfil
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validación en tiempo real
    validateField(name, value);
  };

  // Validar un campo específico
  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          message = 'El nombre es obligatorio';
        }
        break;
      case 'email':
        if (!value.trim()) {
          message = 'El correo electrónico es obligatorio';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          message = 'El correo electrónico no es válido';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: message
    }));
  };

  // Validar todos los campos
  const validateAllFields = () => {
    // Validar cada campo
    validateField('name', profileData.name);
    validateField('email', profileData.email);
    
    // Verificar si hay errores
    const hasErrors = !!(errors.name || errors.email || 
                        !profileData.name.trim() || 
                        !profileData.email.trim() || 
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(profileData.email));
    
    return !hasErrors;
  };

  // Guardar cambios en el perfil
  const handleSaveProfile = async () => {
    if (!user || !user.id) return;
    
    // Validar todos los campos antes de enviar
    if (!validateAllFields()) {
      showToast('Por favor, corrija los errores antes de guardar', 'error'); 
      return;
    }
    
    setIsSavingProfile(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Actualizar perfil en la API
      const updatedUser = await usersApi.update(user.id, profileData, token);
      
      // Actualizar el contexto de autenticación
      updateUser(updatedUser);
      
      // Desactivar modo edición
      setIsEditingProfile(false);
      showToast('Perfil actualizado con éxito', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

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
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              <Save className="mr-2 w-5 h-5" />
              Guardar
            </button>
            <button 
              className="flex items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={() => {
                setIsEditingProfile(false);
                setProfileData({
                  name: user.name || '',
                  email: user.email || ''
                });
                setErrors({
                  name: '',
                  email: ''
                });
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
                value={profileData.name} 
                onChange={handleProfileChange}
                onBlur={(e) => validateField('name', e.target.value)}
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
                value={profileData.email} 
                onChange={handleProfileChange}
                onBlur={(e) => validateField('email', e.target.value)}
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