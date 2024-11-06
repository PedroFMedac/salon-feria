/**
 * @module ErrorMiddleware
 */

/**
 * Middleware para manejar errores en la aplicación.
 * Captura errores inesperados, registra la pila de errores en la consola
 * y envía una respuesta genérica al cliente con un código de estado 500.
 * 
 * @function errorHandler
 * @param {Object} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} Respuesta JSON con un mensaje de error y un código de estado 500.
 */
const errorHandler = (err, req, res, next) => {
    // Registrar el error en la consola
    console.error(err.stack);

    // Responder con un mensaje de error genérico al cliente
    res.status(500).send('Ocurrió un error inesperado. Por favor intenta de nuevo.');
};

module.exports = errorHandler;
