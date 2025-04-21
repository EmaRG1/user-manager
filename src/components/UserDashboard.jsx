import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studiesService, addressesService } from '../services';
import UserStats from './dashboard/UserStats';
import ProfileInfo from './dashboard/ProfileInfo';
import UserStudies from './dashboard/UserStudies';
import UserAddresses from './dashboard/UserAddresses';
import LoadingSpinner from './LoadingSpinner';

export default function UserDashboard() {
  const { user } = useAuth();
  const [userStudies, setUserStudies] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      try {
        const studies = await studiesService.getByUserId(user.id);
        const addresses = await addressesService.getByUserId(user.id);
        
        setUserStudies(studies);
        setUserAddresses(addresses);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-gray-900 text-3xl break-words">Panel Principal</h1>
        <p className="text-gray-600">¡Bienvenido de nuevo, {user.name}!</p>
      </div>
      
      {
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <UserStats userStudies={userStudies} userAddresses={userAddresses} />
            <ProfileInfo user={user} />
            <UserStudies studies={userStudies} />
            <UserAddresses addresses={userAddresses} />
          </>
        )
      }
    </div>
  );
} 