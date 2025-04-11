import Modal from './Modal';
import useFormValidation from '../hooks/useFormValidation';

/**
 * Modal para agregar o editar direcciones
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {function} props.onSave - Función para guardar los datos del formulario
 * @param {Object} props.address - Datos de la dirección para editar (opcional)
 * @returns {React.ReactNode}
 */
export default function AddressModal({ isOpen, onClose, onSave, address = null }) {
  const initialValues = {
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || ''
  };

  const validationRules = {
    street: {
      required: 'La dirección es obligatoria'
    },
    city: {
      required: 'La ciudad es obligatoria'
    },
    state: {
      required: 'El estado/provincia es obligatorio'
    },
    zipCode: {
      required: 'El código postal es obligatorio'
    },
    country: {
      required: 'El país es obligatorio'
    }
  };

  const handleFormSubmit = (formData) => {
    onSave({
      ...formData,
      id: address?.id || Date.now() // Generar ID si es nueva dirección
    });
    onClose();
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
    { addressId: address?.id, isOpen }
  );

  return (
    <Modal
      title={address ? "Editar Dirección" : "Añadir Nueva Dirección"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Calle */}
          <div>
            <label htmlFor="street" className="block mb-1 font-medium text-gray-700 text-sm">
              Dirección
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`px-3 py-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
              placeholder="Calle y número"
            />
            {errors.street && (
              <p className="mt-1 text-red-500 text-sm">{errors.street}</p>
            )}
          </div>
          
          {/* Ciudad y Estado/Provincia (en dos columnas) */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="city" className="block mb-1 font-medium text-gray-700 text-sm">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
                placeholder="Ciudad"
              />
              {errors.city && (
                <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="state" className="block mb-1 font-medium text-gray-700 text-sm">
                Estado/Provincia
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
                placeholder="Estado o provincia"
              />
              {errors.state && (
                <p className="mt-1 text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
          </div>
          
          {/* Código Postal y País (en dos columnas) */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="zipCode" className="block mb-1 font-medium text-gray-700 text-sm">
                Código Postal
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
                placeholder="Código postal"
              />
              {errors.zipCode && (
                <p className="mt-1 text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="country" className="block mb-1 font-medium text-gray-700 text-sm">
                País
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-gray-900 text-sm`}
                placeholder="País"
              />
              {errors.country && (
                <p className="mt-1 text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-white text-sm"
          >
            {address ? 'Guardar Cambios' : 'Guardar Dirección'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 