import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

/**
 * Hook genérico para operaciones CRUD en entidades
 * Aplica principios de inversión de dependencias y principio abierto/cerrado
 * 
 * @param {Object} options - Opciones de configuración
 * @param {Array} options.entities - Lista de entidades actuales
 * @param {Function} options.setEntities - Función para actualizar la lista de entidades
 * @param {Object} options.service - Servicio para operaciones CRUD
 * @param {number} options.userId - ID del usuario propietario
 * @param {Object} options.messages - Mensajes personalizados para operaciones
 * @returns {Object} Funciones y estado para manejar operaciones CRUD
 */
export default function useEntityCRUD({ 
  entities, 
  setEntities, 
  service, 
  userId,
  messages = {
    createSuccess: 'Elemento creado con éxito',
    updateSuccess: 'Elemento actualizado con éxito',
    deleteSuccess: 'Elemento eliminado con éxito',
    createError: 'Error al crear elemento',
    updateError: 'Error al actualizar elemento',
    deleteError: 'Error al eliminar elemento'
  }
}) {
  const [currentItem, setCurrentItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    isSubmitting: false
  });
  const { showToast } = useToast();
  
  // Preparar item para creación
  const handleAddItem = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };
  
  // Preparar item para edición
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  // Guardar item (crear o actualizar)
  const handleSaveItem = async (itemData) => {
    setIsSaving(true);
    try {
      if (currentItem) {
        // Editar existente
        const updatedItem = await service.update(currentItem.id, {
          ...itemData,
          userId
        });
        
        // Actualizar localmente
        setEntities(prevItems => 
          prevItems.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        );
        showToast(messages.updateSuccess, 'success');
      } else {
        // Agregar nuevo
        const newItem = await service.create({
          ...itemData,
          userId
        });
        
        // Añadir a la lista local
        setEntities(prevItems => [...prevItems, newItem]);
        showToast(messages.createSuccess, 'success');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast(
        currentItem ? messages.updateError : messages.createError, 
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  // Abrir diálogo de confirmación para eliminar
  const openDeleteConfirmation = (itemId) => {
    setConfirmDialog({
      isOpen: true,
      itemId,
      isSubmitting: false
    });
  };
  
  // Manejar la eliminación tras la confirmación
  const handleConfirmDelete = async () => {
    // Establecer estado de carga
    setConfirmDialog(prev => ({
      ...prev,
      isSubmitting: true
    }));
    
    try {
      // Eliminar mediante el servicio
      await service.delete(confirmDialog.itemId);
      
      // Actualizar localmente
      setEntities(prevItems => 
        prevItems.filter(item => item.id !== confirmDialog.itemId)
      );
      showToast(messages.deleteSuccess, 'info');
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast(messages.deleteError, 'error');
    } finally {
      // Cerrar diálogo de confirmación
      setConfirmDialog({ isOpen: false, itemId: null, isSubmitting: false });
    }
  };
  
  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, itemId: null, isSubmitting: false });
  };
  
  return {
    currentItem,
    isModalOpen,
    confirmDialog,
    isSaving,
    handleAddItem,
    handleEditItem,
    handleSaveItem,
    openDeleteConfirmation,
    handleConfirmDelete,
    handleCancelDelete,
    setIsModalOpen
  };
} 