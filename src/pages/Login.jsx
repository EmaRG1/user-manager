import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/mockApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamo a la API mock para la autenticación
      const { token, user } = await authApi.login(email, password);

      // Inicio sesión con el token y la info del usuario
      const loginSuccess = await login({ token, user });
      
      if (loginSuccess) {
        navigate('/dashboard');
      } else {
        setError('Error al procesar la autenticación');
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      setError(error.message || 'Error en el servidor. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white px-4 sm:px-6 w-full min-h-screen">
      <div className="bg-white shadow-sm mx-auto my-4 p-6 sm:p-8 border border-gray-200 rounded-lg w-full max-w-md">
        <h2 className="mb-4 font-bold text-gray-900 text-2xl text-center">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-bold text-gray-700 text-sm text-left">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm placeholder-gray-400"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-bold text-gray-700 text-sm text-left">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-md w-full text-gray-900 text-sm placeholder-gray-400"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
            )}
          </div>

          <div className="mt-8 text-gray-600 text-sm">
            <p className="font-medium">Credenciales de demostración:</p>
            <p className="mt-1">
              <span className="font-medium">Admin:</span> admin@admin.com / admin123
            </p>
            <p>
              <span className="font-medium">Usuario:</span> user@user.com / user123
            </p>
            <p>
              <span className="font-medium">Usuario:</span> user2@user.com / user123
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black py-2 rounded-md w-full font-medium text-white text-sm ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
} 