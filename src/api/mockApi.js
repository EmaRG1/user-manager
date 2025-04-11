import { generateToken, verifyToken } from '../utils/jwt';
import usersData from '../data/users.json';
import studiesData from '../data/studies.json';
import addressesData from '../data/addresses.json';

// Creamos copias de los datos para simular una base de datos
let users = [...usersData];
let studies = [...studiesData];
let addresses = [...addressesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const authApi = {
  login: async (email, password) => {
    await delay(400); //simular latencia
    
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

    // Generar token JWT con los datos completos
    const token = await generateToken(tokenPayload);
    
    const { password: _, ...userWithoutPassword } = user;

    const userResponse = {
      ...userWithoutPassword,
      studies: userStudies,
      addresses: userAddresses
    };
    
    return { token, user: userResponse };
  },
  
  logout: async () => {
    await delay(300);
    return { success: true };
  }
};

// API de Usuarios
export const usersApi = {
  // Obtener todos los usuarios (solo admin)
  getAll: async (token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    return users.map(({ password, ...user }) => user);
  },
  
  // Obtener usuario por ID
  getById: async (id, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
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
  },
  
  // Crear nuevo usuario (solo admin)
  create: async (userData, token) => {
    await delay(300);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
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
  },
  
  // Actualizar usuario existente
  update: async (id, userData, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
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
  },
  
  // Eliminar usuario (solo admin)
  delete: async (id, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
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
};

// API de Estudios
export const studiesApi = {
  // Obtener estudios por usuario
  getByUserId: async (userId, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    return studies.filter(study => study.userId === userId);
  },
  
  // Obtener estudio por ID
  getById: async (id, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    const study = studies.find(s => s.id === id);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    return study;
  },
  
  // Crear nuevo estudio
  create: async (studyData, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    // Generar nuevo ID
    const newId = studies.length ? Math.max(...studies.map(s => s.id)) + 1 : 1;
    
    // Crear nuevo estudio
    const newStudy = {
      ...studyData,
      id: newId
    };
    
    studies.push(newStudy);
    return newStudy;
  },
  
  // Actualizar estudio existente
  update: async (id, studyData, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
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
  },
  
  // Eliminar estudio
  delete: async (id, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    const studyIndex = studies.findIndex(s => s.id === id);
    if (studyIndex === -1) {
      throw new Error('Estudio no encontrado');
    }
    
    // Eliminar estudio
    studies.splice(studyIndex, 1);
    
    return { success: true };
  }
};

// API de Direcciones
export const addressesApi = {
  // Obtener direcciones por usuario
  getByUserId: async (userId, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    return addresses.filter(address => address.userId === userId);
  },
  
  // Obtener dirección por ID
  getById: async (id, token) => {
    await delay(100);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    const address = addresses.find(a => a.id === id);
    if (!address) {
      throw new Error('Dirección no encontrada');
    }
    
    return address;
  },
  
  // Crear nueva dirección
  create: async (addressData, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    // Generar nuevo ID
    const newId = addresses.length ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    
    // Crear nueva dirección
    const newAddress = {
      ...addressData,
      id: newId
    };
    
    addresses.push(newAddress);
    return newAddress;
  },
  
  // Actualizar dirección existente
  update: async (id, addressData, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
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
  },
  
  // Eliminar dirección
  delete: async (id, token) => {
    await delay(500);
    if (!await verifyToken(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    const addressIndex = addresses.findIndex(a => a.id === id);
    if (addressIndex === -1) {
      throw new Error('Dirección no encontrada');
    }
    
    // Eliminar dirección
    addresses.splice(addressIndex, 1);
    
    return { success: true };
  }
}; 