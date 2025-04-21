import { Menu, ArrowLeft } from 'lucide-react';
import Sidebar from './sidebar/Sidebar';
import ProfileTabs from '../profile/ProfileTabs';
import LoadingSpinner from '../common/LoadingSpinner';


/**
 * Componente de layout para las páginas de perfil
 */
export default function ProfileLayout({
  title,
  subtitle,
  isLoading,
  activeTab,
  setActiveTab,
  onBack,
  sidebarOpen,
  setSidebarOpen,
  children
}) {
  // Componente para el encabezado del perfil
  const ProfileHeader = () => (
    <div className="flex items-center mb-6">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center mr-4 text-gray-600 hover:text-gray-900"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div>
        <h2 className="mb-2 font-bold text-gray-900 text-3xl break-words">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );

  // Componente para el menú móvil
  const MobileMenu = () => (
    <div className="md:hidden top-0 z-10 sticky flex items-center bg-white px-4 py-3 border-gray-200 border-b">
      <button
        onClick={() => setSidebarOpen(true)}
        className="hover:bg-gray-100 p-2 rounded-md focus:outline-none text-gray-500 hover:text-gray-900"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>
      <h2 className="ml-2 font-medium text-gray-900 text-xl">
        {title.split(' ')[0]} {/* Primera palabra del título */}
      </h2>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="ml-0 md:ml-64 w-full overflow-y-auto main-content">
        <MobileMenu />

        <div className="p-4 sm:p-6">
          <div className="max-w-7xl">
            <ProfileHeader />

            {activeTab && setActiveTab && (
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            )}

            {isLoading ? <LoadingSpinner /> : children}
          </div>
        </div>
      </main>
    </div>
  );
} 