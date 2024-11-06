/**
 * @module OffersRoutes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const offersController = require('../controllers/offersController.js');

/**
 * Ruta para crear una nueva oferta de trabajo.
 * Solo los usuarios con rol de "empresa" (`co`) pueden acceder a esta ruta.
 * 
 * @name POST /
 * @function
 * @memberof module:OffersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si se crea la oferta, o un mensaje de error en caso de acceso denegado.
 */
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si el usuario tiene rol de "empresa", se pasa al controlador
}, offersController.addOffers);

/**
 * Ruta para obtener las ofertas de trabajo por ID de la empresa.
 * Solo los usuarios autenticados pueden acceder a esta ruta.
 * 
 * @name GET /by-id
 * @function
 * @memberof module:OffersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con las ofertas de trabajo de la empresa o un mensaje de error si ocurre algún problema.
 */
router.get('/by-id', verifyToken, offersController.getOffersById);

module.exports = router;
