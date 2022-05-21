import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, bodySchemaMiddleware } from "lib/middlewares";
import { updateUserAddress } from "controllers/user";
import methods from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
  .object()
  .shape({
    address: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { address } = req.body;

  try {
    const results = await updateUserAddress(address, token.userId);
    res.send({ message: results });
  } catch (error) {
    res.status(404).send({ message: error });
  }
}

const handler = methods({
  patch: patchHandler,
});

export default bodySchemaMiddleware(bodySchema, authMiddleware(handler));
