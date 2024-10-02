// routes/users.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/', verifyToken, userController.createUser);
router.get('/', verifyToken, userController.getAllUsers);
router.delete('/:id', verifyToken, userController.deleteUser);
router.put('/:id', verifyToken, userController.updateUser);
router.get('/:id', verifyToken,  userController.getUserById);


module.exports = router;
