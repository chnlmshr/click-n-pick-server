const serviceAccount = {
  "type": "service_account",
  "project_id": "click-n-pick-117fb",
  "private_key_id": "c7e1b192bfc41a988e249bea4ef21fd064dc4c6c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCOTfbYBQUQsJt\nUB1HOlyll3AR/K27rcLa2ELcwdk05ZkHVTUkSiUg6nCy6oH4ppmEbshEKIlK063t\n8lCFSnFx1jBWV9/J/S1VgUh2SGb0wDWLndvtiq+hh++eUC3eZdUAt3EJs1Op4gN+\ncEeBAibkEIkImjd11Ms41THOIsMiTuzijORarLwLIikoKHEBtZNjhlmRfWBrSHvi\nDEQ4jofGWXkPKRO6z3LZCHUBZZliOC9NaGLbmbcwA8GcRD5RQ7Sn/bkRSY37Ul1g\nOIZ3n5kwXWrX/pC6r7ffE34TxFZL51SqL9lKfkROt1H2MrHDzaOK3psspSLB85YX\nw08UwU/tAgMBAAECggEAAqlKDKV6YPSxOVI5tHomPtaeYIC32LR+0QTZlbDKSyFC\nQYl3WvHxJExSEwGHmmKeA+SItfZgOzg/T91cIRduCoNG0kgN9vSTJHLLDWPclUn0\n8d7N3qlh0rLMI70xg7SdgI8C64Ebil5gceET+b6Pzdw0JHwIeoLZ7gNt1UdAqT2p\nfW2WOJPadWW4suM7uWzeUAobXYJFpMNnm/5icfvm22Gmkek9LKdgYt1Q2u5u6trB\n3dshq33nqVqt/awrMH3sbhIriA68FZ0bMCNw6SX1SzDBxJqeff0KxNGNLU71Zel6\nGgibVpUhFIfebV6uCvP35jKa3iFbdt9/lz4jlYr5uQKBgQDuZX6kpc8O7ByRHvXU\n8dOVsO4bSZqNfAlpkvky/h/P/0O+fxJBXa6NSXIeagl5qD8pzZVOdoZCL27DPrXD\n1bKAXA5vG3MyopPC7IYKSW+xxHLhJaLAaumTP8zDWgIWqEHXp8fSehdZEYrR9G7c\nnndb/9GVw4AUnwrEx5Nym76PEwKBgQDQkLRDppdAb1zM4wRApjwmfXNaU/ZzbGG+\nqt8O17JTonM/iLtJjpMzmoFSh5kseRFVJXSRpsPgZxzgnfBMrpBfD1O/6u2xV0PK\nj3Sb8O7HvEsw70FGKSLc0n+/Cq6pcKcx42p8f05/k5Ek/70ofkc2ZCL0GLBJ7+Qf\nyJEfRYmE/wKBgQCAdSxCqB3kmpHiGN66efxbItWK2qRvLLEdtFaXhZu6xn/IfExn\n8IUIGNVnUhf8+A3hBqg3eWJq84gpqPbkqZff1rroX9A5LqWUWUL49A09qu+EJnWG\nXZWzBKPfd/a8Iron7H6eCa/fDLbS33WFZ9ZFOpnCq2+urOxukGQBU67hBQKBgQCo\naoE2M7rlbEe6pwLTFalyx1CzuyNC110isyZF/QViJcb8ofPilP/m5rfRJfAZinXl\nlMZJqyl29qzJ8J+PvFKWgHD3g8SGtNnoIuld1zNqFHF/RWQnPKaLPGutn/mkl3Rb\ng7GEcOS5fjbxcpWTskzc7gWPqLQKMG29AJ+3adZ/jwKBgFwyXW0PRfbyO0XC+f0L\n6oiffbyh4sifQiTRSOH4BV59Bof88zeNnYiFKXbwJq2idEoZ9y1XDe6jC3cHRdAS\nTJ7lUFpPLDqzTH+DP6FGq1/ma0pW/h+zk9U2Bba77/deBPJVyT7K2AVip2XXTUVi\nxbVNav+twr7KNzqa0rlbSWDM\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-due7q@click-n-pick-117fb.iam.gserviceaccount.com",
  "client_id": "109678864829309101004",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-due7q%40click-n-pick-117fb.iam.gserviceaccount.com"
};

const firebaseAdmin = require("firebase-admin"),
  { cert } = require("firebase-admin/app"),
  // serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  firebaseApp = firebaseAdmin.initializeApp({
    credential: cert(serviceAccount),
  });

module.exports = async (token) => {
  const payload = await firebaseAdmin.auth().verifyIdToken(token);
  return payload;
};
