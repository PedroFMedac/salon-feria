/**
 * @module AuthMiddleware
 */
const jwt =  require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');

/**
 * Middleware para verificar el token JWT y extraer información del usuario.
 * Evita consultas redundantes a Firestore si el token ya contiene la información necesaria.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Siguiente middleware.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        // Asigna los datos del token al objeto de solicitud
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
