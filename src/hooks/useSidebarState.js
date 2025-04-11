import { useState, useEffect } from 'react';

export default function useSidebarState() {
  // Función para obtener el estado inicial desde localStorage o basado en el ancho de la pantalla
  const getSavedState = () => {
    const saved = localStorage.getItem('sidebarOpen');
    // Si hay un valor guardado, usarlo; si no, determinar por ancho de pantalla
    return saved !== null 
      ? JSON.parse(saved) 
      : window.innerWidth >= 768;
  };

  const [isOpen, setIsOpen] = useState(getSavedState);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  // Listener para cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Limpiar event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [isOpen, setIsOpen];
} 