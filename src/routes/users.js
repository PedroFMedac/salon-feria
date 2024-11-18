/**
 * @module UsersRoutes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

/**
 * Ruta para crear un nuevo usuario.
 * Solo los usuarios  con rol de "administrador" pueden acceder a esta ruta.
 * 
 * @name POST /
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Cookies enviadas por el cliente.
 * @param {string} req.cookies.token - Token JWT almacenado en la cookie.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si el usuario es creado, o un mensaje de error en caso de acceso denegado.
 */
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si el rol es "admin", permite la creación del usuario
}, userController.createUser);

/**
 * Ruta para eliminar un usuario por su ID.
 * Solo los usuarios con rol de "administrador" pueden acceder a esta ruta.
 * 
 * @name DELETE /:id
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Cookies enviadas por el cliente.
 * @param {string} req.cookies.token - Token JWT almacenado en la cookie.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si el usuario es eliminado, o un mensaje de error en caso de acceso denegado.
 */
router.delete('/:id', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si el rol es "admin", permite la eliminación del usuario
}, userController.deleteUser);

/**
 * Ruta para actualizar la información de un usuario por su ID.
 * Solo el propio usuario o un administrador pueden acceder a esta ruta.
 * 
 * @name PUT /:id
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Cookies enviadas por el cliente.
 * @param {string} req.cookies.token - Token JWT almacenado en la cookie.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.uid - ID del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si el usuario es actualizado, o un mensaje de error en caso de acceso denegado.
 */
router.put('/:id', verifyToken, (req, res, next) => {
    if (req.user.uid !== req.params.id && req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Permite la actualización si es el mismo usuario o un administrador
}, userController.updateUser);

/**
 * Ruta para obtener todos los usuarios.
 * Todos los roles autenticados pueden acceder a esta ruta.
 * 
 * @name GET /
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Cookies enviadas por el cliente.
 * @param {string} req.cookies.token - Token JWT almacenado en la cookie.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con la lista de usuarios.
 */
router.get('/', verifyToken, userController.getAllUsers);

/**
 * Ruta para obtener la información de un usuario por su ID.
 * Todos los usuarios autenticados pueden acceder a esta ruta para ver su propia información.
 * 
 * @name GET /:id
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.cookies - Cookies enviadas por el cliente.
 * @param {string} req.cookies.token - Token JWT almacenado en la cookie.
 * @param {string} req.params.id - ID del usuario a obtener.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con los datos del usuario.
 */
router.get('/:id', verifyToken, userController.getUserById);

module.exports = router;
