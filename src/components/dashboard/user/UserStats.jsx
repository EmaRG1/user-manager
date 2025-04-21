import StatCard from '../../ui/StatCard';
import StatsGroup from '../../ui/StatsGroup';

export default function UserStats({ userStudies, userAddresses }) {
  return (
    <StatsGroup columns={2}>
      <StatCard 
        title="Mi Formación" 
        subtitle="Tu formación académica" 
        value={userStudies.length} 
      />
      <StatCard 
        title="Mis Direcciones" 
        subtitle="Tus direcciones registradas" 
        value={userAddresses.length} 
      />
    </StatsGroup>
  );
} 