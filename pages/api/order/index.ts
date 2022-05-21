import type { NextApiRequest, NextApiResponse } from "next";
import {
  authMiddleware,
  bodySchemaMiddleware,
  querySchemaMiddleware,
} from "lib/middlewares";
import methods from "micro-method-router";
import { createOrderAndSendUrlByMail } from "controllers/orders";
import * as yup from "yup";

let querySchema = yup.object().shape({
  productId: yup.string().required(),
});

//si no pongo el required significa que no es obligatorio
let bodySchema = yup
  .object()
  .shape({
    color: yup.string(),
    shipping_address: yup.string(),
  })
  .noUnknown(true)
  .strict();
//el noUnknown hace que no me pasen nada adicional ademas de lo que esta en el esquema

//genera la orden de pago
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;
  try {
    const url = await createOrderAndSendUrlByMail(
      token.userId,
      productId,
      req.body
    );

    res.send(url);
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

const handler = methods({
  post: postHandler,
});

//esta el la funcion final que se exporta
export default querySchemaMiddleware(
  querySchema,
  bodySchemaMiddleware(bodySchema, authMiddleware(handler))
);
