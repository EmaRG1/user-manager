import { useAuth } from '../../../context/AuthContext';
import UserModal from '../../UserModal';
import DashboardHeader from '../../layout/DashboardHeader';
import AdminStats from './AdminStats';
import UsersTable from './UsersTable';
import ConfirmDialog from '../../ConfirmDialog';
import useAdminDashboard from '../../../hooks/useAdminDashboard';
import LoadingSpinner from '../../ui/LoadingSpinner';
export default function AdminDashboard() {
  const { user: currentUser, logout } = useAuth();
  
  // Usar el hook personalizado para la lógica del dashboard
  const {
    users,
    totalStudies,
    totalAddresses,
    isUserModalOpen,
    setIsUserModalOpen,
    isLoading,
    confirmDialog,
    selectedUser,
    redirectToUserProfile,
    handleAddUser,
    handleSaveUser,
    openDeleteConfirmation,
    handleConfirmDelete,
    handleCancelDelete
  } = useAdminDashboard(currentUser, logout);

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
        isSubmitting={confirmDialog.isSubmitting}
      />
    </div>
  );
} 