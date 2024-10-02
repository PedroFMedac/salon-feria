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

// Obtener usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el documento del usuario por su ID
    const userDoc = await admin.firestore().collection('usuarios').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userData = userDoc.data();
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error obteniendo el usuario por ID:', error);
    res.status(500).json({ error: 'Error obteniendo el usuario' });
  }
};

// Editar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const userRef = admin.firestore().collection('usuarios').doc(id);

    // Verificar si el usuario existe
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar el usuario con los nuevos datos
    await userRef.update(updatedData);
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error actualizando el usuario' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userRef = admin.firestore().collection('usuarios').doc(id);

    // Verificar si el usuario existe
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el documento del usuario
    await userRef.delete();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando el usuario' });
  }
};


module.exports = { getAllUsers, createUser, deleteUser,  updateUser,  getUserById };


