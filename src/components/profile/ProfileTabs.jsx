export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-6 border-gray-200 border-b">
      <nav className="flex -mb-px overflow-x-auto tabs-nav">
        <button
          onClick={() => setActiveTab('profile')}
          className={`whitespace-nowrap py-4 px-4 font-medium text-sm ${
            activeTab === 'profile'
              ? 'border-b-2 border-black text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`whitespace-nowrap py-4 px-4 font-medium text-sm ${
            activeTab === 'addresses'
              ? 'border-b-2 border-black text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Direcciones
        </button>
        <button
          onClick={() => setActiveTab('studies')}
          className={`whitespace-nowrap py-4 px-4 font-medium text-sm ${
            activeTab === 'studies'
              ? 'border-b-2 border-black text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Formación
        </button>
      </nav>
    </div>
  );
} 