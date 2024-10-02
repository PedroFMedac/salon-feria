// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { nombre, contraseña } = req.body;
  if (!nombre || !contraseña) return res.status(400).json({ error: 'Faltan datos.' });

  try {
    const userQuery = await db.collection('usuarios').where('nombre', '==', nombre).get();
    if (userQuery.empty) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(contraseña, userData.contraseña);

    if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign({ nombre, id: userDoc.id, rol: userData.rol }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error en servidor');
  }
});

module.exports = router;
