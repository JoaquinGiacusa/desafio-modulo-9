import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { syncProducts } from "controllers/product";

//para mantener actualizazdo lo que esta en airtable con algolia
export default methods({
  get(req: NextApiRequest, res: NextApiResponse) {
    try {
      syncProducts().then((results) => {
        res.send({ message: results });
      });
    } catch (e) {
      res.send({ errorSync: e });
    }
  },
});
