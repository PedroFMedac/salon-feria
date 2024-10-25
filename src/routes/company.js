// routes/users.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const  companyController  = require('../controllers/companyController');

// Solo las empresas pueden crear informacion adicional
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es empresa, pasa a la función de crear usuario
}, companyController.addInfoCompany);

router.post('/addStanAndRecep', verifyToken, (req, res, next) => {
    if (req.user.rol !== 'co') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next(); // Si es empresa, pasa a la función de crear usuario
    },  companyController.addStandAndRecep);

router.get('/getCompany', verifyToken, companyController.getCompanyInfo);

module.exports = router;