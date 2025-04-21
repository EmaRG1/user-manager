import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studiesService, addressesService, usersService } from '../../services';

/**
 * Hook personalizado para cargar y gestionar datos de perfil de usuario
 * 
 * @param {number|string} userId - ID del usuario a cargar
 * @param {string} userRole - Rol del usuario actual 
 * @param {boolean} requireAdmin - Si es true, redirige si el usuario no es admin
 * @returns {Object} Datos y funciones del perfil
 */
export default function useProfileData(userId, userRole, requireAdmin = false) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userAddressesList, setUserAddressesList] = useState([]);
  const [userStudiesList, setUserStudiesList] = useState([]);
  const [error, setError] = useState(null);

  // Verificar si el usuario tiene los permisos necesarios
  useEffect(() => {
    if (requireAdmin && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [userRole, navigate, requireAdmin]);

  // Cargar datos del usuario desde los servicios
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Cargar datos del usuario mediante el servicio
        const userData = await usersService.getById(Number(userId));
        setUser(userData);
        
        // Si los estudios y direcciones ya vienen en userData, los usamos directamente
        if (userData.studies && userData.addresses) {
          setUserStudiesList(userData.studies);
          setUserAddressesList(userData.addresses);
          return;
        }
        
        // Si no están en userData, los cargamos de los servicios
        const addresses = await addressesService.getByUserId(Number(userId));
        const studies = await studiesService.getByUserId(Number(userId));
        
        setUserAddressesList(addresses);
        setUserStudiesList(studies);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  // Función para actualizar el usuario
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  return {
    isLoading,
    user,
    userAddressesList,
    userStudiesList,
    error,
    updateUserData,
    setUserAddressesList,
    setUserStudiesList
  };
} 