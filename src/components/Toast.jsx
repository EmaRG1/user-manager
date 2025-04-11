import { useState, useEffect } from 'react';
import { XCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Componente Toast para mostrar notificaciones temporales.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo de toast: 'success', 'error', 'info'
 * @param {number} props.duration - Duración en ms que se mostrará el toast
 * @param {Function} props.onClose - Función para cerrar el toast
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Permitir que la animación de salida termine
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Determinar el ícono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Determinar el color según el tipo
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  // No renderizar si no es visible
  if (!visible) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg border-l-4 shadow-md transition-all duration-300 ${
        getBackgroundColor()
      } ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
    >
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="mr-2 font-medium">{message}</div>
      <button 
        onClick={() => {
          setVisible(false);
          setTimeout(() => {
            onClose();
          }, 300);
        }}
        className="inline-flex justify-center items-center hover:bg-gray-200 -mx-1.5 -my-1.5 ml-auto p-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 w-8 h-8 hover:text-gray-900"
      >
        <span className="sr-only">Cerrar</span>
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast; 