/**
 * @module UsersRoutes
 */
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');

/**
 * Ruta para crear información adicional de la empresa.
 * Solo los usuarios con rol de "empresa" (`co`) pueden acceder a esta ruta.
 * 
 * @name POST /
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si se crea la información adicional, o un mensaje de error en caso de acceso denegado.
 */
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es empresa, pasa a la función de crear usuario
}, companyController.addInfoCompany);

/**
 * Ruta para agregar stand y recepcionista a la empresa.
 * Solo los usuarios con rol de "empresa" (`co`) pueden acceder a esta ruta.
 * 
 * @name POST /addStanAndRecep
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} JSON con un mensaje de éxito si se agregan el stand y recepcionista, o un mensaje de error en caso de acceso denegado.
 */
router.post('/addStanAndRecep', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es empresa, pasa a la función de agregar stand y recepcionista
}, companyController.addStandAndRecep);

/**
 * Ruta para obtener información de la empresa.
 * Solo los usuarios autenticados pueden acceder a esta ruta.
 * 
 * @name GET /getCompany
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.rol - Rol del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con la información de la empresa, o un mensaje de error si ocurre algún problema.
 */
router.get('/getCompany', verifyToken, companyController.getCompanyInfo);

/**
 * Ruta para verificar el estado de los formularios de la empresa.
 * Solo los usuarios autenticados pueden acceder a esta ruta.
 * 
 * @name GET /company/status
 * @function
 * @memberof module:UsersRoutes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario autenticado.
 * @param {string} req.user.id - ID del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de los formularios (stand y adicional), o un mensaje de error si ocurre algún problema.
 */
router.get('/status', verifyToken, companyController.getCompanyStatus);

module.exports = router;
