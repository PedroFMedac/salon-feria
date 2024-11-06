const { db } = require('../config/firebaseConfig');

const addOffers = async (req, res) => {
    try {
        // Desestructuramos req.user y req.body para mayor claridad
        const { id, rol } = req.user;
        const { position, workplace_type, location, job_type, description} = req.body;

        // Asignamos companyID dependiendo del rol del usuario
        const companyID = rol === 'co' ? id : req.body.companyID;
        
        // Validamos campos obligatorios
        if (!position || !location || !description) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Estructura de datos de la nueva oferta
        const newOffer = {
            position,
            workplace_type,
            location,
            job_type,
            description,
            companyID,
            createdAt: new Date().toISOString() // Añadimos fecha de creación para seguimiento
        };

        // Agregamos la oferta a Firestore y esperamos su resultado
        const offersRef = await db.collection('offers').add(newOffer);

        return res.status(201).json({
            message: 'Oferta añadida con éxito',
            id: offersRef.id
        });

    } catch (error) {
        console.error("Error al agregar oferta", error);
        return res.status(500).json({
            message: 'Error al agregar oferta',
            error: error.message
        });
    }
};

const getOffersById = async (req, res) => {
    try {
        const { id, rol } = req.user; // Extraemos el rol y el id del token

        // Determinamos el userId según el rol
        const userId = rol === 'co' ? id : req.body.id;

        // Si no se proporciona el userId, devolvemos un error
        if (!userId) {
            return res.status(400).json({ message: 'El ID es obligatorio' });
        }

        // Consulta en Firestore para obtener las ofertas según el companyID
        const offersSnapshot = await db.collection('offers').where('companyID', '==', userId).get();

        // Verificamos si no se encontraron ofertas
        if (offersSnapshot.empty) {
            return res.status(404).json({ message: 'No se encontraron ofertas para este ID' });
        }

        // Mapeamos las ofertas a un array
        const offers = offersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Enviamos la lista de ofertas como respuesta
        return res.status(200).json(offers);

    } catch (error) {
        console.error("Error al obtener ofertas:", error);
        return res.status(500).json({
            message: 'Error al obtener ofertas',
            error: error.message
        });
    }
};

module.exports = { addOffers, getOffersById };
