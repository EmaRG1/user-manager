import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, isOpen, onClose, children, size = 'md' }) {
  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-md'; // md por defecto
    }
  };

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  // Cerrar al presionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // No renderizar nada si el modal no está abierto
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="modal-overlay" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="z-50 fixed inset-0 md:ml-64 overflow-y-auto">
        <div className="flex justify-center items-center p-4 sm:p-0 min-h-full text-center">
          <div 
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${getMaxWidth()}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-gray-200 border-b">
              <h3 className="font-semibold text-gray-900 text-xl">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="focus:outline-none text-gray-400 hover:text-gray-500"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 