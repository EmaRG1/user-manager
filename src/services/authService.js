import { decodeToken, generateToken } from '../utils/jwt';
import httpService from './httpService';
import usersData from '../data/users.json';
import studiesData from '../data/studies.json';
import addressesData from '../data/addresses.json';

// Constantes para storage keys
export const TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

// Clono los datos para simulación
let users = [...usersData];
let studies = [...studiesData];
let addresses = [...addressesData];

/**
 * Servicio para manejar la autenticación
 * Abstrae todas las operaciones relacionadas con login/logout
 */
class AuthService {
  /**
   * Autentica a un usuario con email y password
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{token: string, user: Object}>} Token y datos del usuario
   * @throws {Error} Si las credenciales son inválidas
   */
  async login(email, password) {
    await httpService.delay(400); // Simular latencia

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const userStudies = studies.filter(s => s.userId === user.id);
    const userAddresses = addresses.filter(a => a.userId === user.id);

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studies: userStudies,
      addresses: userAddresses
    };

    // Generar token JWT
    const token = await generateToken(tokenPayload);
    
    const { password: _, ...userWithoutPassword } = user;

    const userResponse = {
      ...userWithoutPassword,
      studies: userStudies,
      addresses: userAddresses
    };
    
    return { token, user: userResponse };
  }

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<{success: boolean}>} Resultado de la operación
   */
  async logout() {
    await httpService.delay(300);
    return { success: true };
  }

  /**
   * Guarda los datos de sesión en sessionStorage
   * @param {Object} userData - Datos del usuario
   * @param {string} token - Token JWT
   */
  saveSession(userData, token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  /**
   * Carga los datos de sesión desde sessionStorage
   * @returns {Object} Datos de sesión o estado inicial
   */
  loadSession() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userData = sessionStorage.getItem(USER_DATA_KEY);
    
    const initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      role: null
    };

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        return {
          isAuthenticated: true,
          token,
          user: parsedUserData,
          role: parsedUserData.role
        };
      } catch (error) {
        console.error('Error al procesar los datos de sesión:', error);
      }
    }
    return initialState;
  }

  /**
   * Limpia los datos de sesión de sessionStorage
   */
  clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
  }

  /**
   * Procesa los datos del token para enriquecer la información del usuario
   * @param {string} token - Token JWT
   * @param {Object} user - Datos del usuario
   * @returns {Object} Usuario con datos enriquecidos
   */
  processUserData(token, user) {
    if (!token || !user) {
      throw new Error('Datos de autenticación incompletos');
    }

    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      throw new Error('Token inválido');
    }

    const studies = decodedToken.studies || [];
    const addresses = decodedToken.addresses || [];

    return {
      ...user,
      studies,
      addresses
    };
  }
}

export default new AuthService(); 