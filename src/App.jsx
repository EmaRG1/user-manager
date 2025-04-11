import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import UserProfile from './pages/UserProfile';
import { Suspense, lazy } from 'react';
import './App.css';

// Componente simple de carga
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="border-gray-900 border-t-2 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Ruta pública */}
              <Route path="/login" element={<Login />} />
              
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
