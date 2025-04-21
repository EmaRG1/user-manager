import { AlertTriangle, HelpCircle, Info } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
  onConfirm,
  onCancel,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  // Determinar el ícono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-500" />;
      case 'question':
      default:
        return <HelpCircle className="w-8 h-8 text-gray-500" />;
    }
  };
  
  // Determinar el color del botón principal según el tipo
  const getButtonColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'question':
      default:
        return 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500';
    }
  };

  return (
    <div className="z-50 fixed inset-0 overflow-y-auto">
      {/* Overlay oscuro */}
      <div className="modal-overlay" />
      
      {/* Centrar el diálogo */}
      <div className="flex justify-center items-center md:ml-64 p-4 min-h-screen">
        <div className="z-60 bg-white shadow-xl mx-auto rounded-lg w-full max-w-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-4">
                {getIcon()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-lg">{title}</h3>
                <p className="mt-2 text-gray-600">{message}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="bg-white hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-gray-700"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()} disabled:opacity-50`}
                onClick={onConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 