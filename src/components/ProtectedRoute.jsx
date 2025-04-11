import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyToken } from '../utils/jwt';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children, allowedRoles, adminOnly = false }) {
  const { isAuthenticated, token, role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // verifico el token
    const checkToken = async () => {
      if (token) {
        const tokenValid = await verifyToken(token);
        setIsValid(tokenValid);
      }
      setIsLoading(false);
    };

    checkToken();
  }, [token]);

  // mientras verifico, muestro un loading o nada
  if (isLoading) {
    return null;
  }

  // si no estoy autenticado, redirijo al login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // verifico que el token sea valido
  if (!isValid) {
    // si el token no es valido, redirijo al login
    console.log('Token inválido o expirado en ruta protegida');
    return <Navigate to="/login" replace />;
  }

  // verifico que el usuario tenga el rol adecuado si se especifican roles permitidos
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`Acceso denegado: El rol ${role} no tiene permiso para esta ruta`);
    return <Navigate to="/dashboard" replace />;
  }

  // Si requiere rol de admin y el usuario no lo tiene, redirigir al dashboard
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // si todo esta bien, muestro el contenido protegido
  return children;
} 