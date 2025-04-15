import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import UserProfile from './pages/UserProfile';
import { Suspense } from 'react';
import './App.css';

// Componente simple de carga
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-gray-900 border-t-2 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
  </div>
);

// Componente para la ruta de login que redirecciona si el usuario ya está autenticado
const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Ruta de login - redirecciona al dashboard si ya está autenticado */}
              <Route path="/login" element={<LoginRoute />} />
              
              {/* Ruta protegida para cualquier usuario autenticado */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Ruta protegida para cualquier usuario autenticado */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />

              {/* Ruta protegida para administradores - perfil de usuario específico */}
              <Route
                path="/user/:userId"
                element={
                  <ProtectedRoute adminOnly>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirección de ruta raíz */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Ruta para manejar URLs no encontradas */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
