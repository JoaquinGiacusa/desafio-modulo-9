import { firestore } from "lib/firestore";

const collection = firestore.collection("orders");
export class Order {
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
  static async createNewOrder(newOrderData = {}) {
    const newOrderSnap = await collection.add(newOrderData);

    const newUser = new Order(newOrderSnap.id);
    newUser.data = newOrderData;
    newUser.data.createdAt = new Date();
    return newUser;
  }

  static async getAllOrdersByUserId(userId: string) {
    const ordersByUserId = await collection.where("userId", "==", userId).get();
    if (ordersByUserId.empty) {
      return [];
    }
    var allOrders = [];
    for (const order of ordersByUserId.docs) {
      allOrders.push(order.data());
    }

    return allOrders;
  }
}
