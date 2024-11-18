/**
 * @module AuthRoutes
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

/**
 * Ruta de autenticación para iniciar sesión.
 * Permite a los usuarios autenticarse utilizando su nombre o correo electrónico y contraseña.
 * Genera un token JWT si las credenciales son correctas.
 * 
 * @async
 * @function /login
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene las credenciales.
 * @param {string} req.body.nameOrEmail - Nombre de usuario o correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el token JWT si la autenticación es exitosa, o un mensaje de error si falla.
 */
router.post('/login', async (req, res) => {
  const { nameOrEmail, password } = req.body;

  // Validación de los campos de entrada
  if (!nameOrEmail || !password) return res.status(400).json({ error: 'Faltan datos.' });

  try {
    // Busca al usuario tanto por nombre como por email
    const userQuery = await db.collection('users')
      .where('name', '==', nameOrEmail)
      .get();

    // Si no se encuentra por nombre, buscar por email
    if (userQuery.empty) {
      const emailQuery = await db.collection('users')
        .where('email', '==', nameOrEmail)
        .get();

      // Si no se encuentra ningún documento, retornar error de credenciales
      if (emailQuery.empty) return res.status(401).json({ error: 'Credenciales incorrectas' });
      
      const userDoc = emailQuery.docs[0];
      const userData = userDoc.data();

       // Comparar contraseñas usando bcrypt
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales incorrectas' });

      // Generar token JWT si las credenciales son válidas
      const token = jwt.sign(
        { name: userData.name, id: userDoc.id, rol: userData.rol, standID: userData.standId },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    } else {
      // Usuario encontrado por nombre
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      // Comparar contraseñas usando bcrypt
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales incorrectas' });

      // Generar token JWT si las credenciales son válidas
      const token = jwt.sign(
        { name: userData.name, id: userDoc.id, rol: userData.rol, standID: userData.standId },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error en login:', error);
    res.status(500).send('Error en servidor');
  }
});

module.exports = router;
