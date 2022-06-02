const { initializeApp, cert } = require("firebase-admin/app"),
  { getAuth } = require("firebase/auth"),
  serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });

module.exports = async (token) => {
  const payload = await getAuth(adminApp).verifyIdToken(token);
  return payload.uid;
};
