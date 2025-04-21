import { useState, useEffect } from 'react';
import { studiesService, addressesService } from '../services';

/**
 * Hook personalizado para cargar y gestionar datos del perfil del usuario actual
 * 
 * @param {Object} currentUser - Objeto de usuario actual desde el contexto de autenticación
 * @param {Function} updateAuthUser - Función para actualizar el usuario en el contexto de autenticación
 * @returns {Object} Datos y funciones del perfil
 */
export default function useCurrentUserProfile(currentUser, updateAuthUser) {
  const [isLoading, setIsLoading] = useState(true);
  const [userAddressesList, setUserAddressesList] = useState([]);
  const [userStudiesList, setUserStudiesList] = useState([]);
  const [error, setError] = useState(null);

  // Cargar datos del usuario desde los servicios
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser || !currentUser.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Usar los servicios para obtener direcciones y estudios
        const addresses = await addressesService.getByUserId(currentUser.id);
        const studies = await studiesService.getByUserId(currentUser.id);
        
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
  }, [currentUser]);

  return {
    isLoading,
    user: currentUser,
    userAddressesList,
    userStudiesList,
    error,
    updateUser: updateAuthUser,
    setUserAddressesList,
    setUserStudiesList
  };
} 