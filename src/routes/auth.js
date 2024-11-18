/**
 * @module AuthRoutes
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebaseConfig');

/**
 * @function generateToken
 * @description Genera un token JWT con los datos del usuario.
 * @param {Object} userData - Información del usuario.
 * @param {string} userData.name - Nombre del usuario.
 * @param {string} userData.id - ID del usuario.
 * @param {string} userData.rol - Rol del usuario.
 * @param {string} userData.standID - ID del stand asociado al usuario.
 * @returns {string} Token JWT.
 */
const generateToken = (userData) => {
  return jwt.sign(
    { name: userData.name, id: userData.id, rol: userData.rol, standID: userData.standID },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  );
};

/**
 * Ruta de autenticación para iniciar sesión.
 * Permite a los usuarios autenticarse utilizando su nombre o correo electrónico y contraseña.
 * Genera un token JWT si las credenciales son correctas y lo configura como una cookie segura.
 * 
 * @async
 * @function /login
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene las credenciales.
 * @param {string} req.body.nameOrEmail - Nombre de usuario o correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con un mensaje de éxito o un mensaje de error.
 */
router.post('/login', async (req, res) => {
  const { nameOrEmail, password } = req.body;

  // Validación de los campos de entrada
  if (!nameOrEmail || !password) {
    return res.status(400).json({ error: 'Faltan datos: nameOrEmail y password son requeridos.' });
  }

  try {
    // Busca al usuario por nombre o email
    let userQuery = await db.collection('users').where('name', '==', nameOrEmail).get();
    if (userQuery.empty) {
      userQuery = await db.collection('users').where('email', '==', nameOrEmail).get();
    }

    // Si no se encuentra ningún usuario
    if (userQuery.empty) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Extraer datos del usuario
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar token JWT
    const token = generateToken({
      name: userData.name,
      id: userDoc.id,
      rol: userData.rol,
      standID: userData.standId,
    });

    // Configurar cookie segura con el token
    res.cookie('token', token, {
      httpOnly: true, // Protege contra XSS
      secure: true, // Solo en HTTPS
      sameSite: 'Strict', // Previene CSRF
      maxAge: 7 * 24 * 60 * 1000, // 1 semana
    });

    return res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * @name GET /auth/role
 * @function
 * @memberof module:AuthRoutes
 * @description Ruta protegida para obtener el rol del usuario autenticado.
 * Requiere un token JWT válido almacenado en las cookies y verificado por el middleware `verifyToken`.
 * 
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Objeto asignado por `verifyToken` que contiene la información decodificada del token JWT.
 * @param {string} req.user.rol - Rol del usuario autenticado (por ejemplo, `admin`, `co`, etc.).
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el rol del usuario si la autenticación es exitosa, o un mensaje de error si no se puede determinar el rol.
 * 
 * @example
 * // Solicitud exitosa
 * // Respuesta: HTTP 200
 * {
 *   "rol": "admin"
 * }
 * 
 * @example
 * // Solicitud fallida
 * // Respuesta: HTTP 403
 * {
 *   "message": "No se pudo determinar el rol del usuario"
 * }
 */
router.get('/role', verifyToken, (req, res) => {
  if (req.user && req.user.rol) {
    res.json(req.user.rol); // Devuelve el rol del usuario
  } else {
    res.status(403).json({ message: 'No se pudo determinar el rol del usuario' });
  }
});

/**
 * Ruta para cerrar sesión.
 * Elimina la cookie que contiene el token JWT.
 * 
 * @name POST /logout
 * @function
 * @memberof module:AuthRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con un mensaje de confirmación.
 */
router.post('/logout', (req, res) => {
  // Elimina la cookie configurándola con maxAge: 0
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Sesión cerrada correctamente.' });
});

module.exports = router;

