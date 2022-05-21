import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);

//si eso es cero tiene que concetarse, si ya se conecto va a ser 1 y no se va a conectar
// if (admin.app.length == 0) {
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// }

const firestore = admin.firestore();
export { firestore };
