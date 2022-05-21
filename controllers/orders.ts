import { Order } from "models/order";
import { createPreference } from "lib/mercadopago";
import { productsIndex } from "lib/algolia";
import { roundToNearestMinutes } from "date-fns";

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
          picture_url: "http://www.myapp.com/myimage.jpg",
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
        "https://pagos-mp-amber.vercel.app/api/webhooks/mercadopago",
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
