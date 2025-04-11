import { Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserStudies({ studies }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="font-bold text-gray-900 text-xl">Mi Formación</h2>
          <p className="text-gray-500 text-sm">Tu formación académica</p>
        </div>
        <button 
          className="flex items-center bg-black hover:bg-gray-800 px-4 py-2 rounded-md text-white"
          onClick={() => navigate('/profile')}
        >
          <Plus className="mr-2 w-5 h-5" />
          Añadir Formación
        </button>
      </div>

      {studies.length > 0 ? (
        <div className="space-y-4">
          {studies.map(study => (
            <div key={study.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex flex-wrap justify-between">
                <div className="mb-2 sm:mb-0 pr-2">
                  <h3 className="font-medium text-gray-900 break-words">{study.title}</h3>
                  <p className="mt-1 text-gray-500 text-sm break-words">
                    {study.institution}
                    {study.degree && ` - ${study.degree}`}
                    {study.fieldOfStudy && ` en ${study.fieldOfStudy}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {study.startYear} - {study.currentlyStudying ? 'Actualidad' : study.endYear}
                  </p>
                  {study.description && (
                    <p className="mt-2 text-gray-600 text-sm break-words">{study.description}</p>
                  )}
                </div>
                <button 
                  className="flex-shrink-0 text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/profile')}
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-gray-500 text-center">No hay formación académica añadida</p>
      )}
    </div>
  );
} 