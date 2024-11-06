/**
 * @module AuthMiddleware
 */
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');

/**
 * Middleware para verificar el token JWT en las solicitudes.
 * Valida el token en el encabezado de autorización y añade los datos decodificados del usuario
 * al objeto de solicitud (`req.user`) si el token es válido.
 * 
 * @async
 * @function verifyToken
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.headers - Encabezados de la solicitud HTTP.
 * @param {string} req.headers.authorization - Encabezado de autorización que contiene el token JWT.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de error si el token no es válido o falta, o llama a `next()` si es válido.
 */
async function verifyToken(req, res, next) {
  // Extrae el token del encabezado de autorización
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send('Token no proporcionado');

  const token = authHeader.split(' ')[1];  // Extrae el token del header
  if (!token) return res.status(403).send('Token no proporcionado');

  // Verifica el token JWT
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');

    try {
      // Consulta Firestore para obtener los datos del usuario a partir del ID decodificado
      const userDoc = await db.collection('users').doc(decoded.id).get();
      if (!userDoc.exists) return res.status(404).send('Usuario no encontrado');

      // Añade los datos del usuario decodificado al objeto de solicitud
      req.user = decoded;
      next(); // Llama a la siguiente función en la cadena de middlewares
    } catch (error) {
      console.error('Error al verificar el usuario en Firestore:', error);
      return res.status(500).send('Error interno del servidor');
    }
  });
}

module.exports = { verifyToken };
