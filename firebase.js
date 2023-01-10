const firebaseAdmin = require("firebase-admin"),
  { cert } = require("firebase-admin/app"),
  firebaseApp = firebaseAdmin.initializeApp({
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  });

module.exports = async (token) => {
  const payload = await firebaseAdmin.auth().verifyIdToken(token);
  return payload;
};
