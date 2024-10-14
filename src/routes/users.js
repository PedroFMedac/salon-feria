// routes/users.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Solo los administradores pueden crear usuarios
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es admin, pasa a la función de crear usuario
  }, userController.createUser);
  
  // Solo los administradores pueden eliminar usuarios
  router.delete('/:id', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es admin, pasa a la función de eliminar usuario
  }, userController.deleteUser);
  
  // Otros usuarios pueden leer y actualizar su información propia
  router.put('/:id', verifyToken, (req, res, next) => {
    if (req.user.uid !== req.params.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es el mismo usuario o un admin, puede actualizar
  }, userController.updateUser);
  
  router.get('/', verifyToken, userController.getAllUsers); // Todos los roles pueden obtener usuarios
  router.get('/:id', verifyToken, userController.getUserById); // Todos pueden obtener sus datos

module.exports = router;
