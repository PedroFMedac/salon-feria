
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRoutes = require ('./routes/auth');
const usersRoutes = require('./routes/users');
const designRoutes = require ('./routes/design');
const fileRoutes = require('./routes/file');
const informationRoutes = require ('./routes/information');
const offersRoutes = require ('./routes/offers');
const videoRoutes = require ('./routes/video');

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:4200','http://localhost:3000'], // Dirección de tu frontend
    credentials: true // Necesario si trabajas con cookies
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/design', designRoutes);
app.use('/file', fileRoutes);
app.use('/information', informationRoutes);
app.use('/offers', offersRoutes);
app.use('/video', videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

