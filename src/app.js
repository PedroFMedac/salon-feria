// app.js
const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebaseConfig');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Middleware de errores
app.use(errorHandler);  // Usar el middleware de errores

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
