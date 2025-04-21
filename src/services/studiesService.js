import httpService from './httpService';
import studiesData from '../data/studies.json';

// Clono los datos para simulación
let studies = [...studiesData];

/**
 * Servicio para manejar las operaciones de estudios académicos
 */
class StudiesService {
  /**
   * Obtiene estudios por usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de estudios
   */
  async getByUserId(userId) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    return studies.filter(study => study.userId === userId);
  }
  
  /**
   * Obtiene un estudio por su ID
   * @param {number} id - ID del estudio
   * @returns {Promise<Object>} Datos del estudio
   */
  async getById(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(100);
    await httpService.validateToken(token);
    
    const study = studies.find(s => s.id === id);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    return study;
  }
  
  /**
   * Crea un nuevo estudio
   * @param {Object} studyData - Datos del nuevo estudio
   * @returns {Promise<Object>} Estudio creado
   */
  async create(studyData) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    // Generar nuevo ID
    const newId = studies.length ? Math.max(...studies.map(s => s.id)) + 1 : 1;
    
    // Crear nuevo estudio
    const newStudy = {
      ...studyData,
      id: newId
    };
    
    studies.push(newStudy);
    return newStudy;
  }
  
  /**
   * Actualiza un estudio existente
   * @param {number} id - ID del estudio
   * @param {Object} studyData - Datos actualizados
   * @returns {Promise<Object>} Estudio actualizado
   */
  async update(id, studyData) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    const studyIndex = studies.findIndex(s => s.id === id);
    if (studyIndex === -1) {
      throw new Error('Estudio no encontrado');
    }
    
    // Actualizar estudio
    studies[studyIndex] = {
      ...studies[studyIndex],
      ...studyData
    };
    
    return studies[studyIndex];
  }
  
  /**
   * Elimina un estudio existente
   * @param {number} id - ID del estudio
   * @returns {Promise<{success: boolean}>} Resultado de la operación
   */
  async delete(id) {
    const token = httpService.getAuthToken();
    await httpService.delay(500);
    await httpService.validateToken(token);
    
    const studyIndex = studies.findIndex(s => s.id === id);
    if (studyIndex === -1) {
      throw new Error('Estudio no encontrado');
    }
    
    // Eliminar estudio
    studies.splice(studyIndex, 1);
    
    return { success: true };
  }
}

export default new StudiesService(); 