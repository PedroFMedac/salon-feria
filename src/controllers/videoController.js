const { db } = require('../config/firebaseConfig');

const addVideo = async (req, res) => {
    try {
        const { id, rol } = req.user;
        const { url } = req.body;

        const companyID = rol === 'co' ? id : req.body.companyID;

        const newVideo = {
            url,
            companyID
        }

        const videoRef = await db.collection('video').add(newVideo);

        return res.status(201).json({
            message: 'Video añadido con éxito',
            id: videoRef.id
        });
    } catch (error) {
        console.error("Error al agregar  video", error);
        return res.status(500).json({
            message: 'Error al  agregar video',
            error: error.message
        })

    }
}

const getVideo =  async (req, res) => {
    try {
        const videosSnapshot = await db.collection('video').get();
        const videos = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.status(200).json(videos);

    }catch{
        console.error("Error al obtener video", error);
        return res.status(500).json({
            message: 'Error al obtener video',
            error: error.message
        })
    }
}


module.exports = {addVideo, getVideo};