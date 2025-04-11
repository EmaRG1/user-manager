export default function StatsCards({ userStudies, userAddresses }) {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-8">
      <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900 text-lg">Mi Formación</h3>
        <p className="mb-4 text-gray-500 text-sm">Tu formación académica</p>
        <p className="font-bold text-4xl">{userStudies.length}</p>
      </div>

      <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900 text-lg">Mis Direcciones</h3>
        <p className="mb-4 text-gray-500 text-sm">Tus direcciones registradas</p>
        <p className="font-bold text-4xl">{userAddresses.length}</p>
      </div>
    </div>
  );
} 