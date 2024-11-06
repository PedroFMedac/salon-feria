/**
 * @module UsersRoutes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const videoController = require('../controllers/videoController.js');

/**
 * Ruta para agregar un nuevo video.
 * Solo los usuarios con rol de "empresa" (`co`) pueden acceder a esta ruta.
 * 
 * @name POST /
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si el video es agregado, o un mensaje de error en caso de acceso denegado.
 */
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Permite la adición de video si el usuario tiene rol "co"
}, videoController.addVideo);

/**
 * Ruta para obtener los videos de la empresa.
 * Solo los usuarios con rol de "empresa" (`co`) pueden acceder a esta ruta.
 * 
 * @name GET /
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con los videos de la empresa, o un mensaje de error en caso de acceso denegado.
 */
router.get('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Permite la obtención de videos si el usuario tiene rol "co"
}, videoController.getVideo);

module.exports = router;
