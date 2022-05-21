import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderById } from "controllers/orders";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const orderId = req.query.orderId;
    try {
      const result = await getOrderById(orderId);
      res.send(result);
    } catch (error) {
      res.status(401).send({ message: error });
    }
  },
});
