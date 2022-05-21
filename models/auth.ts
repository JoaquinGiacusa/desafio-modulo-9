import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

export class Auth {
  ref: FirebaseFirestore.DocumentData;
  data: any;
  id: string;

  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    this.ref.update(this.data);
  }

  //uso lib date-fns para ver si ya vencio
  isCodeExpired() {
    const now = new Date();
    const expired = this.data.expires.toDate();
    return isAfter(now, expired);
  }

  async invalidateCode() {
    this.data.code.valid = false;
    this.push();
  }

  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }

  static async createNewAuth(data) {
    //aca abajo creo el usuario nuevo en auth con la data esa
    const newAuthSnap = await collection.add(data);

    //y despues lo instancio para usar esa data
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }

  //para no estar repitiendolo
  static cleanEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    return cleanEmail;
  }

  static async findByEmailAndCode(email, code) {
    const clearEmail = Auth.cleanEmail(email);

    const results = await collection
      .where("email", "==", clearEmail)
      .where("code.code", "==", code)
      .get();

    if (results.empty) {
      console.error("email y code no coinciden");
      return null;
    } else {
      const doc = results.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
    }
  }
}
