import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";
import { User } from "models/user";
import { payNotification } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  try {
    const result = await payNotification(id, topic);
    console.log("RESULTS", result);

    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error });
  }
  // if (topic == "merchant_order") {
  //   const order = await getMerchantOrder(id);
  //   if (order.order_status == "paid") {
  //     const orderId = order.external_reference;
  //     const myOrder = new Order(orderId);
  //     await myOrder.pull();
  //     myOrder.data.status = "closed";
  //     myOrder.data.externalORder = order;
  //     await myOrder.push();

  //     //sendEmail("Tu pago fue confirmado")
  //     //sendEmailInterno("Alguien compró algo")
  //     res.send("ok");
  //   }
  // } else {
  //   res.send("error");
  // }
}
