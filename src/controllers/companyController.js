/**
 * @module CompanyController
 */
const { db } = require('../config/firebaseConfig');

/**
 * Agrega una nueva empresa a la base de datos.
 * Valida los datos de entrada y crea un nuevo documento en la colección "company".
 * 
 * @async
 * @function addInfoCompany
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario extraída del token.
 * @param {Object} req.body - Datos enviados en el cuerpo de la solicitud.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito y ID de la empresa creada.
 */
const addInfoCompany = async (req, res) => {
    try {
        const { id, rol } = req.user;
        const { name, description, additional_information, documents, links, sector, email } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Nombre y descripción son obligatorios' });
        }

        const validLinks = links && links.every(link => link.additionalButtonTitle && link.additionalButtonLink);
        if (!validLinks) {
            return res.status(400).json({ message: 'Cada link debe tener un título y una URL válida' });
        }

        const companyID = rol === 'co' ? id : req.body.companyID;

        const newCompany = {
            name,
            description,
            additional_information: additional_information || "",
            companyID,
            email,
            sector,
            documents: documents || [],
            link: links || [],
        };

        const companyRef = await db.collection('company').add(newCompany);

        return res.status(201).json({
            message: 'Empresa añadida con éxito',
            id: companyRef.id,
        });
    } catch (error) {
        console.error("Error al agregar la empresa: ", error);
        return res.status(500).json({
            message: 'Error al agregar la empresa',
            error: error.message,
        });
    }
};

/**
 * Asocia un stand y un recepcionista a una empresa.
 * Actualiza o crea un documento en la colección "stand" con los datos proporcionados.
 * 
 * @async
 * @function addStandAndRecep
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario extraída del token.
 * @param {Object} req.body - Datos enviados en el cuerpo de la solicitud.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con mensaje de éxito.
 */
const addStandAndRecep = async (req, res) => {
    try {
        const { id, rol, standID } = req.user;
        const { URLStand, URLRecep } = req.body;

        if (!URLStand || !URLRecep) {
            return res.status(400).json({ message: 'Hay que seleccionar un Stand y un Recepcionista' });
        }

        const companyID = rol === 'co' ? id : req.body.companyID;

        const newStand = {
            companyID,
            URLRecep,
            URLStand
        };
        
        const standRef = db.collection('stand').doc(standID);
        await standRef.set(newStand); 

        return res.status(200).json({message: 'Stand y Recepcionista guardados correctamente'});
    } catch (error) {
        console.error("Error al agregar el stand y el recepcionista: ", error);
        return res.status(500).json({ message: 'Error interno del servidor'})
    }
}

/**
 * Obtiene la información de la empresa según el ID del usuario.
 * Solo los usuarios con rol `co` pueden acceder a esta información.
 * 
 * @async
 * @function getCompanyInfo
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.user - Información del usuario extraída del token.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con la información de la empresa.
 */
const getCompanyInfo = async (req, res) => {
    try {
      const { id, rol } = req.user;
  
      if (rol !== 'co') {
        return res.status(403).json({ message: 'Acceso denegado. No eres una empresa.' });
      }
  
      const companyQuery = await db.collection('company').where('companyID', '==', id).get();
  
      if (companyQuery.empty) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
  
      const companyDoc = companyQuery.docs[0];
      const companyData = companyDoc.data();
  
      return res.status(200).json(companyData);
    } catch (error) {
      console.error('Error al obtener la empresa:', error);
      return res.status(500).json({
        message: 'Error al obtener la empresa',
        error: error.message,
      });
    }
  };

module.exports = { addInfoCompany, addStandAndRecep, getCompanyInfo };
