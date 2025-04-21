import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useSidebarState from '../hooks/common/useSidebarState';
import useCurrentUserProfile from '../hooks/useCurrentUserProfile';
import ProfileLayout from '../components/layout/ProfileLayout';

// Componentes para tabs específicos
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressesList from '../components/profile/AddressesList';
import StudiesList from '../components/profile/StudiesList';

export default function MyProfile() {
  const { user, role, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  
  // Usar el hook personalizado para cargar datos del perfil del usuario actual
  const {
    isLoading,
    userAddressesList,
    userStudiesList,
    setUserAddressesList,
    setUserStudiesList
  } = useCurrentUserProfile(user, updateUser);

  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} role={role} updateUser={updateUser} />;
      
      case 'addresses':
        return (
          <AddressesList 
            user={user} 
            userAddressesList={userAddressesList} 
            setUserAddressesList={setUserAddressesList} 
          />
        );
      
      case 'studies':
        return (
          <StudiesList 
            user={user} 
            userStudiesList={userStudiesList} 
            setUserStudiesList={setUserStudiesList} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <ProfileLayout
      title={`Perfil de ${user?.name || 'Usuario'}`}
      subtitle="Gestiona tu información personal"
      isLoading={isLoading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onBack={null} // No hay botón de regreso en el perfil personal
    >
      {renderTabContent()}
    </ProfileLayout>
  );
} 