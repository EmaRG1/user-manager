import StatCard from '../UI/StatCard';
import StatsGroup from '../UI/StatsGroup';

export default function AdminStats({ users, totalStudies, totalAddresses }) {
  return (
    <StatsGroup columns={3}>
      <StatCard 
        title="Total Usuarios" 
        subtitle="Usuarios activos en el sistema" 
        value={users.length}
      />
      <StatCard 
        title="Direcciones" 
        subtitle="Total de direcciones registradas" 
        value={totalAddresses}
      />
      <StatCard 
        title="Formación" 
        subtitle="Total de formación académica" 
        value={totalStudies}
      />
    </StatsGroup>
  );
} 