// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send('Token no proporcionado');

  const token = authHeader.split(' ')[1];  // Extraer token del header
  if (!token) return res.status(403).send('Token no proporcionado');

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');

    const userDoc = await db.collection('usuarios').doc(decoded.id).get();
    if (!userDoc.exists) return res.status(404).send('Usuario no encontrado');

    req.user = decoded;  // Añade los datos del usuario decodificado al request
    next();
  });
}

module.exports = { verifyToken };