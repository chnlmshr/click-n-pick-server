const firebaseAdmin = require("firebase-admin"),
  { cert } = require("firebase-admin/app"),
  serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  firebaseApp = firebaseAdmin.initializeApp({
    credential: cert(serviceAccount),
  });

module.exports = async (token) => {
  const payload = await firebaseAdmin.auth().verifyIdToken(token);
  return payload;
};
