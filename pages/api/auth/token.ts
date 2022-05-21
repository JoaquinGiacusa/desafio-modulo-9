import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
import { signIn } from "controllers/auth";
import * as yup from "yup";
import { bodySchemaMiddleware } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;

  //intenta hacer el signIn, si salta algun throw salen como error en el catch
  try {
    const token = await signIn(email, code);
    res.send({ token });
  } catch (error) {
    res.status(404).send({ message: error });
  }
}

export default bodySchemaMiddleware(bodySchema, postHandler);
