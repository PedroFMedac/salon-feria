const express = require ('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const  offersController  = require('../controllers/offersController.js');

router.post('/', verifyToken, (req,res,next)=>{
    if(req.user.rol !== 'co'){
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
}, offersController.addOffers);

router.get('/by-id', verifyToken, offersController.getOffersById);

module.exports = router;