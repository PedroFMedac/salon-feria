// routes/users.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const  videoController  = require('../controllers/videoController.js');

router.post ('/', verifyToken, (req,res, next) =>{
    if(req.user.rol !== 'co'){
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
}, videoController.addVideo);

router.get ('/', verifyToken, (req,res, next) =>{
    if(req.user.rol !== 'co'){
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
}, videoController.getVideo);

module.exports = router;