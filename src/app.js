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
    databaseURL: "https://palacio-de-ferias.firebaseio.com"
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
        const token = jwt.sign(
            {
                nombre,
                id: userDoc.id,
                rol: userData.rol,
                iat: Math.floor(Date.now() / 1000)
            }
            , process.env.SECRET_KEY, { expiresIn: '1h' });

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

// Ruta para crear Usuarios
app.post('/users', verificarToken, async (req, res, next) => {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña || !rol) {
        return res.status(400).json({ error: 'Faltan datos.' });
    }

    try {
        // Verificar si el usuario tiene rol de admin
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado, se requiere rol de administrador.' });
        }

        // Buscar si ya existe un usuario con ese nombre
        const userDoc = await db.collection('usuarios').doc(nombre).get();
        if (userDoc.exists) {
            return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear un nuevo documento con el nombre de usuario como ID
        await db.collection('usuarios').doc(nombre).set({
            nombre,
            email,
            contraseña: hashedPassword,
            rol,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario.' });
    }
});

// Ruta para obtener usuarios (protegida y solo accesible por administradores)
app.get('/users', verificarToken, async (req, res) => {
    try {
        // Verificar si el usuario tiene rol de admin
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado, se requiere rol de administrador.' });
        }

        // Obtener todos los usuarios de Firestore
        const usersSnapshot = await db.collection('usuarios').get();
        const users = [];

        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
});

// Ruta protegida con JWT
app.get('/protegido', verificarToken, (req, res) => {
    res.send(`Hola, ${req.user.nombre}. Esta es una ruta protegida.`);
});

// Middleware para verificar el JWT
// Middleware para verificar el JWT
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).send('Token no proporcionado');
    }

    // El token debe venir con el prefijo "Bearer "
    const token = authHeader.split(' ')[1];  // Extraer el token de "Bearer <token>"

    if (!token) {
        return res.status(403).send('Token no proporcionado');
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }

        try {
            // Verificar si el usuario existe en la base de datos
            const userDoc = await db.collection('usuarios').doc(decoded.id).get();
            const userData = userDoc.data();

            if (!userData) {
                return res.status(404).send('Usuario no encontrado');
            }

            // Verificar si el token es válido respecto a la última vez que el usuario cerró sesión
            if (userData.lastLogout && decoded.iat < Math.floor(userData.lastLogout / 1000)) {
                return res.status(401).send('Token ha sido invalidado');
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error('Error al verificar el usuario en la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }
    });
}



// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
