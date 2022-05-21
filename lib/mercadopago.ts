import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN,
});

//crea la preferencia de compra
export async function createPreference(data) {
  const res = await mercadopago.preferences.create(data);
  return res.body;
}

//obtiene la orden de compra
export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}
