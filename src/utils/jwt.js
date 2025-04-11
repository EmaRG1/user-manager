import * as jose from 'jose';

const jwtSecret = import.meta.env.VITE_JWT_SECRET || 'clave-default-desarrollo';

const JWT_SECRET = new TextEncoder().encode(jwtSecret); // Uint8Array para jose

/**
 * Genera un token JWT con los datos del usuario, incluyendo estudios y direcciones
 * @param {Object} payload - Datos a incluir en el token
 * @param {number} payload.id - ID del usuario
 * @param {string} payload.name - Nombre del usuario
 * @param {string} payload.email - Email del usuario
 * @param {string} payload.role - Rol del usuario (admin o user)
 * @param {Array} [payload.studies] - Estudios del usuario
 * @param {Array} [payload.addresses] - Direcciones del usuario
 * @param {string|number} expiresIn - Tiempo de expiración en formato string (ej: '1h') o segundos
 * @returns {Promise<string>} Token JWT generado
 */
export async function generateToken(payload, expiresIn = '1h') {
  // convierto el tiempo de expiracion a segundos
  let expirationTime;
  if (typeof expiresIn === 'string') {
    if (expiresIn.endsWith('h')) {
      expirationTime = parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      expirationTime = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      expirationTime = parseInt(expiresIn);
    } else {
      // default: 1 hora
      expirationTime = 3600;
    }
  } else {
    expirationTime = expiresIn;
  }

  // valido que el payload tenga la estructura esperada
  if (!payload.id || !payload.email) {
    throw new Error('El payload debe contener al menos id y email');
  }

  // creo jwt
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime + 's')  // exp: tiempo de expiración
    .sign(JWT_SECRET);

  return jwt;
}

// verifico si el token es valido
export async function verifyToken(token) {
  try {
    await jose.jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return false;
  }
}

// decodifico el token
export function decodeToken(token) {
  try {
    if (!token) return null;
    return jose.decodeJwt(token);
  } catch (error) {
    console.error('Error al decodificar el token:', error.message);
    return null;
  }
}

// obtengo los estudios del token
export function getUserStudiesFromToken(token) {
  try {
    const payload = decodeToken(token);
    return payload?.studies || null;
  } catch (error) {
    console.error('Error al obtener estudios del token:', error.message);
    return null;
  }
}

// obtengo las direcciones del token
export function getUserAddressesFromToken(token) {
  try {
    const payload = decodeToken(token);
    return payload?.addresses || null;
  } catch (error) {
    console.error('Error al obtener direcciones del token:', error.message);
    return null;
  }
}

// obtengo el tiempo restante de expiracion del token
export function getTokenRemainingTime(token) {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime;
  } catch (error) {
    return null;
  }
} 