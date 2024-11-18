/**
 * @module UserController
 */

const { admin, db } =  require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * Crea un nuevo usuario en la base de datos.
 * Valida los datos de entrada, verifica que el correo no esté en uso,
 * hashea la contraseña y guarda los datos del usuario en Firestore.
 * 
 * @async
 * @function createUser
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene los datos del usuario.
 * @param {string} req.body.name - Nombre del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario (único).
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {string} req.body.rol - Rol del usuario ('admin', 'co' o 'visitor').
 * @param {string} [req.body.company] - Nombre de la empresa (requerido si el rol es 'co').
 * @param {string} [req.body.cif] - CIF de la empresa (requerido si el rol es 'co').
 * @param {string} [req.body.dni] - DNI del usuario (requerido si el rol es 'visitor').
 * @param {string} [req.body.studies] - Estudios del usuario (requerido si el rol es 'visitor').
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con un mensaje de éxito y el ID del usuario creado, o un mensaje de error.
 */
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
        return res.status(400).json({ error: 'Faltan campos de empresa y/o CIF para el CO.' });
      }
      userData.company = company;
      userData.standId = uuidv4();
      userData.cif = cif;
    }

    // Si el rol es 'visitor', añadimos los campos de dni y estudios
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

/**
 * Obtiene todos los usuarios de la base de datos.
 * 
 * @async
 * @function getAllUsers
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con una lista de todos los usuarios o un mensaje de error.
 */
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

/**
 * Obtiene un usuario por su ID.
 * 
 * @async
 * @function getUserById
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {string} req.params.id - ID del usuario a obtener.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con los datos del usuario o un mensaje de error.
 */
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

/**
 * Actualiza los datos de un usuario.
 * 
 * @async
 * @function updateUser
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {string} req.params.id - ID del usuario a actualizar.
 * @param {Object} req.body - Datos a actualizar en el usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito o de error.
 */
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

/**
 * Elimina un usuario por su ID.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {string} req.params.id - ID del usuario a eliminar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito o de error.
 */
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

module.exports = { getAllUsers, createUser, deleteUser, updateUser, getUserById };
