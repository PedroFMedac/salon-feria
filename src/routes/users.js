// routes/users.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/', verifyToken, userController.createUser);
router.get('/', verifyToken, userController.getAllUsers);

module.exports = router;
