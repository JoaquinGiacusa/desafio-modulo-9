import type { NextApiRequest, NextApiResponse } from "next";

import { payNotification } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  try {
    const result = await payNotification(id, topic);
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error });
  }
}
