import httpService from './httpService';
import usersData from '../data/users.json';
import studiesData from '../data/studies.json';
import addressesData from '../data/addresses.json';

// Clono los datos para simulación
let users = [...usersData];
let studies = [...studiesData];
let addresses = [...addressesData];

/**
 * Servicio para manejar las operaciones de usuarios
 */
class UsersService {
  /**
   * Obtiene todos los usuarios (solo admin)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAll() {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    return users.map(({ password, ...user }) => user);
  }
  
  /**
   * Obtiene un usuario por su ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getById(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const userStudies = studies.filter(s => s.userId === id);
    const userAddresses = addresses.filter(a => a.userId === id);
    
    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      studies: userStudies,
      addresses: userAddresses
    };
  }
  
  /**
   * Crea un nuevo usuario (solo admin)
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async create(userData) {
    const token = httpService.getAuthToken();
    await httpService.delay(300);
    await httpService.validateToken(token);
    
    // Generar nuevo ID
    const newId = Math.max(...users.map(u => u.id)) + 1;
    
    // Crear nuevo usuario
    const newUser = {
      ...userData,
      id: newId
    };
    
    users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<Object>} Usuario actualizado
   */
  async update(id, userData) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Actualizar usuario
    users[userIndex] = {
      ...users[userIndex],
      ...userData
    };
    
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
  
  /**
   * Elimina un usuario existente (solo admin)
   * @param {number} id - ID del usuario
   * @returns {Promise<{success: boolean}>} Resultado de la operación
   */
  async delete(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Eliminar usuario
    users.splice(userIndex, 1);
    
    // También eliminar sus estudios y direcciones
    studies = studies.filter(s => s.userId !== id);
    addresses = addresses.filter(a => a.userId !== id);
    
    return { success: true };
  }
}

export default new UsersService(); 