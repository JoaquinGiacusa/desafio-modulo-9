import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "controllers/product";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const productId = req.query.productId;
    try {
      const result = await getProductById(productId);
      res.send(result);
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  },
});
