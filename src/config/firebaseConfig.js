// config/firebaseConfig.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://palacio-de-ferias.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };
