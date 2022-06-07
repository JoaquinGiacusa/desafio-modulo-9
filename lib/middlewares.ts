import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseBearerToken(req);
    if (!token) {
      res.status(401).send({ message: "no hay token" });
    }
    //hago asi para no anidar ifs, entonces si no hay tal cosa lo saltea y listo y se lee mas fasil
    const decodedToken = decode(token);
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      res.status(401).send({ message: "token incorrecto" });
    }
  };
}

//Middleware esquema yup
export function bodySchemaMiddleware(schemaYup, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      //chequeo el schema body
      await schemaYup.validate(req.body);

      callback(req, res);
    } catch (error) {
      res.status(400).send({ field: "body", message: error });
    }
  };
}

export function bodysSchemaMiddleware(schemaYup, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      //chequeo el schema
      await schemaYup.validate(req.body);
      callback(req, res);
    } catch (error) {
      res.status(400).send({ field: "body", message: error });
    }
  };
}

//Middleware esquema yup
export function querySchemaMiddleware(schemaYup, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      //chequeo el schema
      await schemaYup.validate(req.query);
      callback(req, res);
    } catch (error) {
      res.status(400).send({ field: "query", message: error });
    }
  };
}
