import { Plus, Edit, Trash2 } from 'lucide-react';
import { addressesService } from '../../services';
import AddressModal from '../AddressModal';
import ConfirmDialog from '../ConfirmDialog';
import useEntityCRUD from '../../hooks/data/useEntityCRUD';

export default function AddressesList({ user, userAddressesList, setUserAddressesList }) {
  // Usar el hook genérico para operaciones CRUD con mensajes personalizados
  const {
    currentItem: currentAddress,
    isModalOpen: isAddressModalOpen,
    confirmDialog,
    handleAddItem: handleAddAddress,
    handleEditItem: handleEditAddress,
    handleSaveItem: handleSaveAddress,
    openDeleteConfirmation,
    handleConfirmDelete,
    handleCancelDelete,
    setIsModalOpen: setIsAddressModalOpen,
    isSaving
  } = useEntityCRUD({
    entities: userAddressesList,
    setEntities: setUserAddressesList,
    service: addressesService,
    userId: user.id,
    messages: {
      createSuccess: 'Dirección creada con éxito',
      updateSuccess: 'Dirección actualizada con éxito',
      deleteSuccess: 'Dirección eliminada con éxito',
      createError: 'Error al crear dirección',
      updateError: 'Error al actualizar dirección',
      deleteError: 'Error al eliminar dirección'
    }
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Direcciones</h2>
        </div>
        <button 
          className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
          onClick={handleAddAddress}
        >
          <Plus className="mr-2 w-5 h-5" />
          Añadir Dirección
        </button>
      </div>

      {userAddressesList.length > 0 ? (
        <div className="space-y-4">
          {userAddressesList.map(address => (
            <div key={address.id} className="bg-white shadow p-4 rounded-lg">
              <div className="flex flex-wrap justify-between">
                <div className="mb-2 sm:mb-0 pr-2">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 break-words">{address.street}</h3>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm break-words">{address.city}, {address.state}</p>
                  <p className="text-gray-500 text-sm">{address.zipCode}, {address.country}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="flex-shrink-0 text-gray-600 hover:text-gray-900"
                    onClick={() => handleEditAddress(address)}
                    aria-label="Editar dirección"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    className="flex-shrink-0 text-red-600 hover:text-red-900"
                    onClick={() => openDeleteConfirmation(address.id)}
                    aria-label="Eliminar dirección"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow p-4 rounded-lg text-gray-500 text-center">
          No hay direcciones añadidas
        </div>
      )}
      
      {/* Modal para añadir/editar direcciones */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={currentAddress}
        isSaving={isSaving}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title="Eliminar dirección"
        message="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
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