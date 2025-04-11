import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { addressesApi } from '../../api/mockApi';
import AddressModal from '../AddressModal';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../ConfirmDialog';

export default function AddressesList({ user, userAddressesList, setUserAddressesList }) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const { showToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    addressId: null
  });

  // Manejar la apertura del modal para agregar dirección
  const handleAddAddress = () => {
    setCurrentAddress(null);
    setIsAddressModalOpen(true);
  };

  // Manejar la apertura del modal para editar dirección
  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setIsAddressModalOpen(true);
  };

  // Manejar el guardado de una dirección
  const handleSaveAddress = async (addressData) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      if (currentAddress) {
        // Editar dirección existente
        const updatedAddress = await addressesApi.update(currentAddress.id, {
          ...addressData,
          userId: user.id
        }, token);
        
        // Actualizar localmente
        setUserAddressesList(prevAddresses => 
          prevAddresses.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
        showToast('Dirección actualizada con éxito', 'success');
      } else {
        // Agregar nueva dirección
        const newAddress = await addressesApi.create({
          ...addressData,
          userId: user.id
        }, token);
        
        // Añadir a la lista local
        setUserAddressesList(prevAddresses => [...prevAddresses, newAddress]);
        showToast('Dirección creada con éxito', 'success');
      }
      
      setIsAddressModalOpen(false);
    } catch (error) {
      showToast('Error al guardar dirección', 'error');
    }
  };

  // Abrir diálogo de confirmación para eliminar dirección
  const openDeleteConfirmation = (addressId) => {
    setConfirmDialog({
      isOpen: true,
      addressId
    });
  };

  // Manejar la eliminación de dirección tras la confirmación
  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Eliminar dirección
      await addressesApi.delete(confirmDialog.addressId, token);
      
      // Actualizar localmente
      setUserAddressesList(prevAddresses => 
        prevAddresses.filter(addr => addr.id !== confirmDialog.addressId)
      );
      showToast('Dirección eliminada con éxito', 'info');
    } catch (error) {
      showToast('Error al eliminar dirección', 'error');
    } finally {
      // Cerrar diálogo de confirmación
      setConfirmDialog({ isOpen: false, addressId: null });
    }
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, addressId: null });
  };

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
                <div className="flex space-x-2">
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
      />
    </div>
  );
} 