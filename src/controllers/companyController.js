// controllers/companyController.js

const { db } = require('../config/firebaseConfig');

// Controlador para agregar una nueva empresa a la colección "company"
const addInfoCompany = async (req, res) => {
    try {

        const { id, rol, nombre } = req.user;
        const { name, description, additional_information, documents, links, sector, email } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Nombre y descripción son obligatorios' });
        }

        if (links && !Array.isArray(links)) {
            return res.status(400).json({ message: 'El campo links debe ser un array de objetos' });
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

//Controlador para asociar un STAND y un RECEP. a una empresa

const addStandAndRecep = async (req, res) => {

    try {
        const { id, rol, nombre, standID } = req.user;
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
        // Guarda o actualiza el documento en la colección "stand" con el ID proporcionado
        const standRef = db.collection('stand').doc(standID);
        await standRef.set(newStand);  // set() crea o actualiza el documento

        return res.status(200).json({message: 'Stand y Recepcionista guardados correctamente'});
    }catch(error){
        console.error("Error al agregar el stand y el recepcionista: ", error);
        return res.status(500).json({ message: 'Error interno del servidor'})
    }
}

const getCompanyInfo = async (req, res) => {
    try {
      const { id, rol } = req.user; // Obtenemos el companyID del token JWT
  
      if (rol !== 'co') {
        return res.status(403).json({ message: 'Acceso denegado. No eres una empresa.' });
      }
  
      // Consulta a Firestore para obtener el documento donde el campo companyID coincide con el token
      const companyQuery = await db.collection('company').where('companyID', '==', id).get();
  
      if (companyQuery.empty) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
  
      // Asumimos que solo hay un documento que coincide con el companyID
      const companyDoc = companyQuery.docs[0];
      const companyData = companyDoc.data();
  
      return res.status(200).json(companyData); // Devolvemos la información de la empresa
    } catch (error) {
      console.error('Error al obtener la empresa:', error);
      return res.status(500).json({
        message: 'Error al obtener la empresa',
        error: error.message,
      });
    }
  };

module.exports = { addInfoCompany, addStandAndRecep, getCompanyInfo };
