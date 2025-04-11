import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar/Sidebar';
import useSidebarState from '../hooks/useSidebarState';
import { studiesApi, addressesApi } from '../api/mockApi';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressesList from '../components/profile/AddressesList';
import StudiesList from '../components/profile/StudiesList';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyProfile() {
  const { user, role, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [isLoading, setIsLoading] = useState(true);
  const [userAddressesList, setUserAddressesList] = useState([]);
  const [userStudiesList, setUserStudiesList] = useState([]);

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        // Cargar datos del usuario
        const addresses = await addressesApi.getByUserId(user.id, token);
        const studies = await studiesApi.getByUserId(user.id, token);
        
        setUserAddressesList(addresses);
        setUserStudiesList(studies);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

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
    <div className="bg-gray-50 min-h-screen">

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="md:ml-64">
        <ProfileHeader user={user} setSidebarOpen={setSidebarOpen} />

        <div className="px-4 sm:px-6">
          <div className="max-w-7xl">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {isLoading ? <LoadingSpinner /> : renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
} 