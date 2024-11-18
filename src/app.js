/**
 * @file app.js - Configuración principal de la aplicación.
 * Configura el servidor Express, establece las rutas y el middleware de errores.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const { db } = require('./config/firebaseConfig');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const companyRoutes = require('./routes/company');
const videoRoutes = require('./routes/video');
const offersRoutes = require('./routes/offers');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middleware para habilitar CORS, parseo de JSON y cookies
app.use(cors({
  origin: 'http://localhost:4200', // Cambia por el dominio del frontend en producción
  credentials: true, // Permitir envío de cookies
}));
app.use(express.json());
app.use(cookieParser()); // Parseo de cookies

/**
 * Configuración de rutas de la aplicación.
 * 
 * @name Rutas
 * @memberof app.js
 * @description Define las rutas de la aplicación, cada una asignada a un archivo específico en la carpeta de rutas.
 */
app.use('/auth', authRoutes);      // Rutas de autenticación
app.use('/users', userRoutes);      // Rutas para usuarios
app.use('/company', companyRoutes); // Rutas para empresas
app.use('/videos', videoRoutes);    // Rutas para videos
app.use('/offers', offersRoutes);   // Rutas para ofertas

// Middleware de manejo de errores
app.use(errorMiddleware); // Usa el middleware de errores personalizado

// Configuración del puerto y inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
