// controllers/userController.js
const {admin, db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const createUser = async (req, res) => {
  const { name, email, password, rol, company, cif, dni, studies } = req.body;

  // Validar que todos los campos esenciales estén presentes
  if (!name || !email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  // Validar que el rol sea uno de los permitidos
  const rolesPermitidos = ['admin', 'co', 'visitor'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: 'El rol no es válido.' });
  }

  try {
    // Verificar que el correo no esté en uso
    const usersSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!usersSnapshot.empty) {
      return res.status(400).json({ error: 'El correo ya está en uso.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Preparar el objeto de datos del usuario basado en el rol
    let userData = {
      name,
      email,
      password: hashedPassword,
      rol,
      createdAt: admin.firestore.Timestamp.now() // Usando el Timestamp de Firestore
    };

    // Si el rol es 'co', añadimos los campos de empresa, stand y cif
    if (rol === 'co') {
      if (!company || !cif) {
        return res.status(400).json({ error: 'Faltan campos de empresa, stand y/o CIF para el CO.' });
      }
      userData.company = company;
      userData.standId = uuidv4();
      userData.cif = cif;
    }

    // Si el rol es 'visitante', añadimos los campos de dni y estudios
    if (rol === 'visitor') {
      if (!dni || !studies) {
        return res.status(400).json({ error: 'Faltan campos de DNI y/o estudios para el visitante.' });
      }
      userData.dni = dni;
      userData.studies = studies;
    }

    // Crear el documento en Firestore con un ID generado automáticamente
    const userRef = await db.collection('users').add(userData);

    // Devolver respuesta de éxito con el ID del usuario
    res.status(201).json({ message: 'Usuario creado exitosamente.', id: userRef.id });
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};


// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const usersRef = admin.firestore().collection('users');
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
    const userDoc = await admin.firestore().collection('users').doc(id).get();

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
    const userRef = admin.firestore().collection('users').doc(id);

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
    const userRef = admin.firestore().collection('users').doc(id);

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


