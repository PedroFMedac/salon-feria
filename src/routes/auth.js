// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { nameOrEmail, password } = req.body;
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

      if (emailQuery.empty) return res.status(401).json({ error: 'Credenciales incorrectas' });
      const userDoc = emailQuery.docs[0];
      const userData = userDoc.data();

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales incorrectas' });

      // Generar token JWT
      const token = jwt.sign({ noame: userData.name, id: userDoc.id, rol: userData.rol }, process.env.SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales incorrectas' });

      // Generar token JWT
      const token = jwt.sign({ name: userData.name, id: userDoc.id, rol: userData.rol }, process.env.SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error en servidor');
  }
});
module.exports = router;
