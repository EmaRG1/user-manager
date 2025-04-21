import { verifyToken } from '../utils/jwt';

/**
 * Servicio para manejar peticiones HTTP
 */
class HttpService {
  /**
   * Simula un delay para imitar lag
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise<void>}
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica si el token es válido
   * @param {string} token - Token a verificar
   * @throws {Error} Si el token es inválido o está expirado
   */
  async validateToken(token) {
    if (!token) {
      throw new Error('No se proporcionó token de autenticación');
    }
    
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Método para obtener el token actual
   * @returns {string|null} Token almacenado o null
   */
  getAuthToken() {
    return sessionStorage.getItem('auth_token');
  }
}

export default new HttpService(); 