// middlewares/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ocurrió un error inesperado. Por favor intenta de nuevo.');
};

module.exports = errorHandler;
