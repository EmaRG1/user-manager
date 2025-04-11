import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi, studiesApi, addressesApi } from '../api/mockApi';
import UserModal from './UserModal';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import DashboardHeader from './dashboard/DashboardHeader';
import AdminStats from './dashboard/AdminStats';
import UsersTable from './dashboard/UsersTable';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
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
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        // Cargar usuarios
        const usersData = await usersApi.getAll(token);
        setUsers(usersData);

        // Calcular totales de estudios y direcciones
        let studies = 0;
        let addresses = 0;

        // Este enfoque es más eficiente que cargar todos los estudios y direcciones
        for (const userData of usersData) {
          const userStudies = await studiesApi.getByUserId(userData.id, token);
          const userAddresses = await addressesApi.getByUserId(userData.id, token);
          
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
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      if (selectedUser) {
        // Editar usuario existente
        const updatedUser = await usersApi.update(selectedUser.id, userData, token);
        
        // Actualizar la lista de usuarios
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === selectedUser.id ? updatedUser : u)
        );
        showToast('Usuario actualizado con éxito', 'success');
      } else {
        // Crear nuevo usuario
        const newUser = await usersApi.create(userData, token);
        
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
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      await usersApi.delete(confirmDialog.userId, token);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== confirmDialog.userId));
      setTotalStudies(prevTotal => {
        const userStudies = users.find(u => u.id === confirmDialog.userId)?.studies || 0;
        return prevTotal - userStudies;
      });
      setTotalAddresses(prevTotal => {
        const userAddresses = users.find(u => u.id === confirmDialog.userId)?.addresses || 0;
        return prevTotal - userAddresses;
      });
      if (confirmDialog.userId === currentUser.id) {
        navigate('/login');
      }
      showToast('Usuario eliminado con éxito', 'info');
    } catch (error) {
      showToast('Error al eliminar usuario', 'error');
    } finally {
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