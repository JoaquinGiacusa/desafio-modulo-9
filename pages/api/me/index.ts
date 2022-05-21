import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, bodySchemaMiddleware } from "lib/middlewares";
import { getUserById, updateUser } from "controllers/user";
import methods from "micro-method-router";
import * as yup from "yup";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const userData = await getUserById(token.userId);

  res.send(userData);
}

let bodySchema = yup
  .object()
  .shape({
    name: yup.string(),
    lastName: yup.string(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const results = await updateUser(req.body, token.userId);
    res.send({ message: results });
  } catch (error) {
    res.status(404).send({ message: error });
  }
}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

export default bodySchemaMiddleware(bodySchema, authMiddleware(handler));
