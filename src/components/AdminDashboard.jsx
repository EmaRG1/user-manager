import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersService, studiesService, addressesService, authService } from '../services';
import UserModal from './UserModal';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import DashboardHeader from './dashboard/DashboardHeader';
import AdminStats from './dashboard/AdminStats';
import UsersTable from './dashboard/UsersTable';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

export default function AdminDashboard() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalStudies, setTotalStudies] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null
  });

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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para abrir el modal con un usuario seleccionado para editar
  const redirectToUserProfile = (user) => {
    if (user.id === currentUser.id) {
      navigate(`/profile`);
    } else {
      navigate(`/user/${user.id}`);
    }
  };

  // Función para abrir el modal para crear un nuevo usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  // Manejar el guardado de los datos del usuario (crear o editar)
  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Editar usuario existente a través del servicio
        const updatedUser = await usersService.update(selectedUser.id, userData);
        
        // Actualizar la lista de usuarios
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === selectedUser.id ? updatedUser : u)
        );
        showToast('Usuario actualizado con éxito', 'success');
      } else {
        // Crear nuevo usuario a través del servicio
        const newUser = await usersService.create(userData);
        
        // Añadir a la lista de usuarios
        setUsers(prevUsers => [...prevUsers, newUser]);
        showToast('Usuario creado con éxito', 'success');
      }
    } catch (error) {
      showToast('Error al guardar usuario', 'error');
    } finally {
      setIsUserModalOpen(false);
    }
  };

  // Abrir diálogo de confirmación para eliminar usuario
  const openDeleteConfirmation = (userId) => {
    setConfirmDialog({
      isOpen: true,
      userId
    });
  };

  // Manejar la eliminación de usuario tras la confirmación
  const handleConfirmDelete = async () => {
    try {
      const isCurrentUser = confirmDialog.userId === currentUser.id;

      // Eliminar usuario a través del servicio
      await usersService.delete(confirmDialog.userId);
      
      // Actualizar la lista de usuarios y contadores
      setUsers(prevUsers => prevUsers.filter(u => u.id !== confirmDialog.userId));
      setTotalStudies(prevTotal => {
        const userStudies = users.find(u => u.id === confirmDialog.userId)?.studies || 0;
        return prevTotal - userStudies;
      });
      setTotalAddresses(prevTotal => {
        const userAddresses = users.find(u => u.id === confirmDialog.userId)?.addresses || 0;
        return prevTotal - userAddresses;
      });
      
      setConfirmDialog({ isOpen: false, userId: null });
      
      // Si el usuario elimina su propia cuenta
      if (isCurrentUser) {
        await logout(); // Usar el método de logout del contexto de autenticación
        showToast('Su cuenta ha sido eliminada correctamente', 'info');
        navigate('/login');
      } else {
        showToast('Usuario eliminado con éxito', 'info');
      }
    } catch (error) {
      showToast('Error al eliminar usuario', 'error');
      setConfirmDialog({ isOpen: false, userId: null });
    }
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, userId: null });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {isLoading ? <LoadingSpinner /> : (
        <>
          <AdminStats 
            users={users}
            totalStudies={totalStudies}
            totalAddresses={totalAddresses}
          />
          
          <UsersTable 
            users={users}
            redirectToUserProfile={redirectToUserProfile}
            handleAddUser={handleAddUser}
            handleDeleteUser={openDeleteConfirmation}
          />
        </>
      )}

      {/* Modal para gestionar usuarios */}
      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)} 
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title="Eliminar usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer y se eliminarán todos sus datos asociados."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="warning"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
} 