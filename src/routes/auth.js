/**
 * @module AuthRoutes
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const { get, set } = require('../util/cacheManager');

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

  if (!nameOrEmail || !password) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    const cachedUser = get(nameOrEmail);

    let userData;

    if (cachedUser) {
      userData = cachedUser;
    } else {
      const userQuery = await db.collection('users').where('name', '==', nameOrEmail).get();

      if (userQuery.empty) {
        const emailQuery = await db.collection('users').where('email', '==', nameOrEmail).get();

        if (emailQuery.empty) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        userData = emailQuery.docs[0].data();
      } else {
        userData = userQuery.docs[0].data();
      }

      set(nameOrEmail, userData, 3600); // Almacenar en caché
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { name: userData.name, id: userData.id, rol: userData.rol },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error en servidor');
  }
});

module.exports = router;

