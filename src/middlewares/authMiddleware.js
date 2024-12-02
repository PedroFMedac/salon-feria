/**
 * @module AuthMiddleware
 * 
 * Este módulo contiene los middlewares relacionados con la autenticación,
 * incluyendo la validación de tokens JWT y la verificación de roles de usuario.
 */

const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');

/**
 * Middleware para verificar el token JWT en las solicitudes.
 * 
 * Este middleware valida el token JWT proporcionado en las cookies. Si el token es válido,
 * los datos decodificados se añaden al objeto de solicitud (`req.user`). Si el token no es válido
 * o no está presente, devuelve un error 401.
 * 
 * @function verifyToken
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Contiene las cookies enviadas por el cliente.
 * @param {string} req.cookies.authToken - Token JWT del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} Devuelve un mensaje de error si el token no es válido o falta,
 *                   o llama a `next()` si el token es válido.
 * @throws {Error} Devuelve un error si el token es inválido o ha expirado.
 */

const verifyToken = (req, res, next) => {
  try {
    // Obtener el token desde las cookies
    const token = req.cookies?.authToken;
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verificar el token y decodificarlo
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado:', decoded);

    // Añadir los datos del usuario al objeto `req` para su uso posterior
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      rol: decoded.rol || 'user' // Establecer un rol predeterminado si no está presente
    };

    // Continuar con el siguiente middleware
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware para verificar un token desde el encabezado `Authorization`.
 * Este middleware valida el token JWT enviado en el encabezado y adjunta los datos decodificados al objeto `req`.
 * 
 * @function verifyHeaderToken
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.headers - Encabezados de la solicitud HTTP.
 * @param {string} req.headers.authorization - Encabezado `Authorization` con formato `Bearer <token>`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Responde con un error 401 si el token es inválido o no está presente.
 * 
 * @throws {Error} Si el token es inválido, está expirado o no se encuentra en el encabezado.
 * 
 * @example
 * // Uso en una ruta protegida
 * app.get('/protected-route', verifyHeaderToken, (req, res) => {
 *   res.json({ message: `Welcome, ${req.user.name}` });
 * });
 * 
 * @description
 * Este middleware espera que el encabezado `Authorization` contenga un token JWT con el formato:
 * `Bearer <token>`. Si el token es válido, los datos decodificados se adjuntan al objeto `req.user`
 * para ser utilizados en el manejo posterior de la solicitud.
 * 
 * Campos incluidos en `req.user`:
 * - `id` (string): ID del usuario.
 * - `name` (string): Nombre del usuario.
 * - `email` (string): Email del usuario.
 * - `rol` (string): Rol del usuario (por defecto, `'user'` si no se incluye en el token).
 */

const verifyHeaderToken = (req, res, next) => {
  try {
    // Verificar el token desde el encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided in Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado desde encabezado:', decoded);

    // Adjuntar los datos del usuario al objeto req
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      rol: decoded.rol || 'user', // Rol predeterminado
    };

    next();
  } catch (err) {
    console.error('Error al verificar el token desde encabezado:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware para verificar el token JWT y el rol del usuario.
 * 
 * Este middleware valida el token JWT proporcionado en las cookies y verifica que el rol
 * del usuario coincida con el rol requerido para acceder a la ruta. Si el token no es válido,
 * no está presente o el rol no coincide, devuelve un error 401 o 403 según el caso.
 * 
 * @function verifyTokenWithRole
 * @param {string} requiredRole - Rol requerido para acceder a la ruta (por ejemplo, "admin").
 * @returns {Function} Middleware que valida el token JWT y el rol del usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Contiene las cookies enviadas por el cliente.
 * @param {string} req.cookies.authToken - Token JWT del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} Devuelve un mensaje de error si el token es inválido, falta o el rol no coincide,
 *                   o llama a `next()` si el token y el rol son válidos.
 * @throws {Error} Devuelve un error si el token es inválido, ha expirado o el rol no coincide.
 */
const verifyTokenWithRole = (requiredRole) => (req, res, next) => {
  const token = req.cookies['authToken']; // Obtener el token desde las cookies
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verificar el token
    req.user = decoded;

    if (requiredRole && decoded.rol !== requiredRole) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next(); // Pasar al siguiente middleware si el rol coincide
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};



module.exports = { verifyToken, verifyTokenWithRole, verifyHeaderToken };
