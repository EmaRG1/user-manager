import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { decodeToken, verifyToken, getTokenRemainingTime } from '../utils/jwt';
import { authApi } from '../api/mockApi';

const AuthContext = createContext();

// clave para guardar el token en sessionStorage
const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

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
      // Cargar datos desde sessionStorage
      const authState = loadUserData();
      
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

  // Guardar datos del usuario y token en sessionStorage
  const saveUserData = (userData, token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  };

  // Cargar datos del usuario y token desde sessionStorage
  const loadUserData = () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userData = sessionStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      try {
        // Verificar que el token sea válido
        if (verifyToken(token)) {
          const parsedUserData = JSON.parse(userData);
          return {
            isAuthenticated: true,
            token,
            user: parsedUserData,
            role: parsedUserData.role
          };
        }
      } catch (error) {
        console.error('Error al procesar los datos de sesión:', error);
      }
    }
    return initialState;
  };

  // Borrar datos del usuario y token de sessionStorage
  const clearUserData = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
  };

  // Iniciar sesión con token y datos de usuario
  const login = async ({ token, user }) => {
    try {
      if (!token || !user) {
        throw new Error('Datos de autenticación incompletos');
      }

      // Decodificar el token para obtener la información del usuario
      const decodedToken = decodeToken(token);

      if (!decodedToken) {
        throw new Error('Token inválido');
      }

      // Extraer estudios y direcciones del token si están disponibles
      const studies = decodedToken.studies || [];
      const addresses = decodedToken.addresses || [];

      // Asegurar que el usuario tenga los estudios y direcciones del token
      const enrichedUser = {
        ...user,
        studies,
        addresses
      };

      // Guardar token y datos de usuario en sessionStorage
      saveUserData(enrichedUser, token);

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
      // Llamar a la API mock para logout (opcional)
      if (state.token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // elimino el token y los datos de usuario de sessionStorage
      clearUserData();
      
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
      const userDataStr = sessionStorage.getItem(USER_DATA_KEY);
      if (userDataStr) {
        const storedUser = JSON.parse(userDataStr);
        const updatedUser = { ...storedUser, ...userData };
        sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
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