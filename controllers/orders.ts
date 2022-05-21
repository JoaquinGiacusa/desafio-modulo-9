import { Order } from "models/order";
import { createPreference } from "lib/mercadopago";
import { productsIndex } from "lib/algolia";
import { getMerchantOrder } from "lib/mercadopago";
import { User } from "models/user";
import { sgMail } from "lib/sendgrid";

type CreateOrderRes = {
  url: string;
  orderId: string;
};

export async function createOrderAndSendUrlByMail(
  userId,
  productId: string,
  aditionalInfo
): Promise<CreateOrderRes> {
  const order = await Order.createNewOrder({
    aditionalInfo: aditionalInfo,
    productId,
    userId: userId,
    status: "pending",
  });

  const product = (await productsIndex.getObject(productId)) as any;
  if (product) {
    const pref = await createPreference({
      items: [
        {
          title: product.Name,
          category_id: "car_electronics",
          quantity: 1,
          currency_id: "ARS",
          unit_price: product["Unit cost"],
        },
      ],
      back_urls: {
        success: "https://apx.school",
        pending: "https://apx.school/pending-payments",
      },
      external_reference: order.id,
      //esta url que pertenece a mi endopoint se ejecuta cuando se paga o intenta pagar
      notification_url:
        "https://desafio-modulo-9.vercel.app/api/webhooks/mercadopago",
    });

    return { url: pref.init_point, orderId: order.id };
  }
}

export async function getMyOrders(userId) {
  const getMyOrders = await Order.getAllOrdersByUserId(userId);
  if (getMyOrders.length == 0) throw "no tienes ordenes creada";
  return getMyOrders;
}

export async function getOrderById(orderId) {
  const order = new Order(orderId);
  await order.pull();
  console.log(order.data);

  if (!order.data) {
    throw "la order solicitada no existe";
  }
  return order.data;
}

async function sendPayNotificationEmail(to: string) {
  const msg = {
    to: to,
    from: "joaquingiacusa.dev@gmail.com", // Use the email address or domain you verified above
    subject: "Codigo de ingreso",
    text: "code...",
    html: "<strong>Tu pago se realizo con exito</strong>",
  };

  try {
    await sgMail.send(msg);
    return { message: "mensaje enviado" };
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export async function payNotification(id, topic) {
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalORder = order;
      await myOrder.push();

      const user = new User(myOrder.data.userId);
      const email = user.data.email;
      sendPayNotificationEmail(email);
      //sendEmailInterno("Alguien compró algo")
      return "pago exitoso";
    } else {
      throw "error";
    }
  }
}
