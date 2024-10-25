// config/firebaseConfig.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = require('/etc/secrets/palacio-de-ferias-firebase-adminsdk-k83w1-39fe943ebb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://palacio-de-ferias.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };
