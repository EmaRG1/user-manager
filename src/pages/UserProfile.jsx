import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import useSidebarState from '../hooks/common/useSidebarState';
import useProfileData from '../hooks/data/useProfileData';
import ProfileLayout from '../components/layout/ProfileLayout';

// Componentes para tabs específicos
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressesList from '../components/profile/AddressesList';
import StudiesList from '../components/profile/StudiesList';

export default function UserProfile() {
  const { role } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  
  // Usar el hook personalizado para cargar los datos del perfil
  const {
    isLoading,
    user,
    userAddressesList,
    userStudiesList,
    updateUserData,
    setUserAddressesList,
    setUserStudiesList
  } = useProfileData(userId, role, true); // El tercer parámetro "true" indica que se requiere rol de admin

  // Renderizar el contenido de acuerdo a la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} role={user?.role} updateUser={updateUserData} />;
      
      case 'addresses':
        return (
          <AddressesList 
            user={{ id: Number(userId) }}
            userAddressesList={userAddressesList}
            setUserAddressesList={setUserAddressesList}
          />
        );
      
      case 'studies':
        return (
          <StudiesList 
            user={{ id: Number(userId) }}
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
      subtitle="Gestionar información del usuario"
      isLoading={isLoading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onBack={() => navigate('/dashboard')}
    >
      {renderTabContent()}
    </ProfileLayout>
  );
} 