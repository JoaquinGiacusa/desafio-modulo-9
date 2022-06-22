import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchProducts } from "controllers/product";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { q, limit, offset } = req.query;

    try {
      //si el string de search esta vacio devuelte todo
      const results = await searchProducts(limit, offset, q as string);
      //respuesta ya filtada con lo que necesito
      res.send(results);
    } catch (e) {
      res.status(404).send({ message: e.message });
    }
  },
});
