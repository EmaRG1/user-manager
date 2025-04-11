export default function AdminStats({ users, totalStudies, totalAddresses }) {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-8">
      <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900 text-lg">Total Usuarios</h3>
        <p className="mb-4 text-gray-500 text-sm">Usuarios activos en el sistema</p>
        <p className="font-bold text-4xl">{users.length}</p>
      </div>

      <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900 text-lg">Direcciones</h3>
        <p className="mb-4 text-gray-500 text-sm">Total de direcciones registradas</p>
        <p className="font-bold text-4xl">{totalAddresses}</p>
      </div>

      <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900 text-lg">Formación</h3>
        <p className="mb-4 text-gray-500 text-sm">Total de formación académica</p>
        <p className="font-bold text-4xl">{totalStudies}</p>
      </div>
    </div>
  );
} 