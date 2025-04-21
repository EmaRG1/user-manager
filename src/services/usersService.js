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
   * Verifica si un email ya existe en la base de datos
   * @param {string} email - Email a verificar
   * @param {number} excludeUserId - ID del usuario a excluir de la verificación (para updates)
   * @returns {Promise<boolean>} True si el email ya existe
   */
  async emailExists(email, excludeUserId = null) {
    await httpService.delay(100);
    return users.some(user => 
      user.email === email && (excludeUserId === null || user.id !== excludeUserId)
    );
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
    
    // Verificar si el email ya existe
    if (await this.emailExists(userData.email)) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }
    
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
    
    // Verificar si se está cambiando el email y si ya existe
    if (userData.email && userData.email !== users[userIndex].email) {
      if (await this.emailExists(userData.email, id)) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }
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