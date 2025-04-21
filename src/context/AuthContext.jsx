import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getTokenRemainingTime, verifyToken } from '../utils/jwt';
import { authService } from '../services';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        role: action.payload.role
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);

  // Al cargar el componente, verificar si hay un token guardado
  useEffect(() => {
    const initAuth = async () => {
      // Cargar datos desde sessionStorage a través del servicio
      const authState = authService.loadSession();
      
      // Si hay un estado válido, actualizar el contexto
      if (authState.isAuthenticated) {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: authState.user,
            token: authState.token,
            role: authState.role
          }
        });
        
        // Configurar verificación para token próximo a expirar
        const timeRemaining = getTokenRemainingTime(authState.token);
        if (timeRemaining && timeRemaining < 300) { // menos de 5 minutos
          console.log('Token próximo a expirar, deberías renovarlo');
          // Lógica para renovar el token
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // verifico periodicamente si el token sigue siendo valido
  useEffect(() => {
    if (!state.token) return;
    
    const checkTokenInterval = setInterval(async () => {
      const isValid = await verifyToken(state.token);
      if (!isValid) {
        console.log('Token expirado durante la sesión');
        logout();
      }
    }, 60000); // verificar cada minuto
    
    return () => clearInterval(checkTokenInterval); // salgo del intervalo
  }, [state.token]);

  // Iniciar sesión con token y datos de usuario
  const login = async ({ token, user }) => {
    try {
      // Procesar y enriquecer datos de usuario a través del servicio
      const enrichedUser = authService.processUserData(token, user);
      
      // Guardar token y datos de usuario en sessionStorage a través del servicio
      authService.saveSession(enrichedUser, token);

      // Actualizar el estado de autenticación
      dispatch({
        type: 'LOGIN',
        payload: {
          user: enrichedUser,
          token,
          role: enrichedUser.role
        }
      });

      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Llamar al servicio de autenticación para logout
      if (state.token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // elimino el token y los datos de usuario de sessionStorage a través del servicio
      authService.clearSession();
      
      // actualizo el estado
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    // Actualizar el estado
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: userData 
    });
    
    // Actualizar datos guardados en sessionStorage
    try {
      const existingSession = authService.loadSession();
      if (existingSession.isAuthenticated) {
        const updatedUser = { ...existingSession.user, ...userData };
        authService.saveSession(updatedUser, existingSession.token);
      }
    } catch (error) {
      console.error('Error al actualizar datos de usuario en sessionStorage:', error);
    }
  };

  // muestro indicador de carga mientras se verifica el token
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-gray-900 border-t-2 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  const contextValue = {
    ...state,
    login,
    logout,
    updateUser,
    isAdmin: state.role === 'admin'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
} 