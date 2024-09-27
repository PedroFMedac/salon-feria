const express = require('express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Inicializa dotenv para leer las variables de entorno
dotenv.config();

// Inicializa la aplicación de Firebase
const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pruebas-feria-web.firebaseio.com"
});

// Inicializa Firestore y configura Express
const db = admin.firestore();
const app = express();
app.use(cors({
    origin: 'http://localhost:4200',  // Permite solicitudes desde tu frontend local
    methods: 'GET,POST,PUT,DELETE',   // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization',  // Cabeceras permitidas
    credentials: true  // Habilitar el envío de cookies/sesiones si es necesario
  }));
app.options('*', cors());
app.use(express.json());

// Ruta de inicio de sesión
app.post('/login', async (req, res, next) => {
    const { nombre, contraseña } = req.body;
    console.log('Nombre ingresado:', nombre);  // Verificar el nombre que se está enviando desde el frontend

    if (!nombre || !contraseña) {
        console.log('Faltan datos');
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Realizar una consulta en Firestore para buscar por el campo 'nombre'
        const userQuerySnapshot = await db.collection('usuarios').where('nombre', '==', nombre).get();

        // Verificar si la consulta devuelve resultados
        if (userQuerySnapshot.empty) {
            console.log('Usuario no encontrado:', nombre);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Obtenemos el primer documento que coincide con el nombre
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        console.log('Datos del usuario:', userData);

        // Comparar la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(contraseña, userData.contraseña);
        

        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Si la contraseña es válida, generar el JWT
        console.log('Contraseña correcta, generando token');
        const token = jwt.sign({ nombre, id: userDoc.id, iat: Math.floor(Date.now() / 1000) }, process.env.SECRET_KEY, { expiresIn: '1h' });

        console.log('Token generado:', token);
        res.json({ token });

    } catch (error) {
        console.error('Error durante la autenticación:', error);
        next(error);
    }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ocurrió un error inesperado. Por favor intenta de nuevo.');
});


// Ruta protegida con JWT
app.get('/protegido', verificarToken, (req, res) => {
    res.send(`Hola, ${req.user.nombre}. Esta es una ruta protegida.`);
});

// Middleware para verificar el JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Token no proporcionado');
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }

        // Aquí puedes verificar si el token es más antiguo que el último cierre de sesión
        const userDoc = await db.collection('usuarios').doc(decoded.nombre).get();
        const userData = userDoc.data();

        if (userData.lastLogout && decoded.iat < Math.floor(userData.lastLogout / 1000)) {
            return res.status(401).send('Token ha sido invalidado');
        }

        req.user = decoded;
        next();
    });
}


// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
