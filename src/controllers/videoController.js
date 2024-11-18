/**
 * @module VideoController
 */
const { db } =  require('../config/firebaseConfig');

/**
 * Agrega un nuevo video.
 * Incluye el ID de la empresa y la URL del video.
 * 
 * @async
 * @function addVideo
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario.
 * @param {Object} req.body - Datos del video.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito y ID del video creado.
 */
const addVideo = async (req, res) => {
    try {
        const { id, rol } = req.user;
        const { url } = req.body;

        const companyID = rol === 'co' ? id : req.body.companyID;

        const newVideo = {
            url,
            companyID
        };

        const videoRef = await db.collection('video').add(newVideo);

        return res.status(201).json({
            message: 'Video añadido con éxito',
            id: videoRef.id
        });
    } catch (error) {
        console.error("Error al agregar video", error);
        return res.status(500).json({
            message: 'Error al agregar video',
            error: error.message
        });
    }
};

/**
 * Obtiene todos los videos.
 * 
 * @async
 * @function getVideo
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con los videos disponibles.
 */
const getVideo = async (req, res) => {
    try {
        const videosSnapshot = await db.collection('video').get();
        const videos = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.status(200).json(videos);

    } catch (error) {
        console.error("Error al obtener video", error);
        return res.status(500).json({
            message: 'Error al obtener video',
            error: error.message
        });
    }
};

module.exports = { addVideo, getVideo };
