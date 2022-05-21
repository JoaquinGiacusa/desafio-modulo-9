import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getMyOrders } from "controllers/orders";
import methods from "micro-method-router";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const result = await getMyOrders(token.userId);
    res.send(result);
  } catch (error) {
    res.send({ message: error });
  }
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
