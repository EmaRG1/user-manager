import httpService from './httpService';
import addressesData from '../data/addresses.json';

// Clono los datos para simulación
let addresses = [...addressesData];

/**
 * Servicio para manejar las operaciones de direcciones
 */
class AddressesService {
  /**
   * Obtiene direcciones por usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de direcciones
   */
  async getByUserId(userId) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    return addresses.filter(address => address.userId === userId);
  }
  
  /**
   * Obtiene una dirección por su ID
   * @param {number} id - ID de la dirección
   * @returns {Promise<Object>} Datos de la dirección
   */
  async getById(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    const address = addresses.find(a => a.id === id);
    if (!address) {
      throw new Error('Dirección no encontrada');
    }
    
    return address;
  }
  
  /**
   * Crea una nueva dirección
   * @param {Object} addressData - Datos de la nueva dirección
   * @returns {Promise<Object>} Dirección creada
   */
  async create(addressData) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    // Generar nuevo ID
    const newId = addresses.length ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    
    // Crear nueva dirección
    const newAddress = {
      ...addressData,
      id: newId
    };
    
    addresses.push(newAddress);
    return newAddress;
  }
  
  /**
   * Actualiza una dirección existente
   * @param {number} id - ID de la dirección
   * @param {Object} addressData - Datos actualizados
   * @returns {Promise<Object>} Dirección actualizada
   */
  async update(id, addressData) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    const addressIndex = addresses.findIndex(a => a.id === id);
    if (addressIndex === -1) {
      throw new Error('Dirección no encontrada');
    }
    
    // Actualizar dirección
    addresses[addressIndex] = {
      ...addresses[addressIndex],
      ...addressData
    };
    
    return addresses[addressIndex];
  }
  
  /**
   * Elimina una dirección existente
   * @param {number} id - ID de la dirección
   * @returns {Promise<{success: boolean}>} Resultado de la operación
   */
  async delete(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    const addressIndex = addresses.findIndex(a => a.id === id);
    if (addressIndex === -1) {
      throw new Error('Dirección no encontrada');
    }
    
    // Eliminar dirección
    addresses.splice(addressIndex, 1);
    
    return { success: true };
  }
}

export default new AddressesService(); 