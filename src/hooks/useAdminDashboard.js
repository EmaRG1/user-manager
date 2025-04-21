import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { usersService, studiesService, addressesService } from '../services';

/**
 * Hook personalizado para gestionar la lógica del dashboard de administrador
 * 
 * @param {Object} currentUser - Usuario actual desde el contexto de autenticación
 * @param {Function} logoutFunc - Función para cerrar sesión
 * @returns {Object} Estado y funciones para el dashboard de administrador
 */
export default function useAdminDashboard(currentUser, logoutFunc) {
  const [users, setUsers] = useState([]);
  const [totalStudies, setTotalStudies] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    isSubmitting: false
  });
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Cargar usuarios utilizando el servicio de usuarios
        const usersData = await usersService.getAll();
        setUsers(usersData);

        // Calcular totales de estudios y direcciones
        let studies = 0;
        let addresses = 0;

        for (const userData of usersData) {
          const userStudies = await studiesService.getByUserId(userData.id);
          const userAddresses = await addressesService.getByUserId(userData.id);
          
          studies += userStudies.length;
          addresses += userAddresses.length;
        }

        setTotalStudies(studies);
        setTotalAddresses(addresses);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showToast('Error al cargar datos', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  // Navegar al perfil de un usuario
  const redirectToUserProfile = (user) => {
    if (user.id === currentUser.id) {
      navigate('/profile');
    } else {
      navigate(`/user/${user.id}`);
    }
  };

  // Preparar modal para añadir un nuevo usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  // Guardar usuario (crear o actualizar)
  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Editar usuario existente
        const updatedUser = await usersService.update(selectedUser.id, userData);
        
        // Actualizar la lista de usuarios
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === selectedUser.id ? updatedUser : u)
        );
        showToast('Usuario actualizado con éxito', 'success');
        setIsUserModalOpen(false);
      } else {
        // Crear nuevo usuario
        const newUser = await usersService.create(userData);
        
        // Añadir a la lista de usuarios
        setUsers(prevUsers => [...prevUsers, newUser]);
        showToast('Usuario creado con éxito', 'success');
        setIsUserModalOpen(false);
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      // Si es error de email duplicado, propagar el error para que lo maneje el modal
      if (error.message && error.message.includes('Ya existe un usuario con este correo')) {
        throw error; // Propagar el error para que el UserModal lo capture
      } else {
        // Otros errores los manejamos aquí
        showToast(`Error al guardar usuario: ${error.message || 'Error desconocido'}`, 'error');
      }
    }
  };

  // Preparar confirmación para eliminar usuario
  const openDeleteConfirmation = (userId) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      isSubmitting: false
    });
  };

  // Eliminar usuario tras confirmación
  const handleConfirmDelete = async () => {
    // Establecer estado de carga
    setConfirmDialog(prev => ({
      ...prev,
      isSubmitting: true
    }));
    
    try {
      const isCurrentUser = confirmDialog.userId === currentUser.id;

      // Eliminar usuario a través del servicio
      await usersService.delete(confirmDialog.userId);
      
      // Actualizar la lista de usuarios y contadores
      setUsers(prevUsers => prevUsers.filter(u => u.id !== confirmDialog.userId));
      
      // Actualizar contador de estudios
      setTotalStudies(prevTotal => {
        const userStudies = users.find(u => u.id === confirmDialog.userId)?.studies || 0;
        return prevTotal - userStudies;
      });
      
      // Actualizar contador de direcciones
      setTotalAddresses(prevTotal => {
        const userAddresses = users.find(u => u.id === confirmDialog.userId)?.addresses || 0;
        return prevTotal - userAddresses;
      });
      
      setConfirmDialog({ isOpen: false, userId: null, isSubmitting: false });
      
      // Si el usuario elimina su propia cuenta
      if (isCurrentUser) {
        await logoutFunc();
        showToast('Su cuenta ha sido eliminada correctamente', 'info');
        navigate('/login');
      } else {
        showToast('Usuario eliminado con éxito', 'info');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('Error al eliminar usuario', 'error');
      setConfirmDialog({ isOpen: false, userId: null, isSubmitting: false });
    }
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, userId: null, isSubmitting: false });
  };

  return {
    users,
    totalStudies,
    totalAddresses,
    selectedUser,
    isUserModalOpen,
    setIsUserModalOpen,
    isLoading,
    confirmDialog,
    redirectToUserProfile,
    handleAddUser,
    handleSaveUser,
    openDeleteConfirmation,
    handleConfirmDelete,
    handleCancelDelete
  };
} 