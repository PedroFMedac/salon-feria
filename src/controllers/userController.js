// controllers/userController.js
const {admin, db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  if (!nombre || !email || !contraseña || !rol) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    const userDoc = await db.collection('usuarios').doc(nombre).get();
    if (userDoc.exists) return res.status(400).json({ error: 'El nombre de usuario ya existe.' });

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await db.collection('usuarios').doc(nombre).set({
      nombre,
      email,
      contraseña: hashedPassword,
      rol,
      createdAt: new Date(),
    });
    res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const usersRef = admin.firestore().collection('usuarios');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

module.exports = { getAllUsers, createUser};
