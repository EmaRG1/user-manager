import { Plus, Edit, Trash2 } from 'lucide-react';
import { studiesService } from '../../services';
import StudyModal from '../StudyModal';
import ConfirmDialog from '../ConfirmDialog';
import useEntityCRUD from '../../hooks/data/useEntityCRUD';

export default function StudiesList({ user, userStudiesList, setUserStudiesList }) {
  // Usar el hook genérico para operaciones CRUD con mensajes personalizados
  const {
    currentItem: currentStudy,
    isModalOpen: isStudyModalOpen,
    confirmDialog,
    handleAddItem: handleAddStudy,
    handleEditItem: handleEditStudy,
    handleSaveItem: handleSaveStudy,
    openDeleteConfirmation,
    handleConfirmDelete,
    handleCancelDelete,
    setIsModalOpen: setIsStudyModalOpen,
    isSaving
  } = useEntityCRUD({
    entities: userStudiesList,
    setEntities: setUserStudiesList,
    service: studiesService,
    userId: user.id,
    messages: {
      createSuccess: 'Formación creada con éxito',
      updateSuccess: 'Formación actualizada con éxito',
      deleteSuccess: 'Formación eliminada con éxito',
      createError: 'Error al crear formación',
      updateError: 'Error al actualizar formación',
      deleteError: 'Error al eliminar formación'
    }
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Formación Académica</h2>
        </div>
        <button 
          className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
          onClick={handleAddStudy}
        >
          <Plus className="mr-2 w-5 h-5" />
          Añadir Formación
        </button>
      </div>

      {userStudiesList.length > 0 ? (
        <div className="space-y-4">
          {userStudiesList.map(study => (
            <div key={study.id} className="bg-white shadow p-4 rounded-lg">
              <div className="flex flex-wrap justify-between">
                <div className="mb-2 sm:mb-0 pr-2">
                  <h3 className="font-medium text-gray-900 break-words">{study.title}</h3>
                  <p className="mt-1 text-gray-500 text-sm break-words">
                    {study.institution}
                    {study.degree && ` - ${study.degree}`}
                    {study.fieldOfStudy && ` en ${study.fieldOfStudy}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {study.startYear} - {study.currentlyStudying ? 'Actualidad' : study.endYear}
                  </p>
                  {study.description && (
                    <p className="mt-2 text-gray-600 text-sm break-words">{study.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="flex-shrink-0 text-gray-600 hover:text-gray-900"
                    onClick={() => handleEditStudy(study)}
                    aria-label="Editar formación"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    className="flex-shrink-0 text-red-600 hover:text-red-900"
                    onClick={() => openDeleteConfirmation(study.id)}
                    aria-label="Eliminar formación"
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
          No hay formación académica añadida
        </div>
      )}
      
      {/* Modal para añadir/editar estudios */}
      <StudyModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        onSave={handleSaveStudy}
        study={currentStudy}
        isSaving={isSaving}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title="Eliminar formación"
        message="¿Estás seguro de que deseas eliminar esta formación académica? Esta acción no se puede deshacer."
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