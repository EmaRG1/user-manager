import Modal from './common/Modal';
import useFormValidation from '../hooks/common/useFormValidation';

export default function StudyModal({ isOpen, onClose, onSave, study = null, isSaving = false }) {
  const initialValues = {
    institution: study?.institution || '',
    title: study?.title || '',
    degree: study?.degree || '',
    fieldOfStudy: study?.fieldOfStudy || '',
    startYear: study?.startYear || '',
    endYear: study?.endYear || '',
    description: study?.description || '',
    currentlyStudying: study?.currentlyStudying || false
  };

  const validationRules = {
    institution: {
      required: 'La institución es obligatoria'
    },
    title: {
      required: 'El título es obligatorio'
    },
    startYear: {
      required: 'El año de inicio es obligatorio'
    },
    endYear: {
      custom: (value, formData) => {
        if (!formData.currentlyStudying && !value.trim()) {
          return 'El año de finalización es obligatorio';
        }
        return null;
      }
    }
  };

  const handleFormSubmit = (formData) => {
    onSave({
      ...formData,
      id: study?.id || Date.now() // Generar ID si es nueva formación
    });
  };

  const { 
    formData, 
    errors, 
    handleChange, 
    handleSubmit,
    handleBlur
  } = useFormValidation(
    initialValues,
    validationRules,
    handleFormSubmit,
    { studyId: study?.id, isOpen }
  );

  return (
    <Modal
      title={study ? "Editar Formación" : "Añadir Formación"}
      isOpen={isOpen}
      onClose={isSaving ? undefined : onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Institución */}
          <div>
            <label htmlFor="institution" className="block mb-1 font-medium text-gray-700 text-sm">
              Institución
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSaving}
              className={`px-3 py-2 border ${errors.institution ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Nombre de la institución"
            />
            {errors.institution && (
              <p className="mt-1 text-red-500 text-sm">{errors.institution}</p>
            )}
          </div>
          
          {/* Título */}
          <div>
            <label htmlFor="title" className="block mb-1 font-medium text-gray-700 text-sm">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSaving}
              className={`px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Título obtenido"
            />
            {errors.title && (
              <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          
          {/* Grado y Campo de estudio */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="degree" className="block mb-1 font-medium text-gray-700 text-sm">
                Grado
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                disabled={isSaving}
                className={`px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm`}
                placeholder="Ej: Licenciatura, Máster"
              />
            </div>
            
            <div>
              <label htmlFor="fieldOfStudy" className="block mb-1 font-medium text-gray-700 text-sm">
                Campo de Estudio
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                disabled={isSaving}
                className={`px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm`}
                placeholder="Ej: Informática, Economía"
              />
            </div>
          </div>
          
          {/* Año de inicio y Año de fin */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="startYear" className="block mb-1 font-medium text-gray-700 text-sm">
                Año de inicio
              </label>
              <input
                type="number"
                id="startYear"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSaving}
                min={1950}
                max={new Date().getFullYear()}
                className={`px-3 py-2 border ${errors.startYear ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
                placeholder="Ej: 2018"
              />
              {errors.startYear && (
                <p className="mt-1 text-red-500 text-sm">{errors.startYear}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endYear" className="block mb-1 font-medium text-gray-700 text-sm">
                Año de finalización
              </label>
              <input
                type="number"
                id="endYear"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={formData.currentlyStudying || isSaving}
                min={1950}
                max={new Date().getFullYear()}
                className={`px-3 py-2 border ${errors.endYear ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm ${formData.currentlyStudying ? 'bg-gray-100' : ''}`}
                placeholder={formData.currentlyStudying ? "Actual" : "Ej: 2022"}
              />
              {errors.endYear && (
                <p className="mt-1 text-red-500 text-sm">{errors.endYear}</p>
              )}
            </div>
          </div>
          
          {/* Cursando actualmente (checkbox) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="currentlyStudying"
              name="currentlyStudying"
              checked={formData.currentlyStudying}
              onChange={handleChange}
              disabled={isSaving}
              className="border-gray-300 rounded w-4 h-4 text-black"
            />
            <label htmlFor="currentlyStudying" className="block ml-2 text-gray-700 text-sm">
              Actualmente cursando
            </label>
          </div>
          
          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block mb-1 font-medium text-gray-700 text-sm">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={isSaving}
              className="px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm"
              placeholder="Descripción o detalles adicionales (opcional)"
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-black hover:bg-gray-800 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white text-sm"
          >
            {isSaving ? 'Guardando...' : study ? 'Guardar Cambios' : 'Guardar Formación'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 