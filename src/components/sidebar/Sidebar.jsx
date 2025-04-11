import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import NavigationLinks from './NavigationLinks';
import SidebarFooter from './SidebarFooter';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  // Controlar el overflow del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll en todo el documento cuando el sidebar está abierto
      document.body.classList.add('sidebar-open');
      document.documentElement.classList.add('sidebar-open');
    } else {
      // Permitir scroll cuando el sidebar está cerrado
      document.body.classList.remove('sidebar-open');
      document.documentElement.classList.remove('sidebar-open');
    }

    // Limpiar al desmontar
    return () => {
      document.body.classList.remove('sidebar-open');
      document.documentElement.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay para cerrar en celulares */}
      {isOpen && (
        <div 
          className="sidebar-overlay sidebar" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar flex flex-col bg-white shadow fixed h-[100svh]  pb-5 overflow-y-auto z-60 w-64 ${
          isOpen ? 'sidebar-open' : 'sidebar-closed md:sidebar-open'
        }`}
      >
        {/* Botón cerrar en celulares */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden top-4 right-4 absolute hover:bg-gray-200 p-1 rounded-full"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>

        {/* Titulo */}
        <div className="flex-shrink-0 px-6 py-4 border-gray-200 border-b">
          <h2 className="font-semibold text-gray-900 text-lg">
            Gestión de Usuarios
          </h2>
        </div>
        
        {/* Links de navegación */}
        <NavigationLinks />
        
        {/* Footer del sidebar*/}
        <SidebarFooter />
      </aside>
    </>
  );
} 