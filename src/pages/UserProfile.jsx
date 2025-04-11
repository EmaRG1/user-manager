import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';
import useSidebarState from '../hooks/useSidebarState';
import { studiesApi, addressesApi, usersApi } from '../api/mockApi';

// Componentes existentes
import ProfileTabs from '../components/profile/ProfileTabs';
import LoadingSpinner from '../components/LoadingSpinner';
import StudiesList from '../components/profile/StudiesList';
import AddressesList from '../components/profile/AddressesList';
import ProfileInfo from '../components/profile/ProfileInfo';

export default function UserProfile() {
  const { role } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userAddressesList, setUserAddressesList] = useState([]);
  const [userStudiesList, setUserStudiesList] = useState([]);

  // Verificar si el usuario actual es administrador
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/dashboard');
    }
  }, [role, navigate]);

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        // Cargar datos del usuario
        const userData = await usersApi.getById(Number(userId), token);
        setUser(userData);
        
        // Si los estudios y direcciones ya vienen en userData, los usamos directamente
        if (userData.studies && userData.addresses) {
          setUserStudiesList(userData.studies);
          setUserAddressesList(userData.addresses);
          setIsLoading(false);
          return;
        }
        
        // Si no están en userData, los cargamos de la API
        const addresses = await addressesApi.getByUserId(Number(userId), token);
        const studies = await studiesApi.getByUserId(Number(userId), token);
        
        setUserAddressesList(addresses);
        setUserStudiesList(studies);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  // Función para actualizar el usuario
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} role={user?.role} updateUser={updateUser} />;
      
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

  // Componente para el encabezado del perfil
  const ProfileHeader = () => (
    <div className="flex items-center mb-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center mr-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h2 className="mb-2 font-bold text-gray-900 text-3xl break-words">Perfil de {user?.name}</h2>
        <p className="text-gray-600">Gestionar información del usuario</p>
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
      <h2 className="ml-2 font-medium text-gray-900 text-xl">Perfil de Usuario</h2>
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

            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {isLoading ? <LoadingSpinner /> : renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
} 