/**
 * @module OffersController
 */
const { db } = require('../config/firebaseConfig');

/**
 * Agrega una nueva oferta de trabajo.
 * Incluye información de la empresa según el ID y guarda en Firestore.
 * 
 * @async
 * @function addOffers
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario.
 * @param {Object} req.body - Datos de la oferta.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito y ID de la oferta creada.
 */
const addOffers = async (req, res) => {
    try {
        const { id, rol } = req.user;
        const { position, workplace_type, location, job_type, description } = req.body;

        const companyID = rol === 'co' ? id : req.body.companyID;

        if (!position || !location || !description) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Obtener la información de la empresa usando el companyID
        const companySnapshot = await db.collection('company')
            .where('companyID', '==', companyID)
            .get();

        // Obtener los datos del primer documento que coincida (si se espera solo uno)
        const companyData = companySnapshot.docs[0].data();

        const newOffer = {
            position,
            workplace_type,
            location,
            job_type,
            description,
            companyID,
            companyName: companyData.name,
            createdAt: new Date().toISOString()
        };

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

/**
 * Obtiene las ofertas de trabajo por ID de empresa.
 * 
 * @async
 * @function getOffersById
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario.
 * @param {Object} req.body - Datos de la solicitud.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con las ofertas de la empresa.
 */
const getOffersById = async (req, res) => {
    try {
        const { id, rol } = req.user;

        

        const userId = rol === 'co' ? id : req.body.companyID;

        console.log('Datos enviados al backend:', { id: this.id });


        if (!userId) {
            return res.status(400).json({ message: 'El ID es obligatorio' });
        }

        const offersSnapshot = await db.collection('offers').where('companyID', '==', id).get();

        if (offersSnapshot.empty) {
            return res.status(404).json({ message: 'No se encontraron ofertas para este ID' });
        }

        const offers = offersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(offers);

    } catch (error) {
        console.error("Error al obtener ofertas:", error);
        return res.status(500).json({
            message: 'Error al obtener ofertas',
            error: error.message
        });
    }
};

/**
 * Elimina una oferta de trabajo por ID.
 * 
 * @async
 * @function deleteOfferById
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {string} req.params.id - ID de la oferta a eliminar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito o error.
 */
const deleteOfferById = async (req, res) => {
    try {
        const offerId = req.params.id;

        await db.collection('offers').doc(offerId).delete();

        return res.status(200).json({ message: 'Oferta eliminada con éxito' });

    } catch (error) {
        console.error("Error al eliminar oferta:", error);
        return res.status(500).json({
            message: 'Error al eliminar oferta',
            error: error.message
        });
    }
};

/**
 * Actualiza una oferta de trabajo por ID.
 * 
 * @async
 * @function updateOfferById
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {string} req.params.id - ID de la oferta a actualizar.
 * @param {Object} req.body - Datos actualizados de la oferta.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito o error.
 */
const updateOfferById = async (req, res) => {
    try {
        const offerId = req.params.id;
        const { position, workplace_type, location, job_type, description } = req.body;

        const updatedData = {
            ...(position && { position }),
            ...(workplace_type && { workplace_type }),
            ...(location && { location }),
            ...(job_type && { job_type }),
            ...(description && { description }),
            updatedAt: new Date().toISOString()
        };

        await db.collection('offers').doc(offerId).update(updatedData);

        return res.status(200).json({ message: 'Oferta actualizada con éxito' });

    } catch (error) {
        console.error("Error al actualizar oferta:", error);
        return res.status(500).json({
            message: 'Error al actualizar oferta',
            error: error.message
        });
    }
};

module.exports = { addOffers, getOffersById, deleteOfferById, updateOfferById };