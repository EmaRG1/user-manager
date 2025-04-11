import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

// Crear el contexto
const ToastContext = createContext();

/**
 * Proveedor de contexto para el sistema de notificaciones Toast
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Función para agregar un nuevo toast
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        message,
        type,
        duration
      }
    ]);

    return id;
  }, []);

  // Función para eliminar un toast específico
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Valores que expondrá el contexto
  const contextValue = {
    showToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Contenedor de toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de Toast
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  
  return context;
} 