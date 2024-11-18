/**
 * @file app.js - Configuración principal de la aplicación.
 * Configura el  servidor Express, establece las rutas y el middleware de errores.
 */

const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebaseConfig');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const companyRoutes = require('./routes/company');
const videoRoutes = require('./routes/video');
const offersRoutes = require('./routes/offers');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middleware para habilitar CORS y parseo de JSON
app.use(cors());
app.use(express.json());

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
